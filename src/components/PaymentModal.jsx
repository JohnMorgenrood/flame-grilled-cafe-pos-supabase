import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Smartphone, 
  QrCode, 
  X, 
  Lock, 
  Check,
  Camera,
  Wallet
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  orderTotal, 
  onPaymentSuccess, 
  currency = 'ZAR',
  orderDetails = null,
  onPayFastSelected = null
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, American Express',
      color: 'bg-blue-500'
    },
    {
      id: 'payfast',
      name: 'PayFast',
      icon: Lock,
      description: 'South Africa\'s trusted payment gateway',
      color: 'bg-green-600'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      icon: Smartphone,
      description: 'Fast & secure with Google',
      color: 'bg-green-500'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      description: 'Pay with your PayPal account',
      color: 'bg-blue-600'
    },
    {
      id: 'qr',
      name: 'Scan QR Code',
      icon: QrCode,
      description: 'SnapScan, Zapper, or Banking App',
      color: 'bg-purple-500'
    }
  ];

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'number') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    // Format expiry as MM/YY
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const generateOrderCode = () => {
    // Generate order code in format FGC-XXXX
    const digits = Math.floor(Math.random() * 9000) + 1000;
    return `FGC-${digits}`;
  };

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      // Handle PayFast selection
      if (selectedMethod === 'payfast') {
        if (onPayFastSelected) {
          onPayFastSelected();
          return;
        }
      }
      
      // Simulate payment processing for other methods
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderCode = generateOrderCode();
      const paymentData = {
        method: selectedMethod,
        amount: orderTotal,
        orderCode: orderCode,
        timestamp: new Date().toISOString(),
        saveCard: saveCard
      };

      // Success!
      toast.success('🎉 Payment successful!');
      onPaymentSuccess(paymentData);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleGooglePay = async () => {
    setProcessing(true);
    toast.success('🔄 Redirecting to Google Pay...');
    
    // Simulate Google Pay flow
    setTimeout(async () => {
      await processPayment();
    }, 1500);
  };

  const handlePayPal = async () => {
    setProcessing(true);
    toast.success('🔄 Redirecting to PayPal...');
    
    // Simulate PayPal flow
    setTimeout(async () => {
      await processPayment();
    }, 1500);
  };

  const handlePayFast = async () => {
    setProcessing(true);
    toast.success('🔄 Opening PayFast secure payment...');
    
    // Trigger PayFast modal
    setTimeout(() => {
      if (onPayFastSelected) {
        onPayFastSelected();
      } else {
        processPayment();
      }
    }, 1000);
  };

  const handleQRPayment = async () => {
    setProcessing(true);
    toast.success('📱 QR Code generated for payment');
    
    // Simulate QR payment
    setTimeout(async () => {
      await processPayment();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Complete Payment
              </h3>
              <p className="text-sm text-gray-500">
                Total: <span className="font-bold text-orange-600">
                  {currency === 'ZAR' ? 'R' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency}
                  {orderTotal.toFixed(2)}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {!selectedMethod ? (
              /* Payment Method Selection */
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-4">
                  Choose Payment Method
                </h4>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <motion.button
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMethod(method.id)}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors flex items-center space-x-3"
                    >
                      <div className={`p-2 rounded-lg ${method.color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              /* Payment Details */
              <div>
                <button
                  onClick={() => setSelectedMethod(null)}
                  className="text-sm text-orange-600 hover:text-orange-700 mb-4"
                >
                  ← Choose different method
                </button>

                {selectedMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={cardDetails.number}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={cardDetails.name}
                        onChange={handleCardInputChange}
                        placeholder="John Doe"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <label htmlFor="saveCard" className="text-sm text-gray-600">
                        Save card for future orders
                      </label>
                    </div>
                  </div>
                )}

                {selectedMethod === 'qr' && (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-lg p-8 mb-4">
                      <QrCode className="h-32 w-32 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">
                        Scan this QR code with your banking app, SnapScan, or Zapper
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 justify-center">
                      <Camera className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-600">
                        Amount: {currency === 'ZAR' ? 'R' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency}{orderTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {selectedMethod === 'payfast' && (
                  <div className="text-center py-8">
                    <div className="bg-green-50 rounded-lg p-8 mb-4">
                      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        You'll be redirected to PayFast - South Africa's most trusted payment gateway.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                        <div className="flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>PCI DSS Compliant</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>SSL Encrypted</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>Secure Processing</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>80,000+ Merchants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedMethod === 'googlepay' || selectedMethod === 'paypal') && (
                  <div className="text-center py-8">
                    <div className="bg-gray-50 rounded-lg p-8 mb-4">
                      <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-orange-600" />
                      </div>
                      <p className="text-sm text-gray-600">
                        You'll be redirected to {selectedMethod === 'googlepay' ? 'Google Pay' : 'PayPal'} to complete your payment securely.
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (selectedMethod === 'card') processPayment();
                    else if (selectedMethod === 'googlepay') handleGooglePay();
                    else if (selectedMethod === 'paypal') handlePayPal();
                    else if (selectedMethod === 'payfast') handlePayFast();
                    else if (selectedMethod === 'qr') handleQRPayment();
                  }}
                  disabled={processing}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      <span>Pay {currency === 'ZAR' ? 'R' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency}{orderTotal.toFixed(2)}</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="text-xs text-gray-600">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
