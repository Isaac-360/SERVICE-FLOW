import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProviderRouteProps {
  children: ReactNode;
}

export default function ProviderRoute({ children }: ProviderRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Allow both Admins and Businesses (Providers)
  const isAuthorized = user.role === 'admin' || user.role === 'business';
  
  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
