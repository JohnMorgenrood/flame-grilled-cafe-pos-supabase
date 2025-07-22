import React from 'react';
import ProtectedRoute from './ProtectedRoute';

const CashierRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="cashier">
      {children}
    </ProtectedRoute>
  );
};

export default CashierRoute;
