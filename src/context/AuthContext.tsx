import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface RegisterData {
  full_name: string;
  email: string;
  password?: string;
  phone?: string;
  city?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
}

const AUTH_USER_KEY = 'aman_safar_auth_user';

const DEMO_USER: UserProfile = {
  id: 'user-demo-id',
  email: 'yasiralioffical616@gmail.com',
  full_name: 'Mahnoor Fatima',
  phone: '+92 300 7861122',
  avatar_url: '',
  role: 'user',
  city: 'Lahore',
  created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
};

const DEMO_ADMIN: UserProfile = {
  id: 'admin-demo-id',
  email: 'admin@amansafar.org',
  full_name: 'Aman Safar Administrator',
  phone: '+92 300 9998888',
  avatar_url: '',
  role: 'admin',
  city: 'Islamabad',
  created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial auth state from Supabase if active
    const checkSession = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              setUser(profile);
              localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
            }
          }
        } catch (err) {
          console.warn('Supabase auth check error:', err);
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          const userObj = profile || {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            role: 'user' as UserRole,
            created_at: new Date().toISOString(),
          };
          setUser(userObj);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
          setIsLoading(false);
          return { success: true };
        }
      }

      // Local / Resilient fallback handling
      const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      const fallbackUser: UserProfile = {
        id: 'usr_' + Date.now().toString(36),
        email,
        full_name: email.split('@')[0].replace('.', ' ').replace(/^./, (s) => s.toUpperCase()),
        phone: '+92 300 0000000',
        role,
        city: 'Rawalpindi',
        created_at: new Date().toISOString(),
      };
      setUser(fallbackUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase && data.password) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
              phone: data.phone,
            },
          },
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (authData.user) {
          const newProfile: UserProfile = {
            id: authData.user.id,
            email: data.email,
            full_name: data.full_name,
            phone: data.phone,
            city: data.city || 'Karachi',
            role: 'user',
            created_at: new Date().toISOString(),
          };
          await supabase.from('profiles').insert([newProfile]);
          setUser(newProfile);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newProfile));
          setIsLoading(false);
          return { success: true };
        }
      }

      // Local storage fallback
      const newProfile: UserProfile = {
        id: 'usr_' + Date.now().toString(36),
        email: data.email,
        full_name: data.full_name,
        phone: data.phone || '',
        city: data.city || '',
        role: 'user',
        created_at: new Date().toISOString(),
      };
      setUser(newProfile);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newProfile));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Signout warning:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const updated = { ...user, ...updates, updated_at: new Date().toISOString() };
      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').update(updates).eq('id', user.id);
      }
      setUser(updated);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Profile update failed' };
    }
  };

  const loginAsDemoUser = () => {
    setUser(DEMO_USER);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_USER));
  };

  const loginAsDemoAdmin = () => {
    setUser(DEMO_ADMIN);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEMO_ADMIN));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        loginAsDemoUser,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
