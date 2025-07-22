import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../../config/supabase';
import { Clock, CheckCircle, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const CashierDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error updating order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const paidOrders = orders.filter(order => order.status === 'paid');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashier Dashboard</h1>
        <p className="text-gray-600">Manage orders and payments</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-full">
              <Clock className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-full">
              <DollarSign className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Orders</p>
              <p className="text-2xl font-bold text-gray-900">{paidOrders.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Live Orders</h2>
        </div>
        
        <div className="p-6">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Customer: {order.customerEmail || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-gray-900">
                        ${order.total?.toFixed(2) || '0.00'}
                      </p>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        disabled={updatingOrder === order.id}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      >
                        Mark Preparing
                      </button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        disabled={updatingOrder === order.id}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      >
                        Mark Completed
                      </button>
                    )}
                    
                    {order.status === 'completed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                        disabled={updatingOrder === order.id}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No orders found</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CashierDashboard;
