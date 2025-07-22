import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  Clock,
  Star,
  User,
  CheckCircle,
  ArrowLeft,
  Flame,
  Award,
  Truck,
  Zap
} from 'lucide-react';

const RestaurantApp = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('all'); // Start with all items
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: ''
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple currency formatter
  const formatCurrency = (amount) => `R${amount.toFixed(2)}`;

  // Categories with your original beautiful styling - USE ALL CATEGORIES
  const categories = [
    { id: 'all', name: '🍽️ All Items', icon: '🍽️', gradient: 'from-purple-500 to-blue-500' },
    { id: 'specials', name: '⭐ Specials', icon: '⭐', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'brekkie', name: 'Brekkie Rolls', icon: '🥓', gradient: 'from-orange-500 to-red-500' },
    { id: 'sandwiches', name: 'Toasted Sandwiches', icon: '🍞', gradient: 'from-amber-500 to-yellow-500' },
    { id: 'tramezzini', name: 'Gourmet Tramezzini', icon: '🥪', gradient: 'from-green-500 to-teal-500' },
    { id: 'burgers', name: 'Flame Grilled Burgers', icon: '🍔', gradient: 'from-red-500 to-orange-500' },
    { id: 'chicken', name: 'Chicken', icon: '🍗', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'wraps', name: 'Wraps', icon: '🌯', gradient: 'from-purple-500 to-pink-500' },
    { id: 'salads', name: 'Salads', icon: '🥗', gradient: 'from-green-500 to-emerald-500' },
    { id: 'chips', name: 'Hand Cut Chips', icon: '🍟', gradient: 'from-amber-500 to-orange-500' },
    { id: 'beverages', name: 'Beverages', icon: '☕', gradient: 'from-blue-500 to-cyan-500' }
  ];

  // Fetch menu items from Firebase
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'menu'));
        const items = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            ...data,
            // Add some default properties for display
            rating: data.rating || 4.5,
            prepTime: data.prepTime || '15-20 min',
            calories: data.calories || 450
          });
        });
        setMenuItems(items);
        console.log('✅ Fetched menu items:', items.length, 'items');
        console.log('📋 Items by category:');
        const byCategory = items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {});
        console.log(byCategory);
        if (items.length > 0) {
          console.log('🔍 Sample item:', items[0]);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Cart Functions
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get filtered items by category - SHOW ALL IF CATEGORY IS EMPTY
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);
  
  // If no items in selected category, show all items
  const itemsToShow = filteredItems.length > 0 ? filteredItems : menuItems;

  const handleOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || cart.length === 0) return;
    
    setIsProcessingPayment(true);
    try {
      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show confirmation
      setCurrentView('orderConfirm');
      setTimeout(() => {
        setCart([]);
        setCustomerInfo({ name: '', phone: '' });
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Header Component with your original beautiful design
  const Header = () => (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl"></div>
      </div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Flame Grilled Cafe
              </h1>
              <p className="text-sm text-gray-300 flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Flame-grilled perfection</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('cart')}
              className="relative bg-white/10 backdrop-blur-lg p-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                  {getTotalItems()}
                </div>
              )}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white/10 backdrop-blur-lg p-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1">
            <Clock className="w-4 h-4" />
            <span>15-30 min</span>
          </div>
          <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.8 Rating</span>
          </div>
          <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1">
            <Truck className="w-4 h-4" />
            <span>Free Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Category Tabs with your original styling
  const CategoryTabs = () => (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Menu Item Card with featured/special badges
  const MenuItemCard = ({ item }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
              
              {/* Featured Badge */}
              {item.featured && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                  <span>👑</span>
                  <span>Featured</span>
                </div>
              )}
              
              {/* Special Badge */}
              {item.special && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Special</span>
                </div>
              )}
              
              {/* Popular Badge (if item is marked as popular in old data) */}
              {item.popular && (
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>Popular</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-3">{item.description}</p>
            <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{item.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{item.prepTime}</span>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {item.calories} cal
              </div>
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {formatCurrency(item.price)}
            </p>
          </div>
          <div className="text-4xl ml-4 bg-gray-50 rounded-2xl p-3">
            {item.image || '🍽️'}
          </div>
        </div>
        <button
          onClick={() => addToCart(item)}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );

  // Cart View with your original beautiful styling
  const CartView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/90 backdrop-blur-lg p-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={() => setCurrentView('menu')} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Your Cart</h2>
          <div className="ml-auto bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
            {getTotalItems()} items
          </div>
        </div>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
          <button
            onClick={() => setCurrentView('menu')}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-2xl font-bold"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="text-3xl bg-gray-50 rounded-xl p-2">{item.image || '🍽️'}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-red-600 font-bold">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-lg">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-xl">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-bold text-lg">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
          
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {formatCurrency(getTotalPrice())}
              </span>
            </div>
            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Checkout View with your original styling
  const CheckoutView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <button onClick={() => setCurrentView('cart')} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Checkout</h2>
        </div>
        
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Your Name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500"
          />
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-3">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-bold">
            Total: {formatCurrency(getTotalPrice())}
          </div>
        </div>
        
        <button
          onClick={handleOrder}
          disabled={!customerInfo.name || !customerInfo.phone || isProcessingPayment}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2"
        >
          {isProcessingPayment ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <span>💳</span>
              <span>Pay with PayPal - {formatCurrency(getTotalPrice())}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Order Confirmation with your original styling
  const OrderConfirmView = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We'll prepare it with care and notify you when it's ready.
        </p>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order Total</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {formatCurrency(getTotalPrice())}
          </p>
        </div>
        <div className="text-sm text-gray-500 animate-pulse">
          Redirecting to your dashboard...
        </div>
      </div>
    </div>
  );

  // Main Menu View with your original beautiful design
  const MenuView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <CategoryTabs />
      
      <div className="p-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {itemsToShow.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
        
        {!loading && itemsToShow.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No items available{selectedCategory !== 'all' ? ' in this category' : ''}</p>
            <p className="text-gray-400 text-sm mt-2">Items will appear here after adding them in the admin dashboard</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button with your original styling */}
      {cart.length > 0 && currentView === 'menu' && (
        <button
          onClick={() => setCurrentView('cart')}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white p-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50 transform hover:scale-110 transition-all duration-300"
        >
          <ShoppingCart className="w-6 h-6" />
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-90">{getTotalItems()} items</span>
            <span className="font-bold">{formatCurrency(getTotalPrice())}</span>
          </div>
        </button>
      )}
    </div>
  );

  // Render based on current view
  switch (currentView) {
    case 'cart':
      return <CartView />;
    case 'checkout':
      return <CheckoutView />;
    case 'orderConfirm':
      return <OrderConfirmView />;
    default:
      return <MenuView />;
  }
};

export default RestaurantApp;
