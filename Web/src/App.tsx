// App.tsx
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthActions } from './hooks/useAuthActions';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/home/Dashboard';
import AdminPanel from './pages/admin/AdminPanel';
import { Unauthorized } from './pages/Unauthorized';
import { ProtectedRoute } from './auth/ProtectedRoute';
import MainLayout from './layout/MainLayout';

import { LoadingSpinner } from './components/ui/LoadingSpinner';
import HomePage from './pages/public/HomePage';
import ContactPage from './pages/public/ContactPage';
import AboutPage from './pages/public/AboutPage';
import AdminLayout from './layout/AdminLayout';
import ImageElementListPage from './pages/admin/projects/projectList';
import ImageEditor from './pages/admin/home/SubProject';
import ProjectDetailstList from './pages/admin/projects/ProjectDetailstList';
import AnimatedResume from './pages/public/Resume';



// Public pages


export const App = () => {
  const { initializeAuth, isLoading } = useAuthActions();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />
      
      <Route
        path="/contact"
        element={
          <MainLayout>
            <ContactPage />
          </MainLayout>
        }
      />
      
      <Route
        path="/about"
        element={
          <MainLayout>
            <AboutPage />
          </MainLayout>
        }
      />

          <Route
        path="/resume"
        element={
          <MainLayout>
            <AnimatedResume />
          </MainLayout>
        }
      />
      
      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout>
              <Navigate to="/admin/dashboard" replace />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
       <Route
        path="/admin/sub_projects"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout>
              <ImageEditor />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

       <Route
        path="/admin/projects"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout>
              <ImageElementListPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

       <Route
        path="/admin/projects/:projectId"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout>
              <ProjectDetailstList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      
      
      <Route
        path="/admin/panel"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout>
              <AdminPanel />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<MainLayout>
            <HomePage />
          </MainLayout>} />
    </Routes>
  );
};