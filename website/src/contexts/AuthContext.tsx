import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'guide' | 'support' | 'user';
  avatar?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const token = localStorage.getItem('authToken');
        if (token) {
          setSessionToken(token);
          // Verify token is still valid
          await refreshToken();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!sessionToken) return;

    const refreshInterval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
      }
    }, 50 * 60 * 1000); // Refresh every 50 minutes

    return () => clearInterval(refreshInterval);
  }, [sessionToken]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);

      // Call backend authentication API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const { token, user } = await response.json();

      const userData: User = {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role as User['role'],
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setSessionToken(token);
      setUser(userData);
      toast.success('Logged in successfully');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setSessionToken(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (_email: string, _password: string, name: string) => {
    try {
      setLoading(true);

      // In production, call your signup API
      const token = 'demo_token_' + Date.now();
      const userData: User = {
        id: Math.random().toString(),
        email: _email,
        name,
        role: 'user',
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setSessionToken(token);
      setUser(userData);
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      // Verify and refresh token
      // In production, call your refresh API
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      setLoading(true);

      if (!user) throw new Error('No user logged in');

      const updatedUser = { ...user, ...data };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Update user error:', error);
      toast.error(error instanceof Error ? error.message : 'Update failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const resetPassword = useCallback(async (_email: string) => {
    try {
      setLoading(true);
      // In production, call your password reset API
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error instanceof Error ? error.message : 'Password reset failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    refreshToken,
    updateUser,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
