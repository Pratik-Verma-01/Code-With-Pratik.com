import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@contexts/AuthContext';
import { ROUTES } from '@config/routes.config';

const BlockedUserCheck = ({ children }) => {
  const { isBlocked, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isBlocked) {
      navigate(ROUTES.BLOCKED, { replace: true });
    }
  }, [isBlocked, isAuthenticated, navigate]);

  if (isBlocked) return null;

  return children;
};

export default BlockedUserCheck;
