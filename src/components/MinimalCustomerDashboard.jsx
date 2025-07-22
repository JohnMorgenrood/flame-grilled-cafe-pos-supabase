import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MinimalCustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const customer = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    totalOrders: 23,
    favoriteItems: 3
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Simple Header */}
      <header className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/')}
              className="mb-4 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              ← Back to Home
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {customer.name}</p>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {customer.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
            <p className="text-gray-600">{customer.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">{customer.totalOrders}</h3>
          <p className="text-gray-600">Total Orders</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">{customer.favoriteItems}</h3>
          <p className="text-gray-600">Favorite Items</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'orders', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-gray-600">No recent activity to display</p>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Orders</h3>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-gray-600">No active orders</p>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p className="text-gray-600">No order history available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalCustomerDashboard;
