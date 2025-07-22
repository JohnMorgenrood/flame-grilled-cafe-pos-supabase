import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoriesContext';
import { useOrders } from '../context/OrdersContext';
import { useMessaging } from '../context/MessagingContext';
import { useInventory } from '../contexts/InventoryContext';
import { useSettings } from '../contexts/SettingsContext';
import ManageMenu from './dashboard/admin/ManageMenu';
import '../styles/admin.css';
import {
  ArrowLeft,
  BarChart3,
  ChefHat,
  Clock,
  Cog,
  DollarSign,
  Flame,
  LogOut,
  MessageCircle,
  Package,
  PackageX,
  Settings,
  Users
} from 'lucide-react';

const AdminDashboard = () => {
  console.log('AdminDashboard_fixed component rendering...');
  const navigate = useNavigate();
  
  // Simple logout function
  const handleLogout = () => {
    try {
      localStorage.removeItem('flameGrilledUser');
      localStorage.removeItem('simpleAuth');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };
  
  // All context hooks must be called at the top level
  const { categories = [] } = useCategories() || {};
  const { orders = [] } = useOrders() || {};
  const { messages = [] } = useMessaging() || {};
  const { inventory = [] } = useInventory() || {};
  const { settings = {}, staff = [] } = useSettings() || {};

  // Component state
  const [activeTab, setActiveTab] = useState('overview');

  // Helper functions
  const getStaffOnDutyCount = () => {
    return staff?.filter(s => s.onDuty)?.length || 0;
  };

  const getTodayOrders = () => {
    const today = new Date().toDateString();
    return orders.filter(order => new Date(order.timestamp).toDateString() === today);
  };

  const getTodayRevenue = () => {
    const todayOrders = getTodayOrders();
    return todayOrders.reduce((total, order) => total + (order.total || 0), 0);
  };

  // Currency formatting helper
  const formatCurrency = (amount) => {
    const symbol = settings?.restaurant?.currencySymbol || 'R';
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Header Component
  const Header = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border-b border-gray-200 gap-4">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Restaurant</span>
        </button>
        <div className="flex items-center space-x-2">
          <Flame className="w-8 h-8 text-orange-500" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="p-2 text-gray-600 hover:text-gray-800">
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );

  // Business Info Bar Component
  const BusinessInfoBar = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Flame className="w-6 h-6" />
          <span className="text-lg sm:text-xl font-bold">
            {settings.restaurant?.name || 'Flame Grilled Cafe'}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span>Staff on Duty: {getStaffOnDutyCount()}</span>
          <span>Today: {formatCurrency(getTodayRevenue())}</span>
        </div>
      </div>
    </div>
  );

  // Overview Tab Component
  const OverviewTab = () => (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Analytics Cards */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(getTodayRevenue())}</p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{getTodayOrders().length}</p>
            </div>
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menu Items</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {categories.reduce((total, cat) => total + (cat.items?.length || 0), 0)}
              </p>
            </div>
            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
        </div>
        <div className="p-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(order.total || 0)}</p>
                <p className="text-sm text-gray-600">{order.status || 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BusinessInfoBar />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'menu', label: 'Menu Management', icon: ChefHat },
            { id: 'categories', label: 'Categories', icon: Package },
            { id: 'orders', label: 'Orders', icon: Clock },
            { id: 'inventory', label: 'Inventory', icon: PackageX },
            { id: 'messaging', label: 'Messaging', icon: MessageCircle },
            { id: 'settings', label: 'Settings', icon: Cog }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'overview' && <OverviewTab />}
        
        {/* Menu Management - Using the comprehensive ManageMenu component */}
        {activeTab === 'menu' && <ManageMenu />}
        
        {/* Other tabs with placeholder content */}
        {activeTab === 'categories' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Categories Management</h3>
              <p className="text-gray-600">Categories management features coming soon...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
              <p className="text-gray-600">Order management features coming soon...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventory Management</h3>
              <p className="text-gray-600">Inventory management features coming soon...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'messaging' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Messaging</h3>
              <p className="text-gray-600">Messaging features coming soon...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-600">Settings management features coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
