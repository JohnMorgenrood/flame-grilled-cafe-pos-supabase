import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaClock, 
  FaUtensils, 
  FaTruck, 
  FaMapMarkerAlt,
  FaReceipt,
  FaPhone,
  FaUser,
  FaEdit
} from 'react-icons/fa';

import { db } from '../../config/supabase';
import { toast } from 'react-hot-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const orderStatuses = [
    { id: 'initializing', label: 'New Orders', icon: FaReceipt, color: 'bg-blue-500' },
    { id: 'accepted', label: 'Accepted', icon: FaCheck, color: 'bg-green-500' },
    { id: 'preparing', label: 'Preparing', icon: FaUtensils, color: 'bg-orange-500' },
    { id: 'ready', label: 'Ready', icon: FaClock, color: 'bg-purple-500' },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck, color: 'bg-blue-600' },
    { id: 'delivered', label: 'Delivered', icon: FaMapMarkerAlt, color: 'bg-green-600' }
  ];

  useEffect(() => {
    // Listen for real-time order updates
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const orderList = [];
        snapshot.forEach((doc) => {
          orderList.push({ id: doc.id, ...doc.data() });
        });
        setOrders(orderList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
        toast.error('Failed to load orders');
      }
    );

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Order updated to ${orderStatuses.find(s => s.id === newStatus)?.label}`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const getNextStatus = (currentStatus) => {
    const currentIndex = orderStatuses.findIndex(s => s.id === currentStatus);
    if (currentIndex < orderStatuses.length - 1) {
      return orderStatuses[currentIndex + 1].id;
    }
    return null;
  };

  const getStatusInfo = (status) => {
    return orderStatuses.find(s => s.id === status) || orderStatuses[0];
  };

  const pendingOrders = orders.filter(order => 
    ['initializing', 'accepted', 'preparing', 'ready', 'out_for_delivery'].includes(order.status)
  );

  const completedOrders = orders.filter(order => order.status === 'delivered');

  const currentOrders = activeTab === 'pending' ? pendingOrders : completedOrders;

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-600 text-white p-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-orange-200">Manage incoming orders and track delivery status</p>
      </div>

      {/* Order Status Overview */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {orderStatuses.map((status) => {
            const count = getOrdersByStatus(status.id).length;
            const Icon = status.icon;
            return (
              <div key={status.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${status.color} mr-3`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-600">{status.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-4 px-6 text-center font-medium rounded-l-lg ${
                activeTab === 'pending' 
                  ? 'bg-orange-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Active Orders ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-4 px-6 text-center font-medium rounded-r-lg ${
                activeTab === 'completed' 
                  ? 'bg-orange-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed Orders ({completedOrders.length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {currentOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaReceipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {activeTab === 'pending' ? 'No active orders' : 'No completed orders'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'pending' 
                ? 'New orders will appear here' 
                : 'Completed orders will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentOrders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const nextStatus = getNextStatus(order.status);
              
              return (
                <motion.div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">#{order.id.slice(-6)}</h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(order.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${statusInfo.color}`}>
                      <StatusIcon className="h-4 w-4 mr-2" />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaUser className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{order.customer.name}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <FaPhone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {order.customer.phone || order.customer.email}
                      </span>
                    </div>
                    {order.deliveryAddress && (
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                        <span className="text-sm text-gray-600">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>R{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-orange-600">R{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {nextStatus && activeTab === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, nextStatus)}
                      className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center"
                    >
                      <FaEdit className="mr-2" />
                      Move to {orderStatuses.find(s => s.id === nextStatus)?.label}
                    </button>
                  )}

                  {/* Time Information */}
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {order.status === 'initializing' && (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                        ⚠️ Needs Attention
                      </span>
                    )}
                    {order.updatedAt && (
                      <span>Last updated: {new Date(order.updatedAt).toLocaleTimeString()}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
