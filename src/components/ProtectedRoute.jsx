import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  try {
    // Simple localStorage-based auth check with mobile compatibility
    const user = localStorage.getItem('flameGrilledUser');
    
    console.log('ProtectedRoute check:', { user: !!user, requireAuth });
    
    if (requireAuth && !user) {
      console.log('Redirecting to login - no user found');
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error('ProtectedRoute error:', error);
    // If localStorage fails (some mobile browsers), redirect to login
    if (requireAuth) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
};

export default ProtectedRoute;
