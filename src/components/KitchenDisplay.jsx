import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Clock, 
  Users, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Printer,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function KitchenDisplay() {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      orderNumber: 1,
      customerName: 'John Doe',
      items: [
        { name: 'Big Mac', quantity: 2, notes: 'No pickles' },
        { name: 'French Fries', quantity: 2, notes: 'Extra salt' },
        { name: 'Coca-Cola', quantity: 2, notes: 'No ice' }
      ],
      total: 15.97,
      orderTime: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      estimatedTime: 8,
      status: 'preparing',
      priority: 'normal'
    },
    {
      id: 'ORD002',
      orderNumber: 2,
      customerName: 'Jane Smith',
      items: [
        { name: 'Quarter Pounder', quantity: 1, notes: '' },
        { name: 'McNuggets 10pc', quantity: 1, notes: 'BBQ sauce' }
      ],
      total: 11.48,
      orderTime: new Date(Date.now() - 3 * 60000), // 3 minutes ago
      estimatedTime: 6,
      status: 'preparing',
      priority: 'high'
    },
    {
      id: 'ORD003',
      orderNumber: 3,
      customerName: 'Walk-in Customer',
      items: [
        { name: 'McChicken', quantity: 1, notes: '' },
        { name: 'Coffee', quantity: 1, notes: '2 sugar, 1 cream' }
      ],
      total: 5.48,
      orderTime: new Date(Date.now() - 1 * 60000), // 1 minute ago
      estimatedTime: 4,
      status: 'pending',
      priority: 'normal'
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getElapsedTime = (orderTime) => {
    const elapsed = Math.floor((currentTime - orderTime) / 1000 / 60);
    return elapsed;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'normal': return 'border-blue-500';
      case 'low': return 'border-gray-500';
      default: return 'border-gray-500';
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'completed');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kitchen Display System</h1>
            <p className="text-gray-400">Flammed Grilled Cafe</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{currentTime.toLocaleTimeString()}</div>
              <div className="text-sm text-gray-400">{currentTime.toLocaleDateString()}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{activeOrders.length}</div>
              <div className="text-sm text-gray-400">Active Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {activeOrders.map((order) => {
            const elapsedTime = getElapsedTime(order.orderTime);
            const isOverdue = elapsedTime > order.estimatedTime;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-gray-800 rounded-lg p-4 border-2 ${getPriorityColor(order.priority)} ${
                  isOverdue ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                }`}
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold">#{order.orderNumber}</div>
                    <div className="text-sm text-gray-400">{order.customerName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${order.total.toFixed(2)}</div>
                    <div className={`text-sm ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                      {elapsedTime}m / {order.estimatedTime}m
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  {order.priority === 'high' && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">
                      RUSH
                    </span>
                  )}
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-gray-700 rounded p-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.quantity}x {item.name}</span>
                      </div>
                      {item.notes && (
                        <div className="text-sm text-yellow-300 mt-1">
                          Note: {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                      >
                        Mark Ready
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'pending')}
                        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                    >
                      Complete Order
                    </button>
                  )}
                </div>

                {/* Time Warning */}
                {isOverdue && (
                  <div className="mt-2 p-2 bg-red-900 border border-red-600 rounded text-sm">
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Order is overdue!</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {activeOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-medium">All orders completed!</h3>
            <p>No pending orders in the kitchen.</p>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-around max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {orders.filter(o => o.status === 'preparing').length}
            </div>
            <div className="text-xs text-gray-400">Preparing</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {orders.filter(o => o.status === 'ready').length}
            </div>
            <div className="text-xs text-gray-400">Ready</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-400">
              {orders.filter(o => getElapsedTime(o.orderTime) > o.estimatedTime && o.status !== 'completed').length}
            </div>
            <div className="text-xs text-gray-400">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );
}
