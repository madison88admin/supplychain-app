import { supabase } from './supabase';
// import { MaterialPurchaseOrderLine } from './supplyChainData';

// Interface for Material Purchase Order (MPO) Line data
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
  // Core MPO columns
  'Order Reference'?: string;
  'Template'?: string;
  'Transport Method'?: string;
  'Deliver To'?: string;
  'Status'?: string;
  'Total Qty'?: string | number;
  'Total Cost'?: string;
  'Total Value'?: string;
  'PO Line'?: string;
  'Fit Comment'?: string;
  'Fit Log Status'?: string;
  'Fit Log Type'?: string;
  'Fit Log Name'?: string;
  'Customer'?: string;
  'Collection'?: string;
  'Division'?: string;
  'Group'?: string;
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
  'Purchase Order Status'?: string;
  'MPO Key Date'?: string;
  'Supplier Currency'?: string;
  'Supplier Description'?: string;
  'Supplier Parent'?: string;
  'Supplier Purchase Currency'?: string;
  'Customer Selling Currency'?: string;
  'Supplier'?: string;
  'Purchase Currency'?: string;
  'Selling Currency'?: string;
  'Selling Payment Term'?: string;
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
  'Purchase Payment Term'?: string;
  'Supplier Payment Term Description'?: string;
  'Order Purchase Payment Term'?: string;
  'Order Purchase Payment Term Description'?: string;
  'Product Supplier Purchase Payment Term'?: string;
  'Product Supplier Purhcase Payment Term Description'?: string;
  'Order Selling Payment Term'?: string;
  'Order Selling Payment Term Description'?: string;
  'Product Supplier Selling Payment Term'?: string;
  'Product Supplier Selling Payment Term Description'?: string;
  'Purchase Payment Term Description'?: string;
  'Purchase Price'?: string;
  'Selling Price'?: string;
  'Production'?: string;
  'MLA-Purchasing'?: string;
  'China-QC'?: string;
  'MLA-Planning'?: string;
  'MLA-Shipping'?: string;
  'Purchasing'?: string;
  'MPO Key User 2'?: string;
  'MPO Key User 3'?: string;
  'MPO Key User 4'?: string;
  'MPO Key User 5'?: string;
  'PO Key User 6'?: string;
  'PO Key User 7'?: string;
  'PO Key User 8'?: string;
  'Season'?: string;
  'Department'?: string;
  'Customer Parent'?: string;
  'RECIPIENT PRODUCT SUPPLIER-NUMBER'?: string;
  'Recipient Product Supplier'?: string;
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
  'Created'?: string;
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
  'Supplier Location'?: string;
  'Supplier Country'?: string;
  'Selling Payment Term Description'?: string;
  'Default Material Purchase Order Line Template'?: string;
  'Default MPO Line Key Date'?: string;
  'MPO Key Working Group 1'?: string;
  'MPO Key Working Group 2'?: string;
  'MPO Key Working Group 3'?: string;
  'MPO Key Working Group 4'?: string;
  
  // Grouped columns
  'Trim Order'?: { 'Target Date': string; 'Completed Date': string };
  'Ex-Factory'?: { 'Target Date': string; 'Completed Date': string };
  'Trims Received'?: { 'Target Date': string; 'Completed Date': string };
  'MPO Issue Date'?: { 'Target Date': string; 'Completed Date': string };
  'Main Material Order'?: { 'Target Date': string; 'Completed Date': string };
  'Main Material received'?: { 'Target Date': string; 'Completed Date': string };
  
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

// Database service for Material Purchase Orders (MPOs)
export const materialPurchaseOrderService = {
  // Get all MPO lines
  getAllMaterialPurchaseOrderLines: async (): Promise<PurchaseOrderLine[]> => {
    try {
      const { data, error } = await supabase
        .from('materialpurchaseorder')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching material purchase order lines:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllMaterialPurchaseOrderLines:', error);
      throw error;
    }
  },

  // Get MPO line by ID
  getMaterialPurchaseOrderLineById: async (id: string): Promise<PurchaseOrderLine | null> => {
    try {
      const { data, error } = await supabase
        .from('materialpurchaseorder')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching material purchase order line:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getMaterialPurchaseOrderLineById:', error);
      throw error;
    }
  },

  // Create new MPO line
  createMaterialPurchaseOrderLine: async (lineData: Omit<PurchaseOrderLine, 'id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrderLine> => {
    try {
      const { data, error } = await supabase
        .from('materialpurchaseorder')
        .insert({
          purchase_order_id: (lineData as any).purchase_order_id,
          product_id: (lineData as any).product_id,
          quantity: (lineData as any).quantity,
          unit_price: (lineData as any).unit_price,
          received_quantity: (lineData as any).received_quantity || 0,
          notes: (lineData as any).notes,
          // Store additional MPO fields as JSON in additional_data
          additional_data: JSON.stringify({
            // Core MPO fields
            'Order Reference': (lineData as any)['Order Reference'],
            'Template': (lineData as any)['Template'],
            'Transport Method': (lineData as any)['Transport Method'],
            'Deliver To': (lineData as any)['Deliver To'],
            'Status': (lineData as any)['Status'],
            'Total Qty': (lineData as any)['Total Qty'],
            'Total Cost': (lineData as any)['Total Cost'],
            'Total Value': (lineData as any)['Total Value'],
            'Customer': (lineData as any)['Customer'],
            'Supplier': (lineData as any)['Supplier'],
            'Purchase Currency': (lineData as any)['Purchase Currency'],
            'Purchase Payment Term': (lineData as any)['Purchase Payment Term'],
            'Closed Date': (lineData as any)['Closed Date'],
            'MPO Key Date': (lineData as any)['MPO Key Date'],
            'Supplier Currency': (lineData as any)['Supplier Currency'],
            'Supplier Description': (lineData as any)['Supplier Description'],
            'Supplier Parent': (lineData as any)['Supplier Parent'],
            'Delivery Date': (lineData as any)['Delivery Date'],
            'Recipient Product Supplier': (lineData as any)['Recipient Product Supplier'],
            'Comments': (lineData as any)['Comments'],
            'Purchasing': (lineData as any)['Purchasing'],
            'MPO Key User 2': (lineData as any)['MPO Key User 2'],
            'MPO Key User 3': (lineData as any)['MPO Key User 3'],
            'MPO Key User 4': (lineData as any)['MPO Key User 4'],
            'MPO Key User 5': (lineData as any)['MPO Key User 5'],
            'PO Key User 6': (lineData as any)['PO Key User 6'],
            'PO Key User 7': (lineData as any)['PO Key User 7'],
            'PO Key User 8': (lineData as any)['PO Key User 8'],
            'Note Count': (lineData as any)['Note Count'],
            'Latest Note': (lineData as any)['Latest Note'],
            'Purchase Payment Term Description': (lineData as any)['Purchase Payment Term Description'],
            'Created By': (lineData as any)['Created By'],
            'Created': (lineData as any)['Created'],
            'Last Edited': (lineData as any)['Last Edited'],
            'Last Edited By': (lineData as any)['Last Edited By'],
            'Selling Currency': (lineData as any)['Selling Currency'],
            'Selling Payment Term': (lineData as any)['Selling Payment Term'],
            'Delivery Contact': (lineData as any)['Delivery Contact'],
            'Division': (lineData as any)['Division'],
            'Group': (lineData as any)['Group'],
            'Supplier Location': (lineData as any)['Supplier Location'],
            'Supplier Country': (lineData as any)['Supplier Country'],
            'Selling Payment Term Description': (lineData as any)['Selling Payment Term Description'],
            'Default Material Purchase Order Line Template': (lineData as any)['Default Material Purchase Order Line Template'],
            'Default MPO Line Key Date': (lineData as any)['Default MPO Line Key Date'],
            'MPO Key Working Group 1': (lineData as any)['MPO Key Working Group 1'],
            'MPO Key Working Group 2': (lineData as any)['MPO Key Working Group 2'],
            'MPO Key Working Group 3': (lineData as any)['MPO Key Working Group 3'],
            'MPO Key Working Group 4': (lineData as any)['MPO Key Working Group 4'],
            
            // Grouped milestone fields
            'Trim Order': (lineData as any)['Trim Order'],
            'Ex-Factory': (lineData as any)['Ex-Factory'],
            'Trims Received': (lineData as any)['Trims Received'],
            'MPO Issue Date': (lineData as any)['MPO Issue Date'],
            'Main Material Order': (lineData as any)['Main Material Order'],
            'Main Material received': (lineData as any)['Main Material received'],
            
            // Legacy optional fields kept for compatibility
            'Order': (lineData as any)['Order'],
            'Product': (lineData as any)['Product']
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

  // Update MPO line
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
        .from('materialpurchaseorder')
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

  // Delete MPO line
  deletePurchaseOrderLine: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('materialpurchaseorder')
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

  // Bulk import MPO lines
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
          // Core MPO fields
          'Order Reference': line['Order Reference'],
          'Template': line['Template'],
          'Transport Method': line['Transport Method'],
          'Deliver To': line['Deliver To'],
          'Status': line['Status'],
          'Total Qty': line['Total Qty'],
          'Total Cost': line['Total Cost'],
          'Total Value': line['Total Value'],
          'Customer': line['Customer'],
          'Supplier': line['Supplier'],
          'Purchase Currency': line['Purchase Currency'],
          'Purchase Payment Term': line['Purchase Payment Term'],
          'Closed Date': line['Closed Date'],
          'MPO Key Date': line['MPO Key Date'],
          'Supplier Currency': line['Supplier Currency'],
          'Supplier Description': line['Supplier Description'],
          'Supplier Parent': line['Supplier Parent'],
          'Delivery Date': line['Delivery Date'],
          'Recipient Product Supplier': line['Recipient Product Supplier'],
          'Comments': line['Comments'],
          'Purchasing': line['Purchasing'],
          'MPO Key User 2': line['MPO Key User 2'],
          'MPO Key User 3': line['MPO Key User 3'],
          'MPO Key User 4': line['MPO Key User 4'],
          'MPO Key User 5': line['MPO Key User 5'],
          'PO Key User 6': line['PO Key User 6'],
          'PO Key User 7': line['PO Key User 7'],
          'PO Key User 8': line['PO Key User 8'],
          'Note Count': line['Note Count'],
          'Latest Note': line['Latest Note'],
          'Purchase Payment Term Description': line['Purchase Payment Term Description'],
          'Created By': line['Created By'],
          'Created': line['Created'],
          'Last Edited': line['Last Edited'],
          'Last Edited By': line['Last Edited By'],
          'Selling Currency': line['Selling Currency'],
          'Selling Payment Term': line['Selling Payment Term'],
          'Delivery Contact': line['Delivery Contact'],
          'Division': line['Division'],
          'Group': line['Group'],
          'Supplier Location': line['Supplier Location'],
          'Supplier Country': line['Supplier Country'],
          'Selling Payment Term Description': line['Selling Payment Term Description'],
          'Default Material Purchase Order Line Template': line['Default Material Purchase Order Line Template'],
          'Default MPO Line Key Date': line['Default MPO Line Key Date'],
          'MPO Key Working Group 1': line['MPO Key Working Group 1'],
          'MPO Key Working Group 2': line['MPO Key Working Group 2'],
          'MPO Key Working Group 3': line['MPO Key Working Group 3'],
          'MPO Key Working Group 4': line['MPO Key Working Group 4'],
          
          // Grouped milestone fields
          'Trim Order': line['Trim Order'],
          'Ex-Factory': line['Ex-Factory'],
          'Trims Received': line['Trims Received'],
          'MPO Issue Date': line['MPO Issue Date'],
          'Main Material Order': line['Main Material Order'],
          'Main Material received': line['Main Material received'],
          
          // Legacy optional fields kept for compatibility
          'Order': line['Order'],
          'Product': line['Product']
        })
      }));
      
      const { data, error } = await supabase
        .from('materialpurchaseorder')
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
        .from('materialpurchaseorder')
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

// Helper function to convert MPO database row to display format used by the UI
export const convertDbRowToDisplayFormat = (dbRow: any): Record<string, any> => {
  try {
    // Supabase returns jsonb as a native object. Handle both string and object safely.
    const raw = dbRow?.additional_data ?? {};
    const additionalData = typeof raw === 'string' ? JSON.parse(raw) : raw;
    
    return {
      id: dbRow.id,
      // Core MPO fields
      'Order Reference': additionalData['order_reference'] || '',
      'Template': additionalData['template'] || '',
      'Transport Method': additionalData['transport_method'] || '',
      'Deliver To': additionalData['deliver_to'] || '',
      'Status': additionalData['status'] || '',
      'Total Qty': additionalData['total_qty'] || '',
      'Total Cost': additionalData['total_cost'] || '',
      'Total Value': additionalData['total_value'] || '',
      'PO Line': additionalData['po_line'] || '',
      'Fit Comment': additionalData['fit_comment'] || '',
      'Fit Log Status': additionalData['fit_log_status'] || '',
      'Fit Log Type': additionalData['fit_log_type'] || '',
      'Fit Log Name': additionalData['fit_log_name'] || '',
      'Customer': additionalData['customer'] || '',
      'Collection': additionalData['collection'] || '',
      'Division': additionalData['division'] || '',
      'Group': additionalData['group'] || '',
      'Delivery Date': additionalData['delivery_date'] || '',
      'Comments': additionalData['comments'] || '',
      'Quantity': dbRow.quantity || 0,
      'Selling Quantity': additionalData['selling_quantity'] || 0,
      'Closed Date': additionalData['closed_date'] || '',
      'Line Purchase Price': additionalData['Line Purchase Price'] || '',
      'Line Selling Price': additionalData['Line Selling Price'] || '',
      'Note Count': additionalData['Note Count'] || 0,
      'Latest Note': additionalData['Latest Note'] || '',
      'Order Quantity Increment': additionalData['Order Quantity Increment'] || 0,
      'Order Lead Time': additionalData['Order Lead Time'] || '',
      'Supplier Ref.': additionalData['Supplier Ref.'] || '',
      'Purchase Order Status': additionalData['Purchase Order Status'] || '',
      'MPO Key Date': additionalData['MPO Key Date'] || '',
      'Supplier Currency': additionalData['Supplier Currency'] || '',
      'Supplier Description': additionalData['Supplier Description'] || '',
      'Supplier Parent': additionalData['Supplier Parent'] || '',
      'Supplier Purchase Currency': additionalData['Supplier Purchase Currency'] || '',
      'Customer Selling Currency': additionalData['Customer Selling Currency'] || '',
      'Supplier': additionalData['Supplier'] || '',
      'Purchase Currency': additionalData['Purchase Currency'] || '',
      'Selling Currency': additionalData['Selling Currency'] || '',
      'Selling Payment Term': additionalData['Selling Payment Term'] || '',
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
      'Purchase Payment Term': additionalData['Purchase Payment Term'] || '',
      'Supplier Payment Term Description': additionalData['Supplier Payment Term Description'] || '',
      'Order Purchase Payment Term': additionalData['Order Purchase Payment Term'] || '',
      'Order Purchase Payment Term Description': additionalData['Order Purchase Payment Term Description'] || '',
      'Product Supplier Purchase Payment Term': additionalData['Product Supplier Purchase Payment Term'] || '',
      'Product Supplier Purhcase Payment Term Description': additionalData['Product Supplier Purhcase Payment Term Description'] || '',
      'Order Selling Payment Term': additionalData['Order Selling Payment Term'] || '',
      'Order Selling Payment Term Description': additionalData['Order Selling Payment Term Description'] || '',
      'Product Supplier Selling Payment Term': additionalData['Product Supplier Selling Payment Term'] || '',
      'Product Supplier Selling Payment Term Description': additionalData['Product Supplier Selling Payment Term Description'] || '',
      'Purchase Payment Term Description': additionalData['Purchase Payment Term Description'] || '',
      'Purchase Price': additionalData['Purchase Price'] || '',
      'Selling Price': additionalData['Selling Price'] || '',
      'Production': additionalData['Production'] || '',
      'MLA-Purchasing': additionalData['MLA-Purchasing'] || '',
      'China-QC': additionalData['China-QC'] || '',
      'MLA-Planning': additionalData['MLA-Planning'] || '',
      'MLA-Shipping': additionalData['MLA-Shipping'] || '',
      'Purchasing': additionalData['Purchasing'] || '',
      'MPO Key User 2': additionalData['MPO Key User 2'] || '',
      'MPO Key User 3': additionalData['MPO Key User 3'] || '',
      'MPO Key User 4': additionalData['MPO Key User 4'] || '',
      'MPO Key User 5': additionalData['MPO Key User 5'] || '',
      'PO Key User 6': additionalData['PO Key User 6'] || '',
      'PO Key User 7': additionalData['PO Key User 7'] || '',
      'PO Key User 8': additionalData['PO Key User 8'] || '',
      'Season': additionalData['Season'] || '',
      'Department': additionalData['Department'] || '',
      'Customer Parent': additionalData['Customer Parent'] || '',
      'RECIPIENT PRODUCT SUPPLIER-NUMBER': additionalData['RECIPIENT PRODUCT SUPPLIER-NUMBER'] || '',
      'Recipient Product Supplier': additionalData['Recipient Product Supplier'] || '',
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
      'Created': additionalData['Created'] || '',
      'Last Edited': additionalData['Last Edited'] || '',
      'Last Edited By': additionalData['Last Edited By'] || '',
      'Supplier Location': additionalData['Supplier Location'] || '',
      'Supplier Country': additionalData['Supplier Country'] || '',
      'Selling Payment Term Description': additionalData['Selling Payment Term Description'] || '',
      'Default Material Purchase Order Line Template': additionalData['Default Material Purchase Order Line Template'] || '',
      'Default MPO Line Key Date': additionalData['Default MPO Line Key Date'] || '',
      'MPO Key Working Group 1': additionalData['MPO Key Working Group 1'] || '',
      'MPO Key Working Group 2': additionalData['MPO Key Working Group 2'] || '',
      'MPO Key Working Group 3': additionalData['MPO Key Working Group 3'] || '',
      'MPO Key Working Group 4': additionalData['MPO Key Working Group 4'] || '',
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
      // Grouped milestone fields
      'Trim Order': additionalData['Trim Order'] || { 'Target Date': '', 'Completed Date': '' },
      'Ex-Factory': additionalData['Ex-Factory'] || { 'Target Date': '', 'Completed Date': '' },
      'Trims Received': additionalData['Trims Received'] || { 'Target Date': '', 'Completed Date': '' },
      'MPO Issue Date': additionalData['MPO Issue Date'] || { 'Target Date': '', 'Completed Date': '' },
      'Main Material Order': additionalData['Main Material Order'] || { 'Target Date': '', 'Completed Date': '' },
      'Main Material received': additionalData['Main Material received'] || { 'Target Date': '', 'Completed Date': '' },

      // Legacy optional fields for compatibility
      'Order': additionalData['Order'] || '',
      'Product': additionalData['Product'] || ''
    };
  } catch (error) {
    console.error('Error converting database row to display format:', error);
    return {};
  }
}; 