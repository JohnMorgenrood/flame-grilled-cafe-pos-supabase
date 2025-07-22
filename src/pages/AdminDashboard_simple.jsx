import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Flame,
  Calendar,
  LogOut,
  ChefHat,
  DollarSign,
  Package,
  Users,
  Clock,
  UserCheck2
} from 'lucide-react';

const AdminDashboardSimple = () => {
  console.log('AdminDashboard Simple component rendering...');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

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
  const BusinessInfoBar = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Flame className="w-4 h-4" />
            <span className="font-medium">Flame Grilled Cafe</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>09:00 - 22:00</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <UserCheck2 className="w-4 h-4" />
            <span>Staff on Duty: 3</span>
          </div>
          <div>
            Today: R850.00
          </div>
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
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">R850.00</p>
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
              <p className="text-2xl font-bold text-gray-900">24</p>
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
              <p className="text-2xl font-bold text-gray-900">12</p>
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
              <p className="text-2xl font-bold text-gray-900">86</p>
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
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
          >
            <Package className="w-5 h-5" />
            <span>View Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('staff')}
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Users className="w-5 h-5" />
            <span>Staff Management</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-lg hover:from-gray-600 hover:to-slate-600 transition-all"
          >
            <Clock className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">New order from Table 5</span>
            <span className="text-xs text-gray-500">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Menu item "Flame Burger" updated</span>
            <span className="text-xs text-gray-500">15 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Staff member checked in</span>
            <span className="text-xs text-gray-500">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BusinessInfoBar />
      
      <div className="container mx-auto max-w-7xl">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <nav className="flex space-x-8 px-4 sm:px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'orders', label: 'Orders' },
              { id: 'staff', label: 'Staff' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
              <p className="text-gray-600">Order management features coming soon...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'staff' && (
          <div className="p-4 sm:p-6">
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Staff Management</h3>
              <p className="text-gray-600">Staff management features coming soon...</p>
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

export default AdminDashboardSimple;
