import { useMutation,  } from '@tanstack/react-query';
import api from '../utils/axios';


interface LoginCredentials {
  userName: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Login mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data:any) => {
     
      localStorage.setItem('authToken', data?.data.accessToken);
      localStorage.setItem('refreshToken', data?.data?.refreshToken);
       return data;
    },
  });
};