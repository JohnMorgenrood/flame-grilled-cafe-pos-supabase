import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useOrders } from '../context/OrdersContext';
import { useCurrency } from '../hooks/useCurrency';
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
  const { formatCurrency } = useCurrency();
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
    totalOrders: orders.length,
    favoriteItems: 3
  };

  const recentOrders = orders.slice(0, 3);
  const activeOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing' || order.status === 'confirmed');
  const completedOrders = orders.filter(order => order.status === 'completed');
  
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'preparing': return Package;
      case 'completed': return CheckCircle;
      case 'confirmed': return Truck;
      default: return Clock;
    }
  };

  // Header Component
  const Header = () => (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Customer Dashboard</h1>
              <p className="text-sm text-gray-300">Welcome back, {customer.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Quick Stats Component
  const QuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <ShoppingBag className="w-8 h-8 text-blue-200" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Active Orders</p>
            <p className="text-2xl font-bold">{activeOrders.length}</p>
          </div>
          <Clock className="w-8 h-8 text-green-200" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Favorites</p>
            <p className="text-2xl font-bold">{customer.favoriteItems}</p>
          </div>
          <Heart className="w-8 h-8 text-purple-200" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Points</p>
            <p className="text-2xl font-bold">1,250</p>
          </div>
          <Star className="w-8 h-8 text-orange-200" />
        </div>
      </div>
    </div>
  );

  // Active Orders Component
  const ActiveOrdersSection = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-bold mb-4">Active Orders</h3>
      {activeOrders.length > 0 ? (
        <div className="space-y-4">
          {activeOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <StatusIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">{formatTime(order.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <div className="mb-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-semibold">Total: {formatCurrency(order.total)}</span>
                  <span className="text-sm text-gray-600">{order.estimatedTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No active orders</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Order Now
          </button>
        </div>
      )}
    </div>
  );

  // Order History Component
  const OrderHistorySection = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-4">Order History</h3>
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <div key={order.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <StatusIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">{formatTime(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-sm font-semibold mt-1">{formatCurrency(order.total)}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {index > 0 && ', '}
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No order history yet</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Place Your First Order
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuickStats />
        <ActiveOrdersSection />
        <OrderHistorySection />
      </div>
    </div>
  );
};

export default CustomerDashboard;
