import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

// Define the LoginResponse interface based on your API response
interface UserResponse {
  bctUserId: number;
  bctUserGUID: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  countryCode: string;
  isVerified: boolean;
  status: number;
  userName: string;
  isMobileNumberVerified: boolean;
  isEmailVerified: boolean;
  userType: number;
}

export const useGetUserDetails= () => {
  return useMutation({
    mutationFn: async (): Promise<UserResponse> => {
      const response = await api.get('/BctUser/Get/Details/self');
      return response.data;
    },
    onSuccess: (data:any) => {
    
localStorage.setItem('user', JSON.stringify(data?.data));
       return data?.data;
    },
  });
};