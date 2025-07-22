import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CategoriesProvider } from './context/CategoriesContext';
import { OrdersProvider } from './context/OrdersContext';
import { MessagingProvider } from './context/MessagingContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { SettingsProvider } from './contexts/SettingsContext';
import RestaurantApp from './components/RestaurantApp';
import CustomerDashboard from './pages/CustomerDashboard';
import BrandedAdminDashboard from './pages/BrandedAdminDashboard';
import PerfectAdminDashboard from './pages/PerfectAdminDashboard';
import CashierDashboard from './pages/CashierDashboard';
import LoginPage from './pages/LoginPage';
import WorkingMenuManagement from './pages/WorkingMenuManagement';

// Simple protection without complex auth context
const SimpleProtectedRoute = ({ children }) => {
  try {
    const user = localStorage.getItem('flameGrilledUser');
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (error) {
    console.error('Auth check error:', error);
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <SettingsProvider>
      <CategoriesProvider>
        <OrdersProvider>
          <MessagingProvider>
            <InventoryProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={
                    <SimpleProtectedRoute>
                      <RestaurantApp />
                    </SimpleProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <SimpleProtectedRoute>
                      <CustomerDashboard />
                    </SimpleProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <SimpleProtectedRoute>
                      <PerfectAdminDashboard />
                    </SimpleProtectedRoute>
                  } />
                  <Route path="/cashier" element={
                    <SimpleProtectedRoute>
                      <CashierDashboard />
                    </SimpleProtectedRoute>
                  } />
                  <Route path="/menu-management" element={
                    <SimpleProtectedRoute>
                      <WorkingMenuManagement />
                    </SimpleProtectedRoute>
                  } />
                </Routes>
              </Router>
            </InventoryProvider>
          </MessagingProvider>
        </OrdersProvider>
      </CategoriesProvider>
    </SettingsProvider>
  );
}

export default App;
