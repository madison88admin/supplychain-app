# Supply Chain App

A React-based supply chain management application with data collection capabilities.

## Features

- **Data Bank**: Centralized data management interface
- **Data Collection**: Automated data collection from multiple API endpoints
- **Database Storage**: SQLite database for efficient data storage
- **Real-time Status**: Live status updates during data collection

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.7 or higher)
- Required Python packages (install via pip):
  ```bash
  pip install requests sqlite3
  ```

## Installation

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Install Python dependencies:**
   ```bash
   pip install requests
   ```

## Running the Application

### Option 1: Run Frontend and Backend Separately

1. **Start the backend server:**
   ```bash
   npm run server
   ```
   This will start the Express server on port 3001.

2. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   This will start the Vite development server on port 5173.

3. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

### Option 2: Run Both Together (Recommended)

1. **Start the backend server in one terminal:**
   ```bash
   npm run server
   ```

2. **Start the frontend in another terminal:**
   ```bash
   npm run dev
   ```

## Using the Data Collection Feature

1. **Navigate to the Data Bank tab** in the application
2. **Click the "Collect Data" button** in the top-right corner
3. **Monitor the status** - you'll see real-time updates during the collection process
4. **Wait for completion** - the database file will be created in the project directory

## Viewing Collected Data

After data collection is complete, you can view the collected data:

1. **Click "Show Collected Data"** to expand the data view section
2. **Select a table** from the dropdown menu to view data from specific endpoints
3. **Use the search function** to filter records by any text field
4. **Navigate through pages** using the pagination controls
5. **Refresh the data** using the refresh button to get the latest information

### Available Tables

The following tables will be available for viewing:
- **Main Tables**: Products, Materials, PurchaseOrder, Customers, etc.
- **Activity Tables**: `{TableName}_ActivityResults` - containing activity data
- **Field Tables**: `{TableName}_PrimaryUserDefinedFieldValue` - containing custom field data

## Data Collection Process

The data collection process will:

1. **Authenticate** with the Vision PLM API
2. **Fetch data** from 19 different endpoints:
   - BillOfMaterialItemCategories
   - BillOfMaterialItemCategoryMaterialTypes
   - BillOfMaterialItems
   - Customers
   - MaterialOptions
   - Materials
   - MaterialSupplierProfiles
   - MaterialSuppliers
   - MaterialTypes
   - ProductBillOfMaterials
   - ProductOptions
   - Products
   - ProductStatuses
   - ProductSupplierProfiles
   - ProductSuppliers
   - ProductTypes
   - PurchaseOrder
   - PurchaseOrderLines

3. **Store data** in a SQLite database (`supplychain_data.db`)
4. **Create related tables** for ActivityResults and PrimaryUserDefinedFieldValue

## Database Structure

The application creates a single SQLite database file (`supplychain_data.db`) containing:

- **Main tables**: One table per endpoint (e.g., Products, Materials, PurchaseOrder)
- **Activity tables**: `{EndpointName}_ActivityResults` tables
- **Field tables**: `{EndpointName}_PrimaryUserDefinedFieldValue` tables

## API Configuration

The data collection uses the following configuration:
- **Base URL**: `https://nextgen.madison88.com:8443`
- **Authentication**: Username/password-based token authentication
- **Data Format**: JSON responses with "Items" as the data key

## Troubleshooting

### Common Issues

1. **Python not found**: Make sure Python is installed and accessible from the command line
2. **Port conflicts**: If port 3001 is in use, modify the PORT variable in `server.js`
3. **CORS errors**: The backend includes CORS configuration, but ensure the frontend is running on the correct port
4. **Authentication errors**: Check the username/password in `test10.py`

### Logs

- **Backend logs**: Check the terminal running `npm run server`
- **Frontend logs**: Check the browser's developer console
- **Python logs**: Check the backend terminal for Python script output

## Development

### Project Structure

```
supplychain-app-main/
├── src/
│   ├── pages/
│   │   └── DataBank.tsx          # Data Bank page with collection button
│   └── ...
├── server.js                     # Express backend server
├── test10.py                     # Python data collection script
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

### Adding New Endpoints

To add new API endpoints:

1. **Update `test10.py`**: Add new endpoints to the `ENDPOINT_CONFIGS` dictionary
2. **Update DataBank.tsx**: Add new sections to the `sections` array if needed
3. **Test**: Run the data collection process to verify the new endpoints work

## License

This project is for internal use only. 