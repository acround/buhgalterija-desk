import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'director' | 'administrator' | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isDirector: boolean;
  isAdmin: boolean;
  isAccountant: boolean;
  canManageUsers: boolean;
  canManageCompanies: boolean;
  canAssignTasks: boolean;
  canApproveTasks: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user for demonstration - in production this would come from auth
const mockUser: User = {
  id: '1',
  name: 'Анна Петрова',
  email: 'anna@buhgalterija.rs',
  role: 'director', // Change to 'administrator' or 'accountant' to test different views
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(mockUser);

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
      setUser,
      isDirector,
      isAdmin,
      isAccountant,
      canManageUsers,
      canManageCompanies,
      canAssignTasks,
      canApproveTasks,
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
