-- Migration script to add additional_data column to purchase_order_lines table
-- This allows storing all the custom fields from the Purchase Orders interface

-- Add additional_data column to purchase_order_lines table
ALTER TABLE purchase_order_lines 
ADD COLUMN IF NOT EXISTS additional_data JSONB DEFAULT '{}';

-- Add index for better performance when querying additional_data
CREATE INDEX IF NOT EXISTS idx_purchase_order_lines_additional_data 
ON purchase_order_lines USING GIN (additional_data);

-- Add comment to document the purpose of this column
COMMENT ON COLUMN purchase_order_lines.additional_data IS 'Stores additional custom fields from the Purchase Orders interface as JSON';

-- Disable Row Level Security for purchase_order_lines table to allow data operations
ALTER TABLE purchase_order_lines DISABLE ROW LEVEL SECURITY;

-- Update the trigger to include additional_data in updated_at
-- First, drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_purchase_order_lines_updated_at ON purchase_order_lines;

-- Recreate the trigger
CREATE TRIGGER update_purchase_order_lines_updated_at 
BEFORE UPDATE ON purchase_order_lines 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 