import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Clock,
  CheckCircle,
  DollarSign,
  Package,
  Search,
  Filter,
  Eye,
  Plus,
  Minus,
  User,
  MapPin,
  Phone,
  CreditCard,
  Printer,
  Receipt,
  Flame,
  LogOut,
  Settings,
  BarChart3
} from 'lucide-react';

const CashierDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pos');
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderType, setOrderType] = useState('dine-in');

  // Real Flame Grilled Cafe Menu for POS
  const menuItems = [
    // Specials
    { id: 1, name: 'Bacon, Egg, Cheese & Hash Brown Brekkie Roll', price: 50, category: 'specials', image: '�', description: 'Bacon, egg, cheese and hash brown in a fresh roll', prepTime: '8-12 min', available: true },
    { id: 2, name: 'Bacon, Egg & Cheese Burger & Chips', price: 75, category: 'specials', image: '🍔', description: 'Classic breakfast burger served with crispy chips', prepTime: '12-15 min', available: true },
    { id: 3, name: 'Chicken Mayo, Cheese & Bacon Tramezzini', price: 75, category: 'specials', image: '🥪', description: 'Delicious tramezzini with chicken mayo, cheese and bacon', prepTime: '8-10 min', available: true },
    { id: 4, name: 'Crumbed Chicken Cheese Mushroom Burger', price: 70, category: 'specials', image: '🍔', description: 'Crumbed chicken with cheese and mushroom sauce', prepTime: '12-15 min', available: true },
    { id: 5, name: 'Loaded Chicken, Cheese & Bacon Fries', price: 60, category: 'specials', image: '🍟', description: 'Hand-cut fries loaded with chicken, cheese and bacon', prepTime: '10-12 min', available: true },
    
    // Brekkie Rolls
    { id: 6, name: 'Egg Roll', price: 24, category: 'brekkie', image: '🥚', description: 'Fresh egg roll', prepTime: '5-8 min', available: true },
    { id: 7, name: 'Bacon Roll', price: 35, category: 'brekkie', image: '🥓', description: 'Crispy bacon in a fresh roll', prepTime: '6-8 min', available: true },
    { id: 8, name: 'Bacon & Egg Roll', price: 43, category: 'brekkie', image: '🍳', description: 'Bacon and egg in a fresh roll', prepTime: '8-10 min', available: true },
    { id: 9, name: 'Bacon, Egg & Cheese Roll', price: 49, category: 'brekkie', image: '�', description: 'Bacon, egg and cheese in a fresh roll', prepTime: '8-10 min', available: true },
    { id: 10, name: 'Bacon, Egg, Cheese & Hash Brown Roll', price: 60, category: 'brekkie', image: '�', description: 'Complete breakfast roll with hash brown', prepTime: '10-12 min', available: true },
    
    // Sandwiches
    { id: 11, name: 'Toasted Cheese Sandwich', price: 39, category: 'sandwiches', image: '🧀', description: 'Classic toasted cheese sandwich', prepTime: '5-8 min', available: true },
    { id: 12, name: 'Toasted Cheese & Tomato Sandwich', price: 45, category: 'sandwiches', image: '🍅', description: 'Cheese and tomato toasted sandwich', prepTime: '5-8 min', available: true },
    { id: 13, name: 'Toasted Bacon & Cheese Sandwich', price: 56, category: 'sandwiches', image: '🥓', description: 'Bacon and cheese toasted sandwich', prepTime: '8-10 min', available: true },
    { id: 14, name: 'Toasted Chicken Mayonnaise Sandwich', price: 65, category: 'sandwiches', image: '🍗', description: 'Chicken mayonnaise toasted sandwich', prepTime: '8-10 min', available: true },
    { id: 15, name: 'Toasted Chicken Mayo, Cheese & Bacon Sandwich', price: 82, category: 'sandwiches', image: '🥪', description: 'Chicken mayo, cheese and bacon toasted sandwich', prepTime: '10-12 min', available: true },
    
    // Tramezzini
    { id: 16, name: 'Biltong, Cream Cheese, Peppadew & Sweet Chili Tramezzini', price: 82, category: 'tramezzini', image: '🥩', description: 'Gourmet tramezzini with biltong, cream cheese, peppadew and sweet chili', prepTime: '8-10 min', available: true },
    { id: 17, name: 'Bacon, Avo, Feta & Sweet Chili Mayo Tramezzini', price: 82, category: 'tramezzini', image: '🥓', description: 'Bacon, avocado, feta and sweet chili mayo tramezzini', prepTime: '8-10 min', available: true },
    { id: 18, name: 'Jalapeno, Bacon, Cream Cheese, Feta & Sweet Chili Mayo Tramezzini', price: 82, category: 'tramezzini', image: '🌶️', description: 'Spicy tramezzini with jalapeno, bacon, cream cheese and feta', prepTime: '8-10 min', available: true },
    { id: 19, name: 'Grilled Chicken, Bacon, Chipotle Mayo Tramezzini', price: 85, category: 'tramezzini', image: '🍗', description: 'Grilled chicken, bacon, chipotle mayo, tomato, red onion and cheese', prepTime: '10-12 min', available: true },
    
    // Burgers
    { id: 20, name: 'Classic Beef Burger', price: 66, category: 'burgers', image: '🍔', description: 'Flame grilled beef patty, lettuce, onions, tomato basted with BBQ sauce', prepTime: '12-15 min', available: true },
    { id: 21, name: 'Cheese Beef Burger', price: 75, category: 'burgers', image: '🍔', description: 'Flame grilled beef patty with cheddar cheese, lettuce, onions, tomato', prepTime: '12-15 min', available: true },
    { id: 22, name: 'Bacon & Cheese Beef Burger', price: 90, category: 'burgers', image: '🍔', description: 'Flame grilled beef patty, cheddar cheese, bacon, lettuce, onions, tomato', prepTime: '15-18 min', available: true },
    { id: 23, name: 'Dagwood Burger - Old Timer', price: 102, category: 'burgers', image: '🍔', description: 'Made on 2 slices of toast, beef patty, bacon, ham, cheese, egg, lettuce', prepTime: '18-20 min', available: true },
    { id: 24, name: 'Double Cheese Burger', price: 104, category: 'burgers', image: '🍔', description: '2 Flame grilled beef patties with cheese, lettuce, onions, tomato', prepTime: '15-18 min', available: true },
    
    // Chicken
    { id: 25, name: 'Crumbed Chicken Burger', price: 73, category: 'chicken', image: '🍗', description: 'Crumbed chicken fillet, lettuce, onions, tomato with tangy mayo', prepTime: '12-15 min', available: true },
    { id: 26, name: 'Crumbed Chicken Cheese Burger', price: 80, category: 'chicken', image: '🍗', description: 'Crumbed chicken fillet with cheese, lettuce, onions, tomato', prepTime: '12-15 min', available: true },
    { id: 27, name: 'Crumbed Chicken Cheese & Bacon Burger', price: 98, category: 'chicken', image: '🍗', description: 'Crumbed chicken fillet, cheese, bacon, lettuce, onions, tomato', prepTime: '15-18 min', available: true },
    { id: 28, name: 'Chicken Schnitzel', price: 89, category: 'chicken', image: '🍗', description: 'Chicken schnitzel with chips or salad', prepTime: '15-18 min', available: true },
    { id: 29, name: 'Crumbed Chicken Strips', price: 69, category: 'chicken', image: '🍗', description: 'Crumbed chicken strips with chips', prepTime: '12-15 min', available: true },
    
    // Wraps
    { id: 30, name: 'Sunrise Surprise Wrap', price: 60, category: 'wraps', image: '🌯', description: 'Scrambled eggs, bacon, cheese and tomato', prepTime: '8-10 min', available: true },
    { id: 31, name: 'Sunshine Brekkie Wrap', price: 78, category: 'wraps', image: '�', description: 'Scrambled eggs, bacon, cheddar, tomato, feta and avocado', prepTime: '10-12 min', available: true },
    { id: 32, name: 'Chicken Wrap', price: 72, category: 'wraps', image: '🌯', description: 'Grilled/crumbed chicken, lettuce, tomato, cucumber, red onion, feta', prepTime: '10-12 min', available: true },
    { id: 33, name: 'Peri-Peri Chicken, Feta, Avocado Wrap', price: 94, category: 'wraps', image: '🌯', description: 'Peri-peri chicken, feta, avocado, cream cheese, peppadew and jalapeno', prepTime: '12-15 min', available: true },
    
    // Salads
    { id: 34, name: 'Greek Salad', price: 69, category: 'salads', image: '🥗', description: 'Lettuce, peppers, red onion, tomato, cucumber, olives and feta', prepTime: '5-8 min', available: true },
    { id: 35, name: 'Chicken Salad', price: 80, category: 'salads', image: '🥗', description: 'Grilled/crumbed chicken, lettuce, tomato, red onion, feta and seeds', prepTime: '8-10 min', available: true },
    { id: 36, name: 'Bacon, Avo & Feta Salad', price: 85, category: 'salads', image: '🥗', description: 'Bacon, lettuce, tomato, red onion, peppadew and seeds', prepTime: '8-10 min', available: true },
    { id: 37, name: 'Chicken Caesar Salad', price: 99, category: 'salads', image: '🥗', description: 'Grilled chicken, cheddar cheese, croutons, caesar dressing', prepTime: '10-12 min', available: true },
    
    // Chips & Sides
    { id: 38, name: 'Hand Cut Chips', price: 37, category: 'chips', image: '🍟', description: 'Crispy hand-cut potato chips', prepTime: '8-10 min', available: true },
    { id: 39, name: 'Bacon & Cheese Chips', price: 53, category: 'chips', image: '🍟', description: 'Hand-cut chips with bacon and cheese sauce', prepTime: '10-12 min', available: true },
    { id: 40, name: 'Bacon & Mushroom Chips', price: 53, category: 'chips', image: '🍟', description: 'Hand-cut chips with bacon and mushroom sauce', prepTime: '10-12 min', available: true },
    
    // Beverages
    { id: 41, name: 'Americano', price: 20, category: 'beverages', image: '☕', description: 'Classic black coffee', prepTime: '3-5 min', available: true },
    { id: 42, name: 'Cappuccino', price: 20, category: 'beverages', image: '☕', description: 'Espresso with steamed milk and foam', prepTime: '3-5 min', available: true },
    { id: 43, name: 'Latte', price: 22, category: 'beverages', image: '☕', description: 'Espresso with steamed milk', prepTime: '3-5 min', available: true },
    { id: 44, name: 'Chocolate Milkshake', price: 35, category: 'beverages', image: '🥤', description: 'Rich chocolate milkshake', prepTime: '3-5 min', available: true },
    { id: 45, name: 'Vanilla Milkshake', price: 35, category: 'beverages', image: '🥤', description: 'Creamy vanilla milkshake', prepTime: '3-5 min', available: true },
    { id: 46, name: 'Strawberry Milkshake', price: 35, category: 'beverages', image: '🥤', description: 'Fresh strawberry milkshake', prepTime: '3-5 min', available: true }
  ];

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'specials', name: '⭐ Specials', icon: '⭐' },
    { id: 'brekkie', name: 'Brekkie Rolls', icon: '🥓' },
    { id: 'sandwiches', name: 'Sandwiches', icon: '🍞' },
    { id: 'tramezzini', name: 'Tramezzini', icon: '🥪' },
    { id: 'burgers', name: 'Burgers', icon: '🍔' },
    { id: 'chicken', name: 'Chicken', icon: '🍗' },
    { id: 'wraps', name: 'Wraps', icon: '🌯' },
    { id: 'salads', name: 'Salads', icon: '🥗' },
    { id: 'chips', name: 'Chips', icon: '🍟' },
    { id: 'beverages', name: 'Beverages', icon: '☕' }
  ];

  // Sample active orders
  const [activeOrders] = useState([
    {
      id: 'ORD-001',
      items: [
        { name: 'Flame-Grilled Beef Burger', quantity: 2, price: 95 },
        { name: 'Hand-Cut Chips', quantity: 1, price: 35 }
      ],
      total: 225,
      status: 'preparing',
      orderTime: '14:25',
      estimatedTime: '15:30',
      orderType: 'dine-in',
      table: 'Table 5'
    },
    {
      id: 'ORD-002',
      items: [
        { name: 'Chicken Burger Deluxe', quantity: 1, price: 89 },
        { name: 'Soft Drink', quantity: 1, price: 25 }
      ],
      total: 114,
      status: 'ready',
      orderTime: '14:20',
      estimatedTime: '14:35',
      orderType: 'takeaway',
      customer: 'John Smith'
    }
  ]);

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
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processOrder = () => {
    if (cart.length === 0) return;
    
    const orderId = `ORD-${String(Date.now()).slice(-3)}`;
    const newOrder = {
      id: orderId,
      items: cart,
      total: calculateTotal(),
      status: 'preparing',
      orderTime: new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      orderType,
      timestamp: Date.now()
    };
    
    setCurrentOrder(newOrder);
    setCart([]);
    
    // Simulate order processing
    setTimeout(() => {
      alert(`Order ${orderId} sent to kitchen!`);
      setCurrentOrder(null);
    }, 2000);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && item.available;
  });

  // Header Component
  const Header = () => (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Cashier POS</h1>
                <p className="text-sm text-gray-300">Flame Grilled Cafe</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-gray-300">Today's Sales</p>
              <p className="text-lg font-bold">R1,250</p>
            </div>
            <button className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // POS System Tab
  const POSTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Menu Items */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search and Category Filter */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-medium whitespace-nowrap transition-all duration-300 min-w-max ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{item.image}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-red-600">R{item.price}</span>
                  <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-300">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart and Order Summary */}
      <div className="space-y-6">
        {/* Order Type Selection */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Order Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {['dine-in', 'takeaway'].map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`p-3 rounded-2xl font-medium transition-all duration-300 ${
                  orderType === type
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'dine-in' ? '🍽️ Dine In' : '🥡 Takeaway'}
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Current Order</h3>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No items in cart</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-600">R{item.price} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }}
                      className="bg-red-100 text-red-600 p-1 rounded-lg hover:bg-red-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="bg-green-100 text-green-600 p-1 rounded-lg hover:bg-green-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-red-600">R{calculateTotal()}</span>
              </div>
              <button
                onClick={processOrder}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Process Order</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Orders Tab
  const OrdersTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Active Orders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((order) => (
            <div key={order.id} className="bg-gray-50 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-lg">{order.id}</h4>
                  <p className="text-sm text-gray-600">
                    {order.orderType === 'dine-in' ? order.table : order.customer}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'ready' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {order.status === 'ready' ? '✅ Ready' : '🔥 Preparing'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>R{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>Ordered: {order.orderTime}</p>
                  <p>Est: {order.estimatedTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">R{order.total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
              { id: 'orders', label: 'Active Orders', icon: Clock },
              { id: 'reports', label: 'Daily Reports', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'pos' && <POSTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'reports' && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Reports</h3>
            <p className="text-gray-600">Reporting features coming soon...</p>
          </div>
        )}
      </div>

      {/* Order Processing Modal */}
      {currentOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-bold mb-2">Processing Order</h3>
            <p className="text-gray-600 mb-4">Order {currentOrder.id}</p>
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDashboard;
