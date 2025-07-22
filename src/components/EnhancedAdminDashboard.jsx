import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin,
  Phone,
  User,
  AlertTriangle,
  Settings,
  BarChart3,
  Zap,
  X,
  Check,
  XCircle,
  RefreshCw,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  MessageSquare,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const EnhancedAdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('new');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showProfitsModal, setShowProfitsModal] = useState(false);
  const [dailyStats, setDailyStats] = useState({
    totalOrders: 15,
    totalRevenue: 2850.00,
    averageOrderValue: 190.00,
    peakHour: '12:00 PM - 1:00 PM',
    topSellingItem: 'Dagwood Burger'
  });
  const [stockItems, setStockItems] = useState([
    { id: 1, name: 'Dagwood Burger', stock: 12, threshold: 5, status: 'available' },
    { id: 2, name: 'Hand Cut Chips', stock: 2, threshold: 10, status: 'low' },
    { id: 3, name: 'Chicken Wrap', stock: 0, threshold: 5, status: 'out' },
    { id: 4, name: 'Cappuccino', stock: 25, threshold: 8, status: 'available' }
  ]);
  const [aiSuggestions, setAISuggestions] = useState([]);

  // Mock orders with various statuses
  const mockOrders = [
    {
      id: 'ORD-001',
      orderNumber: 1001,
      timestamp: new Date().toISOString(),
      status: 'new',
      items: [
        { id: 1, name: 'Dagwood Burger', quantity: 2, price: 89.00 },
        { id: 2, name: 'Hand Cut Chips', quantity: 1, price: 28.00 }
      ],
      customer: {
        name: 'John Smith',
        phone: '+27 82 123 4567',
        address: '123 Main St, Cape Town'
      },
      total: 206.00,
      orderType: 'delivery',
      estimatedTime: '25-30 min',
      priority: 'normal'
    },
    {
      id: 'ORD-002',
      orderNumber: 1002,
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      status: 'accepted',
      items: [
        { id: 3, name: 'Chicken Wrap', quantity: 1, price: 72.00 }
      ],
      customer: {
        name: 'Sarah Johnson',
        phone: '+27 83 987 6543',
        address: '456 Oak Ave, Stellenbosch'
      },
      total: 97.00,
      orderType: 'pickup',
      estimatedTime: '15-20 min',
      priority: 'high'
    },
    {
      id: 'ORD-003',
      orderNumber: 1003,
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      status: 'preparing',
      items: [
        { id: 4, name: 'Peri-Peri Burger', quantity: 1, price: 65.00 },
        { id: 5, name: 'Cappuccino', quantity: 2, price: 32.00 }
      ],
      customer: {
        name: 'Mike Wilson',
        phone: '+27 84 555 7890',
        address: '789 Pine Rd, Paarl'
      },
      total: 129.00,
      orderType: 'delivery',
      estimatedTime: '10-15 min',
      priority: 'normal',
      progress: 75
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setOrders(mockOrders);
    setLoading(false);

    // Generate AI suggestions based on stock levels
    generateAISuggestions();
  }, []);

  const generateAISuggestions = () => {
    const suggestions = [];
    
    stockItems.forEach(item => {
      if (item.status === 'out') {
        suggestions.push({
          id: Date.now() + Math.random(),
          type: 'stock_out',
          message: `${item.name} is out of stock. Automatically notifying customers and suggesting alternatives.`,
          action: 'auto_substitute',
          severity: 'high'
        });
      } else if (item.status === 'low') {
        suggestions.push({
          id: Date.now() + Math.random(),
          type: 'stock_low',
          message: `${item.name} is running low (${item.stock} remaining). Consider restocking soon.`,
          action: 'restock_reminder',
          severity: 'medium'
        });
      }
    });

    setAISuggestions(suggestions);
  };

  const orderStatuses = {
    new: { label: 'New Orders', color: 'bg-blue-500', icon: Bell },
    accepted: { label: 'Accepted', color: 'bg-green-500', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'bg-orange-500', icon: Clock },
    ready: { label: 'Ready', color: 'bg-purple-500', icon: Package },
    delivering: { label: 'Delivering', color: 'bg-indigo-500', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-600', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      ));
      
      toast.success(`Order updated to ${orderStatuses[newStatus]?.label}`);
      
      // Auto-notify customer
      if (newStatus === 'ready') {
        toast.success('Customer notified: Order ready for pickup/delivery!');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const acceptOrder = (orderId) => {
    updateOrderStatus(orderId, 'accepted');
  };

  const rejectOrder = async (orderId, reason) => {
    try {
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast.error(`Order rejected: ${reason}`);
      
      // AI auto-notification to customer
      setTimeout(() => {
        toast.info('AI: Customer automatically notified and refund processed');
      }, 1000);
    } catch (error) {
      toast.error('Failed to reject order');
    }
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const getStockStatus = (itemName) => {
    const stock = stockItems.find(item => item.name === itemName);
    return stock?.status || 'available';
  };

  const formatPrice = (price) => `R${price.toFixed(2)}`;
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const OrderCard = ({ order }) => {
    const status = orderStatuses[order.status];
    const StatusIcon = status.icon;
    const hasStockIssues = order.items.some(item => getStockStatus(item.name) !== 'available');

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white rounded-lg shadow-sm border-l-4 p-4 mb-4 ${
          order.priority === 'high' ? 'border-l-red-500' : 'border-l-gray-300'
        } ${hasStockIssues ? 'ring-2 ring-red-200' : ''}`}
      >
        {/* Order Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${status.color}`}>
              <StatusIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">#{order.orderNumber}</h3>
              <p className="text-sm text-gray-500">{formatTime(order.timestamp)}</p>
            </div>
            {order.priority === 'high' && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                Priority
              </span>
            )}
            {hasStockIssues && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                Stock Issue
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{formatPrice(order.total)}</p>
            <p className="text-sm text-gray-500 capitalize">{order.orderType}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{order.customer.name}</span>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              <Phone className="w-4 h-4" />
            </button>
          </div>
          {order.orderType === 'delivery' && (
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{order.customer.address}</span>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="space-y-2 mb-3">
          {order.items.map((item, index) => {
            const stockStatus = getStockStatus(item.name);
            return (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.quantity}x</span>
                  <span className={`${stockStatus !== 'available' ? 'text-red-600' : ''}`}>
                    {item.name}
                  </span>
                  {stockStatus === 'out' && (
                    <span className="px-1 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                      OUT OF STOCK
                    </span>
                  )}
                  {stockStatus === 'low' && (
                    <span className="px-1 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                      LOW STOCK
                    </span>
                  )}
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar for Preparing Orders */}
        {order.status === 'preparing' && order.progress && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Preparation Progress</span>
              <span>{order.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-orange-500 h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${order.progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {order.status === 'new' && (
            <>
              <button
                onClick={() => acceptOrder(order.id)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                disabled={hasStockIssues}
              >
                <Check className="w-4 h-4" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => rejectOrder(order.id, 'Items unavailable')}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </>
          )}
          
          {order.status === 'accepted' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'preparing')}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Start Preparing
            </button>
          )}
          
          {order.status === 'preparing' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'ready')}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Mark Ready
            </button>
          )}
          
          {order.status === 'ready' && order.orderType === 'delivery' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'delivering')}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Out for Delivery
            </button>
          )}
          
          {(order.status === 'ready' && order.orderType === 'pickup') || order.status === 'delivering' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'delivered')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Order
            </button>
          )}

          <button
            onClick={() => setSelectedOrder(order)}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const newOrders = getOrdersByStatus('new');
  const activeOrders = orders.filter(order => 
    ['accepted', 'preparing', 'ready', 'delivering'].includes(order.status)
  );
  const completedOrders = getOrdersByStatus('delivered');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white">
        {/* Top Navigation Bar */}
        <div className="px-6 py-4 border-b border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
                <p className="text-red-200">Flammed Grilled Cafe</p>
              </div>
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <div className="text-center">
                  <p className="text-red-200 text-xs">Today's Orders</p>
                  <p className="text-xl font-bold">{dailyStats.totalOrders}</p>
                </div>
                <div className="text-center">
                  <p className="text-red-200 text-xs">Revenue</p>
                  <p className="text-xl font-bold">R{dailyStats.totalRevenue.toFixed(0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-red-200 text-xs">Avg Order</p>
                  <p className="text-xl font-bold">R{dailyStats.averageOrderValue.toFixed(0)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Quick Action Buttons */}
              <button
                onClick={() => setShowProfitsModal(true)}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:block">Daily Profits</span>
              </button>
              
              <button
                onClick={() => setShowInventoryModal(true)}
                className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:block">Inventory</span>
              </button>
              
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:block">Add Product</span>
              </button>

              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:block">AI Assistant</span>
                {aiSuggestions.length > 0 && (
                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                    {aiSuggestions.length}
                  </span>
                )}
              </button>
              
              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="bg-red-700 hover:bg-red-800 p-2 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                
                {showSettingsMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium text-gray-900">Restaurant Settings</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowProfitsModal(true);
                          setShowSettingsMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="font-medium">Analytics & Profits</p>
                          <p className="text-xs text-gray-500">View daily/monthly reports</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowInventoryModal(true);
                          setShowSettingsMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <Package className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="font-medium">Inventory Management</p>
                          <p className="text-xs text-gray-500">Manage stock levels</p>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowAddProductModal(true);
                          setShowSettingsMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Add New Product</p>
                          <p className="text-xs text-gray-500">Add items to menu</p>
                        </div>
                      </button>
                      
                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <User className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="font-medium">Staff Management</p>
                          <p className="text-xs text-gray-500">Manage team access</p>
                        </div>
                      </button>
                      
                      <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                        <div>
                          <p className="font-medium">Reports</p>
                          <p className="text-xs text-gray-500">Generate business reports</p>
                        </div>
                      </button>
                      
                      <div className="border-t">
                        <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3">
                          <Settings className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="font-medium">General Settings</p>
                            <p className="text-xs text-gray-500">Restaurant preferences</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary Header with Restaurant Info */}
        <div className="px-6 py-3 bg-red-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Open: 10:00 AM - 10:00 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>123 Main Street, Cape Town</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+27 21 123 4567</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span className="text-red-200">Peak Hour: {dailyStats.peakHour}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Panel */}
      <AnimatePresence>
        {showAIPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border-b border-blue-200"
          >
            <div className="p-4">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>AI Assistant Suggestions</span>
              </h3>
              {aiSuggestions.length > 0 ? (
                <div className="space-y-2">
                  {aiSuggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className={`p-3 rounded-lg ${
                        suggestion.severity === 'high' ? 'bg-red-100 border border-red-200' :
                        suggestion.severity === 'medium' ? 'bg-orange-100 border border-orange-200' :
                        'bg-blue-100 border border-blue-200'
                      }`}
                    >
                      <p className="text-sm">{suggestion.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-700">All systems running smoothly! 🚀</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 mr-3">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{newOrders.length}</p>
                <p className="text-sm text-gray-600">New Orders</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-orange-100 mr-3">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedOrders.length}</p>
                <p className="text-sm text-gray-600">Completed Today</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">R{orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}</p>
                <p className="text-sm text-gray-600">Total Sales</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-4 px-6 text-center font-medium rounded-l-lg flex items-center justify-center space-x-2 ${
                activeTab === 'new' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>New Orders ({newOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center space-x-2 ${
                activeTab === 'active' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>In Progress ({activeOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-4 px-6 text-center font-medium rounded-r-lg flex items-center justify-center space-x-2 ${
                activeTab === 'completed' 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Completed ({completedOrders.length})</span>
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <AnimatePresence>
            {activeTab === 'new' && newOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {activeTab === 'active' && activeOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {activeTab === 'completed' && completedOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {((activeTab === 'new' && newOrders.length === 0) ||
          (activeTab === 'active' && activeOrders.length === 0) ||
          (activeTab === 'completed' && completedOrders.length === 0)) && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} orders
            </h3>
            <p className="text-gray-500">
              {activeTab === 'new' ? 'New orders will appear here' :
               activeTab === 'active' ? 'Orders in progress will appear here' :
               'Completed orders will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Daily Profits Modal */}
      <AnimatePresence>
        {showProfitsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfitsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span>Daily Profits & Analytics</span>
                </h2>
                <button
                  onClick={() => setShowProfitsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Profit Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-green-800 font-semibold">Today's Revenue</p>
                      <p className="text-2xl font-bold text-green-900">R{dailyStats.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center">
                    <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-blue-800 font-semibold">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900">{dailyStats.totalOrders}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center">
                    <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-purple-800 font-semibold">Avg Order Value</p>
                      <p className="text-2xl font-bold text-purple-900">R{dailyStats.averageOrderValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center">
                    <Star className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-orange-800 font-semibold">Top Seller</p>
                      <p className="text-lg font-bold text-orange-900">{dailyStats.topSellingItem}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Chart Placeholder */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Hourly Sales Today</h3>
                <div className="h-64 bg-white rounded border flex items-center justify-center">
                  <p className="text-gray-500">📊 Sales chart would go here (integrate with Chart.js)</p>
                </div>
              </div>

              {/* Top Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Dagwood Burger', sales: 12, revenue: 1068 },
                      { name: 'Chicken Wrap', sales: 8, revenue: 576 },
                      { name: 'Hand Cut Chips', sales: 15, revenue: 420 },
                      { name: 'Cappuccino', sales: 18, revenue: 576 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.sales} sold</p>
                        </div>
                        <p className="font-bold text-green-600">R{item.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
                  <div className="space-y-3">
                    {[
                      { time: '12:00 PM - 1:00 PM', orders: 8, revenue: 1520 },
                      { time: '6:00 PM - 7:00 PM', orders: 5, revenue: 950 },
                      { time: '7:00 PM - 8:00 PM', orders: 4, revenue: 760 },
                      { time: '1:00 PM - 2:00 PM', orders: 3, revenue: 570 }
                    ].map((hour, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{hour.time}</p>
                          <p className="text-sm text-gray-500">{hour.orders} orders</p>
                        </div>
                        <p className="font-bold text-blue-600">R{hour.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Management Modal */}
      <AnimatePresence>
        {showInventoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInventoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Package className="w-6 h-6 text-orange-600" />
                  <span>Inventory Management</span>
                </h2>
                <button
                  onClick={() => setShowInventoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Inventory Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-green-800 font-semibold">In Stock</p>
                  <p className="text-2xl font-bold text-green-900">{stockItems.filter(item => item.status === 'available').length}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-orange-800 font-semibold">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-900">{stockItems.filter(item => item.status === 'low').length}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-red-800 font-semibold">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-900">{stockItems.filter(item => item.status === 'out').length}</p>
                </div>
              </div>

              {/* Inventory List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Current Inventory</h3>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Update Stock
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Item Name</th>
                        <th className="px-4 py-3 text-left font-semibold">Current Stock</th>
                        <th className="px-4 py-3 text-left font-semibold">Threshold</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockItems.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-3 font-medium">{item.name}</td>
                          <td className="px-4 py-3">{item.stock}</td>
                          <td className="px-4 py-3">{item.threshold}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'available' ? 'bg-green-100 text-green-800' :
                              item.status === 'low' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status === 'available' ? 'In Stock' :
                               item.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddProductModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                  <span>Add New Product</span>
                </h2>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Product Form */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Supreme Pizza"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Burgers</option>
                      <option>Wraps</option>
                      <option>Salads</option>
                      <option>Beverages</option>
                      <option>Sides</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (R)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="89.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prep Time (min)
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image URL
                  </label>
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Popular Item</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Spicy</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Available for Delivery</span>
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedAdminDashboard;
