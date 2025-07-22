import React, { useState } from 'react';

// Simple standalone CustomerDashboard that doesn't rely on external dependencies
const StandaloneCustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const customer = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+27 82 555 0123',
    address: '123 Ocean Drive, Cape Town, 8001',
    memberSince: '2024',
    totalOrders: 23,
    favoriteItems: 3
  };

  const orders = [
    {
      id: 'ORD-2025-001',
      orderNumber: 1234,
      status: 'preparing',
      estimatedTime: '25 min',
      items: [
        { name: 'Flame-Grilled Chicken Burger', quantity: 1, price: 89, image: '🍔' },
        { name: 'Truffle Hand-Cut Chips', quantity: 1, price: 35, image: '🍟' }
      ],
      total: 146,
      timestamp: '2025-07-20T14:30:00Z',
      deliveryType: 'delivery',
      progress: 60
    },
    {
      id: 'ORD-2025-002',
      orderNumber: 1233,
      status: 'completed',
      items: [
        { name: 'Gourmet Chicken Wrap', quantity: 2, price: 72, image: '🌯' }
      ],
      total: 144,
      timestamp: '2025-07-19T12:15:00Z',
      rating: 5,
      deliveryType: 'pickup'
    }
  ];

  const activeOrders = orders.filter(order => order.status === 'preparing');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const formatPrice = (price) => `R${price.toFixed(2)}`;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-ZA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {customer.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative">
                <span className="text-gray-600">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <span className="text-gray-600">⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400 to-orange-500 rounded-full -translate-y-16 translate-x-16 opacity-10"></div>
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl">👤</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>📧</span>
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>📱</span>
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>📍</span>
                    <span className="text-sm">{customer.address}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="text-lg font-semibold text-gray-900">{customer.memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50">
                <span className="text-2xl">🛍️</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{customer.totalOrders}</h3>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-50">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{activeOrders.length}</h3>
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-xs text-gray-500">In progress</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-50">
                <span className="text-2xl">❤️</span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900">{customer.favoriteItems}</h3>
              <p className="text-sm font-medium text-gray-600">Favorite Items</p>
              <p className="text-xs text-gray-500">Your go-to meals</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'active', label: `Active Orders (${activeOrders.length})` },
                { id: 'history', label: `Order History (${completedOrders.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-6">
                    {orders.slice(0, 2).map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                              <p className="text-sm text-gray-500">{formatTime(order.timestamp)}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                order.status === 'preparing' 
                                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                                  : 'bg-green-100 text-green-800 border-green-200'
                              }`}>
                                {order.status === 'preparing' ? '⏰' : '✅'} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              {order.estimatedTime && (
                                <span className="text-sm font-medium text-orange-600">
                                  {order.estimatedTime}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{item.image}</span>
                                  <span className="text-sm font-medium text-gray-900">{item.quantity}x {item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{order.deliveryType === 'delivery' ? '🚚' : '📦'}</span>
                              <span>{order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <button className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 transition-colors duration-200">
                      <span>🛍️</span>
                      <span>Order Now</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-colors duration-200">
                      <span>❤️</span>
                      <span>View Favorites</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Orders Tab */}
            {activeTab === 'active' && (
              <div>
                {activeOrders.length > 0 ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Current Orders</h3>
                    {/* Similar order cards would go here */}
                    <div className="text-center py-8">
                      <p className="text-gray-600">Active orders will be displayed here</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📦</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Active Orders
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      You don't have any orders in progress. Ready to order something delicious?
                    </p>
                    <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                  <div className="text-center py-8">
                    <p className="text-gray-600">Order history will be displayed here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandaloneCustomerDashboard;
