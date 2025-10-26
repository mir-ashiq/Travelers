/**
 * Customer Context
 * Manages customer authentication state and JWT token storage
 * 
 * Provides:
 * - Authentication state (logged in, loading, error)
 * - Current customer data
 * - Login/logout/register functions
 * - Token refresh logic
 * - Persistent session storage
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Customer data type
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  address?: string;
  verified_at?: string;
  status: 'pending' | 'active' | 'inactive';
  loyalty_points?: number;
  created_at?: string;
}

// Auth error type
export interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

// Context type
interface CustomerContextType {
  // State
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  token: string | null;

  // Methods
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (customerId: string, token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (customerId: string, token: string, newPassword: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<Customer>) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// Create context
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_STORAGE_KEY = 'jklg_customer_token';
const CUSTOMER_STORAGE_KEY = 'jklg_customer_data';

/**
 * Provider component
 */
export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const savedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedCustomer) {
      try {
        setCustomer(JSON.parse(savedCustomer));
      } catch (err) {
        console.error('Failed to parse saved customer:', err);
        localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      }
    }
  }, []);

  // Helper: Make API request
  const apiRequest = useCallback(
    async (method: string, endpoint: string, body?: any) => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        const apiError: AuthError = {
          message: data.error || 'An error occurred',
          code: data.code,
          details: data,
        };
        throw apiError;
      }

      return data;
    },
    [token]
  );

  // Helper: Save auth state
  const saveAuthState = useCallback((newToken: string, newCustomer: Customer) => {
    setToken(newToken);
    setCustomer(newCustomer);
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(newCustomer));
  }, []);

  // Helper: Clear auth state
  const clearAuthState = useCallback(() => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  }, []);

  // Helper: Set error
  const handleError = useCallback((err: any) => {
    const authError: AuthError = {
      message: err instanceof Error ? err.message : err?.message || 'An error occurred',
      code: err?.code,
      details: err,
    };
    setError(authError);
    throw authError;
  }, []);

  /**
   * Register new customer
   */
  const register = useCallback(
    async (email: string, password: string, name: string, phone?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiRequest('POST', '/customers/register', {
          email,
          password,
          name,
          phone,
        });

        // Save temporary auth state (customer needs email verification)
        saveAuthState(response.token, {
          id: response.customerId,
          email,
          name,
          phone: phone || undefined,
          status: 'pending',
          verified_at: undefined,
        });
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, saveAuthState, handleError]
  );

  /**
   * Login customer
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiRequest('POST', '/customers/login', {
          email,
          password,
        });

        saveAuthState(response.token, response.customer);
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, saveAuthState, handleError]
  );

  /**
   * Logout customer
   */
  const logout = useCallback(() => {
    clearAuthState();
    setError(null);
  }, [clearAuthState]);

  /**
   * Verify email
   */
  const verifyEmail = useCallback(
    async (customerId: string, emailToken: string) => {
      try {
        setIsLoading(true);
        setError(null);

        await apiRequest('POST', '/customers/verify-email', {
          customerId,
          token: emailToken,
        });

        // Update customer status to active
        if (customer) {
          const updatedCustomer = {
            ...customer,
            verified_at: new Date().toISOString(),
            status: 'active' as const,
          };
          setCustomer(updatedCustomer);
          localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedCustomer));
        }
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, customer, handleError]
  );

  /**
   * Resend verification email
   */
  const resendVerification = useCallback(
    async (email: string) => {
      try {
        setIsLoading(true);
        setError(null);

        await apiRequest('POST', '/customers/resend-verification', { email });
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, handleError]
  );

  /**
   * Request password reset
   */
  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        setIsLoading(true);
        setError(null);

        await apiRequest('POST', '/customers/forgot-password', { email });
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, handleError]
  );

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(
    async (customerId: string, resetToken: string, newPassword: string) => {
      try {
        setIsLoading(true);
        setError(null);

        await apiRequest('POST', '/customers/reset-password', {
          customerId,
          token: resetToken,
          newPassword,
        });

        // Clear auth state - user must login again
        clearAuthState();
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, clearAuthState, handleError]
  );

  /**
   * Change password (authenticated)
   */
  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      try {
        setIsLoading(true);
        setError(null);

        await apiRequest('POST', '/customers/change-password', {
          oldPassword,
          newPassword,
        });

        // Session remains valid - no logout needed
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, handleError]
  );

  /**
   * Update customer profile (authenticated)
   */
  const updateProfile = useCallback(
    async (updates: Partial<Customer>) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!customer) {
          throw new Error('Not authenticated');
        }

        const response = await apiRequest('PUT', `/customers/${customer.id}`, updates);

        const updatedCustomer = {
          ...customer,
          ...response.customer,
        };

        setCustomer(updatedCustomer);
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updatedCustomer));
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [apiRequest, customer, handleError]
  );

  /**
   * Refresh token (if expired)
   */
  const refreshToken = useCallback(async () => {
    try {
      // In a real app, you'd call a /refresh-token endpoint
      // For now, this is a placeholder for token refresh logic
      // The backend should implement token refresh if needed

      // Get current user data
      if (customer) {
        const response = await apiRequest('GET', '/customers/me');
        setCustomer(response.customer);
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(response.customer));
      }
    } catch (err) {
      // If token refresh fails, logout user
      clearAuthState();
      handleError(err);
    }
  }, [apiRequest, customer, clearAuthState, handleError]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: CustomerContextType = {
    customer,
    isLoading,
    isAuthenticated: !!customer && !!token,
    error,
    token,
    register,
    login,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    refreshToken,
    clearError,
  };

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};

/**
 * Hook: Use customer context
 */
export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within CustomerProvider');
  }
  return context;
};

/**
 * Hook: Check if authenticated (convenience hook)
 */
export const useAuth = () => {
  const { isAuthenticated, customer, isLoading } = useCustomer();
  return { isAuthenticated, customer, isLoading };
};

export default CustomerContext;
