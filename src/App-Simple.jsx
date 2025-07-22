import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import POSSystem from './components/POSSystem';
import DemoLogin from './components/DemoLogin';
import MobileOrderingApp from './components/MobileOrderingApp';
import RestaurantManager from './components/RestaurantManager';

function App() {
  return (
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
          {/* Demo Login for Easy Access */}
          <Route path="/demo" element={<DemoLogin />} />

          {/* Main POS System Route */}
          <Route path="/" element={<POSSystem />} />
          <Route path="/pos" element={<POSSystem />} />

          {/* Mobile Customer Ordering App */}
          <Route path="/order" element={<MobileOrderingApp />} />
          <Route path="/mobile" element={<MobileOrderingApp />} />

          {/* Admin Dashboard - Restaurant Manager */}
          <Route path="/admin" element={<RestaurantManager />} />
          <Route path="/admin/*" element={<RestaurantManager />} />

          {/* Fallback to POS */}
          <Route path="*" element={<POSSystem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
