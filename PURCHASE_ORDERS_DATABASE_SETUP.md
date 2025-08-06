# Purchase Orders Database Integration Setup

This document explains how to set up the database integration for the Purchase Orders functionality.

## Overview

The Purchase Orders feature has been updated to integrate with the Supabase database, allowing data to persist across page refreshes and browser sessions.

## Database Schema

The system uses the existing `purchase_order_lines` table with an additional `additional_data` column to store all the custom fields from the Purchase Orders interface.

### Key Features

1. **Data Persistence**: All purchase order data is now stored in the database
2. **Excel Import/Export**: Excel files are imported directly to the database
3. **Real-time Updates**: Changes are immediately saved to the database
4. **Error Handling**: Comprehensive error handling with user-friendly messages

## Setup Instructions

### 1. Run Database Migration

Execute the migration script to add the required column:

```sql
-- Run the migration script
\i database-migration-purchase-orders.sql
```

Or manually run these commands in your Supabase SQL editor:

```sql
-- Add additional_data column to purchase_order_lines table
ALTER TABLE purchase_order_lines 
ADD COLUMN IF NOT EXISTS additional_data JSONB DEFAULT '{}';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_purchase_order_lines_additional_data 
ON purchase_order_lines USING GIN (additional_data);

-- Add comment
COMMENT ON COLUMN purchase_order_lines.additional_data IS 'Stores additional custom fields from the Purchase Orders interface as JSON';
```

### 2. Verify Database Connection

Ensure your Supabase environment variables are properly configured in your `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the Integration

1. Navigate to the Purchase Orders page
2. Upload an Excel file - data should be saved to the database
3. Refresh the page - data should persist
4. Edit a row - changes should be saved to the database
5. Delete a row - deletion should be reflected in the database

## Features

### Excel Import
- Upload Excel files with purchase order data
- Data is automatically processed and stored in the database
- Date formatting is applied to date columns
- All custom fields are preserved

### Data Management
- Add new purchase order lines
- Edit existing lines with real-time database updates
- Delete lines with database cleanup
- Search and filter functionality

### Error Handling
- Loading states during database operations
- Error messages for failed operations
- Graceful fallback to dummy data if database is unavailable

## Database Structure

The `purchase_order_lines` table stores:

- **Core fields**: `id`, `purchase_order_id`, `product_id`, `quantity`, `unit_price`, `received_quantity`, `notes`
- **Additional data**: All custom fields stored as JSON in the `additional_data` column
- **Timestamps**: `created_at`, `updated_at`

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check your Supabase environment variables
   - Verify your Supabase project is active

2. **Import failures**
   - Ensure Excel file format is correct
   - Check browser console for detailed error messages

3. **Data not persisting**
   - Verify the migration script was executed successfully
   - Check database permissions for the `purchase_order_lines` table

### Debug Mode

To enable debug logging, add this to your browser console:

```javascript
localStorage.setItem('debug', 'purchase-orders');
```

## Performance Considerations

- The `additional_data` column is indexed for better query performance
- Large imports are processed in batches
- Loading states prevent UI freezing during database operations

## Future Enhancements

- Batch operations for multiple rows
- Advanced filtering and sorting
- Export functionality with database data
- Real-time collaboration features 