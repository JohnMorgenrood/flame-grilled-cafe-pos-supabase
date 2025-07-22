import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const SimpleMobileApp = () => {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const sampleItems = [
    { id: 1, name: 'Burger', price: 85.99, image: '/api/placeholder/300/200' },
    { id: 2, name: 'Pizza', price: 125.50, image: '/api/placeholder/300/200' },
    { id: 3, name: 'Fries', price: 45.00, image: '/api/placeholder/300/200' }
  ];

  const addToCart = (item) => {
    setCart([...cart, { ...item, quantity: 1 }]);
    toast.success(`${item.name} added to cart`);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-600 text-white p-4">
        <h1 className="text-2xl font-bold">Flame Grilled Cafe</h1>
        <p className="text-orange-100">Simple Mobile Ordering</p>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <div className="grid gap-4">
          {sampleItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-orange-600 font-bold">R{item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold">Cart ({cart.length} items)</span>
            <span className="font-bold text-orange-600">R{total.toFixed(2)}</span>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Simple Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            <div className="mb-4">
              <p>Total: R{total.toFixed(2)}</p>
              <p>Items: {cart.length}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  toast.success('Order placed successfully!');
                  setCart([]);
                  setShowCheckout(false);
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Place Order
              </button>
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleMobileApp;
