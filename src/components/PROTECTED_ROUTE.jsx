import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLogin } from './LoginContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useLogin();  
  const location = useLocation();
  if (!user) {
    // User not logged in, redirect to login
    return <Navigate to="/adminLogin" state={{ from: location.pathname }} replace />;
  }
  if (adminOnly && !isAdmin) {
    // User is not admin but trying to access admin route
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has proper role
  return children;
};

export default ProtectedRoute;