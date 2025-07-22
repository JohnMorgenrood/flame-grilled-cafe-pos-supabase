import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RestaurantHomepage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('burgers');

  const menuCategories = [
    { id: 'burgers', name: 'Burgers', icon: '🍔' },
    { id: 'chicken', name: 'Chicken', icon: '🍗' },
    { id: 'sides', name: 'Sides', icon: '🍟' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' }
  ];

  const menuItems = {
    burgers: [
      {
        id: 'burger-1',
        name: 'Flame-Grilled Beef Burger',
        description: 'Juicy beef patty flame-grilled to perfection with fresh lettuce, tomato, and our signature sauce',
        price: 89,
        image: '🍔',
        popular: true
      },
      {
        id: 'burger-2',
        name: 'Chicken Deluxe Burger',
        description: 'Tender grilled chicken breast with bacon, cheese, and crispy onions',
        price: 85,
        image: '🍔',
        popular: false
      },
      {
        id: 'burger-3',
        name: 'Veggie Garden Burger',
        description: 'Plant-based patty with fresh vegetables and avocado',
        price: 75,
        image: '🍔',
        popular: false
      }
    ],
    chicken: [
      {
        id: 'chicken-1',
        name: 'Flame-Grilled Chicken Pieces',
        description: '4 pieces of tender flame-grilled chicken with herbs and spices',
        price: 65,
        image: '🍗',
        popular: true
      },
      {
        id: 'chicken-2',
        name: 'Chicken Wings (6 pieces)',
        description: 'Spicy buffalo wings with blue cheese dip',
        price: 55,
        image: '🍗',
        popular: false
      }
    ],
    sides: [
      {
        id: 'side-1',
        name: 'Truffle Hand-Cut Chips',
        description: 'Crispy golden chips with truffle oil and parmesan',
        price: 35,
        image: '🍟',
        popular: true
      },
      {
        id: 'side-2',
        name: 'Onion Rings',
        description: 'Crispy beer-battered onion rings',
        price: 28,
        image: '🧅',
        popular: false
      }
    ],
    drinks: [
      {
        id: 'drink-1',
        name: 'Craft Cola',
        description: 'Artisanal cola made with real sugar',
        price: 22,
        image: '🥤',
        popular: true
      },
      {
        id: 'drink-2',
        name: 'Fresh Lemonade',
        description: 'Freshly squeezed lemon juice with mint',
        price: 25,
        image: '🍋',
        popular: false
      }
    ],
    desserts: [
      {
        id: 'dessert-1',
        name: 'Chocolate Brownie',
        description: 'Warm chocolate brownie with vanilla ice cream',
        price: 45,
        image: '🍫',
        popular: true
      }
    ]
  };

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

  const formatPrice = (price) => `R${price.toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🔥</span>
                <h1 className="text-xl font-bold text-gray-900">Flammed Grilled Cafe</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Orders
              </button>
              <div className="relative">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                  <span>🛒</span>
                  <span>Cart ({cart.length})</span>
                  {cart.length > 0 && (
                    <span className="bg-red-800 text-white text-xs px-2 py-1 rounded-full">
                      {formatPrice(getTotalPrice())}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu Categories</h2>
              <nav className="space-y-2">
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
                      activeCategory === category.id
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {menuCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              <p className="text-gray-600">Choose from our delicious selection</p>
            </div>

            <div className="space-y-6">
              {menuItems[activeCategory]?.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                            {item.popular && (
                              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <p className="text-2xl font-bold text-gray-900">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span>+</span>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Order</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🛒</div>
                  <p className="text-gray-500 text-sm">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">{item.image}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-gray-600 text-xs">{formatPrice(item.price)} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-gray-900">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-3 rounded-lg font-medium transition-all duration-200">
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHomepage;
