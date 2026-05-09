import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is authenticated and has admin role
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin role - STRICT OVERWATCH
  const isAdmin = user.role === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
