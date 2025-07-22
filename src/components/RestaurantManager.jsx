import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Clock,
  Package,
  Star,
  Calendar,
  Download,
  Filter,
  Eye,
  Settings,
  Bell,
  Utensils,
  CreditCard,
  Receipt,
  Mail,
  Key
} from 'lucide-react';
import TransactionsTable from './TransactionsTable';
import POSSystem from './POSSystem';
import KitchenDisplay from './KitchenDisplay';
import AdminSettings from '../pages/admin/AdminSettings';
import EmailMarketing from '../pages/admin/EmailMarketing';
import OrderManagement from '../pages/admin/OrderManagement';

// Sample data for charts and stats
const salesData = [
  { day: 'Mon', sales: 2400, orders: 45 },
  { day: 'Tue', sales: 2600, orders: 52 },
  { day: 'Wed', sales: 2100, orders: 38 },
  { day: 'Thu', sales: 2800, orders: 58 },
  { day: 'Fri', sales: 3200, orders: 67 },
  { day: 'Sat', sales: 3800, orders: 78 },
  { day: 'Sun', sales: 3400, orders: 71 }
];

const topProducts = [
  { name: 'Big Mac', sales: 156, revenue: 935.44 },
  { name: 'French Fries', sales: 203, revenue: 505.47 },
  { name: 'McNuggets 10pc', sales: 89, revenue: 444.11 },
  { name: 'Quarter Pounder', sales: 67, revenue: 434.83 },
  { name: 'Coca-Cola', sales: 178, revenue: 354.22 }
];

const recentOrders = [
  { id: 'ORD001', customer: 'John Doe', total: 15.97, status: 'completed', time: '2 mins ago' },
  { id: 'ORD002', customer: 'Jane Smith', total: 11.48, status: 'preparing', time: '5 mins ago' },
  { id: 'ORD003', customer: 'Mike Johnson', total: 8.99, status: 'ready', time: '8 mins ago' },
  { id: 'ORD004', customer: 'Sarah Wilson', total: 23.45, status: 'completed', time: '12 mins ago' },
  { id: 'ORD005', customer: 'David Brown', total: 6.78, status: 'completed', time: '15 mins ago' }
];

export default function RestaurantManager() {
  const [activeView, setActiveView] = useState('dashboard');
  const [dateRange, setDateRange] = useState('today');

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Sales"
          value="$3,247"
          icon={DollarSign}
          trend={12.5}
          color="green"
        />
        <StatCard
          title="Orders Today"
          value="87"
          icon={ShoppingCart}
          trend={8.2}
          color="blue"
        />
        <StatCard
          title="Avg Order Value"
          value="$37.32"
          icon={TrendingUp}
          trend={-2.1}
          color="purple"
        />
        <StatCard
          title="Active Customers"
          value="342"
          icon={Users}
          trend={5.8}
          color="orange"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Sales</h3>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="space-y-4">
            {salesData.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-900">${day.sales}</span>
                    <span className="text-xs text-gray-500">{day.orders} orders</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(day.sales / 4000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="text-sm font-medium text-gray-900">
                      ${product.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{product.sales} sold</span>
                    <span>{((product.sales / 500) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 px-4 text-gray-600">{order.customer}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">${order.total}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Manager</h1>
              <p className="text-gray-600">Flammed Grilled Cafe Control Center</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'pos', label: 'Point of Sale', icon: CreditCard },
              { id: 'kitchen', label: 'Kitchen Display', icon: Utensils },
              { id: 'orders', label: 'Order Management', icon: ShoppingCart },
              { id: 'transactions', label: 'Transactions', icon: Receipt },
              { id: 'menu', label: 'Menu Management', icon: Package },
              { id: 'reports', label: 'Reports', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Key },
              { id: 'email', label: 'Email Marketing', icon: Mail }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeView === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'pos' && <POSSystem />}
        {activeView === 'kitchen' && <KitchenDisplay />}
        {activeView === 'orders' && <OrderManagement />}
        {activeView === 'transactions' && <TransactionsTable />}
        {activeView === 'menu' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Menu Management</h2>
            <p className="text-gray-600">Menu management interface coming soon...</p>
          </div>
        )}
        {activeView === 'reports' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Reports & Analytics</h2>
            <p className="text-gray-600">Advanced reporting coming soon...</p>
          </div>
        )}
        {activeView === 'settings' && <AdminSettings />}
        {activeView === 'email' && <EmailMarketing />}
      </div>
    </div>
  );
}
