import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Simple inline components to avoid import issues
const SimpleLogin = () => {
  const handleLogin = () => {
    localStorage.setItem('simpleAuth', 'true');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-5xl sm:text-6xl mb-4">🔥</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Flame Grilled Cafe</h1>
          <p className="text-gray-600 text-sm sm:text-base">South Africa's finest flame-grilled cuisine</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">Please sign in to continue</p>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-semibold text-base sm:text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95 min-h-[48px]"
        >
          🚪 Enter Restaurant
        </button>
        
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Experience authentic South African flavors<br />
            with our signature flame-grilling technique
          </p>
        </div>
      </div>
    </div>
  );
};

const SimpleDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('simpleAuth');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">🔥 Flame Grilled Cafe</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-2 rounded-lg hover:bg-red-700 text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Flame Grilled Cafe! 🔥</h2>
          <p className="text-gray-600">South Africa's finest flame-grilled cuisine. Order now and taste the difference!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2 text-green-600">Today's Revenue</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-700">R2,450.00</p>
            <p className="text-sm text-gray-500">↗️ +12% from yesterday</p>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2 text-blue-600">Orders Today</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700">34</p>
            <p className="text-sm text-gray-500">🍽️ Average: R72 per order</p>
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-2 text-purple-600">Menu Items</h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-700">28</p>
            <p className="text-sm text-gray-500">🥩 Specializing in flame-grilled</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-sm font-medium">New Order</div>
              </div>
            </button>
            <button className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-1">🍽️</div>
                <div className="text-sm font-medium">Menu</div>
              </div>
            </button>
            <button className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm font-medium">Reports</div>
              </div>
            </button>
            <button className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-1">⚙️</div>
                <div className="text-sm font-medium">Settings</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {[
              { id: 'FGC-001', customer: 'John D.', items: 'Flame Burger + Chips', amount: 'R85.00', status: 'Preparing' },
              { id: 'FGC-002', customer: 'Sarah M.', items: 'Grilled Chicken + Salad', amount: 'R120.00', status: 'Ready' },
              { id: 'FGC-003', customer: 'Mike R.', items: 'BBQ Ribs + Drink', amount: 'R145.00', status: 'Delivered' }
            ].map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="mb-2 sm:mb-0">
                  <div className="font-semibold text-gray-800">#{order.id} - {order.customer}</div>
                  <div className="text-sm text-gray-600">{order.items}</div>
                </div>
                <div className="flex items-center justify-between sm:justify-end space-x-3">
                  <span className="font-bold text-green-600">{order.amount}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('simpleAuth');
  return isAuth ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleLogin />} />
        <Route path="/dashboard" element={
          <SimpleProtectedRoute>
            <SimpleDashboard />
          </SimpleProtectedRoute>
        } />
        <Route path="/admin" element={
          <SimpleProtectedRoute>
            <SimpleDashboard />
          </SimpleProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
