import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url_here') {
  console.warn('Supabase environment variables not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User interface that matches your existing User type
export interface SupabaseUser {
  id: string;
  name: string;
  email: string;
  role: 'Production' | 'Admin' | 'QA' | 'Product Developer' | 'Buyer' | 'Logistics Manager' | 'Accountant' | 'Costing Analyst';
  department: string;
  avatar?: string;
}

// Extended User interface for administration
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Production' | 'Admin' | 'QA' | 'Product Developer' | 'Buyer' | 'Logistics Manager' | 'Accountant' | 'Costing Analyst';
  department: string;
  status: 'Active' | 'Inactive' | 'Pending';
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Custom authentication functions using your users table
export const auth = {
  // Sign in with email and password using custom users table
  signIn: async (email: string, password: string) => {
    try {
      console.log('🔍 Attempting login for email:', email);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email_address', email) // Use correct database column name
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.log('❌ User not found or error:', error);
        throw new Error('Invalid email or password');
      }

      console.log('✅ User found:', { 
        id: data.id, 
        username: data.username, 
        email: data.email_address,
        passwordLength: data.password?.length || 0,
        passwordStartsWith: data.password?.substring(0, 10) || 'N/A'
      });

      // Check if password is already hashed
      if (!data.password || data.password.length < 20) {
        console.log('⚠️ Password appears to be plain text, hashing it now...');
        // Hash the plain text password and update the database
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await supabase
          .from('users')
          .update({ password: hashedPassword })
          .eq('id', data.id);
        console.log('✅ Password hashed and updated in database');
        
        // Update the data.password to use the new hashed password for comparison
        data.password = hashedPassword;
      }

      // Compare provided password with hashed one
      console.log('🔐 Comparing passwords...');
      const isMatch = await bcrypt.compare(password, data.password);
      console.log('🔐 Password match result:', isMatch);
      
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      const userData: SupabaseUser = {
        id: data.id,
        name: data.username,
        email: data.email_address, // Use correct database column name
        role: data.role,
        department: data.department,
        avatar: data.avatar || ''
      };

      localStorage.setItem('user', JSON.stringify(userData));

      return { user: userData };
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  // Sign up with email and password (adds to your custom users table)
  signUp: async (email: string, password: string, userData: Omit<SupabaseUser, 'id'>) => {
    try {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('users')
        .insert({
          email_address: email, // Use correct database column name
          username: userData.name,
          password: hashedPassword,
          role: userData.role,
          department: userData.department,
          avatar: userData.avatar || '',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      const newUser: SupabaseUser = {
        id: data.id,
        name: data.username,
        email: data.email_address, // Use correct database column name
        role: data.role,
        department: data.department,
        avatar: data.avatar
      };

      localStorage.setItem('user', JSON.stringify(newUser));

      return { user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  signOut: async () => {
    localStorage.removeItem('user');
    return { error: null };
  },

  getSession: async () => {
    const userStr = localStorage.getItem('user');
    return { user: userStr ? JSON.parse(userStr) : null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const checkAuthState = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        callback('SIGNED_IN', { user: JSON.parse(userStr) });
      } else {
        callback('SIGNED_OUT', { user: null });
      }
    };

    checkAuthState();
    window.addEventListener('storage', checkAuthState);

    return {
      data: {
        subscription: {
          unsubscribe: () => window.removeEventListener('storage', checkAuthState)
        }
      }
    };
  }
};

// User management functions for administration
export const userManagement = {
  getAllUsers: async (): Promise<AdminUser[]> => {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    return data?.map(user => ({
      id: user.id,
      name: user.username,
      email: user.email_address,
      password: user.password,
      role: user.role,
      department: user.department,
      status: user.is_active ? 'Active' : 'Inactive',
      avatar: user.avatar,
      phone: '',
      lastLogin: '',
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at
    })) || [];
  },

  getUserById: async (id: string): Promise<AdminUser | null> => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error || !data) return null;

    return {
      id: data.id,
      name: data.username,
      email: data.email_address,
      password: data.password,
      role: data.role,
      department: data.department,
      status: data.is_active ? 'Active' : 'Inactive',
      avatar: data.avatar,
      phone: '',
      lastLogin: '',
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  createUser: async (userData: Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>): Promise<AdminUser> => {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert({
        email_address: userData.email, // Use correct database column name
        username: userData.name,
        password: hashedPassword,
        role: userData.role,
        department: userData.department,
        avatar: userData.avatar || '',
        is_active: userData.status === 'Active'
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.username,
      email: data.email_address,
      password: data.password,
      role: data.role,
      department: data.department,
      status: data.is_active ? 'Active' : 'Inactive',
      avatar: data.avatar,
      phone: '',
      lastLogin: '',
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  updateUser: async (id: string, userData: Partial<AdminUser>): Promise<AdminUser> => {
    const updateData: any = {};

    if (userData.name !== undefined) updateData.username = userData.name;
    if (userData.email !== undefined) updateData.email_address = userData.email; // Use correct database column name
    if (userData.password !== undefined) updateData.password = await bcrypt.hash(userData.password, 10);
    if (userData.role !== undefined) updateData.role = userData.role;
    if (userData.department !== undefined) updateData.department = userData.department;
    if (userData.avatar !== undefined) updateData.avatar = userData.avatar;
    if (userData.status !== undefined) updateData.is_active = userData.status === 'Active';

    const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select().single();
    if (error) throw error;

    return {
      id: data.id,
      name: data.username,
      email: data.email_address,
      password: data.password,
      role: data.role,
      department: data.department,
      status: data.is_active ? 'Active' : 'Inactive',
      avatar: data.avatar,
      phone: '',
      lastLogin: '',
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  deleteUser: async (id: string): Promise<void> => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  },

  updateProfile: async (id: string, profileData: Partial<SupabaseUser>): Promise<SupabaseUser> => {
    const updateData: any = {};
    if (profileData.name !== undefined) updateData.username = profileData.name;
    if (profileData.email !== undefined) updateData.email_address = profileData.email; // Use correct database column name
    if (profileData.role !== undefined) updateData.role = profileData.role;
    if (profileData.department !== undefined) updateData.department = profileData.department;
    if (profileData.avatar !== undefined) updateData.avatar = profileData.avatar;

    const { data, error } = await supabase.from('users').update(updateData).eq('id', id).select().single();
    if (error) throw error;

    return {
      id: data.id,
      name: data.username,
      email: data.email_address,
      role: data.role,
      department: data.department,
      avatar: data.avatar
    };
  },

  // Check password status for all users
  checkPasswordStatus: async (): Promise<{ hashed: number; plainText: number; total: number; details: any[] }> => {
    try {
      console.log('🔍 Checking password status for all users...');
      
      const { data: users, error } = await supabase.from('users').select('*');
      if (error) throw error;
      
      let hashed = 0;
      let plainText = 0;
      const details: any[] = [];
      
      for (const user of users) {
        const isHashed = user.password && user.password.length >= 20 && user.password.startsWith('$2a$');
        
        if (isHashed) {
          hashed++;
        } else {
          plainText++;
        }
        
        details.push({
          id: user.id,
          username: user.username,
          email: user.email_address,
          passwordLength: user.password?.length || 0,
          isHashed,
          passwordPreview: user.password ? user.password.substring(0, 10) + '...' : 'No password'
        });
      }
      
      console.log(`📊 Password Status: ${hashed} hashed, ${plainText} plain text, ${users.length} total`);
      return { hashed, plainText, total: users.length, details };
      
    } catch (error) {
      console.error('❌ Failed to check password status:', error);
      throw error;
    }
  },

  // Migration function to hash all existing plain text passwords
  migratePasswords: async (): Promise<{ success: number; errors: number }> => {
    try {
      console.log('🔄 Starting password migration...');
      
      // Get all users
      const { data: users, error } = await supabase.from('users').select('*');
      if (error) throw error;
      
      let success = 0;
      let errors = 0;
      
      for (const user of users) {
        try {
          // Check if password is already hashed (bcrypt hashes start with $2a$ and are ~60 chars)
          if (user.password && (user.password.length < 20 || !user.password.startsWith('$2a$'))) {
            console.log(`🔄 Hashing password for user: ${user.username} (${user.email_address})`);
            
            // Hash the plain text password
            const hashedPassword = await bcrypt.hash(user.password, 10);
            
            // Update the user's password in the database
            const { error: updateError } = await supabase
              .from('users')
              .update({ password: hashedPassword })
              .eq('id', user.id);
            
            if (updateError) {
              console.error(`❌ Failed to update password for ${user.username}:`, updateError);
              errors++;
            } else {
              console.log(`✅ Successfully hashed password for ${user.username}`);
              success++;
            }
          } else {
            console.log(`✅ Password already hashed for user: ${user.username}`);
          }
        } catch (userError) {
          console.error(`❌ Error processing user ${user.username}:`, userError);
          errors++;
        }
      }
      
      console.log(`🎉 Password migration completed! Success: ${success}, Errors: ${errors}`);
      return { success, errors };
      
    } catch (error) {
      console.error('❌ Password migration failed:', error);
      throw error;
    }
  }
};

// Expose helpers for running from the browser console (temporary admin aid)
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.userManagement = userManagement;
  // @ts-ignore
  window.auth = auth;
}
