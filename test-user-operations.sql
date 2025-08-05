-- Test user operations in the database
-- Run this in Supabase SQL Editor to verify everything works

-- 1. Check current users
SELECT 
  id,
  username as name,
  email_address as email,
  role,
  department,
  is_active,
  created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Test updating a user (replace USER_ID with actual ID from step 1)
-- UPDATE users 
-- SET username = 'Updated Admin User'
-- WHERE email_address = 'admin@madison88.com'
-- RETURNING *;

-- 3. Test creating a new user
-- INSERT INTO users (email_address, username, password, role, department, is_active)
-- VALUES ('test@example.com', 'Test User', 'test123', 'Product Developer', 'Product Development', true)
-- RETURNING *;

-- 4. Check if the update worked
-- SELECT * FROM users WHERE email_address = 'admin@madison88.com';

-- 5. Test deleting a test user (uncomment when ready to test)
-- DELETE FROM users WHERE email_address = 'test@example.com';

-- 6. Verify RLS policies are working
-- This should show the current RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 7. Test login query (should return admin user)
SELECT 
  id,
  username,
  email_address,
  role,
  department,
  is_active
FROM users 
WHERE email_address = 'admin@madison88.com' 
  AND password = 'admin123' 
  AND is_active = true; 