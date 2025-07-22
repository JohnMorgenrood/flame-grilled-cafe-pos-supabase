import React from 'react';

const SimpleCheckout = ({ 
  cartItems, 
  total, 
  deliveryAddress, 
  onPaymentSuccess, 
  onCancel 
}) => {
  const handlePayment = () => {
    // Simple success simulation
    onPaymentSuccess({
      id: `TEST-${Date.now()}`,
      items: cartItems,
      total: total,
      paymentDetails: {
        transactionId: 'test-123',
        paymentMethod: 'test'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Simple Checkout Test</h2>
          
          <div className="mb-4">
            <p className="text-lg">Total: R{total.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Items: {cartItems.length}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
            >
              Test Payment Success
            </button>
            
            <button
              onClick={onCancel}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            This is a simple test checkout component to debug the white screen issue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleCheckout;
