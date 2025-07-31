import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to collect data
app.post('/api/collect-data', async (req, res) => {
  try {
    console.log('Starting data collection...');
    
    // Run the Python script
    const pythonProcess = spawn('python', ['test10.py'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    // Collect stdout
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log('Python output:', data.toString());
    });

    // Collect stderr
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python error:', data.toString());
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Data collection completed successfully');
        res.json({
          success: true,
          message: 'Data collection completed successfully',
          database_file: 'supplychain_data.db',
          output: output
        });
      } else {
        console.error('Data collection failed with code:', code);
        res.status(500).json({
          success: false,
          message: 'Data collection failed',
          error: errorOutput,
          code: code
        });
      }
    });

    // Handle process errors
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start data collection process',
        error: error.message
      });
    });

  } catch (error) {
    console.error('Error in data collection endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get available tables
app.get('/api/tables', (req, res) => {
  // Look for database in current directory and parent directory
  let dbPath = path.join(__dirname, 'supplychain_data.db');
  
  if (!fs.existsSync(dbPath)) {
    // Try parent directory
    dbPath = path.join(__dirname, '..', 'supplychain_data.db');
  }
  
  if (!fs.existsSync(dbPath)) {
    console.log('Database file not found at:', dbPath);
    return res.json([]);
  }

  console.log('Found database at:', dbPath);
  const db = new sqlite3.Database(dbPath);
  
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err);
      res.status(500).json({ error: 'Failed to fetch tables' });
    } else {
      const tableNames = tables.map(table => table.name);
      console.log('Available tables:', tableNames);
      res.json(tableNames);
    }
    db.close();
  });
});

// Get table data with pagination and search
app.get('/api/data/:tableName', (req, res) => {
  const { tableName } = req.params;
  const { page = 1, limit = 10, search = '' } = req.query;
  
  // Look for database in current directory and parent directory
  let dbPath = path.join(__dirname, 'supplychain_data.db');
  
  if (!fs.existsSync(dbPath)) {
    // Try parent directory
    dbPath = path.join(__dirname, '..', 'supplychain_data.db');
  }
  
  if (!fs.existsSync(dbPath)) {
    return res.json({ records: [], total: 0 });
  }

  const db = new sqlite3.Database(dbPath);
  const offset = (page - 1) * limit;
  
  // Build search condition
  let searchCondition = '';
  let searchParams = [];
  
  if (search && search.trim()) {
    // Get table columns first to build a proper search query
    db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
      if (err) {
        console.error('Error getting table info:', err);
        res.status(500).json({ error: 'Failed to get table info' });
        db.close();
        return;
      }
      
      // Build search condition for all text columns
      const textColumns = columns
        .filter(col => col.type.toLowerCase().includes('text'))
        .map(col => col.name);
      
      if (textColumns.length > 0) {
        const searchTerms = search.trim().split(' ').filter(term => term.length > 0);
        const searchConditions = searchTerms.map(term => {
          const columnConditions = textColumns.map(col => `${col} LIKE ?`).join(' OR ');
          return `(${columnConditions})`;
        });
        searchCondition = `WHERE ${searchConditions.join(' AND ')}`;
        searchParams = searchTerms.flatMap(term => 
          textColumns.map(() => `%${term}%`)
        );
      }
      
      executeQuery();
    });
  } else {
    executeQuery();
  }
  
  function executeQuery() {
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM ${tableName} ${searchCondition}`;
    db.get(countQuery, searchParams, (err, countResult) => {
      if (err) {
        console.error('Error counting records:', err);
        res.status(500).json({ error: 'Failed to count records' });
        db.close();
        return;
      }

      const total = countResult.total;
      
      // Get paginated data
      const dataQuery = `SELECT * FROM ${tableName} ${searchCondition} LIMIT ${limit} OFFSET ${offset}`;
      db.all(dataQuery, searchParams, (err, records) => {
        if (err) {
          console.error('Error fetching records:', err);
          res.status(500).json({ error: 'Failed to fetch records' });
        } else {
          res.json({
            records: records || [],
            total: total,
            page: parseInt(page),
            limit: parseInt(limit)
          });
        }
        db.close();
      });
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Data collection endpoint: http://localhost:${PORT}/api/collect-data`);
}); 