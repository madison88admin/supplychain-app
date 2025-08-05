import { createClient } from '@supabase/supabase-js';

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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email_address', email)
        .eq('password', password)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('Login error:', error);
        throw new Error('Invalid email or password');
      }
      
      if (data) {
        // Map your custom user data to the expected format
        const userData: SupabaseUser = {
          id: data.id,
          name: data.username,
          email: data.email_address,
          role: data.role,
          department: data.department,
          avatar: data.avatar || ''
        };
        
        // Store user in localStorage for session management
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { user: userData };
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  // Sign up with email and password (adds to your custom users table)
  signUp: async (email: string, password: string, userData: Omit<SupabaseUser, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email_address: email,
          username: userData.name,
          password: password, // Note: In production, use hashed passwords!
          role: userData.role,
          department: userData.department,
          avatar: userData.avatar || '',
          is_active: true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      if (data) {
        const newUser: SupabaseUser = {
          id: data.id,
          name: data.username,
          email: data.email_address,
          role: data.role,
          department: data.department,
          avatar: data.avatar
        };
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(newUser));
        
        return { user: newUser };
      }
      
      throw new Error('Failed to create user');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Sign out (clears localStorage since we're not using Supabase auth)
  signOut: async () => {
    try {
      localStorage.removeItem('user');
      return { error: null };
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  },

  // Get current session (check localStorage)
  getSession: async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return { user };
      }
      return { user: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { user: null };
    }
  },

  // Listen to auth state changes (simplified for custom auth)
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // For custom auth, we'll create a simple subscription
    const checkAuthState = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        callback('SIGNED_IN', { user });
      } else {
        callback('SIGNED_OUT', { user: null });
      }
    };
    
    // Check initial state
    checkAuthState();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuthState);
    
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            window.removeEventListener('storage', checkAuthState);
          }
        }
      }
    };
  }
};

// User management functions for administration
export const userManagement = {
  // Get all users
  getAllUsers: async (): Promise<AdminUser[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      // Map database fields to AdminUser interface
      return data?.map(user => ({
        id: user.id,
        name: user.username,
        email: user.email_address,
        password: user.password,
        role: user.role,
        department: user.department,
        status: user.is_active ? 'Active' : 'Inactive',
        avatar: user.avatar,
        phone: '', // Add phone field to users table if needed
        lastLogin: '', // Add last_login field to users table if needed
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at
      })) || [];
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<AdminUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
      
      if (data) {
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
      }
      
      return null;
    } catch (error) {
      console.error('Error in getUserById:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: Omit<AdminUser, 'id' | 'created_at' | 'updated_at'>): Promise<AdminUser> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email_address: userData.email,
          username: userData.name,
          password: userData.password,
          role: userData.role,
          department: userData.department,
          avatar: userData.avatar || '',
          is_active: userData.status === 'Active'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }
      
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
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: Partial<AdminUser>): Promise<AdminUser> => {
    try {
      const updateData: any = {};
      
      if (userData.name !== undefined) updateData.username = userData.name;
      if (userData.email !== undefined) updateData.email_address = userData.email;
      if (userData.password !== undefined) updateData.password = userData.password;
      if (userData.role !== undefined) updateData.role = userData.role;
      if (userData.department !== undefined) updateData.department = userData.department;
      if (userData.avatar !== undefined) updateData.avatar = userData.avatar;
      if (userData.status !== undefined) updateData.is_active = userData.status === 'Active';
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }
      
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
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw error;
    }
  },

  // Update user profile (for user's own profile)
  updateProfile: async (id: string, profileData: Partial<SupabaseUser>): Promise<SupabaseUser> => {
    try {
      const updateData: any = {};
      
      if (profileData.name !== undefined) updateData.username = profileData.name;
      if (profileData.email !== undefined) updateData.email_address = profileData.email;
      if (profileData.role !== undefined) updateData.role = profileData.role;
      if (profileData.department !== undefined) updateData.department = profileData.department;
      if (profileData.avatar !== undefined) updateData.avatar = profileData.avatar;
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      return {
        id: data.id,
        name: data.username,
        email: data.email_address,
        role: data.role,
        department: data.department,
        avatar: data.avatar
      };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }
}; 