import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, supabase, SupabaseUser, userManagement } from '../lib/supabase';

interface User extends SupabaseUser {}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Omit<User, 'id'>) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for existing user session
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Function to refresh current user data from database
  const refreshCurrentUser = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await userManagement.getUserById(user.id);
      if (updatedUser) {
        const userData: User = {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          department: updatedUser.department,
          avatar: updatedUser.avatar
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing current user:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any invalid session data
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const { user: authUser } = await auth.signIn(email, password);
      if (authUser) {
        setUser(authUser);
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, userData: Omit<User, 'id'>) => {
    try {
      const { user: authUser } = await auth.signUp(email, password, userData);
      if (authUser) {
        setUser(authUser);
      }
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = await userManagement.updateProfile(user.id, profileData);
      setUser(updatedUser);
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      isAuthenticated, 
      logout, 
      login, 
      signup, 
      updateProfile,
      refreshCurrentUser,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};