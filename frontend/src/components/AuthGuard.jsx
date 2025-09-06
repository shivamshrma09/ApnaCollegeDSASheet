import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthorized } from '../utils/security';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized()) {
      navigate('/login');
    }
  }, [navigate]);

  if (!isAuthorized()) {
    return null;
  }

  return children;
};

export default AuthGuard;