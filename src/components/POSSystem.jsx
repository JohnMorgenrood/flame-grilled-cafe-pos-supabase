import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign,
  Clock,
  User,
  Search,
  Grid,
  List,
  Filter,
  Percent,
  Gift,
  Receipt,
  Printer,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { db } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

// Sample menu data (in a real app, this would come from Firebase)
const menuCategories = [
  {
    id: 'specials',
    name: '⭐ Specials',
    color: 'bg-red-500',
    items: [
      { id: 1, name: 'Dagwood Burger', price: 89.00, image: '/api/placeholder/150/150', description: 'The \'Old Timer\' - bacon, ham, cheese, egg' },
      { id: 2, name: 'Sunrise Surprise Wrap', price: 65.00, image: '/api/placeholder/150/150', description: 'Scrambled eggs, bacon, cheese & tomato' }
    ]
  },
  {
    id: 'brekkie',
    name: 'Brekkie Rolls',
    color: 'bg-orange-500',
    items: [
      { id: 3, name: 'Egg Roll', price: 24.00, image: '/api/placeholder/150/150', description: 'Fresh egg in a soft roll' },
      { id: 4, name: 'Bacon Roll', price: 35.00, image: '/api/placeholder/150/150', description: 'Crispy bacon in a fresh roll' },
      { id: 5, name: 'Bacon & Egg Roll', price: 43.00, image: '/api/placeholder/150/150', description: 'Classic bacon and egg combination' },
      { id: 6, name: 'Bacon, Egg & Cheese Roll', price: 49.00, image: '/api/placeholder/150/150', description: 'Triple combo with melted cheese' },
      { id: 7, name: 'Ultimate Breakfast Roll', price: 60.00, image: '/api/placeholder/150/150', description: 'Bacon, egg, cheese & hash brown' }
    ]
  },
  {
    id: 'burgers',
    name: 'Flame-Grilled Burgers',
    color: 'bg-red-600',
    items: [
      { id: 19, name: 'Classic Burger', price: 55.00, image: '/api/placeholder/150/150', description: 'Flame-grilled beef patty' },
      { id: 20, name: 'Cheese Burger', price: 62.00, image: '/api/placeholder/150/150', description: 'Classic burger with melted cheese' },
      { id: 21, name: 'Bacon & Cheese Burger', price: 72.00, image: '/api/placeholder/150/150', description: 'Beef patty with bacon and cheese' },
      { id: 22, name: 'Peri-Peri Burger', price: 65.00, image: '/api/placeholder/150/150', description: 'Spicy peri-peri flame-grilled burger' },
      { id: 23, name: 'Double Bacon & Cheese', price: 88.00, image: '/api/placeholder/150/150', description: 'Double patty with bacon and cheese' }
    ]
  },
  {
    id: 'chicken',
    name: 'Chicken Burgers',
    color: 'bg-yellow-500',
    items: [
      { id: 24, name: 'Crumbed Chicken Classic', price: 52.00, image: '/api/placeholder/150/150', description: 'Crispy crumbed chicken fillet' },
      { id: 25, name: 'Chicken Cheese Burger', price: 58.00, image: '/api/placeholder/150/150', description: 'Crumbed chicken with cheese' },
      { id: 26, name: 'Peri-Peri Chicken Burger', price: 62.00, image: '/api/placeholder/150/150', description: 'Spicy peri-peri chicken' },
      { id: 27, name: 'Chicken Bacon & Cheese', price: 68.00, image: '/api/placeholder/150/150', description: 'Chicken with bacon and cheese' }
    ]
  },
  {
    id: 'drinks',
    name: 'Beverages',
    color: 'bg-blue-500',
    items: [
      { id: 42, name: 'Cappuccino', price: 32.00, image: '/api/placeholder/150/150', description: 'Rich coffee with steamed milk' },
      { id: 43, name: 'Americano', price: 28.00, image: '/api/placeholder/150/150', description: 'Strong black coffee' },
      { id: 44, name: 'Latte', price: 35.00, image: '/api/placeholder/150/150', description: 'Smooth coffee with steamed milk' },
      { id: 45, name: 'Rooibos Tea', price: 22.00, image: '/api/placeholder/150/150', description: 'Traditional South African tea' },
      { id: 46, name: 'Regular Milkshake', price: 38.00, image: '/api/placeholder/150/150', description: 'Creamy milkshake' },
      { id: 47, name: 'Soft Drink', price: 25.00, image: '/api/placeholder/150/150', description: 'Refreshing soft drink' }
    ]
  },
  {
    id: 'sides',
    name: 'Chips & Sides',
    color: 'bg-orange-500',
    items: [
      { id: 38, name: 'Hand Cut Chips', price: 28.00, image: '/api/placeholder/150/150', description: 'Golden crispy chips' },
      { id: 39, name: 'Bacon & Cheese Chips', price: 48.00, image: '/api/placeholder/150/150', description: 'Loaded chips with bacon' },
      { id: 40, name: 'Spicy Jalapeno Chips', price: 55.00, image: '/api/placeholder/150/150', description: 'Chips with jalapenos' },
      { id: 41, name: 'Russian & Chips', price: 55.00, image: '/api/placeholder/150/150', description: 'Traditional boerewors with chips' }
    ]
  }
];

export default function POSSystem() {
  const { user, role } = useAuth();
  const [activeCategory, setActiveCategory] = useState('burgers');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showPayment, setShowPayment] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax] = useState(0.08); // 8% tax
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Get current category items
  const currentCategory = menuCategories.find(cat => cat.id === activeCategory);
  const filteredItems = currentCategory?.items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const taxAmount = (subtotal - discountAmount) * tax;
  const total = subtotal - discountAmount + taxAmount;

  // Add item to cart
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to order`);
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from order');
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setDiscount(0);
    toast.success('Order cleared');
  };

  // Process payment with comprehensive Firebase integration
  const processPayment = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (processing) {
      toast.error('Payment already being processed');
      return;
    }

    setProcessing(true);

    try {
      // Generate unique IDs
      const timestamp = new Date();
      const orderId = `ORDER-${timestamp.getTime()}`;
      const receiptId = `REC-${timestamp.getTime()}`;
      const transactionId = `TXN-${timestamp.getTime()}`;
      
      // Prepare order data
      const orderData = {
        orderId,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity
        })),
        customer: customerName || 'Walk-in Customer',
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discountAmount.toFixed(2)),
        discountPercentage: discount,
        tax: Number(taxAmount.toFixed(2)),
        total: Number(total.toFixed(2)),
        paymentMethod,
        timestamp: serverTimestamp(),
        status: 'completed',
        cashier: user?.email || 'anonymous',
        cashierName: user?.displayName || user?.email || 'POS User',
        cashierUid: user?.uid || null,
        source: 'pos'
      };

      // Save main order to Firebase
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      console.log('Order saved with ID:', orderRef.id);

      // Create receipt record
      const receiptData = {
        receiptId,
        orderId,
        orderDocId: orderRef.id,
        ...orderData,
        printedAt: serverTimestamp(),
        receiptNumber: receiptId,
        businessInfo: {
          name: 'Flame Grilled Cafe',
          address: '123 Main Street, Cape Town',
          phone: '(021) 123-4567',
          vatNumber: '4123456789'
        }
      };
      
      const receiptRef = await addDoc(collection(db, 'receipts'), receiptData);
      console.log('Receipt saved with ID:', receiptRef.id);

      // Create transaction record for admin tracking
      const transactionData = {
        transactionId,
        orderId,
        receiptId,
        orderDocId: orderRef.id,
        receiptDocId: receiptRef.id,
        amount: Number(total.toFixed(2)),
        paymentMethod,
        cashier: user?.email || 'anonymous',
        cashierName: user?.displayName || user?.email || 'POS User',
        cashierUid: user?.uid || null,
        timestamp: serverTimestamp(),
        date: timestamp.toISOString().split('T')[0],
        time: timestamp.toTimeString().split(' ')[0],
        type: 'sale',
        status: 'completed',
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        customer: customerName || 'Walk-in Customer',
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discountAmount.toFixed(2)),
        tax: Number(taxAmount.toFixed(2))
      };

      const transactionRef = await addDoc(collection(db, 'transactions'), transactionData);
      console.log('Transaction saved with ID:', transactionRef.id);

      // Update daily sales summary
      const today = timestamp.toISOString().split('T')[0];
      const dailySalesRef = doc(db, 'daily_sales', today);
      
      const dailySalesData = {
        date: today,
        lastUpdated: serverTimestamp(),
        orders: {
          [orderRef.id]: {
            amount: Number(total.toFixed(2)),
            paymentMethod,
            timestamp: serverTimestamp(),
            cashier: user?.email || 'anonymous'
          }
        }
      };

      await setDoc(dailySalesRef, dailySalesData, { merge: true });
      console.log('Daily sales updated for:', today);

      // Also save to kitchen orders for kitchen display
      const kitchenOrderData = {
        orderId,
        orderDocId: orderRef.id,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          notes: item.notes || ''
        })),
        customer: customerName || 'Walk-in Customer',
        timestamp: serverTimestamp(),
        status: 'pending',
        estimatedTime: 15, // 15 minutes default
        source: 'pos',
        paymentMethod,
        total: Number(total.toFixed(2))
      };

      const kitchenRef = await addDoc(collection(db, 'kitchen_orders'), kitchenOrderData);
      console.log('Kitchen order saved with ID:', kitchenRef.id);

      // Prepare receipt data for local display
      const localReceiptData = {
        receiptId,
        orderId,
        receiptNumber: receiptId,
        items: cart,
        customer: customerName || 'Walk-in Customer',
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discountAmount.toFixed(2)),
        tax: Number(taxAmount.toFixed(2)),
        total: Number(total.toFixed(2)),
        paymentMethod,
        timestamp: timestamp,
        cashier: user?.email || 'anonymous',
        cashierName: user?.displayName || user?.email || 'POS User',
        printedAt: timestamp
      };

      // Set receipt data for printing
      setLastReceipt(localReceiptData);
      
      toast.success('Payment processed successfully!');
      
      // Auto-show receipt for cash payments
      if (paymentMethod === 'cash') {
        setShowReceipt(true);
        toast.success('Receipt ready for printing');
      } else {
        toast.success('Card payment processed - Receipt available');
      }

      // Clear everything
      clearCart();
      setShowPayment(false);
      setPaymentMethod('card');
      
    } catch (error) {
      console.error('Payment processing error:', error);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please ensure you are logged in with proper credentials.');
      } else if (error.code === 'unavailable') {
        toast.error('Firebase service unavailable. Please check your internet connection.');
      } else {
        toast.error(`Payment failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setProcessing(false);
    }
  };

  // Print receipt function
  const printReceipt = () => {
    if (!lastReceipt) return;
    
    const receiptWindow = window.open('', '_blank', 'width=300,height=600');
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${lastReceipt.receiptId}</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; margin: 10px; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .receipt-info { margin: 10px 0; }
            .items { border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin: 2px 0; }
            .totals { margin-top: 10px; }
            .total-line { display: flex; justify-content: space-between; margin: 2px 0; }
            .final-total { border-top: 1px solid #000; padding-top: 5px; font-weight: bold; }
            .footer { text-align: center; margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>🔥 FLAME GRILLED CAFE</h2>
            <p>123 Main Street, Cape Town<br>Tel: (021) 123-4567</p>
          </div>
          
          <div class="receipt-info">
            <p><strong>Receipt #:</strong> ${lastReceipt.receiptNumber}</p>
            <p><strong>Order #:</strong> ${lastReceipt.orderId}</p>
            <p><strong>Date:</strong> ${lastReceipt.timestamp.toLocaleString()}</p>
            <p><strong>Cashier:</strong> ${lastReceipt.cashierName}</p>
            <p><strong>Customer:</strong> ${lastReceipt.customer}</p>
          </div>
          
          <div class="items">
            <h3>ITEMS ORDERED:</h3>
            ${lastReceipt.items.map(item => `
              <div class="item">
                <span>${item.quantity}x ${item.name}</span>
                <span>R${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="totals">
            <div class="total-line">
              <span>Subtotal:</span>
              <span>R${lastReceipt.subtotal.toFixed(2)}</span>
            </div>
            ${lastReceipt.discount > 0 ? `
              <div class="total-line">
                <span>Discount (${discount}%):</span>
                <span>-R${lastReceipt.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-line">
              <span>Tax (8%):</span>
              <span>R${lastReceipt.tax.toFixed(2)}</span>
            </div>
            <div class="total-line final-total">
              <span>TOTAL:</span>
              <span>R${lastReceipt.total.toFixed(2)}</span>
            </div>
            <div class="total-line">
              <span>Payment Method:</span>
              <span>${lastReceipt.paymentMethod.toUpperCase()}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Visit us again soon!</p>
            <p>VAT Reg: 4123456789</p>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Panel - Menu Items */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Flammed Grilled Cafe POS</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.open('/order', '_blank')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📱 Mobile App
              </button>
              <button
                onClick={() => window.location.href = '/demo'}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                🔑 Demo Login
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Admin Panel
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b px-4 py-2">
          <div className="flex space-x-2 overflow-x-auto">
            {menuCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? `${category.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-4 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md"
                  onClick={() => addToCart(item)}
                >
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <p className="text-lg font-bold text-red-600">R{item.price.toFixed(2)}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md flex items-center"
                  onClick={() => addToCart(item)}
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <p className="text-lg font-bold text-red-600">R{item.price.toFixed(2)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-96 bg-white shadow-lg flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Customer Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No items in cart</p>
              <p className="text-sm">Tap items to add to order</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center border hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-gray-800">
                      R{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Discount */}
            <div className="flex items-center space-x-2">
              <Percent className="w-5 h-5 text-gray-400" />
              <input
                type="number"
                placeholder="Discount %"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>

            {/* Order Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span>-R{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>R{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>R{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear</span>
              </button>
              <button
                onClick={() => setShowPayment(true)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Pay</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-96 max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Payment</h3>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-red-600"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-red-600"
                  />
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span>Cash</span>
                </label>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPayment(false)}
                  disabled={processing}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={processing}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Receipt className="w-5 h-5" />
                      <span>Process Payment</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && lastReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-96 max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Receipt</h3>
                <button
                  onClick={() => setShowReceipt(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Receipt Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 font-mono text-sm">
                <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
                  <h4 className="font-bold text-lg">🔥 FLAME GRILLED CAFE</h4>
                  <p>123 Main Street, Cape Town</p>
                  <p>Tel: (021) 123-4567</p>
                </div>
                
                <div className="mb-3">
                  <p><strong>Receipt #:</strong> {lastReceipt.receiptNumber}</p>
                  <p><strong>Order #:</strong> {lastReceipt.orderId}</p>
                  <p><strong>Date:</strong> {lastReceipt.timestamp.toLocaleString()}</p>
                  <p><strong>Cashier:</strong> {lastReceipt.cashierName}</p>
                  <p><strong>Customer:</strong> {lastReceipt.customer}</p>
                </div>

                <div className="border-b border-dashed border-gray-400 pb-3 mb-3">
                  <h5 className="font-bold mb-2">ITEMS ORDERED:</h5>
                  {lastReceipt.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R{lastReceipt.subtotal.toFixed(2)}</span>
                  </div>
                  {lastReceipt.discount > 0 && (
                    <div className="flex justify-between">
                      <span>Discount ({discount}%):</span>
                      <span>-R{lastReceipt.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>R{lastReceipt.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-400 pt-1 font-bold">
                    <span>TOTAL:</span>
                    <span>R{lastReceipt.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span>{lastReceipt.paymentMethod.toUpperCase()}</span>
                  </div>
                </div>

                <div className="text-center mt-3 pt-3 border-t border-dashed border-gray-400">
                  <p>Thank you for your business!</p>
                  <p>Visit us again soon!</p>
                  <p className="text-xs">VAT Reg: 4123456789</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReceipt(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={printReceipt}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
