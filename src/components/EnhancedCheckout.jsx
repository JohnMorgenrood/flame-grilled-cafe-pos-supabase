import React, { useState, useEffect } from 'react';
import { 
  FaCreditCard, 
  FaPaypal, 
  FaQrcode, 
  FaGoogle, 
  FaLock,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext-simple';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/PaymentService';

import { db } from '../config/supabase';

const EnhancedCheckout = ({ 
  cartItems, 
  total, 
  deliveryAddress, 
  onPaymentSuccess, 
  onCancel 
}) => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(user ? 'payment' : 'auth');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || ''
  });

  useEffect(() => {
    loadPaymentMethods();
    loadQRCode();
  }, []);

  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || ''
      });
      setStep('payment');
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      await paymentService.loadSettings();
      const methods = paymentService.getAvailablePaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedMethod(methods[0].id);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      // Set default fallback methods if settings fail to load
      const fallbackMethods = [
        {
          id: 'qr',
          name: 'QR Code',
          description: 'Scan QR code to pay',
          icon: '📱',
          local: true
        }
      ];
      setPaymentMethods(fallbackMethods);
      setSelectedMethod('qr');
      toast.error('Failed to load payment options, using default methods');
    }
  };

  const loadQRCode = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'admin', 'settings'));
      if (settingsDoc.exists()) {
        const settings = settingsDoc.data();
        if (settings.qrCode?.url) {
          setQrCodeUrl(settings.qrCode.url);
        }
      }
    } catch (error) {
      console.error('Error loading QR code:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setProcessing(true);
      await signInWithGoogle();
      toast.success('Signed in successfully!');
      setStep('payment');
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google');
    } finally {
      setProcessing(false);
    }
  };

  const handleGuestCheckout = () => {
    if (!customerInfo.name || !customerInfo.email) {
      toast.error('Please fill in your name and email');
      return;
    }
    setStep('payment');
  };

  const validateCustomerInfo = () => {
    if (!customerInfo.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!customerInfo.email.trim() || !customerInfo.email.includes('@')) {
      toast.error('Valid email is required');
      return false;
    }
    return true;
  };

  const processPayment = async () => {
    if (!validateCustomerInfo()) return;
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);
    try {
      const orderData = {
        id: `ORD-${Date.now()}`,
        items: cartItems,
        total: total,
        customer: customerInfo,
        deliveryAddress: deliveryAddress,
        timestamp: new Date().toISOString(),
        status: 'initializing'
      };

      const result = await paymentService.processPayment(selectedMethod, orderData, total);
      
      if (result.success) {
        // Save order to Firestore
        await setDoc(doc(db, 'orders', orderData.id), {
          ...orderData,
          paymentDetails: result,
          updatedAt: new Date().toISOString()
        });

        setPaymentData(result);
        toast.success('Payment successful! Redirecting to order tracking...');
        
        // Redirect to order tracking after a short delay
        setTimeout(() => {
          navigate('/customer/order-tracking', { 
            state: { orderData: { ...orderData, paymentDetails: result } }
          });
          onPaymentSuccess({
            ...orderData,
            paymentDetails: result
          });
        }, 2000);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const renderAuthStep = () => (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In to Continue</h2>
      
      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        disabled={processing}
        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-3 mb-4"
      >
        <FaGoogle className="h-5 w-5" />
        <span>{processing ? 'Signing in...' : 'Continue with Google'}</span>
      </button>

      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Guest Checkout */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Continue as Guest</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="+27 11 123 4567"
          />
        </div>

        <button
          onClick={handleGuestCheckout}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700"
        >
          Continue as Guest
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        By continuing, you agree to our terms of service and privacy policy.
      </p>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Order Summary */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span className="text-orange-600">R{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
        <div className="text-sm text-gray-600">
          <p>{customerInfo.name}</p>
          <p>{customerInfo.email}</p>
          {customerInfo.phone && <p>{customerInfo.phone}</p>}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                selectedMethod === method.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-sm text-gray-600">{method.description}</p>
                  {method.local && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Local Payment
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* QR Code Display */}
      {selectedMethod === 'qr' && qrCodeUrl && (
        <div className="mb-6 text-center">
          <h4 className="font-semibold mb-3">Scan QR Code to Pay</h4>
          <div className="inline-block border border-gray-300 rounded-lg p-4">
            <img
              src={qrCodeUrl}
              alt="Payment QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Scan with SnapScan, Zapper, or your banking app
          </p>
        </div>
      )}

      {/* PayPal Container */}
      {selectedMethod === 'paypal' && (
        <div id="paypal-button-container" className="mb-6"></div>
      )}

      {/* Payment Actions */}
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
        
        {selectedMethod !== 'paypal' && (
          <button
            onClick={processPayment}
            disabled={processing || !selectedMethod}
            className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <FaSpinner className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaLock className="h-4 w-4" />
                <span>Pay Now</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
        <FaLock className="h-4 w-4 mr-2" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaCheck className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-4">
        Your order has been confirmed and payment received.
      </p>
      {paymentData && (
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <p className="text-sm text-gray-600">
            <strong>Transaction ID:</strong> {paymentData.transactionId}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Payment Method:</strong> {paymentData.paymentMethod}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Steps */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step === 'auth' ? 'text-orange-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'auth' ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                {step === 'auth' ? '1' : <FaCheck className="h-4 w-4" />}
              </div>
              <span className="text-sm font-medium">Sign In</span>
            </div>
            
            <div className="flex-1 h-px bg-gray-300"></div>
            
            <div className={`flex items-center space-x-2 ${
              step === 'payment' ? 'text-orange-600' : 
              step === 'success' ? 'text-green-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-orange-100' : 
                step === 'success' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {step === 'success' ? <FaCheck className="h-4 w-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'auth' && renderAuthStep()}
        {step === 'payment' && renderPaymentStep()}
        {paymentData && renderSuccessStep()}
      </div>
    </div>
  );
};

export default EnhancedCheckout;
