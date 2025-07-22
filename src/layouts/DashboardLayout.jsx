import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  ShoppingBag, 
  Settings, 
  Users, 
  ChefHat, 
  BarChart3,
  ClipboardList,
  ArrowLeft
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, role } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { to: '/dashboard/customer', icon: User, label: 'Profile', roles: ['customer', 'admin', 'cashier'] },
    ];

    switch (role) {
      case 'admin':
        return [
          { to: '/dashboard/admin', icon: BarChart3, label: 'Overview' },
          { to: '/dashboard/admin/menu', icon: ChefHat, label: 'Manage Menu' },
          { to: '/dashboard/admin/users', icon: Users, label: 'Manage Users' },
          { to: '/dashboard/admin/analytics', icon: BarChart3, label: 'Analytics' },
        ];
      case 'cashier':
        return [
          { to: '/dashboard/cashier', icon: ClipboardList, label: 'Orders' },
          { to: '/dashboard/customer', icon: User, label: 'Profile' },
        ];
      case 'customer':
      default:
        return [
          { to: '/dashboard/customer', icon: User, label: 'Dashboard' },
          { to: '/dashboard/customer/orders', icon: ShoppingBag, label: 'Order History' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <Link to="/" className="flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeft size={20} className="mr-2" />
              Back to Site
            </Link>
          </div>
          
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard
            </h2>
            <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
          </div>

          <nav className="mt-6">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
