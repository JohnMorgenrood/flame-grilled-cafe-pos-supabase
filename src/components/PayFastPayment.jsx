import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// PayFast configuration
const PAYFAST_CONFIG = {
  merchant_id: process.env.REACT_APP_PAYFAST_MERCHANT_ID || '10000100',
  merchant_key: process.env.REACT_APP_PAYFAST_MERCHANT_KEY || '46f0cd694581a',
  sandbox: process.env.NODE_ENV !== 'production', // Use sandbox for development
  passphrase: process.env.REACT_APP_PAYFAST_PASSPHRASE || 'jt7NOE43FZPn',
  notify_url: `${window.location.origin}/api/payfast/notify`,
  return_url: `${window.location.origin}/payment/success`,
  cancel_url: `${window.location.origin}/payment/cancel`
};

export default function PayFastPayment({ 
  orderTotal, 
  currency, 
  orderDetails, 
  onPaymentSuccess, 
  onPaymentError,
  onClose 
}) {
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  // Generate payment signature for PayFast
  const generateSignature = (data, passphrase = '') => {
    // Create parameter string
    const paramString = Object.keys(data)
      .filter(key => data[key] !== '' && data[key] !== null && data[key] !== undefined)
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key].toString().trim())}`)
      .join('&');
    
    // Add passphrase if provided
    const stringToHash = passphrase ? `${paramString}&passphrase=${passphrase}` : paramString;
    
    // For demo purposes, use a simple hash (in production, use proper server-side signature)
    // This is just for demonstration - PayFast signatures should be generated server-side
    let hash = 0;
    for (let i = 0; i < stringToHash.length; i++) {
      const char = stringToHash.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  };

  // Prepare PayFast payment data
  const preparePaymentData = () => {
    const amount = (orderTotal * 1).toFixed(2); // Convert to ZAR and format
    const orderNumber = `ORD-${Date.now()}`;
    
    const paymentData = {
      merchant_id: PAYFAST_CONFIG.merchant_id,
      merchant_key: PAYFAST_CONFIG.merchant_key,
      return_url: PAYFAST_CONFIG.return_url,
      cancel_url: PAYFAST_CONFIG.cancel_url,
      notify_url: PAYFAST_CONFIG.notify_url,
      name_first: orderDetails.customerInfo?.name?.split(' ')[0] || 'Customer',
      name_last: orderDetails.customerInfo?.name?.split(' ').slice(1).join(' ') || '',
      email_address: orderDetails.customerInfo?.email || 'customer@example.com',
      m_payment_id: orderNumber,
      amount: amount,
      item_name: 'Flammed Grilled Order',
      item_description: `Order containing ${orderDetails.items?.length || 0} items`,
      custom_int1: orderDetails.items?.length || 0,
      custom_str1: orderDetails.orderType || 'delivery',
      custom_str2: JSON.stringify({ orderCode: `FGC-${Math.floor(Math.random() * 9000) + 1000}` })
    };
    
    // Generate signature
    if (PAYFAST_CONFIG.passphrase) {
      paymentData.signature = generateSignature(paymentData, PAYFAST_CONFIG.passphrase);
    }
    
    return paymentData;
  };

  // Submit payment to PayFast
  const submitPayment = () => {
    setIsProcessing(true);
    
    try {
      const data = preparePaymentData();
      setPaymentData(data);
      
      // Create form and submit to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = PAYFAST_CONFIG.sandbox 
        ? 'https://sandbox.payfast.co.za/eng/process' 
        : 'https://www.payfast.co.za/eng/process';
      form.target = '_blank';
      
      Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      // Show success message and handle payment completion
      toast.success('Redirected to PayFast for secure payment');
      
      // Simulate payment success for demo (remove in production)
      setTimeout(() => {
        const mockPaymentResult = {
          method: 'payfast',
          orderCode: JSON.parse(data.custom_str2).orderCode,
          paymentId: data.m_payment_id,
          amount: data.amount,
          currency: 'ZAR'
        };
        
        onPaymentSuccess(mockPaymentResult);
        setIsProcessing(false);
      }, 3000);
      
    } catch (error) {
      console.error('PayFast payment error:', error);
      toast.error('Payment initialization failed');
      onPaymentError(error);
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 max-w-md w-full"
    >
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 mb-4">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Secure Payment
        </h3>
        
        <p className="text-gray-600">
          Complete your order with PayFast - South Africa's leading payment gateway
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-900">Order Total:</span>
          <span className="text-xl font-bold text-gray-900">R{orderTotal.toFixed(2)}</span>
        </div>
        <div className="text-sm text-gray-600">
          {orderDetails.items?.length || 0} items • {orderDetails.orderType || 'delivery'}
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-900">Secure Payment with PayFast</span>
        </div>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• PCI DSS Level 1 compliant</li>
          <li>• SSL encrypted transactions</li>
          <li>• No card details stored</li>
          <li>• Trusted by 80,000+ merchants</li>
        </ul>
        
        <button
          onClick={() => setShowSecurityInfo(true)}
          className="mt-2 text-green-600 hover:text-green-800 font-medium text-sm underline"
        >
          Learn more about payment security
        </button>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Accepted Payment Methods</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Visa', logo: '💳' },
            { name: 'Mastercard', logo: '💳' },
            { name: 'EFT', logo: '🏦' },
            { name: 'Instant EFT', logo: '⚡' }
          ].map((method) => (
            <div key={method.name} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg">
              <span className="text-xl">{method.logo}</span>
              <span className="text-sm font-medium text-gray-700">{method.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="space-y-3">
        <button
          onClick={submitPayment}
          disabled={isProcessing}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pay R{orderTotal.toFixed(2)} with PayFast</span>
            </>
          )}
        </button>
        
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Terms */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        By completing this payment, you agree to our{' '}
        <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
      </div>

      {/* Security Info Modal */}
      {showSecurityInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Payment Security</h3>
              <button
                onClick={() => setShowSecurityInfo(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">PCI DSS Compliance</p>
                  <p className="text-sm text-gray-600">PayFast meets the highest security standards for payment processing</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">SSL Encryption</p>
                  <p className="text-sm text-gray-600">All payment data is encrypted during transmission</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">No Data Storage</p>
                  <p className="text-sm text-gray-600">We never store your payment card information</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowSecurityInfo(false)}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
