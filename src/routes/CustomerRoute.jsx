import React from 'react';
import ProtectedRoute from './ProtectedRoute';

const CustomerRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="customer">
      {children}
    </ProtectedRoute>
  );
};

export default CustomerRoute;
