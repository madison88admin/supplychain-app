-- Test script to verify database setup
-- Run this in Supabase SQL Editor to check if everything is working

-- Check if users table exists and has the right structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check if sample users were created
SELECT 
  id,
  email_address,
  username,
  role,
  department,
  is_active
FROM users 
WHERE email_address LIKE '%@madison88.com'
ORDER BY email_address;

-- Check if departments table exists
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'departments' 
ORDER BY ordinal_position;

-- Check if departments were created
SELECT * FROM departments ORDER BY name;

-- Test login query (this should return the admin user)
SELECT 
  id,
  email_address,
  username,
  role,
  department
FROM users 
WHERE email_address = 'admin@madison88.com' 
  AND password = 'admin123' 
  AND is_active = true;

-- Count total tables created
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name; 