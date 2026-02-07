import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { ROUTES } from '@config/routes.config';
import Loader from '@components/ui/Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <Loader size="lg" text="Authenticating..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to auth page but save the location they were trying to access
    return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
