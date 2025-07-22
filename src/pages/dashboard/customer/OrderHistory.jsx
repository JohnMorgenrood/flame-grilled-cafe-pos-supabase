import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../../config/supabase';
import { useAuth } from '../../../context/AuthContext';
import { Clock, CheckCircle, Package } from 'lucide-react';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrderHistory();
    }
  }, [user]);

  const fetchOrderHistory = async () => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'preparing':
        return <Package className="text-blue-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'paid':
        return <CheckCircle className="text-purple-500" size={20} />;
      default:
        return <Clock className="text-gray-500" size={20} />;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">View your past orders and their status</p>
      </motion.div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    {getStatusIcon(order.status)}
                    <h3 className="text-lg font-semibold text-gray-900 ml-2">
                      Order #{order.id.slice(-6)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Placed on {order.createdAt ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.createdAt ? new Date(order.createdAt.toDate()).toLocaleTimeString() : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    ${order.total?.toFixed(2) || '0.00'}
                  </p>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Status Timeline */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Status:</h4>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center ${
                    ['pending', 'preparing', 'completed', 'paid'].includes(order.status) 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      ['pending', 'preparing', 'completed', 'paid'].includes(order.status)
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Order Placed</span>
                  </div>

                  <div className={`flex items-center ${
                    ['preparing', 'completed', 'paid'].includes(order.status)
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      ['preparing', 'completed', 'paid'].includes(order.status)
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Preparing</span>
                  </div>

                  <div className={`flex items-center ${
                    ['completed', 'paid'].includes(order.status)
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      ['completed', 'paid'].includes(order.status)
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Completed</span>
                  </div>

                  <div className={`flex items-center ${
                    order.status === 'paid'
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      order.status === 'paid'
                        ? 'bg-green-600'
                        : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Paid</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-12 text-center"
        >
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start browsing our menu to place your first order!
          </p>
          <a href="/dashboard/customer" className="btn-primary">
            Browse Menu
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default OrderHistory;
