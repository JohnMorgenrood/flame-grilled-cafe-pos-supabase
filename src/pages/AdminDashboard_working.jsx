import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoriesContext';
import { useOrders } from '../context/OrdersContext';
import { useMessaging } from '../context/MessagingContext';
import { useInventory } from '../contexts/InventoryContext';
import { useSettings } from '../contexts/SettingsContext';
import '../styles/admin.css';
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Clock,
  Star,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Upload,
  Flame,
  MessageCircle,
  Send,
  Mail,
  Smartphone,
  Target,
  Calendar,
  CheckCircle,
  PackageX,
  Cog,
  Phone,
  MapPin,
  UserCheck2,
  Coffee,
  Pizza,
  Sandwich,
  IceCream,
  Cookie,
  Salad,
  Fish,
  Beef,
  Apple,
  Wine,
  Utensils,
  ChefHat,
  Image,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  console.log('AdminDashboard_working component rendering...');
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
  
  // All context hooks must be called at the top level - no conditional calling!
  const { categories = [], addCategory, updateCategory, deleteCategory } = useCategories() || {};
  const { orders = [] } = useOrders() || {};
  const { messages = [], sendBulkMessage, updateCustomerContacts, customerContacts = [] } = useMessaging() || {};
  const { inventory = [], stockAlerts = [], dismissAlert } = useInventory() || {};
  const { settings = {}, staff = [], getStaffOnDuty, updateSettings } = useSettings() || {};

  // Component state
  const [activeTab, setActiveTab] = useState('overview');

  // Restaurant settings with defaults
  const restaurantSettings = {
    currency: 'ZAR',
    currencySymbol: 'R',
    taxRate: 0.15,
    serviceFee: 0.1,
    ...settings
  };

  // Helper functions
  const getStaffOnDutyCount = () => {
    if (typeof getStaffOnDuty === 'function') {
      return getStaffOnDuty().length;
    }
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
    const currency = restaurantSettings.currency || 'ZAR';
    const symbol = restaurantSettings.currencySymbol || 'R';
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
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );

  // Business Info Bar Component
  const BusinessInfoBar = () => {
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
    const todayHours = settings?.operatingHours?.[currentDay] || { open: '09:00', close: '22:00', closed: false };
    const staffOnDuty = getStaffOnDuty ? getStaffOnDuty() : [];
    
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Flame className="w-4 h-4" />
              <span className="font-medium">Flame Grilled Cafe</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              {todayHours.closed ? (
                <span className="text-red-200 font-medium">Closed Today</span>
              ) : (
                <span>{todayHours.open} - {todayHours.close}</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <UserCheck2 className="w-4 h-4" />
              <span>Staff on Duty: {getStaffOnDutyCount()}</span>
            </div>
            <div>
              Today: {formatCurrency(getTodayRevenue())}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Overview Tab Component
  const OverviewTab = () => (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Analytics Cards */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTodayRevenue())}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900">{getTodayOrders().length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menu Items</p>
              <p className="text-2xl font-bold text-gray-900">{categories.reduce((total, cat) => total + (cat.items?.length || 0), 0)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <ChefHat className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/menu-management')}
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <ChefHat className="w-5 h-5" />
            <span>Manage Menu</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setActiveTab('categories')}
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            <Package className="w-5 h-5" />
            <span>Categories</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Clock className="w-5 h-5" />
            <span>Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
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
        
        {/* Other tabs with placeholder content */}
        {activeTab === 'categories' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Categories Management</h3>
              <p className="text-gray-600">Categories management features...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
              <p className="text-gray-600">Order management features...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'inventory' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventory Management</h3>
              <p className="text-gray-600">Inventory management features...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'messaging' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Messaging</h3>
              <p className="text-gray-600">Messaging features...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-600">Settings management features...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
