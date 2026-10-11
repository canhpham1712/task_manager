import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserResponse, LoginRequest, RegisterRequest } from '@task-manager/shared';
import { apiPost, setAccessToken, getAccessToken } from '../api/client';

interface AuthState {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        // Try to refresh
        const response = await fetch('/api/v1/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAccessToken(data.data.accessToken);
          }
        } else {
          setIsLoading(false);
          return;
        }
      }

      const userData = await apiPost<UserResponse>('/auth/me');
      setUser(userData);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (data: LoginRequest) => {
    const result = await apiPost<{ user: UserResponse; accessToken: string }>('/auth/login', data);
    setAccessToken(result.accessToken);
    setUser(result.user);
  };

  const register = async (data: RegisterRequest) => {
    const result = await apiPost<{ user: UserResponse; accessToken: string }>('/auth/register', data);
    setAccessToken(result.accessToken);
    setUser(result.user);
  };

  const logout = async () => {
    try {
      await apiPost('/auth/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
