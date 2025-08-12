/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios, { type AxiosResponse, AxiosError } from 'axios';



// const DEFAULT_ERROR_NOTIFICATION = 'Something went wrong!';

// // Create axios instance
// const api = axios.create({
//   baseURL: import.meta.env.VITE_BASE_API_URL || 'https://mocki.io/v1',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor for success handling
// const handleSuccessResponse = (response: AxiosResponse) => {
//   if (response?.data?.notice) {
//     // Toastr.success(response.data.notice);
//   }
//   return response;
// };

// // Response interceptor for error handling with token refresh
// const handleErrorResponse = async (error: AxiosError): Promise<AxiosResponse | never> => {
//   const originalRequest = error.config as (import('axios').AxiosRequestConfig & { _retry?: boolean });

//   // Handle 401 errors with token refresh
//   if (error.response?.status === 401 && !originalRequest._retry) {
//     originalRequest._retry = true;

//     try {
//       const refreshToken = localStorage.getItem('refreshToken');

//       if (!refreshToken) {
//         throw new Error('No refresh token');
//       }

//       // Call refresh token API
//       const refreshResponse = await axios.post('/Auth/RefreshToken', {
//         refreshToken,
//       });

//       const newToken = refreshResponse.data.token;
//       localStorage.setItem('authToken', newToken);

//       // Update original request with new token
//       if (originalRequest.headers) {
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//       }

//       return api(originalRequest);
//     } catch (refreshError) {
//       // Refresh failed - clear storage and redirect
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('refreshToken');
      
//       setTimeout(() => {
//         window.location.href = '/login';
//       }, 100);

//       return Promise.reject(refreshError);
//     }
//   }

//   // Handle other errors
//   const errorData = error.response?.data as { message?: string } | undefined;
//   const errorMessage =
//     (errorData && typeof errorData === 'object' && errorData.message) ||
//     error.message ||
//     DEFAULT_ERROR_NOTIFICATION;

//   // Toastr.error(errorMessage);

//   // Handle 423 status
//   if (error.response?.status === 423) {
//     window.location.href = '/';
//   }

//   return Promise.reject(error);
// };

// // Add response interceptors
// api.interceptors.response.use(handleSuccessResponse, handleErrorResponse);

// export default api;

import axios, { type AxiosResponse, AxiosError } from 'axios';

const DEFAULT_ERROR_NOTIFICATION = 'Something went wrong!';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || 'https://mocki.io/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for success handling
const handleSuccessResponse = (response: AxiosResponse) => {
  if (response?.data?.notice) {
    // Use global notification instead of Toastr.success
    if ((window as any).showNotification) {
      (window as any).showNotification(
        response.data.notice, 
        'success',
        'Success'
      );
    }
  }
  return response;
};

// Response interceptor for error handling
const handleErrorResponse = async (error: AxiosError): Promise<AxiosResponse | never> => {
  const originalRequest = error.config as (import('axios').AxiosRequestConfig & { _retry?: boolean });

  // Handle 401 errors with token refresh
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const refreshResponse = await axios.post('/Auth/RefreshToken', {
        refreshToken,
      });

      const newToken = refreshResponse.data.token;
      localStorage.setItem('authToken', newToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      // Show session expired notification
      if ((window as any).showNotification) {
        (window as any).showNotification(
          'Session expired. Please login again.',
          'error',
          'Session Expired'
        );
      }

      setTimeout(() => {
        window.location.href = '/login';
      }, 100);

      return Promise.reject(refreshError);
    }
  }

  // Handle other errors
  const errorData = error.response?.data as { message?: string } | undefined;
  const errorMessage =
    (errorData &&
    typeof errorData === "object" &&
    "message" in errorData &&
    (errorData as { message?: string })?.message) ||
(error as any)?.response?.data?.errors?.Title?.[0] ||
  DEFAULT_ERROR_NOTIFICATION;

  // Use global notification instead of Toastr.error
  if ((window as any).showNotification) {
    (window as any).showNotification(
      errorMessage,
      'error',
      'Error'
    );
  }

  if (error.response?.status === 423) {
    window.location.href = '/';
  }

  return Promise.reject(error);
};

api.interceptors.response.use(handleSuccessResponse, handleErrorResponse);

export default api;