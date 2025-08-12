// auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';
import type { JSX } from 'react';

export const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
  const user=localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;

 

  // If no user is logged in, redirect to admin login
  if (!user) return <Navigate to="/admin/login" />;
  const userRole = user.userType === 1 ? 'admin' : 'user'; // Adjust based on your userType logic
  // If roles are specified and user doesn't have required role
  if (roles && !roles.includes(userRole)) return <Navigate to="/unauthorized" />;

  return children;
};