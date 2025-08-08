

// useAuthActions.ts
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { AuthUser } from '../types/auth';
import { useLogin } from '../api/auth';
import { useGetUserDetails } from '../api/useGetUserDetails';

export const useAuthActions = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        // Map your UserResponse to AuthUser format
        const authUser: AuthUser = {
          id: userData.bctUserId.toString(),
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.emailId,
          role: userData.userType === 1 ? 'admin' : 'user' // Adjust mapping as needed
        };
        setUser(authUser);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const { mutate: loginApi, isPending: isLoginPending } = useLogin();
  const { mutate: userDetailsApi, isPending: isUserDetailsPending } = useGetUserDetails();

  const login = async (userName: string, password: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      loginApi(
        { userName, password },
        {
          onSuccess: (loginResult) => {
            console.log('Login success:', loginResult);
            
            // Store token from login response
            if (loginResult?.data?.accessToken) {
              localStorage.setItem('token', loginResult.data.accessToken);
            }

            // Now fetch user details
            userDetailsApi(undefined, {
              onSuccess: (userDetails) => {
                console.log('User details success:', userDetails);
                
                // Map UserResponse to AuthUser
                const authUser: AuthUser = {
                  id: userDetails.bctUserId.toString(),
                  name: `${userDetails.firstName} ${userDetails.lastName}`,
                  email: userDetails.emailId,
                  role: userDetails.userType === 1 ? 'admin' : 'user' // Adjust mapping as needed
                };
                
                // Set user in context
                setUser(authUser);
                
                resolve({ success: true });
              },
              onError: (userDetailsError) => {
                console.error('User details error:', userDetailsError);
                // Even if user details fail, login was successful
                resolve({ success: false, error: 'Failed to load user details' });
              }
            });
          },
          onError: (loginError) => {
            console.error('Login error:', loginError);
            resolve({ success: false, error: 'Login failed' });
          },
        }
      );
    });
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
    isLoading: isLoading || isLoginPending || isUserDetailsPending
  };
};

