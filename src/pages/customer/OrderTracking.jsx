import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaClock, 
  FaUtensils, 
  FaTruck, 
  FaMapMarkerAlt,
  FaPhone,
  FaReceipt
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { toast } from 'react-hot-toast';

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(location.state?.orderData || null);
  const [orderStatus, setOrderStatus] = useState('initializing');

  // Order status progression
  const orderSteps = [
    { 
      id: 'initializing', 
      title: 'Order Placed', 
      description: 'Your order has been received',
      icon: FaReceipt,
      color: 'bg-blue-500'
    },
    { 
      id: 'accepted', 
      title: 'Order Accepted', 
      description: 'Restaurant confirmed your order',
      icon: FaCheck,
      color: 'bg-green-500'
    },
    { 
      id: 'preparing', 
      title: 'Preparing Food', 
      description: 'Your delicious meal is being prepared',
      icon: FaUtensils,
      color: 'bg-orange-500'
    },
    { 
      id: 'ready', 
      title: 'Ready for Pickup/Delivery', 
      description: 'Your order is ready',
      icon: FaClock,
      color: 'bg-purple-500'
    },
    { 
      id: 'out_for_delivery', 
      title: 'Out for Delivery', 
      description: 'Driver is on the way',
      icon: FaTruck,
      color: 'bg-blue-600'
    },
    { 
      id: 'delivered', 
      title: 'Delivered', 
      description: 'Enjoy your meal!',
      icon: FaMapMarkerAlt,
      color: 'bg-green-600'
    }
  ];

  useEffect(() => {
    if (!orderData) {
      navigate('/');
      return;
    }

    // Listen for real-time order updates
    const unsubscribe = onSnapshot(
      doc(db, 'orders', orderData.id),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setOrderStatus(data.status || 'initializing');
          setOrderData(prev => ({ ...prev, ...data }));
        }
      },
      (error) => {
        console.error('Error listening to order updates:', error);
      }
    );

    return () => unsubscribe();
  }, [orderData, navigate]);

  const getCurrentStepIndex = () => {
    return orderSteps.findIndex(step => step.id === orderStatus);
  };

  const getProgress = () => {
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / orderSteps.length) * 100;
  };

  const getEstimatedTime = () => {
    switch (orderStatus) {
      case 'initializing': return '2-5 minutes';
      case 'accepted': return '15-25 minutes';
      case 'preparing': return '10-20 minutes';
      case 'ready': return '5-10 minutes';
      case 'out_for_delivery': return '10-15 minutes';
      case 'delivered': return 'Completed';
      default: return 'Calculating...';
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaClock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-600 text-white p-4">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="text-orange-200 hover:text-white mb-2"
          >
            ← Back to Menu
          </button>
          <h1 className="text-xl font-bold">Order #{orderData.id.slice(-6)}</h1>
          <p className="text-orange-200">Track your order progress</p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Order Status</h2>
            <span className="text-sm text-gray-500">ETA: {getEstimatedTime()}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{Math.round(getProgress())}% Complete</p>
          </div>

          {/* Order Steps */}
          <div className="space-y-4">
            {orderSteps.map((step, index) => {
              const currentIndex = getCurrentStepIndex();
              const isCompleted = index <= currentIndex;
              const isActive = index === currentIndex;
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.id}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive ? 'bg-orange-50 border border-orange-200' : 
                    isCompleted ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`p-2 rounded-full mr-4 ${
                    isCompleted ? 'bg-green-500' : 
                    isActive ? 'bg-orange-500' : 'bg-gray-300'
                  }`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isActive ? 'text-orange-700' : 
                      isCompleted ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      isActive ? 'text-orange-600' : 
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {isCompleted && (
                    <FaCheck className="h-5 w-5 text-green-500" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Order Details</h3>
          <div className="space-y-3">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total</span>
                <span className="text-orange-600">R{orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        {orderData.deliveryAddress && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Delivery Information</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="font-medium">{orderData.customer.name}</p>
                  <p className="text-gray-600 text-sm">
                    {orderData.deliveryAddress.street}, {orderData.deliveryAddress.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhone className="h-4 w-4 text-gray-400 mr-3" />
                <p className="text-gray-600 text-sm">{orderData.customer.phone || orderData.customer.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Restaurant */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Need Help?</h3>
          <div className="space-y-3">
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700">
              <FaPhone className="inline mr-2" />
              Call Restaurant
            </button>
            <button 
              onClick={() => navigate('/customer/orders')}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
            >
              View All Orders
            </button>
          </div>
        </div>

        {/* Order Again */}
        {orderStatus === 'delivered' && (
          <motion.div 
            className="bg-white rounded-lg p-6 shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-semibold mb-2">Enjoyed your meal?</h3>
            <p className="text-gray-600 mb-4">Order again from Flame Grilled Cafe</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700"
            >
              Order Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
