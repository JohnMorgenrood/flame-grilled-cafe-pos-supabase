import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrders } from '../context/OrdersContext';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Star,
  Package,
  User,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Settings,
  Bell,
  Heart,
  CreditCard,
  Truck
} from 'lucide-react';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { orders, currentOrder, getOrderById } = useOrders();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    // Check if redirected from order completion
    const orderId = searchParams.get('order');
    if (orderId) {
      const order = getOrderById(orderId);
      if (order) {
        setCustomerData({
          name: order.customer.name,
          phone: order.customer.phone,
          email: order.customer.email || `${order.customer.phone}@email.com`,
          address: 'Address not provided'
        });
      }
    }
  }, [searchParams, getOrderById]);

  // Use real customer data from order or fallback to demo data
  const customer = customerData || {
    name: 'Demo Customer',
    email: 'demo@email.com',
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
        { name: 'Truffle Hand-Cut Chips', quantity: 1, price: 35, image: '🍟' },
        { name: 'Craft Cola', quantity: 1, price: 22, image: '🥤' }
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
        { name: 'Gourmet Chicken Wrap', quantity: 2, price: 72, image: '🌯' },
        { name: 'Fresh Fruit Bowl', quantity: 1, price: 28, image: '🥗' }
      ],
      total: 172,
      timestamp: '2025-07-19T12:15:00Z',
      rating: 5,
      deliveryType: 'pickup',
      completedAt: '2025-07-19T13:00:00Z'
    },
    {
      id: 'ORD-2025-003',
      orderNumber: 1232,
      status: 'completed',
      items: [
        { name: 'Signature Beef Burger', quantity: 1, price: 95, image: '🍔' }
      ],
      total: 95,
      timestamp: '2025-07-18T19:45:00Z',
      rating: 4,
      deliveryType: 'delivery'
    }
  ];

  const recentOrders = orders.slice(0, 3);
  const activeOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing' || order.status === 'confirmed');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'text-blue-600' }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color === 'text-blue-600' ? 'bg-blue-50' : color === 'text-green-600' ? 'bg-green-50' : 'bg-purple-50'}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  const OrderCard = ({ order, compact = false }) => (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {!compact && (
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
              <p className="text-sm text-gray-500">{formatTime(order.timestamp)}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                {order.status === 'preparing' && <Clock className="w-3 h-3 inline mr-1" />}
                {order.status === 'completed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              {order.estimatedTime && (
                <span className="text-sm font-medium text-orange-600">
                  {order.estimatedTime}
                </span>
              )}
            </div>
          </div>
          
          {order.progress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Order Progress</span>
                <span>{order.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="p-6">
        <div className="space-y-3 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{item.image}</span>
                <div>
                  <span className="text-sm font-medium text-gray-900">{item.quantity}x {item.name}</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {order.deliveryType === 'delivery' ? (
              <>
                <Truck className="w-4 h-4" />
                <span>Delivery</span>
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                <span>Pickup</span>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
          </div>
        </div>
        
        {order.rating && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Your rating:</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < order.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
                <p className="text-sm text-gray-500">Welcome back, {customer.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <Settings className="w-5 h-5 text-gray-600" />
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
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
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
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={customer.totalOrders}
            subtitle="All time"
            color="text-blue-600"
          />
          <StatCard
            icon={Clock}
            title="Active Orders"
            value={activeOrders.length}
            subtitle="In progress"
            color="text-orange-600"
          />
          <StatCard
            icon={Heart}
            title="Favorite Items"
            value={customer.favoriteItems}
            subtitle="Your go-to meals"
            color="text-red-600"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Package },
                { id: 'active', label: `Active Orders (${activeOrders.length})`, icon: Clock },
                { id: 'history', label: `Order History (${completedOrders.length})`, icon: CheckCircle }
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
                  <tab.icon className="w-4 h-4" />
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
                    {recentOrders.map((order) => (
                      <OrderCard key={order.id} order={order} compact />
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Quick Actions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <button
                      onClick={() => navigate('/')}
                      className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 transition-colors duration-200"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Now</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-colors duration-200">
                      <Heart className="w-4 h-4" />
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
                    {activeOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Active Orders
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      You don't have any orders in progress. Ready to order something delicious?
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Browse Menu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === 'history' && (
              <div>
                {completedOrders.length > 0 ? (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
                    {completedOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Order History
                    </h3>
                    <p className="text-gray-500">
                      Your completed orders will appear here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
