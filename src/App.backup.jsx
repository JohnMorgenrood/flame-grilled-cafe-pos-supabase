import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext-simple';
import POSSystem from './components/POSSystem';
import RestaurantManager from './components/RestaurantManager';
import MobileOrderingApp from './components/MobileOrderingApp';
import SimpleMobileApp from './components/SimpleMobileApp';
import SimpleTest from './components/SimpleTest';
import SimpleCustomerTest from './components/SimpleCustomerTest';
import MinimalCustomerDashboard from './components/MinimalCustomerDashboard';
import CustomerDashboardNoIcons from './components/CustomerDashboardNoIcons';
import SimpleHomePage from './components/SimpleHomePage';
import RestaurantHomepage from './components/RestaurantHomepage';
import UltraSimpleTest from './components/UltraSimpleTest';
import EmergencyTest from './components/EmergencyTest';
import ConfigChecker from './components/ConfigChecker';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/public/Home';
import Menu from './pages/public/Menu';
import About from './pages/public/About';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';

import PublicHome from './pages/public/PublicHome';

// Auth Pages
import Login from './pages/auth/Login';
import EnhancedLogin from './pages/auth/EnhancedLogin';
import Register from './pages/auth/Register';

// Dashboard Pages
import CustomerDashboard from './pages/CustomerDashboard';
// import StandaloneCustomerDashboard from './components/StandaloneCustomerDashboard';
// import CustomerProfile from './components/CustomerProfile';
// import OrderTracking from './pages/customer/OrderTracking';
// import OrderManagement from './pages/admin/OrderManagement';
import EnhancedAdminDashboard from './components/EnhancedAdminDashboard';

// Route Protection
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import CashierRoute from './routes/CashierRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Configuration Checker (temporary) */}
            <Route path="/config" element={<ConfigChecker />} />

            {/* Main POS System Route - Admin Only */}
            <Route path="/pos" element={
              <ProtectedRoute>
                <AdminRoute>
                  <POSSystem />
                </AdminRoute>
              </ProtectedRoute>
            } />

            {/* Mobile Customer Ordering App */}
            <Route path="/order" element={<MobileOrderingApp />} />
            <Route path="/mobile" element={<MobileOrderingApp />} />

            {/* Public Website Routes with Navbar */}
            <Route path="/website/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<PublicHome />} />
                  <Route path="/home" element={<PublicHome />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<EnhancedLogin />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
                <Footer />
              </>
            } />

            {/* EMERGENCY TEST - RED SCREEN WITH TEXT */}
            <Route path="/" element={<EmergencyTest />} />
            
            {/* Restaurant homepage */}
            <Route path="/menu" element={<RestaurantHomepage />} />
            
            {/* Customer Dashboard - accessible from main menu */}
            <Route path="/dashboard" element={<CustomerDashboard />} />
            
            {/* Test route for debugging */}
            <Route path="/test" element={<SimpleTest />} />
            <Route path="/simple" element={<SimpleMobileApp />} />
            <Route path="/test-dashboard" element={<CustomerDashboard />} />
            <Route path="/no-icons-dashboard" element={<CustomerDashboardNoIcons />} />
            <Route path="/minimal-dashboard" element={<MinimalCustomerDashboard />} />
            <Route path="/simple-test" element={<SimpleCustomerTest />} />

            {/* Login/Register accessible from POS */}
            <Route path="/login" element={<EnhancedLogin />} />
            <Route path="/enhanced-login" element={<EnhancedLogin />} />
            <Route path="/register" element={
              <>
                <Navbar />
                <Register />
                <Footer />
              </>
            } />

            {/* Admin Dashboard - Restaurant Manager */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminRoute>
                  <Routes>
                    <Route path="/" element={<RestaurantManager />} />
                    <Route path="/orders" element={<OrderManagement />} />
                    <Route path="/enhanced" element={<EnhancedAdminDashboard />} />
                    <Route path="/*" element={<RestaurantManager />} />
                  </Routes>
                </AdminRoute>
              </ProtectedRoute>
            } />

            {/* Public Enhanced Admin Dashboard (for demo) */}
            <Route path="/admin-dashboard" element={<EnhancedAdminDashboard />} />

            {/* Cashier POS Access */}
            <Route path="/cashier" element={
              <ProtectedRoute>
                <CashierRoute>
                  <POSSystem />
                </CashierRoute>
              </ProtectedRoute>
            } />

            {/* Customer Dashboard */}
            <Route path="/customer/*" element={
              <ErrorBoundary>
                <Routes>
                  <Route path="/dashboard" element={<CustomerDashboard />} />
                  <Route path="/orders" element={<CustomerDashboard />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                  <Route path="/profile" element={<CustomerProfile />} />
                </Routes>
              </ErrorBoundary>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
