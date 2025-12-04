import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { LoginResponse } from '@/api/auth';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/api/client';

export type UserRole = 'director' | 'administrator' | 'accountant' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthSession {
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  session: AuthSession | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  isDirector: boolean;
  isAdmin: boolean;
  isAccountant: boolean;
  canManageUsers: boolean;
  canManageCompanies: boolean;
  canAssignTasks: boolean;
  canApproveTasks: boolean;
  setAuthFromLogin: (payload: LoginResponse) => void;
}

const USER_STORAGE_KEY = 'authUser';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function mapLoginToUser(payload: LoginResponse): User {
  const { user } = payload;
  return {
    id: String(user.id),
    name: user.username || user.email || 'User',
    email: user.email || user.username || '',
    role: (user.role as UserRole) || 'accountant',
    avatar: user.avatar,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as User;
    } catch (error) {
      console.error('Failed to parse stored user', error);
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const setAuthFromLogin = (payload: LoginResponse) => {
    const nextUser = mapLoginToUser(payload);
    setUser(nextUser);
    setToken(payload.token);
    setAccessToken(payload.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const signOut = async () => {
    clearAccessToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  const session = useMemo<AuthSession | null>(() => {
    if (!token) return null;
    return { token };
  }, [token]);

  const isDirector = user?.role === 'director';
  const isAdmin = user?.role === 'administrator';
  const isAccountant = user?.role === 'accountant';

  const canManageUsers = isAdmin;
  const canManageCompanies = isAdmin || isDirector;
  const canAssignTasks = isAdmin || isDirector;
  const canApproveTasks = isDirector;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      session,
      isLoading,
      signOut,
      isDirector: Boolean(isDirector),
      isAdmin: Boolean(isAdmin),
      isAccountant: Boolean(isAccountant),
      canManageUsers,
      canManageCompanies,
      canAssignTasks,
      canApproveTasks,
      setAuthFromLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}