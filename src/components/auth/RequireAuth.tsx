
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page, but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
