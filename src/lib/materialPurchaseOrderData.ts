import { supabase } from './supabase';

// Interface for Material Purchase Order (MPO) Line data - aligned with database schema
export interface PurchaseOrderLine {
  // Core database columns
  id?: string;
  purchase_order_id?: string;
  product_id?: string;
  quantity: number;
  unit_price: number;
  total_price?: number;
  received_quantity?: number;
  notes?: string;
  additional_data?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  
  // Database columns that map directly
  order_reference?: string;
  template?: string;
  transport_method?: string;
  deliver_to?: string;
  status?: string;
  total_qty?: number;
  total_cost?: number;
  total_value?: string;
  customer?: string;
  supplier?: string;
  purchase_currency?: string;
  purchase_payment_term?: string;
  closed_date?: string;
  mpo_key_date?: string;
  supplier_currency?: string;
  supplier_description?: string;
  supplier_parent?: string;
  delivery_date?: string;
  recipient_product_supplier?: string;
  comments?: string;
  purchasing?: string;
  mpo_key_user_2?: string;
  mpo_key_user_3?: string;
  mpo_key_user_4?: string;
  mpo_key_user_5?: string;
  mpo_key_user_6?: string;
  mpo_key_user_7?: string;
  mpo_key_user_8?: string;
  note_count?: string;
  latest_note?: string;
  purchase_payment_term_description?: string;
  created_by?: string;
  created?: string;
  last_edited?: string;
  
  // Milestone date columns
  trim_order_target_date?: string;
  trim_order_completed_date?: string;
  ex_factory_target_date?: string;
  ex_factory_completed_date?: string;
  trims_received_target_date?: string;
  trims_received_completed_date?: string;
  mpo_issue_date_target_date?: string;
  mpo_issue_date_completed_date?: string;
  main_material_order_target_date?: string;
  main_material_order_completed_date?: string;
  main_material_received_target_date?: string;
  main_material_received_completed_date?: string;
  
  selling_currency?: string;
  selling_payment_term?: string;
  delivery_contact?: string;
  division?: string;
  group?: string;
  supplier_location?: string;
  supplier_country?: string;
  selling_payment_term_description?: string;
  default_material_purchase_order_line_template?: string;
  default_mpo_line_key_date?: string;
  mpo_key_working_group_1?: string;
  mpo_key_working_group_2?: string;
  mpo_key_working_group_3?: string;
  mpo_key_working_group_4?: string;
  last_edited_by?: string;
  
  // Legacy interface fields for backward compatibility (stored in additional_data)
  'Order Reference'?: string;
  'Template'?: string;
  'Transport Method'?: string;
  'Deliver To'?: string;
  'Status'?: string;
  'Total Qty'?: string | number;
  'Total Cost'?: string;
  'Total Value'?: string;
  'Customer'?: string;
  'Supplier'?: string;
  'Purchase Currency'?: string;
  'Purchase Payment Term'?: string;
  'Closed Date'?: string;
  'MPO Key Date'?: string;
  'Supplier Currency'?: string;
  'Supplier Description'?: string;
  'Supplier Parent'?: string;
  'Delivery Date'?: string;
  'Recipient Product Supplier'?: string;
  'Comments'?: string;
  'Purchasing'?: string;
  'MPO Key User 2'?: string;
  'MPO Key User 3'?: string;
  'MPO Key User 4'?: string;
  'MPO Key User 5'?: string;
  'MPO Key User 6'?: string;
  'MPO Key User 7'?: string;
  'MPO Key User 8'?: string;
  
  // Grouped columns for UI display
  'Trim Order'?: { 'Target Date': string; 'Completed Date': string };
  'Ex-Factory'?: { 'Target Date': string; 'Completed Date': string };
  'Trims Received'?: { 'Target Date': string; 'Completed Date': string };
  'MPO Issue Date'?: { 'Target Date': string; 'Completed Date': string };
  'Main Material Order'?: { 'Target Date': string; 'Completed Date': string };
  'Main Material received'?: { 'Target Date': string; 'Completed Date': string };
  
  // Other fields that go in additional_data
  'PO Line'?: string;
  'Fit Comment'?: string;
  'Collection'?: string;
  'Selling Quantity'?: number;
  'Product Type'?: string;
  'Season'?: string;
  'Department'?: string;
  'Size'?: string;
  'Color'?: string;
  'Order'?: string;
  'Product'?: string;
  [key: string]: any; // Allow for additional dynamic fields
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

// Helper function to map interface fields to database columns
const mapToDbColumns = (lineData: Partial<PurchaseOrderLine>) => {
  const dbData: any = {};
  const additionalData: any = {};
  
  // Map direct database columns
  if (lineData.purchase_order_id !== undefined) dbData.purchase_order_id = lineData.purchase_order_id;
  if (lineData.product_id !== undefined) dbData.product_id = lineData.product_id;
  if (lineData.quantity !== undefined) dbData.quantity = lineData.quantity;
  if (lineData.unit_price !== undefined) dbData.unit_price = lineData.unit_price;
  if (lineData.total_price !== undefined) dbData.total_price = lineData.total_price;
  if (lineData.received_quantity !== undefined) dbData.received_quantity = lineData.received_quantity;
  if (lineData.notes !== undefined) dbData.notes = lineData.notes;
  
  // Map fields that have both snake_case and display versions
  if (lineData.order_reference !== undefined) dbData.order_reference = lineData.order_reference;
  if (lineData['Order Reference'] !== undefined) dbData.order_reference = lineData['Order Reference'];
  
  if (lineData.template !== undefined) dbData.template = lineData.template;
  if (lineData['Template'] !== undefined) dbData.template = lineData['Template'];
  
  if (lineData.transport_method !== undefined) dbData.transport_method = lineData.transport_method;
  if (lineData['Transport Method'] !== undefined) dbData.transport_method = lineData['Transport Method'];
  
  if (lineData.deliver_to !== undefined) dbData.deliver_to = lineData.deliver_to;
  if (lineData['Deliver To'] !== undefined) dbData.deliver_to = lineData['Deliver To'];
  
  if (lineData.status !== undefined) dbData.status = lineData.status;
  if (lineData['Status'] !== undefined) dbData.status = lineData['Status'];
  
  if (lineData.total_qty !== undefined) dbData.total_qty = lineData.total_qty;
  if (lineData['Total Qty'] !== undefined) dbData.total_qty = lineData['Total Qty'];
  
  if (lineData.total_cost !== undefined) dbData.total_cost = lineData.total_cost;
  if (lineData['Total Cost'] !== undefined) dbData.total_cost = lineData['Total Cost'];
  
  if (lineData.total_value !== undefined) dbData.total_value = lineData.total_value;
  if (lineData['Total Value'] !== undefined) dbData.total_value = lineData['Total Value'];
  
  if (lineData.customer !== undefined) dbData.customer = lineData.customer;
  if (lineData['Customer'] !== undefined) dbData.customer = lineData['Customer'];
  
  if (lineData.supplier !== undefined) dbData.supplier = lineData.supplier;
  if (lineData['Supplier'] !== undefined) dbData.supplier = lineData['Supplier'];
  
  if (lineData.purchase_currency !== undefined) dbData.purchase_currency = lineData.purchase_currency;
  if (lineData['Purchase Currency'] !== undefined) dbData.purchase_currency = lineData['Purchase Currency'];
  
  if (lineData.purchase_payment_term !== undefined) dbData.purchase_payment_term = lineData.purchase_payment_term;
  if (lineData['Purchase Payment Term'] !== undefined) dbData.purchase_payment_term = lineData['Purchase Payment Term'];
  
  if (lineData.closed_date !== undefined) dbData.closed_date = lineData.closed_date;
  if (lineData['Closed Date'] !== undefined) dbData.closed_date = lineData['Closed Date'];
  
  if (lineData.mpo_key_date !== undefined) dbData.mpo_key_date = lineData.mpo_key_date;
  if (lineData['MPO Key Date'] !== undefined) dbData.mpo_key_date = lineData['MPO Key Date'];
  
  if (lineData.supplier_currency !== undefined) dbData.supplier_currency = lineData.supplier_currency;
  if (lineData['Supplier Currency'] !== undefined) dbData.supplier_currency = lineData['Supplier Currency'];
  
  if (lineData.supplier_description !== undefined) dbData.supplier_description = lineData.supplier_description;
  if (lineData['Supplier Description'] !== undefined) dbData.supplier_description = lineData['Supplier Description'];
  
  if (lineData.supplier_parent !== undefined) dbData.supplier_parent = lineData.supplier_parent;
  if (lineData['Supplier Parent'] !== undefined) dbData.supplier_parent = lineData['Supplier Parent'];
  
  if (lineData.delivery_date !== undefined) dbData.delivery_date = lineData.delivery_date;
  if (lineData['Delivery Date'] !== undefined) dbData.delivery_date = lineData['Delivery Date'];
  
  if (lineData.recipient_product_supplier !== undefined) dbData.recipient_product_supplier = lineData.recipient_product_supplier;
  if (lineData['Recipient Product Supplier'] !== undefined) dbData.recipient_product_supplier = lineData['Recipient Product Supplier'];
  
  if (lineData.comments !== undefined) dbData.comments = lineData.comments;
  if (lineData['Comments'] !== undefined) dbData.comments = lineData['Comments'];
  
  if (lineData.purchasing !== undefined) dbData.purchasing = lineData.purchasing;
  if (lineData['Purchasing'] !== undefined) dbData.purchasing = lineData['Purchasing'];
  
  // Map user fields
  if (lineData.mpo_key_user_2 !== undefined) dbData.mpo_key_user_2 = lineData.mpo_key_user_2;
  if (lineData['MPO Key User 2'] !== undefined) dbData.mpo_key_user_2 = lineData['MPO Key User 2'];
  
  if (lineData.mpo_key_user_3 !== undefined) dbData.mpo_key_user_3 = lineData.mpo_key_user_3;
  if (lineData['MPO Key User 3'] !== undefined) dbData.mpo_key_user_3 = lineData['MPO Key User 3'];
  
  if (lineData.mpo_key_user_4 !== undefined) dbData.mpo_key_user_4 = lineData.mpo_key_user_4;
  if (lineData['MPO Key User 4'] !== undefined) dbData.mpo_key_user_4 = lineData['MPO Key User 4'];
  
  if (lineData.mpo_key_user_5 !== undefined) dbData.mpo_key_user_5 = lineData.mpo_key_user_5;
  if (lineData['MPO Key User 5'] !== undefined) dbData.mpo_key_user_5 = lineData['MPO Key User 5'];
  
  if (lineData.mpo_key_user_6 !== undefined) dbData.mpo_key_user_6 = lineData.mpo_key_user_6;
  if (lineData['MPO Key User 6'] !== undefined) dbData.mpo_key_user_6 = lineData['MPO Key User 6'];
  
  if (lineData.mpo_key_user_7 !== undefined) dbData.mpo_key_user_7 = lineData.mpo_key_user_7;
  if (lineData['MPO Key User 7'] !== undefined) dbData.mpo_key_user_7 = lineData['MPO Key User 7'];
  
  if (lineData.mpo_key_user_8 !== undefined) dbData.mpo_key_user_8 = lineData.mpo_key_user_8;
  if (lineData['MPO Key User 8'] !== undefined) dbData.mpo_key_user_8 = lineData['MPO Key User 8'];
  
  // Map milestone dates
  if (lineData['Trim Order']) {
    dbData.trim_order_target_date = lineData['Trim Order']['Target Date'];
    dbData.trim_order_completed_date = lineData['Trim Order']['Completed Date'];
  }
  if (lineData['Ex-Factory']) {
    dbData.ex_factory_target_date = lineData['Ex-Factory']['Target Date'];
    dbData.ex_factory_completed_date = lineData['Ex-Factory']['Completed Date'];
  }
  if (lineData['Trims Received']) {
    dbData.trims_received_target_date = lineData['Trims Received']['Target Date'];
    dbData.trims_received_completed_date = lineData['Trims Received']['Completed Date'];
  }
  if (lineData['MPO Issue Date']) {
    dbData.mpo_issue_date_target_date = lineData['MPO Issue Date']['Target Date'];
    dbData.mpo_issue_date_completed_date = lineData['MPO Issue Date']['Completed Date'];
  }
  if (lineData['Main Material Order']) {
    dbData.main_material_order_target_date = lineData['Main Material Order']['Target Date'];
    dbData.main_material_order_completed_date = lineData['Main Material Order']['Completed Date'];
  }
  if (lineData['Main Material received']) {
    dbData.main_material_received_target_date = lineData['Main Material received']['Target Date'];
    dbData.main_material_received_completed_date = lineData['Main Material received']['Completed Date'];
  }
  
  // Map remaining direct database fields
  if (lineData.selling_currency !== undefined) dbData.selling_currency = lineData.selling_currency;
  if (lineData.selling_payment_term !== undefined) dbData.selling_payment_term = lineData.selling_payment_term;
  if (lineData.delivery_contact !== undefined) dbData.delivery_contact = lineData.delivery_contact;
  if (lineData.division !== undefined) dbData.division = lineData.division;
  if (lineData.group !== undefined) dbData.group = lineData.group;
  if (lineData.supplier_location !== undefined) dbData.supplier_location = lineData.supplier_location;
  if (lineData.supplier_country !== undefined) dbData.supplier_country = lineData.supplier_country;
  if (lineData.selling_payment_term_description !== undefined) dbData.selling_payment_term_description = lineData.selling_payment_term_description;
  if (lineData.default_material_purchase_order_line_template !== undefined) dbData.default_material_purchase_order_line_template = lineData.default_material_purchase_order_line_template;
  if (lineData.default_mpo_line_key_date !== undefined) dbData.default_mpo_line_key_date = lineData.default_mpo_line_key_date;
  if (lineData.mpo_key_working_group_1 !== undefined) dbData.mpo_key_working_group_1 = lineData.mpo_key_working_group_1;
  if (lineData.mpo_key_working_group_2 !== undefined) dbData.mpo_key_working_group_2 = lineData.mpo_key_working_group_2;
  if (lineData.mpo_key_working_group_3 !== undefined) dbData.mpo_key_working_group_3 = lineData.mpo_key_working_group_3;
  if (lineData.mpo_key_working_group_4 !== undefined) dbData.mpo_key_working_group_4 = lineData.mpo_key_working_group_4;
  if (lineData.note_count !== undefined) dbData.note_count = lineData.note_count;
  if (lineData.latest_note !== undefined) dbData.latest_note = lineData.latest_note;
  if (lineData.purchase_payment_term_description !== undefined) dbData.purchase_payment_term_description = lineData.purchase_payment_term_description;
  if (lineData.created_by !== undefined) dbData.created_by = lineData.created_by;
  if (lineData.created !== undefined) dbData.created = lineData.created;
  if (lineData.last_edited !== undefined) dbData.last_edited = lineData.last_edited;
  if (lineData.last_edited_by !== undefined) dbData.last_edited_by = lineData.last_edited_by;
  
  // Everything else goes in additional_data
  Object.keys(lineData).forEach(key => {
    // Skip fields that are already mapped to database columns
    if (!['id', 'purchase_order_id', 'product_id', 'quantity', 'unit_price', 'total_price', 
          'received_quantity', 'notes', 'created_at', 'updated_at', 'additional_data',
          'order_reference', 'template', 'transport_method', 'deliver_to', 'status',
          'total_qty', 'total_cost', 'total_value', 'customer', 'supplier', 'purchase_currency',
          'purchase_payment_term', 'closed_date', 'mpo_key_date', 'supplier_currency',
          'supplier_description', 'supplier_parent', 'delivery_date', 'recipient_product_supplier',
          'comments', 'purchasing', 'mpo_key_user_2', 'mpo_key_user_3', 'mpo_key_user_4',
          'mpo_key_user_5', 'mpo_key_user_6', 'mpo_key_user_7', 'mpo_key_user_8',
          'note_count', 'latest_note', 'purchase_payment_term_description', 'created_by',
          'created', 'last_edited', 'trim_order_target_date', 'trim_order_completed_date',
          'ex_factory_target_date', 'ex_factory_completed_date', 'trims_received_target_date',
          'trims_received_completed_date', 'mpo_issue_date_target_date', 'mpo_issue_date_completed_date',
          'main_material_order_target_date', 'main_material_order_completed_date',
          'main_material_received_target_date', 'main_material_received_completed_date',
          'selling_currency', 'selling_payment_term', 'delivery_contact', 'division',
          'group', 'supplier_location', 'supplier_country', 'selling_payment_term_description',
          'default_material_purchase_order_line_template', 'default_mpo_line_key_date',
          'mpo_key_working_group_1', 'mpo_key_working_group_2', 'mpo_key_working_group_3',
          'mpo_key_working_group_4', 'last_edited_by',
          // Skip display name versions that are already mapped
          'Order Reference', 'Template', 'Transport Method', 'Deliver To', 'Status',
          'Total Qty', 'Total Cost', 'Total Value', 'Customer', 'Supplier', 'Purchase Currency',
          'Purchase Payment Term', 'Closed Date', 'MPO Key Date', 'Supplier Currency',
          'Supplier Description', 'Supplier Parent', 'Delivery Date', 'Recipient Product Supplier',
          'Comments', 'Purchasing', 'MPO Key User 2', 'MPO Key User 3', 'MPO Key User 4',
          'MPO Key User 5', 'MPO Key User 6', 'MPO Key User 7', 'MPO Key User 8',
          'Trim Order', 'Ex-Factory', 'Trims Received', 'MPO Issue Date', 'Main Material Order',
          'Main Material received'
        ].includes(key)) {
      additionalData[key] = lineData[key as keyof PurchaseOrderLine];
    }
  });
  
  if (Object.keys(additionalData).length > 0) {
    dbData.additional_data = additionalData;
  }
  
  return dbData;
};

// Database service for Material Purchase Orders (MPOs)
export const materialPurchaseOrderService = {
  // Test connection
  testConnection: async () => {
    try {
      // Test 1: Check authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth User:', user);
      console.log('Auth Error:', authError);
      
      // Test 2: Try a simple count query
      const { count, error: countError } = await supabase
        .from('materialpurchaseorder')
        .select('*', { count: 'exact', head: true });
      
      console.log('Row Count:', count);
      console.log('Count Error:', countError);
      
      // Test 3: Try fetching one row
      const { data, error } = await supabase
        .from('materialpurchaseorder')
        .select('*')
        .limit(1);
      
      console.log('Sample Data:', data);
      console.log('Data Error:', error);
      
      return { user, count, data, error };
    } catch (err) {
      console.error('Connection test failed:', err);
      return { error: err };
    }
  },

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
      const dbData = mapToDbColumns(lineData);
      
      const { data, error } = await supabase
        .from('materialpurchaseorder')
        .insert(dbData)
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
      const dbData = mapToDbColumns(lineData);
      
      const { data, error } = await supabase
        .from('materialpurchaseorder')
        .update(dbData)
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
      const importData = lines.map(line => mapToDbColumns(line));
      
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
    // Parse additional_data if it exists
    const additionalData = dbRow?.additional_data || {};
    
    return {
      id: dbRow.id,
      
      // Map database columns to display format
      'Order Reference': dbRow.order_reference || '',
      'Template': dbRow.template || '',
      'Transport Method': dbRow.transport_method || '',
      'Deliver To': dbRow.deliver_to || '',
      'Status': dbRow.status || '',
      'Total Qty': dbRow.total_qty || '',
      'Total Cost': dbRow.total_cost || '',
      'Total Value': dbRow.total_value || '',
      'Customer': dbRow.customer || '',
      'Supplier': dbRow.supplier || '',
      'Purchase Currency': dbRow.purchase_currency || '',
      'Purchase Payment Term': dbRow.purchase_payment_term || '',
      'Closed Date': dbRow.closed_date || '',
      'MPO Key Date': dbRow.mpo_key_date || '',
      'Supplier Currency': dbRow.supplier_currency || '',
      'Supplier Description': dbRow.supplier_description || '',
      'Supplier Parent': dbRow.supplier_parent || '',
      'Delivery Date': dbRow.delivery_date || '',
      'Recipient Product Supplier': dbRow.recipient_product_supplier || '',
      'Comments': dbRow.comments || '',
      'Purchasing': dbRow.purchasing || '',
      'MPO Key User 2': dbRow.mpo_key_user_2 || '',
      'MPO Key User 3': dbRow.mpo_key_user_3 || '',
      'MPO Key User 4': dbRow.mpo_key_user_4 || '',
      'MPO Key User 5': dbRow.mpo_key_user_5 || '',
      'MPO Key User 6': dbRow.mpo_key_user_6 || '',
      'MPO Key User 7': dbRow.mpo_key_user_7 || '',
      'MPO Key User 8': dbRow.mpo_key_user_8 || '',
      'Note Count': dbRow.note_count || '',
      'Latest Note': dbRow.latest_note || '',
      'Purchase Payment Term Description': dbRow.purchase_payment_term_description || '',
      'Created By': dbRow.created_by || '',
      'Created': dbRow.created || '',
      'Last Edited': dbRow.last_edited || '',
      'Last Edited By': dbRow.last_edited_by || '',
      'Selling Currency': dbRow.selling_currency || '',
      'Selling Payment Term': dbRow.selling_payment_term || '',
      'Delivery Contact': dbRow.delivery_contact || '',
      'Division': dbRow.division || '',
      'Group': dbRow.group || '',
      'Supplier Location': dbRow.supplier_location || '',
      'Supplier Country': dbRow.supplier_country || '',
      'Selling Payment Term Description': dbRow.selling_payment_term_description || '',
      'Default Material Purchase Order Line Template': dbRow.default_material_purchase_order_line_template || '',
      'Default MPO Line Key Date': dbRow.default_mpo_line_key_date || '',
      'MPO Key Working Group 1': dbRow.mpo_key_working_group_1 || '',
      'MPO Key Working Group 2': dbRow.mpo_key_working_group_2 || '',
      'MPO Key Working Group 3': dbRow.mpo_key_working_group_3 || '',
      'MPO Key Working Group 4': dbRow.mpo_key_working_group_4 || '',
      
      // Core fields
      'Quantity': dbRow.quantity || 0,
      'Unit Price': dbRow.unit_price || 0,
      'Total Price': dbRow.total_price || 0,
      'Received Quantity': dbRow.received_quantity || 0,
      'Notes': dbRow.notes || '',
      
      // Grouped milestone fields
      'Trim Order': {
        'Target Date': dbRow.trim_order_target_date || '',
        'Completed Date': dbRow.trim_order_completed_date || ''
      },
      'Ex-Factory': {
        'Target Date': dbRow.ex_factory_target_date || '',
        'Completed Date': dbRow.ex_factory_completed_date || ''
      },
      'Trims Received': {
        'Target Date': dbRow.trims_received_target_date || '',
        'Completed Date': dbRow.trims_received_completed_date || ''
      },
      'MPO Issue Date': {
        'Target Date': dbRow.mpo_issue_date_target_date || '',
        'Completed Date': dbRow.mpo_issue_date_completed_date || ''
      },
      'Main Material Order': {
        'Target Date': dbRow.main_material_order_target_date || '',
        'Completed Date': dbRow.main_material_order_completed_date || ''
      },
      'Main Material received': {
        'Target Date': dbRow.main_material_received_target_date || '',
        'Completed Date': dbRow.main_material_received_completed_date || ''
      },
      
      // Fields from additional_data
      'PO Line': additionalData['PO Line'] || '',
      'Fit Comment': additionalData['Fit Comment'] || '',
      'Fit Log Status': additionalData['Fit Log Status'] || '',
      'Fit Log Type': additionalData['Fit Log Type'] || '',
      'Fit Log Name': additionalData['Fit Log Name'] || '',
      'Collection': additionalData['Collection'] || '',
      'Selling Quantity': additionalData['Selling Quantity'] || 0,
      'Line Purchase Price': additionalData['Line Purchase Price'] || '',
      'Line Selling Price': additionalData['Line Selling Price'] || '',
      'Order Quantity Increment': additionalData['Order Quantity Increment'] || 0,
      'Order Lead Time': additionalData['Order Lead Time'] || '',
      'Supplier Ref.': additionalData['Supplier Ref.'] || '',
      'Purchase Order Status': additionalData['Purchase Order Status'] || '',
      'Supplier Purchase Currency': additionalData['Supplier Purchase Currency'] || '',
      'Customer Selling Currency': additionalData['Customer Selling Currency'] || '',
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
      'PO Key Working Group 1': additionalData['PO Key Working Group 1'] || '',
      'PO Key Working Group 2': additionalData['PO Key Working Group 2'] || '',
      'PO Key Working Group 3': additionalData['PO Key Working Group 3'] || '',
      'PO Key Working Group 4': additionalData['PO Key Working Group 4'] || '',
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
      
      // Legacy optional fields for compatibility
      'Order': additionalData['Order'] || '',
      'Product': additionalData['Product'] || '',
      
      // Timestamps
      'Created At': dbRow.created_at || '',
      'Updated At': dbRow.updated_at || '',
      
      // Database IDs for reference
      'Purchase Order ID': dbRow.purchase_order_id || '',
      'Product ID': dbRow.product_id || ''
    };
  } catch (error) {
    console.error('Error converting database row to display format:', error);
    return {
      id: dbRow?.id || '',
      error: 'Error parsing data'
    };
  }
};

// Helper function to convert display format back to database format
export const convertDisplayFormatToDbRow = (displayRow: Record<string, any>): Partial<PurchaseOrderLine> => {
  try {
    const result: Partial<PurchaseOrderLine> = {
      id: displayRow.id,
      
      // Map core fields
      quantity: displayRow['Quantity'] || 0,
      unit_price: displayRow['Unit Price'] || 0,
      total_price: displayRow['Total Price'] || null,
      received_quantity: displayRow['Received Quantity'] || 0,
      notes: displayRow['Notes'] || null,
      
      // Map direct database columns
      order_reference: displayRow['Order Reference'] || null,
      template: displayRow['Template'] || null,
      transport_method: displayRow['Transport Method'] || null,
      deliver_to: displayRow['Deliver To'] || null,
      status: displayRow['Status'] || null,
      total_qty: displayRow['Total Qty'] || null,
      total_cost: displayRow['Total Cost'] || null,
      total_value: displayRow['Total Value'] || null,
      customer: displayRow['Customer'] || null,
      supplier: displayRow['Supplier'] || null,
      purchase_currency: displayRow['Purchase Currency'] || null,
      purchase_payment_term: displayRow['Purchase Payment Term'] || null,
      closed_date: displayRow['Closed Date'] || null,
      mpo_key_date: displayRow['MPO Key Date'] || null,
      supplier_currency: displayRow['Supplier Currency'] || null,
      supplier_description: displayRow['Supplier Description'] || null,
      supplier_parent: displayRow['Supplier Parent'] || null,
      delivery_date: displayRow['Delivery Date'] || null,
      recipient_product_supplier: displayRow['Recipient Product Supplier'] || null,
      comments: displayRow['Comments'] || null,
      purchasing: displayRow['Purchasing'] || null,
      mpo_key_user_2: displayRow['MPO Key User 2'] || null,
      mpo_key_user_3: displayRow['MPO Key User 3'] || null,
      mpo_key_user_4: displayRow['MPO Key User 4'] || null,
      mpo_key_user_5: displayRow['MPO Key User 5'] || null,
      mpo_key_user_6: displayRow['MPO Key User 6'] || null,
      mpo_key_user_7: displayRow['MPO Key User 7'] || null,
      mpo_key_user_8: displayRow['MPO Key User 8'] || null,
      note_count: displayRow['Note Count'] || null,
      latest_note: displayRow['Latest Note'] || null,
      purchase_payment_term_description: displayRow['Purchase Payment Term Description'] || null,
      created_by: displayRow['Created By'] || null,
      created: displayRow['Created'] || null,
      last_edited: displayRow['Last Edited'] || null,
      last_edited_by: displayRow['Last Edited By'] || null,
      selling_currency: displayRow['Selling Currency'] || null,
      selling_payment_term: displayRow['Selling Payment Term'] || null,
      delivery_contact: displayRow['Delivery Contact'] || null,
      division: displayRow['Division'] || null,
      group: displayRow['Group'] || null,
      supplier_location: displayRow['Supplier Location'] || null,
      supplier_country: displayRow['Supplier Country'] || null,
      selling_payment_term_description: displayRow['Selling Payment Term Description'] || null,
      default_material_purchase_order_line_template: displayRow['Default Material Purchase Order Line Template'] || null,
      default_mpo_line_key_date: displayRow['Default MPO Line Key Date'] || null,
      mpo_key_working_group_1: displayRow['MPO Key Working Group 1'] || null,
      mpo_key_working_group_2: displayRow['MPO Key Working Group 2'] || null,
      mpo_key_working_group_3: displayRow['MPO Key Working Group 3'] || null,
      mpo_key_working_group_4: displayRow['MPO Key Working Group 4'] || null,
      
      // Map milestone dates
      trim_order_target_date: displayRow['Trim Order']?.['Target Date'] || null,
      trim_order_completed_date: displayRow['Trim Order']?.['Completed Date'] || null,
      ex_factory_target_date: displayRow['Ex-Factory']?.['Target Date'] || null,
      ex_factory_completed_date: displayRow['Ex-Factory']?.['Completed Date'] || null,
      trims_received_target_date: displayRow['Trims Received']?.['Target Date'] || null,
      trims_received_completed_date: displayRow['Trims Received']?.['Completed Date'] || null,
      mpo_issue_date_target_date: displayRow['MPO Issue Date']?.['Target Date'] || null,
      mpo_issue_date_completed_date: displayRow['MPO Issue Date']?.['Completed Date'] || null,
      main_material_order_target_date: displayRow['Main Material Order']?.['Target Date'] || null,
      main_material_order_completed_date: displayRow['Main Material Order']?.['Completed Date'] || null,
      main_material_received_target_date: displayRow['Main Material received']?.['Target Date'] || null,
      main_material_received_completed_date: displayRow['Main Material received']?.['Completed Date'] || null,
      
      // Map IDs if present
      purchase_order_id: displayRow['Purchase Order ID'] || null,
      product_id: displayRow['Product ID'] || null
    };
    
    // Build additional_data from remaining fields
    const additionalData: Record<string, any> = {};
    const mappedFields = new Set([
      'id', 'Quantity', 'Unit Price', 'Total Price', 'Received Quantity', 'Notes',
      'Order Reference', 'Template', 'Transport Method', 'Deliver To', 'Status',
      'Total Qty', 'Total Cost', 'Total Value', 'Customer', 'Supplier', 'Purchase Currency',
      'Purchase Payment Term', 'Closed Date', 'MPO Key Date', 'Supplier Currency',
      'Supplier Description', 'Supplier Parent', 'Delivery Date', 'Recipient Product Supplier',
      'Comments', 'Purchasing', 'MPO Key User 2', 'MPO Key User 3', 'MPO Key User 4',
      'MPO Key User 5', 'MPO Key User 6', 'MPO Key User 7', 'MPO Key User 8',
      'Note Count', 'Latest Note', 'Purchase Payment Term Description', 'Created By',
      'Created', 'Last Edited', 'Last Edited By', 'Selling Currency', 'Selling Payment Term',
      'Delivery Contact', 'Division', 'Group', 'Supplier Location', 'Supplier Country',
      'Selling Payment Term Description', 'Default Material Purchase Order Line Template',
      'Default MPO Line Key Date', 'MPO Key Working Group 1', 'MPO Key Working Group 2',
      'MPO Key Working Group 3', 'MPO Key Working Group 4', 'Trim Order', 'Ex-Factory',
      'Trims Received', 'MPO Issue Date', 'Main Material Order', 'Main Material received',
      'Purchase Order ID', 'Product ID', 'Created At', 'Updated At'
    ]);
    
    Object.keys(displayRow).forEach(key => {
      if (!mappedFields.has(key)) {
        additionalData[key] = displayRow[key];
      }
    });
    
    if (Object.keys(additionalData).length > 0) {
      result.additional_data = additionalData;
    }
    
    return result;
  } catch (error) {
    console.error('Error converting display format to database row:', error);
    return { id: displayRow?.id };
  }
};