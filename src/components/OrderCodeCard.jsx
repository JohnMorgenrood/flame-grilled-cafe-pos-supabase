import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Copy, 
  Check, 
  Clock,
  MapPin,
  Phone,
  Star,
  Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const OrderCodeCard = ({ order, onConfirmDelivery }) => {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const copyOrderCode = () => {
    navigator.clipboard.writeText(order.orderCode);
    setCopied(true);
    toast.success('Order code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmDelivery = async () => {
    setConfirming(true);
    
    // Simulate confirmation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('✅ Order confirmed as delivered!');
    onConfirmDelivery(order.id);
    setConfirming(false);
  };

  const getStatusInfo = () => {
    switch (order.status) {
      case 'confirmed':
        return {
          color: 'bg-blue-500',
          text: 'Order Confirmed',
          description: 'Your order is being prepared'
        };
      case 'preparing':
        return {
          color: 'bg-orange-500',
          text: 'Being Prepared',
          description: 'Chef is working on your order'
        };
      case 'ready':
        return {
          color: 'bg-green-500',
          text: 'Ready for Delivery',
          description: 'Driver will collect soon'
        };
      case 'delivering':
        return {
          color: 'bg-purple-500',
          text: 'Out for Delivery',
          description: 'Driver is on the way'
        };
      default:
        return {
          color: 'bg-gray-500',
          text: order.status,
          description: 'Order status'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const showDeliveryCode = ['ready', 'delivering'].includes(order.status);
  const canConfirmDelivery = order.status === 'delivering';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(order.timestamp).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">
              R{order.total.toFixed(2)}
            </p>
            <p className="text-sm text-green-600">✓ Paid</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${statusInfo.color}`}></div>
          <div>
            <p className="font-medium text-gray-900">{statusInfo.text}</p>
            <p className="text-sm text-gray-500">{statusInfo.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full ${statusInfo.color} transition-all duration-500`}
            style={{ width: `${order.progress || 0}%` }}
          ></div>
        </div>

        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-900">
                R{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery Info */}
        {order.orderType === 'delivery' && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
              </div>
            </div>
            {order.estimatedTime && (
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-600">
                  Estimated time: {order.estimatedTime}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Order Code Section */}
        {showDeliveryCode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-orange-900">
                Delivery Verification Code
              </h4>
            </div>
            
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 tracking-widest">
                    {order.orderCode}
                  </p>
                  <p className="text-xs text-gray-500">
                    Show this code to the delivery driver
                  </p>
                </div>
                <button
                  onClick={copyOrderCode}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-xs text-orange-700 space-y-1">
              <p>• Keep this code ready when the driver arrives</p>
              <p>• Don't share this code with anyone else</p>
              <p>• Driver will verify this code before handover</p>
            </div>
          </motion.div>
        )}

        {/* Confirm Delivery Button */}
        {canConfirmDelivery && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirmDelivery}
            disabled={confirming}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {confirming ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <Package className="h-5 w-5" />
                <span>I Received My Order</span>
              </>
            )}
          </motion.button>
        )}

        {/* Driver Contact (when delivering) */}
        {order.status === 'delivering' && order.driverInfo && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Your Driver: {order.driverInfo.name}
                </p>
                <p className="text-xs text-blue-700">
                  {order.driverInfo.vehicle} • {order.driverInfo.plate}
                </p>
              </div>
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Phone className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderCodeCard;
