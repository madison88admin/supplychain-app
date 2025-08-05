-- Supply Chain Management System - Simple Database Schema
-- This schema creates tables in the correct order to avoid dependency issues

-- =====================================================
-- STEP 1: CREATE OR UPDATE USERS TABLE FIRST
-- =====================================================

-- Check if users table exists and add missing columns
DO $$ 
BEGIN
    -- Add missing columns to existing users table
    BEGIN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Admin';
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
    
    BEGIN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'IT';
    EXCEPTION WHEN duplicate_column THEN
        -- Column already exists, ignore
    END;
END $$;

-- =====================================================
-- STEP 2: CREATE DEPARTMENTS TABLE (NO MANAGER REFERENCE)
-- =====================================================

CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  budget DECIMAL(15,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: CREATE OTHER TABLES WITHOUT COMPLEX DEPENDENCIES
-- =====================================================

-- User profiles (simplified)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  employee_id VARCHAR(50),
  hire_date DATE,
  permissions JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  country VARCHAR(100),
  payment_terms VARCHAR(100),
  credit_limit DECIMAL(15,2),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  unit_of_measure VARCHAR(20),
  standard_cost DECIMAL(15,2),
  selling_price DECIMAL(15,2),
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  current_stock INTEGER DEFAULT 0,
  supplier_id UUID REFERENCES suppliers(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN (
    'Draft', 'Submitted', 'Approved', 'Ordered', 'Received', 'Cancelled'
  )),
  total_amount DECIMAL(15,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  notes TEXT,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Order Lines table
CREATE TABLE IF NOT EXISTS purchase_order_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  received_quantity INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Purchase Orders
CREATE TABLE IF NOT EXISTS material_purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mpo_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  material_type VARCHAR(100),
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN (
    'Draft', 'Submitted', 'Approved', 'Ordered', 'Received', 'Cancelled'
  )),
  total_amount DECIMAL(15,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  notes TEXT,
  created_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Purchase Order Lines
CREATE TABLE IF NOT EXISTS material_purchase_order_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_purchase_order_id UUID REFERENCES material_purchase_orders(id) ON DELETE CASCADE,
  material_name VARCHAR(255) NOT NULL,
  specification TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  unit_of_measure VARCHAR(20),
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  received_quantity DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample Requests table
CREATE TABLE IF NOT EXISTS sample_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_number VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  supplier_id UUID REFERENCES suppliers(id),
  requested_by UUID REFERENCES users(id),
  request_date DATE NOT NULL,
  required_date DATE,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN (
    'Pending', 'Approved', 'Ordered', 'Received', 'Evaluated', 'Rejected'
  )),
  quantity INTEGER NOT NULL,
  purpose TEXT,
  evaluation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Techpacks table
CREATE TABLE IF NOT EXISTS techpacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  techpack_number VARCHAR(50) UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  version VARCHAR(20) DEFAULT '1.0',
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN (
    'Draft', 'In Review', 'Approved', 'Production Ready', 'Archived'
  )),
  specifications JSONB,
  materials_list JSONB,
  cost_breakdown JSONB,
  created_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  status VARCHAR(50) DEFAULT 'Open' CHECK (status IN (
    'Open', 'In Progress', 'Review', 'Completed', 'Cancelled'
  )),
  due_date DATE,
  completed_date DATE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path TEXT,
  file_size INTEGER,
  file_type VARCHAR(50),
  category VARCHAR(100),
  tags TEXT[],
  uploaded_by UUID REFERENCES users(id),
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 4: CREATE INDEXES
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email_address);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);

-- Purchase order indexes
CREATE INDEX IF NOT EXISTS idx_purchase_orders_number ON purchase_orders(po_number);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_date ON purchase_orders(order_date);

-- Material purchase order indexes
CREATE INDEX IF NOT EXISTS idx_material_pos_number ON material_purchase_orders(mpo_number);
CREATE INDEX IF NOT EXISTS idx_material_pos_supplier ON material_purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_material_pos_status ON material_purchase_orders(status);

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);

-- =====================================================
-- STEP 5: INSERT SAMPLE DATA
-- =====================================================

-- Insert departments
INSERT INTO departments (name, description) VALUES
  ('IT', 'Information Technology Department'),
  ('Production', 'Production and Manufacturing'),
  ('Quality Assurance', 'Quality Control and Testing'),
  ('Product Development', 'Product Design and Development'),
  ('Procurement', 'Purchasing and Supplier Management'),
  ('Logistics', 'Supply Chain and Distribution'),
  ('Finance', 'Accounting and Financial Management'),
  ('Costing', 'Cost Analysis and Budgeting')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users (only if they don't exist)
INSERT INTO users (email_address, username, password, role, department) VALUES
  ('admin@madison88.com', 'Sample Admin User', 'admin123', 'Admin', 'IT'),
  ('production@madison88.com', 'Sample Production Manager', 'prod123', 'Production', 'Production'),
  ('qa@madison88.com', 'Sample QA Specialist', 'qual123', 'QA', 'Quality Assurance'),
  ('developer@madison88.com', 'Sample Product Developer', 'dev123', 'Product Developer', 'Product Development'),
  ('buyer@madison88.com', 'Sample Buyer', 'buy123', 'Buyer', 'Procurement'),
  ('logistics@madison88.com', 'Sample Logistics Manager', 'logi123', 'Logistics Manager', 'Logistics'),
  ('accountant@madison88.com', 'Sample Accountant', 'acc123', 'Accountant', 'Finance'),
  ('costing@madison88.com', 'Sample Costing Analyst', 'cost123', 'Costing Analyst', 'Costing')
ON CONFLICT (email_address) DO NOTHING;

-- Insert sample suppliers
INSERT INTO suppliers (supplier_code, name, contact_person, email, phone, country) VALUES
  ('SUP001', 'ABC Textiles Ltd', 'John Smith', 'john@abctextiles.com', '+1-555-0101', 'China'),
  ('SUP002', 'XYZ Fabrics Inc', 'Jane Doe', 'jane@xyzfabrics.com', '+1-555-0102', 'India'),
  ('SUP003', 'Global Materials Co', 'Mike Johnson', 'mike@globalmaterials.com', '+1-555-0103', 'Vietnam'),
  ('SUP004', 'Premium Supplies Ltd', 'Sarah Wilson', 'sarah@premiumsupplies.com', '+1-555-0104', 'Bangladesh')
ON CONFLICT (supplier_code) DO NOTHING;

-- =====================================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_purchase_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (true);

-- =====================================================
-- STEP 7: CREATE TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchase_orders_updated_at ON purchase_orders;
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_material_purchase_orders_updated_at ON material_purchase_orders;
CREATE TRIGGER update_material_purchase_orders_updated_at BEFORE UPDATE ON material_purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'Database schema created successfully! You can now test login with admin@madison88.com / admin123' as message; 