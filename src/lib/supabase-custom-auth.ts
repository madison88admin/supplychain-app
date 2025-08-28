import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Supabase project URL and anon key from your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Warn if env vars not set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User interface for your app
export interface CustomUser {
  id: string;
  name: string;
  email: string;
  role:
    | 'Production'
    | 'Admin'
    | 'QA'
    | 'Product Developer'
    | 'Buyer'
    | 'Logistics Manager'
    | 'Accountant'
    | 'Costing Analyst';
  department: string;
  avatar?: string;
}

// Custom authentication functions
export const customAuth = {
  // Sign in
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email_address', email)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        throw new Error('Invalid email or password');
      }

      // Compare password with hashed value
      const isMatch = await bcrypt.compare(password, data.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      // Map user record to app format
      const userData: CustomUser = {
        id: data.id,
        name: data.username,
        email: data.email_address,
        role: data.role,
        department: data.department,
        avatar: data.avatar || '',
      };

      localStorage.setItem('user', JSON.stringify(userData));

      return { user: userData };
    } catch (err) {
      console.error('Authentication error:', err);
      throw err;
    }
  },

  // Sign up
  signUp: async (
    email: string,
    password: string,
    userData: Omit<CustomUser, 'id'>
  ) => {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('users')
        .insert({
          email_address: email,
          username: userData.name,
          password: hashedPassword,
          role: userData.role,
          department: userData.department,
          avatar: userData.avatar || '',
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      const newUser: CustomUser = {
        id: data.id,
        name: data.username,
        email: data.email_address,
        role: data.role,
        department: data.department,
        avatar: data.avatar,
      };

      localStorage.setItem('user', JSON.stringify(newUser));

      return { user: newUser };
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  },

  // Sign out
  signOut: async () => {
    localStorage.removeItem('user');
    return { error: null };
  },

  // Get current session
  getSession: async () => {
    const user = localStorage.getItem('user');
    return { user: user ? JSON.parse(user) : null };
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (user) {
        callback('SIGNED_IN', { user: JSON.parse(user) });
      } else {
        callback('SIGNED_OUT', { user: null });
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return {
      data: {
        subscription: {
          unsubscribe: () =>
            window.removeEventListener('storage', checkAuth),
        },
      },
    };
  },
};
