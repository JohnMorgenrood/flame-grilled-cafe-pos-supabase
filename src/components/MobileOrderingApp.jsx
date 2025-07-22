import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Heart,
  Star,
  Clock,
  MapPin,
  Phone,
  Search,
  User,
  Menu as MenuIcon,
  X,
  CreditCard,
  Truck,
  Store,
  LogIn,
  LogOut,
  Settings,
  Navigation,
  Shield
} from 'lucide-react';
import { FaReceipt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';
import CustomerDashboard from '../pages/CustomerDashboard';

const MobileOrderingApp = () => {
  const navigate = useNavigate();
  const { user, currentUser, signInWithGoogle, logout, loading } = useAuth();
  
  // Cart and UI State
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('deals');
  const [showCart, setShowCart] = useState(false);
  const [orderType, setOrderType] = useState('delivery');
  const [currentCurrency, setCurrentCurrency] = useState('ZAR');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  // Order and Payment State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const placeholderImage = '/images/food-placeholder.png'; // or a remote URL

  // Calculate cart total
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setOrderTotal(total);
  }, [cart]);

  // Auto-fill customer info when user is logged in
  useEffect(() => {
    if (user || currentUser) {
      setCustomerInfo({
        name: user?.displayName || currentUser?.displayName || '',
        phone: user?.phoneNumber || currentUser?.phoneNumber || '',
        email: user?.email || currentUser?.email || ''
      });
    }
  }, [user, currentUser]);

  // On page load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) setCart(savedCart);
  }, []);

  // Add to cart function
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      // On add to cart
      setCart([...cart, item]);
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart!`);
  };

  // Remove from cart function
  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === itemId) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            toast.success('Item removed from cart');
            return null;
          }
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Clear cart function
  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  // Handle place order
  const placeOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check if user is authenticated
    if (!user && !currentUser) {
      toast.error('Please sign in to place your order.');
      navigate('/signin'); // Redirect to the sign-in page
      return;
    }

    // Check if customer info is complete
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please complete your profile information');
      return;
    }

    // Open payment modal
    setShowPaymentModal(true);
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentDetails) => {
    const orderCode = `FGC-${Math.floor(1000 + Math.random() * 9000)}`;
    
    toast.success(`Payment successful! Order code: ${orderCode}`);
    setShowPaymentModal(false);
    clearCart();
    
    // Navigate to order tracking
    navigate('/customer/dashboard');
  };

  // Menu categories (your existing menu data)
  const menuCategories = [
    {
      id: 'deals',
      name: '⭐ Deals',
      color: 'bg-red-500',
      image: placeholderImage,
      items: [
        { 
          id: 1, 
          name: 'Dagwood Burger', 
          price: 89.00, 
          image: placeholderImage,
          description: 'The Old Timer - bacon, ham, cheese, egg',
          rating: 4.8,
          prepTime: '12-15 min',
          popular: true
        },
        { 
          id: 2, 
          name: 'Sunrise Surprise Wrap', 
          price: 65.00, 
          image: placeholderImage,
          description: 'Scrambled eggs, bacon, cheese & tomato',
          rating: 4.6,
          prepTime: '8-10 min',
          popular: true
        }
      ]
    },
    {
      id: 'brekkie',
      name: 'Brekkie Rolls',
      color: 'bg-orange-500',
      image: placeholderImage,
      items: [
        { 
          id: 3, 
          name: 'Egg Roll', 
          price: 24.00, 
          image: placeholderImage,
          description: 'Fresh egg in a soft roll',
          rating: 4.2,
          prepTime: '5-7 min'
        },
        { 
          id: 4, 
          name: 'Bacon Roll', 
          price: 35.00, 
          image: placeholderImage,
          description: 'Crispy bacon in a fresh roll',
          rating: 4.4,
          prepTime: '6-8 min'
        },
        { 
          id: 5, 
          name: 'Bacon & Egg Roll', 
          price: 43.00, 
          image: placeholderImage,
          description: 'Classic bacon and egg combination',
          rating: 4.5,
          prepTime: '7-9 min'
        },
        { 
          id: 6, 
          name: 'Bacon, Egg & Cheese Roll', 
          price: 49.00, 
          image: placeholderImage,
          description: 'Triple combo with melted cheese',
          rating: 4.6,
          prepTime: '8-10 min'
        },
        { 
          id: 7, 
          name: 'Bacon, Egg, Cheese & Hash Brown Roll', 
          price: 60.00, 
          image: placeholderImage,
          description: 'Ultimate breakfast roll with crispy hash brown',
          rating: 4.7,
          prepTime: '10-12 min'
        }
      ]
    },
    {
      id: 'toasted',
      name: 'Toasted Sandwiches',
      color: 'bg-yellow-500',
      image: placeholderImage,
      items: [
        { 
          id: 8, 
          name: 'Cheese', 
          price: 25.00, 
          image: placeholderImage,
          description: 'Classic melted cheese sandwich',
          rating: 4.1,
          prepTime: '4-6 min'
        },
        { 
          id: 9, 
          name: 'Cheese & Tomato', 
          price: 30.00, 
          image: placeholderImage,
          description: 'Cheese and fresh tomato',
          rating: 4.2,
          prepTime: '5-7 min'
        },
        { 
          id: 10, 
          name: 'Bacon & Cheese', 
          price: 45.00, 
          image: placeholderImage,
          description: 'Crispy bacon with melted cheese',
          rating: 4.5,
          prepTime: '6-8 min'
        },
        { 
          id: 11, 
          name: 'Bacon, Egg & Cheese', 
          price: 55.00, 
          image: placeholderImage,
          description: 'The perfect trio combination',
          rating: 4.6,
          prepTime: '7-9 min'
        },
        { 
          id: 12, 
          name: 'Chicken Mayo', 
          price: 42.00, 
          image: placeholderImage,
          description: 'Tender chicken with creamy mayo',
          rating: 4.4,
          prepTime: '6-8 min'
        },
        { 
          id: 13, 
          name: 'Ham, Cheese, Tomato, Egg & Bacon', 
          price: 68.00, 
          image: placeholderImage,
          description: 'Ultimate loaded sandwich',
          rating: 4.8,
          prepTime: '10-12 min'
        }
      ]
    },
    {
      id: 'tramezzini',
      name: 'Gourmet Tramezzini',
      color: 'bg-purple-500',
      image: placeholderImage,
      items: [
        { 
          id: 14, 
          name: 'Biltong Special', 
          price: 78.00, 
          image: placeholderImage,
          description: 'Biltong, cream cheese, peppadew, sweet chili & cheese',
          rating: 4.7,
          prepTime: '8-10 min'
        },
        { 
          id: 15, 
          name: 'Bacon & Avo', 
          price: 82.00, 
          image: placeholderImage,
          description: 'Bacon, avo, feta & sweet chili mayo',
          rating: 4.8,
          prepTime: '8-10 min'
        },
        { 
          id: 16, 
          name: 'Jalapeno Bacon', 
          price: 85.00, 
          image: placeholderImage,
          description: 'Jalapeno, bacon, cream cheese, feta, cheddar & sweet chili mayo',
          rating: 4.6,
          prepTime: '8-10 min',
          spicy: true
        },
        { 
          id: 17, 
          name: 'Grilled Chicken Supreme', 
          price: 88.00, 
          image: placeholderImage,
          description: 'Grilled chicken, jalapeno, chipotle mayo, red onion, tomato & cheese',
          rating: 4.7,
          prepTime: '10-12 min',
          spicy: true
        },
        { 
          id: 18, 
          name: 'Veggie Delight', 
          price: 75.00, 
          image: placeholderImage,
          description: 'Cream cheese, mushroom, avocado, feta, cheddar & peppadew',
          rating: 4.5,
          prepTime: '8-10 min'
        }
      ]
    },
    {
      id: 'burgers',
      name: 'Flame-Grilled Burgers',
      color: 'bg-red-600',
      image: placeholderImage,
      items: [
        { 
          id: 19, 
          name: 'Classic Burger', 
          price: 55.00, 
          image: placeholderImage,
          description: 'Flame-grilled beef patty with fresh garnish',
          rating: 4.3,
          prepTime: '12-15 min'
        },
        { 
          id: 20, 
          name: 'Cheese Burger', 
          price: 62.00, 
          image: placeholderImage,
          description: 'Classic burger with melted cheese',
          rating: 4.4,
          prepTime: '12-15 min'
        },
        { 
          id: 21, 
          name: 'Bacon & Cheese Burger', 
          price: 72.00, 
          image: placeholderImage,
          description: 'Beef patty with bacon and cheese',
          rating: 4.6,
          prepTime: '14-16 min'
        },
        { 
          id: 22, 
          name: 'Peri-Peri Burger', 
          price: 65.00, 
          image: placeholderImage,
          description: 'Spicy peri-peri flame-grilled burger',
          rating: 4.5,
          prepTime: '12-15 min',
          spicy: true
        },
        { 
          id: 23, 
          name: 'Double Bacon & Cheese', 
          price: 88.00, 
          image: placeholderImage,
          description: 'Double patty with bacon and cheese',
          rating: 4.7,
          prepTime: '16-18 min'
        }
      ]
    },
    {
      id: 'chicken',
      name: 'Chicken Burgers',
      color: 'bg-yellow-600',
      image: placeholderImage,
      items: [
        { 
          id: 24, 
          name: 'Crumbed Chicken Classic', 
          price: 52.00, 
          image: placeholderImage,
          description: 'Crispy crumbed chicken fillet',
          rating: 4.3,
          prepTime: '10-12 min'
        },
        { 
          id: 25, 
          name: 'Chicken Cheese Burger', 
          price: 58.00, 
          image: placeholderImage,
          description: 'Crumbed chicken with melted cheese',
          rating: 4.4,
          prepTime: '10-12 min'
        },
        { 
          id: 26, 
          name: 'Peri-Peri Chicken Burger', 
          price: 62.00, 
          image: placeholderImage,
          description: 'Spicy peri-peri chicken burger',
          rating: 4.5,
          prepTime: '10-12 min',
          spicy: true
        },
        { 
          id: 27, 
          name: 'Chicken Bacon & Cheese', 
          price: 68.00, 
          image: placeholderImage,
          description: 'Chicken fillet with bacon and cheese',
          rating: 4.6,
          prepTime: '12-14 min'
        }
      ]
    },
    {
      id: 'gourmet',
      name: 'Gourmet Burgers',
      color: 'bg-green-600',
      image: placeholderImage,
      items: [
        { 
          id: 28, 
          name: 'Bacon, Cheddar & Guacamole', 
          price: 95.00, 
          image: placeholderImage,
          description: 'Premium burger with fresh guacamole',
          rating: 4.8,
          prepTime: '15-18 min'
        },
        { 
          id: 29, 
          name: 'Bacon, Feta & Guacamole', 
          price: 98.00, 
          image: placeholderImage,
          description: 'Gourmet burger with feta and guacamole',
          rating: 4.7,
          prepTime: '15-18 min'
        },
        { 
          id: 30, 
          name: 'Bacon, Jalapeno & Feta', 
          price: 92.00, 
          image: placeholderImage,
          description: 'Spicy gourmet with jalapenos and feta',
          rating: 4.6,
          prepTime: '15-18 min',
          spicy: true
        }
      ]
    },
    {
      id: 'wraps',
      name: 'Wraps',
      color: 'bg-blue-500',
      image: placeholderImage,
      items: [
        { 
          id: 31, 
          name: 'Chicken Wrap', 
          price: 72.00, 
          image: placeholderImage,
          description: 'Grilled/crumbed chicken, lettuce, tomato, cucumber, onion, feta & seeds',
          rating: 4.5,
          prepTime: '8-10 min'
        },
        { 
          id: 32, 
          name: 'Veggie Wrap', 
          price: 68.00, 
          image: placeholderImage,
          description: 'Cream cheese, mushroom, feta, peppadew & avocado',
          rating: 4.3,
          prepTime: '7-9 min'
        },
        { 
          id: 33, 
          name: 'Meat Lovers Wrap', 
          price: 88.00, 
          image: placeholderImage,
          description: 'Chicken, ham, bacon, mushroom & feta',
          rating: 4.7,
          prepTime: '10-12 min'
        },
        { 
          id: 34, 
          name: 'Peri-Peri Chicken Wrap', 
          price: 82.00, 
          image: placeholderImage,
          description: 'Peri-peri chicken, feta, avocado, cream cheese, peppadew & jalapeno',
          rating: 4.6,
          prepTime: '9-11 min',
          spicy: true
        }
      ]
    },
    {
      id: 'salads',
      name: 'Salads',
      color: 'bg-green-500',
      image: placeholderImage,
      items: [
        { 
          id: 35, 
          name: 'Greek Salad', 
          price: 58.00, 
          image: placeholderImage,
          description: 'Lettuce, peppers, onion, tomato, cucumber, olives & feta',
          rating: 4.4,
          prepTime: '5-7 min'
        },
        { 
          id: 36, 
          name: 'Chicken Salad', 
          price: 72.00, 
          image: placeholderImage,
          description: 'Grilled/crumbed chicken, lettuce, tomato, onion, feta & seeds',
          rating: 4.5,
          prepTime: '7-9 min'
        },
        { 
          id: 37, 
          name: 'Chicken Caesar', 
          price: 75.00, 
          image: placeholderImage,
          description: 'Grilled chicken, cheddar, croutons, green and red pepper',
          rating: 4.6,
          prepTime: '7-9 min'
        }
      ]
    },
    {
      id: 'chips',
      name: 'Chips & Sides',
      color: 'bg-orange-600',
      image: placeholderImage,
      items: [
        { 
          id: 38, 
          name: 'Hand Cut Chips', 
          price: 28.00, 
          image: placeholderImage,
          description: 'Golden crispy hand-cut potato chips',
          rating: 4.3,
          prepTime: '6-8 min'
        },
        { 
          id: 39, 
          name: 'Bacon & Cheese Chips', 
          price: 48.00, 
          image: placeholderImage,
          description: 'Loaded chips with bacon and cheese sauce',
          rating: 4.6,
          prepTime: '8-10 min'
        },
        { 
          id: 40, 
          name: 'Bacon & Jalapeno Cheese Chips', 
          price: 55.00, 
          image: placeholderImage,
          description: 'Spicy loaded chips with jalapenos',
          rating: 4.5,
          prepTime: '8-10 min',
          spicy: true
        },
        { 
          id: 41, 
          name: 'Cheesy Russian & Chips', 
          price: 55.00, 
          image: placeholderImage,
          description: 'Traditional South African favorite with chips',
          rating: 4.4,
          prepTime: '10-12 min'
        }
      ]
    },
    {
      id: 'beverages',
      name: 'Beverages',
      color: 'bg-blue-600',
      image: placeholderImage,
      items: [
        { 
          id: 42, 
          name: 'Cappuccino', 
          price: 32.00, 
          image: placeholderImage,
          description: 'Rich coffee with steamed milk foam',
          rating: 4.4,
          prepTime: '3-5 min'
        },
        { 
          id: 43, 
          name: 'Americano', 
          price: 28.00, 
          image: placeholderImage,
          description: 'Strong black coffee',
          rating: 4.2,
          prepTime: '2-4 min'
        },
        { 
          id: 44, 
          name: 'Latte', 
          price: 35.00, 
          image: placeholderImage,
          description: 'Smooth coffee with steamed milk',
          rating: 4.5,
          prepTime: '4-6 min'
        },
        { 
          id: 45, 
          name: 'Rooibos Tea', 
          price: 22.00, 
          image: placeholderImage,
          description: 'Traditional South African red bush tea',
          rating: 4.3,
          prepTime: '3-5 min'
        },
        { 
          id: 46, 
          name: 'Regular Milkshake', 
          price: 38.00, 
          image: placeholderImage,
          description: 'Creamy milkshake in various flavors',
          rating: 4.5,
          prepTime: '4-6 min'
        },
        { 
          id: 47, 
          name: 'Soft Drink 440ml', 
          price: 25.00, 
          image: placeholderImage,
          description: 'Refreshing soft drink',
          rating: 4.1,
          prepTime: '1-2 min'
        }
      ]
    }
  ];

  const currentCategory = menuCategories.find(cat => cat.id === selectedCategory);
  const filteredItems = currentCategory?.items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/api/placeholder/40/40" 
                alt="Flamme Grilled Logo" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Flamme Grilled</h1>
                <p className="text-xs text-gray-500">Café & Restaurant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Cart Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative p-2 bg-red-500 text-white rounded-full shadow-lg"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                {user || currentUser ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full bg-gray-100"
                  >
                    <img 
                      src={user?.photoURL || currentUser?.photoURL || '/api/placeholder/32/32'} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  </motion.button>
                ) : (
                  <Link
                    to="/signin"
                    className="flex items-center space-x-2 p-2 rounded-full bg-blue-500 text-white"
                  >
                    <LogIn size={16} />
                    <span className="text-sm">Sign In</span>
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {showMenu && (user || currentUser) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.displayName || currentUser?.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || currentUser?.email}
                      </p>
                    </div>
                    <Link
                      to="/customer/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      <User size={16} className="mr-2" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                        toast.success('Signed out successfully');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {menuCategories.map((category) => (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="flex">
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{item.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{item.prepTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-red-600">
                          R{item.price.toFixed(2)}
                        </span>
                        
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(item)}
                          className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-red-600 font-bold">R{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-xl font-bold text-red-600">R{orderTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sign in to Place Order</h3>
                <p className="text-gray-600 mb-6">Please sign in to continue with your order</p>
                
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                  <span className="font-medium text-gray-700">
                    {loading ? 'Signing in...' : 'Continue with Google'}
                  </span>
                </button>
                
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="mt-4 w-full text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderTotal={orderTotal}
          onPaymentSuccess={handlePaymentSuccess}
          currency={currentCurrency}
          orderDetails={{
            items: cart,
            orderType,
            deliveryAddress,
            customerInfo
          }}
        />
      )}
    </div>
  );
};

export default MobileOrderingApp;
