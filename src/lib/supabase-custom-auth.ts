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
export interface CustomUser {
  id: string;
  name: string;
  email: string;
  role: 'Production' | 'Admin' | 'QA' | 'Product Developer' | 'Buyer' | 'Logistics Manager' | 'Accountant' | 'Costing Analyst';
  department: string;
  avatar?: string;
}

// Custom authentication functions for your users table
export const customAuth = {
  // Sign in with email and password using your custom users table
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email_address', email)
      .eq('password', password)
      .single();
    
    if (error) throw error;
    
    if (data) {
      // Map your custom user data to the expected format
      const userData: CustomUser = {
        id: data.id,
        name: data.username,
        email: data.email_address,
        role: 'Admin', // You might want to add a role field to your users table
        department: 'General', // You might want to add a department field
        avatar: ''
      };
      
      return { user: userData };
    }
    
    return { user: null };
  },

  // Sign up with email and password (adds to your custom users table)
  signUp: async (email: string, password: string, userData: Omit<CustomUser, 'id'>) => {
    const { data, error } = await supabase
      .from('users')
      .insert({
        email_address: email,
        username: userData.name,
        password: password // Note: This stores password in plain text - not secure!
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      return {
        user: {
          id: data.id,
          name: data.username,
          email: data.email_address,
          role: userData.role,
          department: userData.department,
          avatar: userData.avatar
        }
      };
    }
    
    return { user: null };
  },

  // Sign out (just clears local storage since we're not using Supabase auth)
  signOut: async () => {
    // Clear any stored user data
    localStorage.removeItem('user');
  },

  // Get current session (check localStorage)
  getSession: async () => {
    const user = localStorage.getItem('user');
    return user ? { user: JSON.parse(user) } : null;
  },

  // Listen to auth state changes (simplified for custom auth)
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // For custom auth, we'll just return a simple subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
}; 