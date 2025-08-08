/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { AuthUser } from '../types/auth';

export const useAuthActions = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    try {
      // Check for stored token
      const token = localStorage.getItem('token');
      if (token) {
        // In a real app, you would validate the token with your backend
        // For now, we'll simulate a user
        const mockUser: AuthUser = {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin'
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (email: string, password: string) => {
  try {


    // In a real app, you would make an API call here
    const mockUser: AuthUser = {
      id: '1',
      name: 'John Doe',
      email,
      role: "admin",
    };

    localStorage.setItem('token', 'mock-token');
     localStorage.setItem('user', JSON.stringify(mockUser));

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
};


  const logout = () => {
    localStorage.removeItem('token');
     localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    initializeAuth,
    isLoading
  };
}; 