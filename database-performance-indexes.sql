-- Performance Optimization Indexes for Supply Chain Management System
-- Execute these in your Supabase SQL editor for better performance

-- =====================================================
-- USER MANAGEMENT INDEXES
-- =====================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email_address);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_manager_id ON user_profiles(manager_id);

-- User sessions indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- =====================================================
-- SUPPLY CHAIN OPERATIONS INDEXES
-- =====================================================

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_current_stock ON products(current_stock);

-- Suppliers table indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_suppliers_country ON suppliers(country);
CREATE INDEX IF NOT EXISTS idx_suppliers_is_active ON suppliers(is_active);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_by ON suppliers(created_by);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_at ON suppliers(created_at);

-- Purchase Orders table indexes
CREATE INDEX IF NOT EXISTS idx_purchase_orders_number ON purchase_orders(purchase_order_number);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created_by ON purchase_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created_at ON purchase_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_date ON purchase_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_delivery_date ON purchase_orders(delivery_date);

-- Purchase Order Lines table indexes
CREATE INDEX IF NOT EXISTS idx_purchase_order_lines_po_id ON purchase_order_lines(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_lines_product_id ON purchase_order_lines(product_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_lines_status ON purchase_order_lines(status);
CREATE INDEX IF NOT EXISTS idx_purchase_order_lines_created_at ON purchase_order_lines(created_at);

-- Material Purchase Orders table indexes
CREATE INDEX IF NOT EXISTS idx_material_po_number ON material_purchase_orders(purchase_order_number);
CREATE INDEX IF NOT EXISTS idx_material_po_status ON material_purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_material_po_supplier_id ON material_purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_material_po_created_by ON material_purchase_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_material_po_created_at ON material_purchase_orders(created_at);

-- Material Purchase Order Lines table indexes
CREATE INDEX IF NOT EXISTS idx_material_po_lines_po_id ON material_purchase_order_lines(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_material_po_lines_material_id ON material_purchase_order_lines(material_id);
CREATE INDEX IF NOT EXISTS idx_material_po_lines_status ON material_purchase_order_lines(status);
CREATE INDEX IF NOT EXISTS idx_material_po_lines_created_at ON material_purchase_order_lines(created_at);

-- =====================================================
-- WORKFLOW & TASK MANAGEMENT INDEXES
-- =====================================================

-- Tasks table indexes
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by ON tasks(assigned_by);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Sample Requests table indexes
CREATE INDEX IF NOT EXISTS idx_sample_requests_status ON sample_requests(status);
CREATE INDEX IF NOT EXISTS idx_sample_requests_requested_by ON sample_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_sample_requests_created_at ON sample_requests(created_at);

-- Documents table indexes
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);

-- =====================================================
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- =====================================================

-- User management composite indexes
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active);
CREATE INDEX IF NOT EXISTS idx_users_department_active ON users(department, is_active);

-- Purchase order composite indexes
CREATE INDEX IF NOT EXISTS idx_po_status_created ON purchase_orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_po_supplier_status ON purchase_orders(supplier_id, status);
CREATE INDEX IF NOT EXISTS idx_po_created_by_status ON purchase_orders(created_by, status);

-- Task management composite indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_tasks_status_due ON tasks(status, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority_status ON tasks(priority, status);

-- =====================================================
-- JSONB INDEXES FOR ADDITIONAL DATA
-- =====================================================

-- GIN indexes for JSONB columns (if they exist)
CREATE INDEX IF NOT EXISTS idx_purchase_order_lines_additional_data 
ON purchase_order_lines USING GIN (additional_data);

CREATE INDEX IF NOT EXISTS idx_material_po_lines_additional_data 
ON material_purchase_order_lines USING GIN (additional_data);

CREATE INDEX IF NOT EXISTS idx_user_profiles_permissions 
ON user_profiles USING GIN (permissions);

CREATE INDEX IF NOT EXISTS idx_user_profiles_preferences 
ON user_profiles USING GIN (preferences);

-- =====================================================
-- PERFORMANCE MONITORING QUERIES
-- =====================================================

-- Query to check index usage (run after implementing indexes)
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch 
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY idx_scan DESC;

-- Query to identify slow queries
-- SELECT query, mean_time, calls, total_time 
-- FROM pg_stat_statements 
-- ORDER BY mean_time DESC 
-- LIMIT 10;
