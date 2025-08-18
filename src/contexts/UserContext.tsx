import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase, auth } from "../lib/supabase";

interface User {
  id: string;
  email: string;
  role?: string;
  name?: string;
  department?: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Refresh user from DB (optional if you have custom user table)
  const refreshCurrentUser = async () => {
    if (!user) return;
    try {
      const { user: refreshedUser } = await auth.getSession();
      if (refreshedUser) {
        setUser({
          id: refreshedUser.id,
          email: refreshedUser.email,
          role: refreshedUser.role,
          name: refreshedUser.name,
          department: refreshedUser.department,
          avatar: refreshedUser.avatar
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user } = await auth.getSession();
        if (user) {
          setUser({
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            department: user.department,
            avatar: user.avatar
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          role: session.user.role,
          name: session.user.name,
          department: session.user.department,
          avatar: session.user.avatar
        });
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user } = await auth.signIn(email, password);
      if (user) {
        setUser({
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          department: user.department,
          avatar: user.avatar
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const userData = {
        email: email,
        name: email.split('@')[0], // Default name from email
        role: 'Production' as const, // Default role
        department: 'General', // Default department
        avatar: ''
      };
      
      const { user } = await auth.signUp(email, password, userData);
      if (user) {
        setUser({
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          department: user.department,
          avatar: user.avatar
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) throw new Error("No user logged in");
    const { data, error } = await supabase.from("users").update(profileData).eq("id", user.id).select().single();
    if (error) throw error;
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        logout,
        login,
        signup,
        updateProfile,
        refreshCurrentUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
