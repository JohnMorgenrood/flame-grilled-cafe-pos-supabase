import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Plus, Minus, X, Clock, Star, MapPin, User, CreditCard,
  CheckCircle, ArrowLeft, Search, Filter, Flame, Award, Truck, Store, Zap
} from 'lucide-react';

const MobileRestaurantApp = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('burgers');
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', email: '', address: '', notes: ''
  });
  const [orderType, setOrderType] = useState('delivery');
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced Menu Data
  const categories = [
    { id: 'burgers', name: 'Burgers', icon: '🍔', gradient: 'from-red-500 to-orange-500' },
    { id: 'chicken', name: 'Chicken', icon: '🍗', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'wraps', name: 'Wraps', icon: '🌯', gradient: 'from-green-500 to-teal-500' },
    { id: 'sides', name: 'Sides', icon: '🍟', gradient: 'from-purple-500 to-pink-500' },
    { id: 'drinks', name: 'Drinks', icon: '🥤', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'desserts', name: 'Desserts', icon: '🍰', gradient: 'from-pink-500 to-rose-500' }
  ];

  const menuItems = {
    burgers: [
      {
        id: 1, 
        name: 'Flame-Grilled Beef Burger', 
        price: 95, 
        image: '🍔',
        description: 'Juicy beef patty with flame-grilled flavor, lettuce, tomato, onion',
        popular: true, 
        rating: 4.8, 
        prepTime: '15-20 min', 
        calories: 550
      },
      {
        id: 2, 
        name: 'Chicken Burger Deluxe', 
        price: 89, 
        image: '🍔',
        description: 'Grilled chicken breast, mayo, lettuce, tomato',
        rating: 4.6, 
        prepTime: '12-15 min', 
        calories: 480
      },
      {
        id: 3, 
        name: 'Cheese Burger Special', 
        price: 105, 
        image: '🍔',
        description: 'Double cheese, beef patty, special sauce',
        rating: 4.7, 
        prepTime: '15-18 min', 
        calories: 620
      },
      {
        id: 4, 
        name: 'BBQ Bacon Burger', 
        price: 115, 
        image: '🍔',
        description: 'BBQ sauce, crispy bacon, onion rings',
        rating: 4.9, 
        prepTime: '18-22 min', 
        calories: 680
      }
    ],
    chicken: [
      {
        id: 5, 
        name: 'Flame-Grilled Half Chicken', 
        price: 85, 
        image: '🍗',
        description: 'Marinated half chicken, flame-grilled to perfection',
        popular: true, 
        rating: 4.9, 
        prepTime: '25-30 min', 
        calories: 450
      },
      {
        id: 6, 
        name: 'Chicken Wings (8pc)', 
        price: 65, 
        image: '🍗',
        description: 'Spicy chicken wings with your choice of sauce',
        rating: 4.5, 
        prepTime: '15-18 min', 
        calories: 380
      },
      {
        id: 7, 
        name: 'Chicken Strips', 
        price: 75, 
        image: '🍗',
        description: 'Tender chicken strips with dipping sauce',
        rating: 4.6, 
        prepTime: '12-15 min', 
        calories: 320
      },
      {
        id: 8, 
        name: 'Peri-Peri Chicken', 
        price: 95, 
        image: '🍗',
        description: 'Spicy peri-peri marinated chicken',
        rating: 4.8, 
        prepTime: '20-25 min', 
        calories: 420
      }
    ],
    wraps: [
      {
        id: 9, 
        name: 'Chicken Wrap', 
        price: 72, 
        image: '🌯',
        description: 'Grilled chicken, lettuce, tomato, mayo',
        rating: 4.4, 
        prepTime: '8-12 min', 
        calories: 380
      },
      {
        id: 10, 
        name: 'Beef Wrap', 
        price: 78, 
        image: '🌯',
        description: 'Seasoned beef strips, vegetables, sauce',
        rating: 4.5, 
        prepTime: '10-15 min', 
        calories: 420
      },
      {
        id: 11, 
        name: 'Veggie Wrap', 
        price: 65, 
        image: '🌯',
        description: 'Fresh vegetables, hummus, avocado',
        rating: 4.3, 
        prepTime: '5-8 min', 
        calories: 280
      }
    ],
    sides: [
      {
        id: 12, 
        name: 'Hand-Cut Chips', 
        price: 35, 
        image: '🍟',
        description: 'Crispy hand-cut potato chips',
        rating: 4.6, 
        prepTime: '8-10 min', 
        calories: 320
      },
      {
        id: 13, 
        name: 'Onion Rings', 
        price: 42, 
        image: '🧅',
        description: 'Golden crispy onion rings',
        rating: 4.4, 
        prepTime: '10-12 min', 
        calories: 280
      },
      {
        id: 14, 
        name: 'Coleslaw', 
        price: 28, 
        image: '🥗',
        description: 'Fresh cabbage and carrot coleslaw',
        rating: 4.2, 
        prepTime: '2-3 min', 
        calories: 120
      },
      {
        id: 15, 
        name: 'Garden Salad', 
        price: 45, 
        image: '🥗',
        description: 'Mixed greens, tomato, cucumber',
        rating: 4.5, 
        prepTime: '5-7 min', 
        calories: 80
      }
    ],
    drinks: [
      {
        id: 16, 
        name: 'Craft Cola', 
        price: 22, 
        image: '🥤',
        description: 'Premium cola drink',
        rating: 4.3, 
        prepTime: '1-2 min', 
        calories: 150
      },
      {
        id: 17, 
        name: 'Fresh Orange Juice', 
        price: 28, 
        image: '🍊',
        description: 'Freshly squeezed orange juice',
        rating: 4.7, 
        prepTime: '3-5 min', 
        calories: 110
      },
      {
        id: 18, 
        name: 'Milkshake', 
        price: 35, 
        image: '🥤',
        description: 'Chocolate, vanilla, or strawberry',
        rating: 4.8, 
        prepTime: '5-8 min', 
        calories: 280
      },
      {
        id: 19, 
        name: 'Coffee', 
        price: 18, 
        image: '☕',
        description: 'Freshly brewed coffee',
        rating: 4.5, 
        prepTime: '3-5 min', 
        calories: 5
      }
    ],
    desserts: [
      {
        id: 20, 
        name: 'Chocolate Brownie', 
        price: 45, 
        image: '🍰',
        description: 'Rich chocolate brownie with ice cream',
        rating: 4.8, 
        prepTime: '5-7 min', 
        calories: 450
      },
      {
        id: 21, 
        name: 'Ice Cream', 
        price: 32, 
        image: '🍦',
        description: 'Vanilla, chocolate, or strawberry',
        rating: 4.6, 
        prepTime: '2-3 min', 
        calories: 220
      },
      {
        id: 22, 
        name: 'Apple Pie', 
        price: 38, 
        image: '🥧',
        description: 'Homemade apple pie slice',
        rating: 4.5, 
        prepTime: '3-5 min', 
        calories: 320
      }
    ]
  };

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

  const filteredItems = searchQuery
    ? Object.values(menuItems).flat().filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : menuItems[selectedCategory] || [];

  const handleOrder = () => {
    setCurrentView('orderConfirm');
    setTimeout(() => {
      setCart([]);
      navigate('/dashboard');
    }, 3000);
  };

  // Ultra-Modern Header Component
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
                Flamme Grilled Cafe
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

  // Enhanced Search Bar
  const SearchBar = () => (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
        <input
          type="text"
          placeholder="Search delicious items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 focus:shadow-lg transition-all duration-300"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Filter className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );

  // Modern Category Tabs
  const CategoryTabs = () => (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchQuery('');
              }}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
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

  // Enhanced Menu Item Card
  const MenuItemCard = ({ item }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
              {item.popular && (
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>Popular</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
            
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
              R{item.price.toFixed(2)}
            </p>
          </div>
          
          <div className="text-4xl ml-4 bg-gray-50 rounded-2xl p-3">
            {item.image}
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

  // Enhanced Cart View
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
                  <div className="text-3xl bg-gray-50 rounded-xl p-2">{item.image}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-red-600 font-bold">R{item.price.toFixed(2)} each</p>
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
                <span className="font-bold text-lg">R{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                R{getTotalPrice().toFixed(2)}
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

  // Enhanced Checkout View
  const CheckoutView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/90 backdrop-blur-lg p-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button onClick={() => setCurrentView('cart')} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Checkout</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Type Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Order Type</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOrderType('delivery')}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                orderType === 'delivery'
                  ? 'border-red-500 bg-red-50 text-red-600 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Truck className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Delivery</span>
              <p className="text-xs text-gray-500 mt-1">25-35 min</p>
            </button>
            <button
              onClick={() => setOrderType('pickup')}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                orderType === 'pickup'
                  ? 'border-red-500 bg-red-50 text-red-600 scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Store className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Pickup</span>
              <p className="text-xs text-gray-500 mt-1">15-20 min</p>
            </button>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Your Information</h3>
          <div className="space-y-4">
            <input
              type="text" 
              placeholder="Full Name *" 
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 transition-colors"
            />
            <input
              type="tel" 
              placeholder="Phone Number *" 
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 transition-colors"
            />
            <input
              type="email" 
              placeholder="Email Address" 
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 transition-colors"
            />
            {orderType === 'delivery' && (
              <textarea
                placeholder="Delivery Address *" 
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 transition-colors"
                rows={3}
              />
            )}
            <textarea
              placeholder="Special Instructions (Optional)" 
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 transition-colors"
              rows={2}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                <span className="font-semibold">R{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span className="text-red-600">R{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={!customerInfo.name || !customerInfo.phone || (orderType === 'delivery' && !customerInfo.address)}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <CreditCard className="w-5 h-5" />
          <span>Place Order - R{getTotalPrice().toFixed(2)}</span>
        </button>
      </div>
    </div>
  );

  // Order Confirmation View
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
            R{getTotalPrice().toFixed(2)}
          </p>
        </div>
        <div className="text-sm text-gray-500 animate-pulse">
          Redirecting to your dashboard...
        </div>
      </div>
    </div>
  );

  // Main Menu View
  const MenuView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <SearchBar />
      {!searchQuery && <CategoryTabs />}
      
      <div className="p-4">
        {searchQuery && (
          <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold">Search Results for "{searchQuery}"</h2>
            <p className="text-sm text-gray-600">{filteredItems.length} items found</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
        
        {filteredItems.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No items found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Floating Cart Button */}
      {cart.length > 0 && currentView === 'menu' && (
        <button
          onClick={() => setCurrentView('cart')}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white p-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-50 transform hover:scale-110 transition-all duration-300"
        >
          <ShoppingCart className="w-6 h-6" />
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-90">{getTotalItems()} items</span>
            <span className="font-bold">R{getTotalPrice().toFixed(2)}</span>
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

export default MobileRestaurantApp;
