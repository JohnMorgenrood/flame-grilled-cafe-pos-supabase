import React, { useMemo } from 'react';
import { useOrders } from '../context/OrdersContext';
import { useInventory } from '../contexts/InventoryContext';
import { useMessaging } from '../context/MessagingContext';
import { useCurrency } from '../hooks/useCurrency';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package,
  AlertTriangle,
  MessageSquare,
  Calendar,
  Clock,
  Star,
  Target
} from 'lucide-react';

const OverviewDashboard = () => {
  const { orders } = useOrders();
  const { inventory, stockAlerts, getInventoryAnalytics } = useInventory();
  const { messages } = useMessaging();
  const { formatCurrency } = useCurrency();

  // Calculate analytics
  const analytics = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Orders analytics
    const todaysOrders = orders.filter(order => new Date(order.timestamp) >= startOfToday);
    const thisWeeksOrders = orders.filter(order => new Date(order.timestamp) >= startOfWeek);
    const thisMonthsOrders = orders.filter(order => new Date(order.timestamp) >= startOfMonth);

    // Revenue analytics
    const todaysRevenue = todaysOrders.reduce((sum, order) => sum + order.total, 0);
    const thisWeeksRevenue = thisWeeksOrders.reduce((sum, order) => sum + order.total, 0);
    const thisMonthsRevenue = thisMonthsOrders.reduce((sum, order) => sum + order.total, 0);

    // Order status breakdown
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Most popular items
    const itemCounts = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Customer analytics
    const uniqueCustomers = new Set(orders.map(order => order.customerName)).size;
    const averageOrderValue = orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0;

    // Peak hours analysis
    const hourlyOrders = orders.reduce((acc, order) => {
      const hour = new Date(order.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const peakHour = Object.entries(hourlyOrders)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      todaysOrders: todaysOrders.length,
      todaysRevenue,
      thisWeeksOrders: thisWeeksOrders.length,
      thisWeeksRevenue,
      thisMonthsOrders: thisMonthsOrders.length,
      thisMonthsRevenue,
      ordersByStatus,
      popularItems,
      uniqueCustomers,
      averageOrderValue,
      peakHour: peakHour ? `${peakHour[0]}:00` : 'N/A',
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
    };
  }, [orders]);

  const inventoryAnalytics = getInventoryAnalytics();

  // Recent activity
  const recentActivity = useMemo(() => {
    const activities = [];

    // Recent orders
    orders.slice(-5).forEach(order => {
      const customerName = order.customerName || order.customer?.name || 'Customer';
      activities.push({
        type: 'order',
        message: `New order #${order.id} from ${customerName}`,
        timestamp: order.timestamp,
        value: order.total
      });
    });

    // Stock alerts
    stockAlerts.slice(-3).forEach(alert => {
      activities.push({
        type: 'alert',
        message: alert.message,
        timestamp: alert.timestamp,
        severity: alert.severity
      });
    });

    // Recent messages
    messages.slice(-3).forEach(message => {
      activities.push({
        type: 'message',
        message: `Message sent: ${message.subject}`,
        timestamp: message.timestamp,
        recipients: message.recipients.length
      });
    });

    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  }, [orders, stockAlerts, messages]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Overview</h2>
        <p className="text-gray-600 mt-1">Real-time analytics and insights for your restaurant</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.todaysRevenue)}</p>
              <p className="text-sm text-gray-500">{analytics.todaysOrders} orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.thisWeeksOrders}</p>
              <p className="text-sm text-gray-500">{formatCurrency(analytics.thisWeeksRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.uniqueCustomers}</p>
              <p className="text-sm text-gray-500">Avg: {formatCurrency(analytics.averageOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(inventoryAnalytics.totalValue)}</p>
              <p className="text-sm text-gray-500">{inventoryAnalytics.lowStockCount} low stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
          <div className="space-y-3">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => {
              const percentage = (count / analytics.totalOrders) * 100;
              const getStatusColor = (status) => {
                switch(status) {
                  case 'completed': return 'bg-green-500';
                  case 'preparing': return 'bg-yellow-500';
                  case 'ready': return 'bg-blue-500';
                  case 'cancelled': return 'bg-red-500';
                  default: return 'bg-gray-500';
                }
              };

              return (
                <div key={status} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize">{status}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Items</h3>
          <div className="space-y-3">
            {analytics.popularItems.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.count} orders</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Hour</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.peakHour}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.thisMonthsRevenue)}</p>
              <p className="text-sm text-gray-500">{analytics.thisMonthsOrders} orders</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <div className="p-3 rounded-full bg-pink-100">
              <MessageSquare className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'order' ? 'bg-blue-100' :
                  activity.type === 'alert' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'order' && <ShoppingBag className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                  {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-green-600" />}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                {activity.value && (
                  <div className="text-sm font-medium text-green-600">
                    +{formatCurrency(activity.value)}
                  </div>
                )}
                {activity.recipients && (
                  <div className="text-sm text-gray-500">
                    {activity.recipients} recipients
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Set Daily Goal</p>
            <p className="text-sm opacity-75">Target: {formatCurrency(500)}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Check Inventory</p>
            <p className="text-sm opacity-75">{inventoryAnalytics.lowStockCount} items need attention</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Send Update</p>
            <p className="text-sm opacity-75">Notify customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
