import { supabase } from './supabase';

// Interface for Purchase Order Line data
export interface PurchaseOrderLine {
  id?: string;
  purchase_order_id?: string;
  product_id?: string;
  quantity: number;
  unit_price: number;
  total_price?: number;
  received_quantity?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // Additional fields from the current implementation
  'PO Line'?: string;
  'Fit Comment'?: string;
  'Fit Log Status'?: string;
  'Fit Log Type'?: string;
  'Fit Log Name'?: string;
  'Customer'?: string;
  'Collection'?: string;
  'Division'?: string;
  'Group'?: string;
  'Transport Method'?: string;
  'Deliver To'?: string;
  'Status'?: string;
  'Delivery Date'?: string;
  'Comments'?: string;
  'Selling Quantity'?: number;
  'Closed Date'?: string;
  'Line Purchase Price'?: string;
  'Line Selling Price'?: string;
  'Note Count'?: number;
  'Latest Note'?: string;
  'Order Quantity Increment'?: number;
  'Order Lead Time'?: string;
  'Supplier Ref.'?: string;
  'Template'?: string;
  'Ex-Factory'?: string;
  'Purchase Order Status'?: string;
  'Supplier Purchase Currency'?: string;
  'Customer Selling Currency'?: string;
  'Supplier'?: string;
  'Purchase Currency'?: string;
  'Selling Currency'?: string;
  'Minimum Order Quantity'?: number;
  'Purchase Description'?: string;
  'Product Type'?: string;
  'Product Sub Type'?: string;
  'Product Status'?: string;
  'Product Buyer Style Name'?: string;
  'Product Buyer Style Number'?: string;
  'Standard Minute Value'?: number;
  'Costing'?: string;
  'Costong Purchase Currency'?: string;
  'Costing Selling Currency'?: string;
  'Costing Status'?: string;
  'Supplier Payment Term'?: string;
  'Supplier Payment Term Description'?: string;
  'Order Purchase Payment Term'?: string;
  'Order Purchase Payment Term Description'?: string;
  'Product Supplier Purchase Payment Term'?: string;
  'Product Supplier Purhcase Payment Term Description'?: string;
  'Order Selling Payment Term'?: string;
  'Order Selling Payment Term Description'?: string;
  'Product Supplier Selling Payment Term'?: string;
  'Product Supplier Selling Payment Term Description'?: string;
  'Purchase Price'?: string;
  'Selling Price'?: string;
  'Production'?: string;
  'MLA-Purchasing'?: string;
  'China-QC'?: string;
  'MLA-Planning'?: string;
  'MLA-Shipping'?: string;
  'PO Key User 6'?: string;
  'PO Key User 7'?: string;
  'PO Key User 8'?: string;
  'Season'?: string;
  'Department'?: string;
  'Customer Parent'?: string;
  'RECIPIENT PRODUCT SUPPLIER-NUMBER'?: string;
  'FG PO Number'?: string;
  'Received'?: number;
  'Balance'?: number;
  'Over Received'?: number;
  'Size'?: string;
  'Main Material'?: string;
  'Main Material Description'?: string;
  'Delivery Contact'?: string;
  'PO Key Working Group 1'?: string;
  'PO Key Working Group 2'?: string;
  'PO Key Working Group 3'?: string;
  'PO Key Working Group 4'?: string;
  'Created By'?: string;
  'Last Edited'?: string;
  'Last Edited By'?: string;
  'Color'?: string;
  'Vessel Schedule'?: string;
  'Buyer PO Number'?: string;
  'Shipment ID'?: string;
  'Factory Invoiced'?: string;
  'Supplier Invoice'?: string;
  'QuickBooks Invoice'?: string;
  'Shipment Noted'?: string;
  'Buy Information'?: string;
  'Handling Charges'?: string;
  'Original Forecasts Quantity'?: number;
  'Start Date'?: string;
  'Cancelled Date'?: string;
  'Factory Date Paid'?: string;
  'Date Invoice Raised'?: string;
  'Submitted Inspection Date'?: string;
  'Remarks'?: string;
  'Inspection Results'?: string;
  'Report Type'?: string;
  'Inspector'?: string;
  'Approval Status'?: string;
  'Shipment Status'?: string;
  'QC Comment'?: string;
  'Delay Shipment Code'?: string;
  'Discount Percentage'?: string;
  'SELL INC COMM'?: string;
  'Buyer Surcharge'?: string;
  'Buyer Surchage Percentage'?: string;
  'MOQ'?: string;
  'Discount Cost'?: string;
  'Factory Surcharge'?: string;
  'Factory Surchage Percentage'?: string;
  'Buyer Season'?: string;
  'Lookbook'?: string;
  'Finished Good Testing Status'?: string;
  
  // Grouped columns
  'Packing & Label Instruction'?: { 'Target Date': string; 'Completed Date': string };
  'inline Inspection'?: { 'Target Date': string; 'Completed Date': string };
  'Factory Packing List'?: { 'Target Date': string; 'Completed Date': string };
  'UCC Label'?: { 'Target Date': string; 'Completed Date': string };
  'Final Inspection'?: { 'Target Date': string; 'Completed Date': string };
  'Ex-Factory Date'?: { 'Target Date': string; 'Completed Date': string };
  'Upload Shipping Docs'?: { 'Target Date': string; 'Completed Date': string };
  'Invoice Customer'?: { 'Target Date': string; 'Completed Date': string };
  'Customer Delivery Date'?: { 'Target Date': string; 'Completed Date': string };
  'Shipment Booking'?: { 'Target Date': string; 'Completed Date': string };
  'Warehouse/UCC Label'?: { 'Target Date': string; 'Completed Date': string };
  'Projected Delivery Date'?: { 'Target Date': string; 'Completed Date': string };
  'Booking'?: { 'Target Date': string; 'Completed Date': string };
  'Order Placement'?: { 'Target Date': string; 'Completed Date': string };
  
  // Order and Product fields
  'Order'?: string;
  'Product'?: string;
}

// Interface for Purchase Order data
export interface PurchaseOrder {
  id?: string;
  po_number: string;
  supplier_id?: string;
  order_date: string;
  expected_delivery_date?: string;
  status: string;
  total_amount?: number;
  currency?: string;
  notes?: string;
  created_by?: string;
  approved_by?: string;
  created_at?: string;
  updated_at?: string;
  lines?: PurchaseOrderLine[];
}

// Database service for Purchase Orders
export const purchaseOrderService = {
  // Get all purchase order lines
  getAllPurchaseOrderLines: async (): Promise<PurchaseOrderLine[]> => {
    try {
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching purchase order lines:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllPurchaseOrderLines:', error);
      throw error;
    }
  },

  // Get purchase order line by ID
  getPurchaseOrderLineById: async (id: string): Promise<PurchaseOrderLine | null> => {
    try {
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching purchase order line:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getPurchaseOrderLineById:', error);
      throw error;
    }
  },

  // Create new purchase order line
  createPurchaseOrderLine: async (lineData: Omit<PurchaseOrderLine, 'id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrderLine> => {
    try {
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .insert({
          purchase_order_id: lineData.purchase_order_id,
          product_id: lineData.product_id,
          quantity: lineData.quantity,
          unit_price: lineData.unit_price,
          received_quantity: lineData.received_quantity || 0,
          notes: lineData.notes,
          // Store additional fields as JSON in notes or create a separate table
          additional_data: JSON.stringify({
            'PO Line': lineData['PO Line'],
            'Fit Comment': lineData['Fit Comment'],
            'Fit Log Status': lineData['Fit Log Status'],
            'Fit Log Type': lineData['Fit Log Type'],
            'Fit Log Name': lineData['Fit Log Name'],
            'Customer': lineData['Customer'],
            'Collection': lineData['Collection'],
            'Division': lineData['Division'],
            'Group': lineData['Group'],
            'Transport Method': lineData['Transport Method'],
            'Deliver To': lineData['Deliver To'],
            'Status': lineData['Status'],
            'Delivery Date': lineData['Delivery Date'],
            'Comments': lineData['Comments'],
            'Selling Quantity': lineData['Selling Quantity'],
            'Closed Date': lineData['Closed Date'],
            'Line Purchase Price': lineData['Line Purchase Price'],
            'Line Selling Price': lineData['Line Selling Price'],
            'Note Count': lineData['Note Count'],
            'Latest Note': lineData['Latest Note'],
            'Order Quantity Increment': lineData['Order Quantity Increment'],
            'Order Lead Time': lineData['Order Lead Time'],
            'Supplier Ref.': lineData['Supplier Ref.'],
            'Template': lineData['Template'],
            'Ex-Factory': lineData['Ex-Factory'],
            'Purchase Order Status': lineData['Purchase Order Status'],
            'Supplier Purchase Currency': lineData['Supplier Purchase Currency'],
            'Customer Selling Currency': lineData['Customer Selling Currency'],
            'Supplier': lineData['Supplier'],
            'Purchase Currency': lineData['Purchase Currency'],
            'Selling Currency': lineData['Selling Currency'],
            'Minimum Order Quantity': lineData['Minimum Order Quantity'],
            'Purchase Description': lineData['Purchase Description'],
            'Product Type': lineData['Product Type'],
            'Product Sub Type': lineData['Product Sub Type'],
            'Product Status': lineData['Product Status'],
            'Product Buyer Style Name': lineData['Product Buyer Style Name'],
            'Product Buyer Style Number': lineData['Product Buyer Style Number'],
            'Standard Minute Value': lineData['Standard Minute Value'],
            'Costing': lineData['Costing'],
            'Costong Purchase Currency': lineData['Costong Purchase Currency'],
            'Costing Selling Currency': lineData['Costing Selling Currency'],
            'Costing Status': lineData['Costing Status'],
            'Supplier Payment Term': lineData['Supplier Payment Term'],
            'Supplier Payment Term Description': lineData['Supplier Payment Term Description'],
            'Order Purchase Payment Term': lineData['Order Purchase Payment Term'],
            'Order Purchase Payment Term Description': lineData['Order Purchase Payment Term Description'],
            'Product Supplier Purchase Payment Term': lineData['Product Supplier Purchase Payment Term'],
            'Product Supplier Purhcase Payment Term Description': lineData['Product Supplier Purhcase Payment Term Description'],
            'Order Selling Payment Term': lineData['Order Selling Payment Term'],
            'Order Selling Payment Term Description': lineData['Order Selling Payment Term Description'],
            'Product Supplier Selling Payment Term': lineData['Product Supplier Selling Payment Term'],
            'Product Supplier Selling Payment Term Description': lineData['Product Supplier Selling Payment Term Description'],
            'Purchase Price': lineData['Purchase Price'],
            'Selling Price': lineData['Selling Price'],
            'Production': lineData['Production'],
            'MLA-Purchasing': lineData['MLA-Purchasing'],
            'China-QC': lineData['China-QC'],
            'MLA-Planning': lineData['MLA-Planning'],
            'MLA-Shipping': lineData['MLA-Shipping'],
            'PO Key User 6': lineData['PO Key User 6'],
            'PO Key User 7': lineData['PO Key User 7'],
            'PO Key User 8': lineData['PO Key User 8'],
            'Season': lineData['Season'],
            'Department': lineData['Department'],
            'Customer Parent': lineData['Customer Parent'],
            'RECIPIENT PRODUCT SUPPLIER-NUMBER': lineData['RECIPIENT PRODUCT SUPPLIER-NUMBER'],
            'FG PO Number': lineData['FG PO Number'],
            'Received': lineData['Received'],
            'Balance': lineData['Balance'],
            'Over Received': lineData['Over Received'],
            'Size': lineData['Size'],
            'Main Material': lineData['Main Material'],
            'Main Material Description': lineData['Main Material Description'],
            'Delivery Contact': lineData['Delivery Contact'],
            'PO Key Working Group 1': lineData['PO Key Working Group 1'],
            'PO Key Working Group 2': lineData['PO Key Working Group 2'],
            'PO Key Working Group 3': lineData['PO Key Working Group 3'],
            'PO Key Working Group 4': lineData['PO Key Working Group 4'],
            'Created By': lineData['Created By'],
            'Last Edited': lineData['Last Edited'],
            'Last Edited By': lineData['Last Edited By'],
            'Color': lineData['Color'],
            'Vessel Schedule': lineData['Vessel Schedule'],
            'Buyer PO Number': lineData['Buyer PO Number'],
            'Shipment ID': lineData['Shipment ID'],
            'Factory Invoiced': lineData['Factory Invoiced'],
            'Supplier Invoice': lineData['Supplier Invoice'],
            'QuickBooks Invoice': lineData['QuickBooks Invoice'],
            'Shipment Noted': lineData['Shipment Noted'],
            'Buy Information': lineData['Buy Information'],
            'Handling Charges': lineData['Handling Charges'],
            'Original Forecasts Quantity': lineData['Original Forecasts Quantity'],
            'Start Date': lineData['Start Date'],
            'Cancelled Date': lineData['Cancelled Date'],
            'Factory Date Paid': lineData['Factory Date Paid'],
            'Date Invoice Raised': lineData['Date Invoice Raised'],
            'Submitted Inspection Date': lineData['Submitted Inspection Date'],
            'Remarks': lineData['Remarks'],
            'Inspection Results': lineData['Inspection Results'],
            'Report Type': lineData['Report Type'],
            'Inspector': lineData['Inspector'],
            'Approval Status': lineData['Approval Status'],
            'Shipment Status': lineData['Shipment Status'],
            'QC Comment': lineData['QC Comment'],
            'Delay Shipment Code': lineData['Delay Shipment Code'],
            'Discount Percentage': lineData['Discount Percentage'],
            'SELL INC COMM': lineData['SELL INC COMM'],
            'Buyer Surcharge': lineData['Buyer Surcharge'],
            'Buyer Surchage Percentage': lineData['Buyer Surchage Percentage'],
            'MOQ': lineData['MOQ'],
            'Discount Cost': lineData['Discount Cost'],
            'Factory Surcharge': lineData['Factory Surcharge'],
            'Factory Surchage Percentage': lineData['Factory Surchage Percentage'],
            'Buyer Season': lineData['Buyer Season'],
            'Lookbook': lineData['Lookbook'],
            'Finished Good Testing Status': lineData['Finished Good Testing Status'],
            'Packing & Label Instruction': lineData['Packing & Label Instruction'],
            'inline Inspection': lineData['inline Inspection'],
            'Factory Packing List': lineData['Factory Packing List'],
            'UCC Label': lineData['UCC Label'],
            'Final Inspection': lineData['Final Inspection'],
            'Ex-Factory Date': lineData['Ex-Factory Date'],
            'Upload Shipping Docs': lineData['Upload Shipping Docs'],
            'Invoice Customer': lineData['Invoice Customer'],
            'Customer Delivery Date': lineData['Customer Delivery Date'],
            'Shipment Booking': lineData['Shipment Booking'],
            'Warehouse/UCC Label': lineData['Warehouse/UCC Label'],
            'Projected Delivery Date': lineData['Projected Delivery Date'],
            'Booking': lineData['Booking'],
            'Order Placement': lineData['Order Placement'],
            'Order': lineData['Order'],
            'Product': lineData['Product']
          })
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating purchase order line:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in createPurchaseOrderLine:', error);
      throw error;
    }
  },

  // Update purchase order line
  updatePurchaseOrderLine: async (id: string, lineData: Partial<PurchaseOrderLine>): Promise<PurchaseOrderLine> => {
    try {
      const updateData: any = {};
      
      if (lineData.quantity !== undefined) updateData.quantity = lineData.quantity;
      if (lineData.unit_price !== undefined) updateData.unit_price = lineData.unit_price;
      if (lineData.received_quantity !== undefined) updateData.received_quantity = lineData.received_quantity;
      if (lineData.notes !== undefined) updateData.notes = lineData.notes;
      
      // Update additional data
      const additionalData: any = {};
      Object.keys(lineData).forEach(key => {
        if (key !== 'id' && key !== 'quantity' && key !== 'unit_price' && key !== 'received_quantity' && key !== 'notes' && key !== 'created_at' && key !== 'updated_at') {
          additionalData[key] = lineData[key as keyof PurchaseOrderLine];
        }
      });
      
      if (Object.keys(additionalData).length > 0) {
        updateData.additional_data = JSON.stringify(additionalData);
      }
      
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating purchase order line:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updatePurchaseOrderLine:', error);
      throw error;
    }
  },

  // Delete purchase order line
  deletePurchaseOrderLine: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('purchase_order_lines')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting purchase order line:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deletePurchaseOrderLine:', error);
      throw error;
    }
  },

  // Bulk import purchase order lines
  bulkImportPurchaseOrderLines: async (lines: PurchaseOrderLine[]): Promise<PurchaseOrderLine[]> => {
    try {
      const importData = lines.map(line => ({
        purchase_order_id: line.purchase_order_id,
        product_id: line.product_id,
        quantity: line.quantity || 0,
        unit_price: line.unit_price || 0,
        received_quantity: line.received_quantity || 0,
        notes: line.notes,
        additional_data: JSON.stringify({
          'PO Line': line['PO Line'],
          'Fit Comment': line['Fit Comment'],
          'Fit Log Status': line['Fit Log Status'],
          'Fit Log Type': line['Fit Log Type'],
          'Fit Log Name': line['Fit Log Name'],
          'Customer': line['Customer'],
          'Collection': line['Collection'],
          'Division': line['Division'],
          'Group': line['Group'],
          'Transport Method': line['Transport Method'],
          'Deliver To': line['Deliver To'],
          'Status': line['Status'],
          'Delivery Date': line['Delivery Date'],
          'Comments': line['Comments'],
          'Selling Quantity': line['Selling Quantity'],
          'Closed Date': line['Closed Date'],
          'Line Purchase Price': line['Line Purchase Price'],
          'Line Selling Price': line['Line Selling Price'],
          'Note Count': line['Note Count'],
          'Latest Note': line['Latest Note'],
          'Order Quantity Increment': line['Order Quantity Increment'],
          'Order Lead Time': line['Order Lead Time'],
          'Supplier Ref.': line['Supplier Ref.'],
          'Template': line['Template'],
          'Ex-Factory': line['Ex-Factory'],
          'Purchase Order Status': line['Purchase Order Status'],
          'Supplier Purchase Currency': line['Supplier Purchase Currency'],
          'Customer Selling Currency': line['Customer Selling Currency'],
          'Supplier': line['Supplier'],
          'Purchase Currency': line['Purchase Currency'],
          'Selling Currency': line['Selling Currency'],
          'Minimum Order Quantity': line['Minimum Order Quantity'],
          'Purchase Description': line['Purchase Description'],
          'Product Type': line['Product Type'],
          'Product Sub Type': line['Product Sub Type'],
          'Product Status': line['Product Status'],
          'Product Buyer Style Name': line['Product Buyer Style Name'],
          'Product Buyer Style Number': line['Product Buyer Style Number'],
          'Standard Minute Value': line['Standard Minute Value'],
          'Costing': line['Costing'],
          'Costong Purchase Currency': line['Costong Purchase Currency'],
          'Costing Selling Currency': line['Costing Selling Currency'],
          'Costing Status': line['Costing Status'],
          'Supplier Payment Term': line['Supplier Payment Term'],
          'Supplier Payment Term Description': line['Supplier Payment Term Description'],
          'Order Purchase Payment Term': line['Order Purchase Payment Term'],
          'Order Purchase Payment Term Description': line['Order Purchase Payment Term Description'],
          'Product Supplier Purchase Payment Term': line['Product Supplier Purchase Payment Term'],
          'Product Supplier Purhcase Payment Term Description': line['Product Supplier Purhcase Payment Term Description'],
          'Order Selling Payment Term': line['Order Selling Payment Term'],
          'Order Selling Payment Term Description': line['Order Selling Payment Term Description'],
          'Product Supplier Selling Payment Term': line['Product Supplier Selling Payment Term'],
          'Product Supplier Selling Payment Term Description': line['Product Supplier Selling Payment Term Description'],
          'Purchase Price': line['Purchase Price'],
          'Selling Price': line['Selling Price'],
          'Production': line['Production'],
          'MLA-Purchasing': line['MLA-Purchasing'],
          'China-QC': line['China-QC'],
          'MLA-Planning': line['MLA-Planning'],
          'MLA-Shipping': line['MLA-Shipping'],
          'PO Key User 6': line['PO Key User 6'],
          'PO Key User 7': line['PO Key User 7'],
          'PO Key User 8': line['PO Key User 8'],
          'Season': line['Season'],
          'Department': line['Department'],
          'Customer Parent': line['Customer Parent'],
          'RECIPIENT PRODUCT SUPPLIER-NUMBER': line['RECIPIENT PRODUCT SUPPLIER-NUMBER'],
          'FG PO Number': line['FG PO Number'],
          'Received': line['Received'],
          'Balance': line['Balance'],
          'Over Received': line['Over Received'],
          'Size': line['Size'],
          'Main Material': line['Main Material'],
          'Main Material Description': line['Main Material Description'],
          'Delivery Contact': line['Delivery Contact'],
          'PO Key Working Group 1': line['PO Key Working Group 1'],
          'PO Key Working Group 2': line['PO Key Working Group 2'],
          'PO Key Working Group 3': line['PO Key Working Group 3'],
          'PO Key Working Group 4': line['PO Key Working Group 4'],
          'Created By': line['Created By'],
          'Last Edited': line['Last Edited'],
          'Last Edited By': line['Last Edited By'],
          'Color': line['Color'],
          'Vessel Schedule': line['Vessel Schedule'],
          'Buyer PO Number': line['Buyer PO Number'],
          'Shipment ID': line['Shipment ID'],
          'Factory Invoiced': line['Factory Invoiced'],
          'Supplier Invoice': line['Supplier Invoice'],
          'QuickBooks Invoice': line['QuickBooks Invoice'],
          'Shipment Noted': line['Shipment Noted'],
          'Buy Information': line['Buy Information'],
          'Handling Charges': line['Handling Charges'],
          'Original Forecasts Quantity': line['Original Forecasts Quantity'],
          'Start Date': line['Start Date'],
          'Cancelled Date': line['Cancelled Date'],
          'Factory Date Paid': line['Factory Date Paid'],
          'Date Invoice Raised': line['Date Invoice Raised'],
          'Submitted Inspection Date': line['Submitted Inspection Date'],
          'Remarks': line['Remarks'],
          'Inspection Results': line['Inspection Results'],
          'Report Type': line['Report Type'],
          'Inspector': line['Inspector'],
          'Approval Status': line['Approval Status'],
          'Shipment Status': line['Shipment Status'],
          'QC Comment': line['QC Comment'],
          'Delay Shipment Code': line['Delay Shipment Code'],
          'Discount Percentage': line['Discount Percentage'],
          'SELL INC COMM': line['SELL INC COMM'],
          'Buyer Surcharge': line['Buyer Surcharge'],
          'Buyer Surchage Percentage': line['Buyer Surchage Percentage'],
          'MOQ': line['MOQ'],
          'Discount Cost': line['Discount Cost'],
          'Factory Surcharge': line['Factory Surcharge'],
          'Factory Surchage Percentage': line['Factory Surchage Percentage'],
          'Buyer Season': line['Buyer Season'],
          'Lookbook': line['Lookbook'],
          'Finished Good Testing Status': line['Finished Good Testing Status'],
          'Packing & Label Instruction': line['Packing & Label Instruction'],
          'inline Inspection': line['inline Inspection'],
          'Factory Packing List': line['Factory Packing List'],
          'UCC Label': line['UCC Label'],
          'Final Inspection': line['Final Inspection'],
          'Ex-Factory Date': line['Ex-Factory Date'],
          'Upload Shipping Docs': line['Upload Shipping Docs'],
          'Invoice Customer': line['Invoice Customer'],
          'Customer Delivery Date': line['Customer Delivery Date'],
          'Shipment Booking': line['Shipment Booking'],
          'Warehouse/UCC Label': line['Warehouse/UCC Label'],
          'Projected Delivery Date': line['Projected Delivery Date'],
          'Booking': line['Booking'],
          'Order Placement': line['Order Placement'],
          'Order': line['Order'],
          'Product': line['Product']
        })
      }));
      
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .insert(importData)
        .select();
      
      if (error) {
        console.error('Error bulk importing purchase order lines:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in bulkImportPurchaseOrderLines:', error);
      throw error;
    }
  },

  // Clear all purchase order lines (for fresh import)
  clearAllPurchaseOrderLines: async (): Promise<void> => {
    try {
      const { error } = await supabase
        .from('purchase_order_lines')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (error) {
        console.error('Error clearing purchase order lines:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in clearAllPurchaseOrderLines:', error);
      throw error;
    }
  }
};

// Helper function to convert database row to display format
export const convertDbRowToDisplayFormat = (dbRow: any): Record<string, any> => {
  try {
    const additionalData = dbRow.additional_data ? JSON.parse(dbRow.additional_data) : {};
    
    return {
      id: dbRow.id,
      'Order': additionalData['Order'] || '',
      'Product': additionalData['Product'] || '',
      'PO Line': additionalData['PO Line'] || '',
      'Fit Comment': additionalData['Fit Comment'] || '',
      'Fit Log Status': additionalData['Fit Log Status'] || '',
      'Fit Log Type': additionalData['Fit Log Type'] || '',
      'Fit Log Name': additionalData['Fit Log Name'] || '',
      'Customer': additionalData['Customer'] || '',
      'Collection': additionalData['Collection'] || '',
      'Division': additionalData['Division'] || '',
      'Group': additionalData['Group'] || '',
      'Transport Method': additionalData['Transport Method'] || '',
      'Deliver To': additionalData['Deliver To'] || '',
      'Status': additionalData['Status'] || '',
      'Delivery Date': additionalData['Delivery Date'] || '',
      'Comments': additionalData['Comments'] || '',
      'Quantity': dbRow.quantity || 0,
      'Selling Quantity': additionalData['Selling Quantity'] || 0,
      'Closed Date': additionalData['Closed Date'] || '',
      'Line Purchase Price': additionalData['Line Purchase Price'] || '',
      'Line Selling Price': additionalData['Line Selling Price'] || '',
      'Note Count': additionalData['Note Count'] || 0,
      'Latest Note': additionalData['Latest Note'] || '',
      'Order Quantity Increment': additionalData['Order Quantity Increment'] || 0,
      'Order Lead Time': additionalData['Order Lead Time'] || '',
      'Supplier Ref.': additionalData['Supplier Ref.'] || '',
      'Template': additionalData['Template'] || '',
      'Ex-Factory': additionalData['Ex-Factory'] || '',
      'Purchase Order Status': additionalData['Purchase Order Status'] || '',
      'Supplier Purchase Currency': additionalData['Supplier Purchase Currency'] || '',
      'Customer Selling Currency': additionalData['Customer Selling Currency'] || '',
      'Supplier': additionalData['Supplier'] || '',
      'Purchase Currency': additionalData['Purchase Currency'] || '',
      'Selling Currency': additionalData['Selling Currency'] || '',
      'Minimum Order Quantity': additionalData['Minimum Order Quantity'] || 0,
      'Purchase Description': additionalData['Purchase Description'] || '',
      'Product Type': additionalData['Product Type'] || '',
      'Product Sub Type': additionalData['Product Sub Type'] || '',
      'Product Status': additionalData['Product Status'] || '',
      'Product Buyer Style Name': additionalData['Product Buyer Style Name'] || '',
      'Product Buyer Style Number': additionalData['Product Buyer Style Number'] || '',
      'Standard Minute Value': additionalData['Standard Minute Value'] || 0,
      'Costing': additionalData['Costing'] || '',
      'Costong Purchase Currency': additionalData['Costong Purchase Currency'] || '',
      'Costing Selling Currency': additionalData['Costing Selling Currency'] || '',
      'Costing Status': additionalData['Costing Status'] || '',
      'Supplier Payment Term': additionalData['Supplier Payment Term'] || '',
      'Supplier Payment Term Description': additionalData['Supplier Payment Term Description'] || '',
      'Order Purchase Payment Term': additionalData['Order Purchase Payment Term'] || '',
      'Order Purchase Payment Term Description': additionalData['Order Purchase Payment Term Description'] || '',
      'Product Supplier Purchase Payment Term': additionalData['Product Supplier Purchase Payment Term'] || '',
      'Product Supplier Purhcase Payment Term Description': additionalData['Product Supplier Purhcase Payment Term Description'] || '',
      'Order Selling Payment Term': additionalData['Order Selling Payment Term'] || '',
      'Order Selling Payment Term Description': additionalData['Order Selling Payment Term Description'] || '',
      'Product Supplier Selling Payment Term': additionalData['Product Supplier Selling Payment Term'] || '',
      'Product Supplier Selling Payment Term Description': additionalData['Product Supplier Selling Payment Term Description'] || '',
      'Purchase Price': additionalData['Purchase Price'] || '',
      'Selling Price': additionalData['Selling Price'] || '',
      'Production': additionalData['Production'] || '',
      'MLA-Purchasing': additionalData['MLA-Purchasing'] || '',
      'China-QC': additionalData['China-QC'] || '',
      'MLA-Planning': additionalData['MLA-Planning'] || '',
      'MLA-Shipping': additionalData['MLA-Shipping'] || '',
      'PO Key User 6': additionalData['PO Key User 6'] || '',
      'PO Key User 7': additionalData['PO Key User 7'] || '',
      'PO Key User 8': additionalData['PO Key User 8'] || '',
      'Season': additionalData['Season'] || '',
      'Department': additionalData['Department'] || '',
      'Customer Parent': additionalData['Customer Parent'] || '',
      'RECIPIENT PRODUCT SUPPLIER-NUMBER': additionalData['RECIPIENT PRODUCT SUPPLIER-NUMBER'] || '',
      'FG PO Number': additionalData['FG PO Number'] || '',
      'Received': additionalData['Received'] || 0,
      'Balance': additionalData['Balance'] || 0,
      'Over Received': additionalData['Over Received'] || 0,
      'Size': additionalData['Size'] || '',
      'Main Material': additionalData['Main Material'] || '',
      'Main Material Description': additionalData['Main Material Description'] || '',
      'Delivery Contact': additionalData['Delivery Contact'] || '',
      'PO Key Working Group 1': additionalData['PO Key Working Group 1'] || '',
      'PO Key Working Group 2': additionalData['PO Key Working Group 2'] || '',
      'PO Key Working Group 3': additionalData['PO Key Working Group 3'] || '',
      'PO Key Working Group 4': additionalData['PO Key Working Group 4'] || '',
      'Created By': additionalData['Created By'] || '',
      'Last Edited': additionalData['Last Edited'] || '',
      'Last Edited By': additionalData['Last Edited By'] || '',
      'Color': additionalData['Color'] || '',
      'Vessel Schedule': additionalData['Vessel Schedule'] || '',
      'Buyer PO Number': additionalData['Buyer PO Number'] || '',
      'Shipment ID': additionalData['Shipment ID'] || '',
      'Factory Invoiced': additionalData['Factory Invoiced'] || '',
      'Supplier Invoice': additionalData['Supplier Invoice'] || '',
      'QuickBooks Invoice': additionalData['QuickBooks Invoice'] || '',
      'Shipment Noted': additionalData['Shipment Noted'] || '',
      'Buy Information': additionalData['Buy Information'] || '',
      'Handling Charges': additionalData['Handling Charges'] || '',
      'Original Forecasts Quantity': additionalData['Original Forecasts Quantity'] || 0,
      'Start Date': additionalData['Start Date'] || '',
      'Cancelled Date': additionalData['Cancelled Date'] || '',
      'Factory Date Paid': additionalData['Factory Date Paid'] || '',
      'Date Invoice Raised': additionalData['Date Invoice Raised'] || '',
      'Submitted Inspection Date': additionalData['Submitted Inspection Date'] || '',
      'Remarks': additionalData['Remarks'] || '',
      'Inspection Results': additionalData['Inspection Results'] || '',
      'Report Type': additionalData['Report Type'] || '',
      'Inspector': additionalData['Inspector'] || '',
      'Approval Status': additionalData['Approval Status'] || '',
      'Shipment Status': additionalData['Shipment Status'] || '',
      'QC Comment': additionalData['QC Comment'] || '',
      'Delay Shipment Code': additionalData['Delay Shipment Code'] || '',
      'Discount Percentage': additionalData['Discount Percentage'] || '',
      'SELL INC COMM': additionalData['SELL INC COMM'] || '',
      'Buyer Surcharge': additionalData['Buyer Surcharge'] || '',
      'Buyer Surchage Percentage': additionalData['Buyer Surchage Percentage'] || '',
      'MOQ': additionalData['MOQ'] || '',
      'Discount Cost': additionalData['Discount Cost'] || '',
      'Factory Surcharge': additionalData['Factory Surcharge'] || '',
      'Factory Surchage Percentage': additionalData['Factory Surchage Percentage'] || '',
      'Buyer Season': additionalData['Buyer Season'] || '',
      'Lookbook': additionalData['Lookbook'] || '',
      'Finished Good Testing Status': additionalData['Finished Good Testing Status'] || '',
      'Packing & Label Instruction': additionalData['Packing & Label Instruction'] || { 'Target Date': '', 'Completed Date': '' },
      'inline Inspection': additionalData['inline Inspection'] || { 'Target Date': '', 'Completed Date': '' },
      'Factory Packing List': additionalData['Factory Packing List'] || { 'Target Date': '', 'Completed Date': '' },
      'UCC Label': additionalData['UCC Label'] || { 'Target Date': '', 'Completed Date': '' },
      'Final Inspection': additionalData['Final Inspection'] || { 'Target Date': '', 'Completed Date': '' },
      'Ex-Factory Date': additionalData['Ex-Factory Date'] || { 'Target Date': '', 'Completed Date': '' },
      'Upload Shipping Docs': additionalData['Upload Shipping Docs'] || { 'Target Date': '', 'Completed Date': '' },
      'Invoice Customer': additionalData['Invoice Customer'] || { 'Target Date': '', 'Completed Date': '' },
      'Customer Delivery Date': additionalData['Customer Delivery Date'] || { 'Target Date': '', 'Completed Date': '' },
      'Shipment Booking': additionalData['Shipment Booking'] || { 'Target Date': '', 'Completed Date': '' },
      'Warehouse/UCC Label': additionalData['Warehouse/UCC Label'] || { 'Target Date': '', 'Completed Date': '' },
      'Projected Delivery Date': additionalData['Projected Delivery Date'] || { 'Target Date': '', 'Completed Date': '' },
      'Booking': additionalData['Booking'] || { 'Target Date': '', 'Completed Date': '' },
      'Order Placement': additionalData['Order Placement'] || { 'Target Date': '', 'Completed Date': '' }
    };
  } catch (error) {
    console.error('Error converting database row to display format:', error);
    return {};
  }
}; 