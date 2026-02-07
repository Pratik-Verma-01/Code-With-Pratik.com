import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { ROUTES } from '@config/routes.config';
import Loader from '@components/ui/Loader';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950">
        <Loader size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to dashboard or previous location
    const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
