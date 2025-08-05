import { supabase } from './supabase';

// =====================================================
// PRODUCT MANAGEMENT
// =====================================================

export interface Product {
  id: string;
  product_code: string;
  name: string;
  description?: string;
  category?: string;
  unit_of_measure?: string;
  standard_cost?: number;
  selling_price?: number;
  min_stock_level?: number;
  max_stock_level?: number;
  current_stock?: number;
  supplier_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export const productManagement = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          suppliers(name, supplier_code)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          suppliers(name, supplier_code)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// =====================================================
// SUPPLIER MANAGEMENT
// =====================================================

export interface Supplier {
  id: string;
  supplier_code: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  payment_terms?: string;
  credit_limit?: number;
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export const supplierManagement = {
  // Get all suppliers
  getAllSuppliers: async (): Promise<Supplier[]> => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  // Get supplier by ID
  getSupplierById: async (id: string): Promise<Supplier | null> => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching supplier:', error);
      throw error;
    }
  },

  // Create new supplier
  createSupplier: async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplierData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  // Update supplier
  updateSupplier: async (id: string, supplierData: Partial<Supplier>): Promise<Supplier> => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  },

  // Delete supplier
  deleteSupplier: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  }
};

// =====================================================
// PURCHASE ORDER MANAGEMENT
// =====================================================

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  order_date: string;
  expected_delivery_date?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled';
  total_amount?: number;
  currency?: string;
  notes?: string;
  created_by?: string;
  approved_by?: string;
  created_at?: string;
  updated_at?: string;
  supplier?: Supplier;
  lines?: PurchaseOrderLine[];
}

export interface PurchaseOrderLine {
  id: string;
  purchase_order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  product?: Product;
}

export const purchaseOrderManagement = {
  // Get all purchase orders
  getAllPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers(name, supplier_code),
          purchase_order_lines(
            *,
            products(name, product_code)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw error;
    }
  },

  // Get purchase order by ID
  getPurchaseOrderById: async (id: string): Promise<PurchaseOrder | null> => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers(name, supplier_code),
          purchase_order_lines(
            *,
            products(name, product_code)
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching purchase order:', error);
      throw error;
    }
  },

  // Create new purchase order
  createPurchaseOrder: async (orderData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>, lines?: Omit<PurchaseOrderLine, 'id' | 'purchase_order_id' | 'created_at' | 'updated_at'>[]): Promise<PurchaseOrder> => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('purchase_orders')
        .insert(orderData)
        .select()
        .single();
      
      if (orderError) throw orderError;

      // Add lines if provided
      if (lines && lines.length > 0) {
        const linesWithOrderId = lines.map(line => ({
          ...line,
          purchase_order_id: order.id
        }));

        const { error: linesError } = await supabase
          .from('purchase_order_lines')
          .insert(linesWithOrderId);
        
        if (linesError) throw linesError;
      }

      return order;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }
  },

  // Update purchase order
  updatePurchaseOrder: async (id: string, orderData: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .update(orderData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating purchase order:', error);
      throw error;
    }
  },

  // Delete purchase order
  deletePurchaseOrder: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      throw error;
    }
  },

  // Add line to purchase order
  addPurchaseOrderLine: async (lineData: Omit<PurchaseOrderLine, 'id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrderLine> => {
    try {
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .insert(lineData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding purchase order line:', error);
      throw error;
    }
  },

  // Update purchase order line
  updatePurchaseOrderLine: async (id: string, lineData: Partial<PurchaseOrderLine>): Promise<PurchaseOrderLine> => {
    try {
      const { data, error } = await supabase
        .from('purchase_order_lines')
        .update(lineData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating purchase order line:', error);
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
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting purchase order line:', error);
      throw error;
    }
  }
};

// =====================================================
// MATERIAL PURCHASE ORDER MANAGEMENT
// =====================================================

export interface MaterialPurchaseOrder {
  id: string;
  mpo_number: string;
  supplier_id: string;
  material_type?: string;
  order_date: string;
  expected_delivery_date?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled';
  total_amount?: number;
  currency?: string;
  notes?: string;
  created_by?: string;
  approved_by?: string;
  created_at?: string;
  updated_at?: string;
  supplier?: Supplier;
  lines?: MaterialPurchaseOrderLine[];
}

export interface MaterialPurchaseOrderLine {
  id: string;
  material_purchase_order_id: string;
  material_name: string;
  specification?: string;
  quantity: number;
  unit_of_measure?: string;
  unit_price: number;
  total_price: number;
  received_quantity?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const materialPurchaseOrderManagement = {
  // Get all material purchase orders
  getAllMaterialPurchaseOrders: async (): Promise<MaterialPurchaseOrder[]> => {
    try {
      const { data, error } = await supabase
        .from('material_purchase_orders')
        .select(`
          *,
          suppliers(name, supplier_code),
          material_purchase_order_lines(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching material purchase orders:', error);
      throw error;
    }
  },

  // Create new material purchase order
  createMaterialPurchaseOrder: async (orderData: Omit<MaterialPurchaseOrder, 'id' | 'created_at' | 'updated_at'>, lines?: Omit<MaterialPurchaseOrderLine, 'id' | 'material_purchase_order_id' | 'created_at' | 'updated_at'>[]): Promise<MaterialPurchaseOrder> => {
    try {
      const { data: order, error: orderError } = await supabase
        .from('material_purchase_orders')
        .insert(orderData)
        .select()
        .single();
      
      if (orderError) throw orderError;

      // Add lines if provided
      if (lines && lines.length > 0) {
        const linesWithOrderId = lines.map(line => ({
          ...line,
          material_purchase_order_id: order.id
        }));

        const { error: linesError } = await supabase
          .from('material_purchase_order_lines')
          .insert(linesWithOrderId);
        
        if (linesError) throw linesError;
      }

      return order;
    } catch (error) {
      console.error('Error creating material purchase order:', error);
      throw error;
    }
  },

  // Update material purchase order
  updateMaterialPurchaseOrder: async (id: string, orderData: Partial<MaterialPurchaseOrder>): Promise<MaterialPurchaseOrder> => {
    try {
      const { data, error } = await supabase
        .from('material_purchase_orders')
        .update(orderData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating material purchase order:', error);
      throw error;
    }
  },

  // Delete material purchase order
  deleteMaterialPurchaseOrder: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('material_purchase_orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting material purchase order:', error);
      throw error;
    }
  }
};

// =====================================================
// SAMPLE REQUEST MANAGEMENT
// =====================================================

export interface SampleRequest {
  id: string;
  request_number: string;
  product_id?: string;
  supplier_id?: string;
  requested_by?: string;
  request_date: string;
  required_date?: string;
  status: 'Pending' | 'Approved' | 'Ordered' | 'Received' | 'Evaluated' | 'Rejected';
  quantity: number;
  purpose?: string;
  evaluation_notes?: string;
  created_at?: string;
  updated_at?: string;
  product?: Product;
  supplier?: Supplier;
}

export const sampleRequestManagement = {
  // Get all sample requests
  getAllSampleRequests: async (): Promise<SampleRequest[]> => {
    try {
      const { data, error } = await supabase
        .from('sample_requests')
        .select(`
          *,
          products(name, product_code),
          suppliers(name, supplier_code)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sample requests:', error);
      throw error;
    }
  },

  // Create new sample request
  createSampleRequest: async (requestData: Omit<SampleRequest, 'id' | 'created_at' | 'updated_at'>): Promise<SampleRequest> => {
    try {
      const { data, error } = await supabase
        .from('sample_requests')
        .insert(requestData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating sample request:', error);
      throw error;
    }
  },

  // Update sample request
  updateSampleRequest: async (id: string, requestData: Partial<SampleRequest>): Promise<SampleRequest> => {
    try {
      const { data, error } = await supabase
        .from('sample_requests')
        .update(requestData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating sample request:', error);
      throw error;
    }
  },

  // Delete sample request
  deleteSampleRequest: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('sample_requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting sample request:', error);
      throw error;
    }
  }
};

// =====================================================
// TASK MANAGEMENT
// =====================================================

export interface Task {
  id: string;
  task_number: string;
  title: string;
  description?: string;
  assigned_to?: string;
  assigned_by?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Review' | 'Completed' | 'Cancelled';
  due_date?: string;
  completed_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  related_entity_type?: string;
  related_entity_id?: string;
  created_at?: string;
  updated_at?: string;
  assignedToUser?: { name: string; email: string };
  assignedByUser?: { name: string; email: string };
}

export const taskManagement = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignedToUser:users!assigned_to(username, email_address),
          assignedByUser:users!assigned_by(username, email_address)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get tasks for current user
  getMyTasks: async (userId: string): Promise<Task[]> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignedByUser:users!assigned_by(username, email_address)
        `)
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching my tasks:', error);
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

// =====================================================
// DOCUMENT MANAGEMENT
// =====================================================

export interface Document {
  id: string;
  document_number: string;
  title: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  category?: string;
  tags?: string[];
  uploaded_by?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
  uploadedByUser?: { name: string; email: string };
}

export const documentManagement = {
  // Get all documents
  getAllDocuments: async (): Promise<Document[]> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          uploadedByUser:users!uploaded_by(username, email_address)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Create new document
  createDocument: async (documentData: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Update document
  updateDocument: async (id: string, documentData: Partial<Document>): Promise<Document> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(documentData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}; 