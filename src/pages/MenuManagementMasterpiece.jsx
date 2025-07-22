import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Edit3, Trash2, Save, X, Upload, Award, Flame, Star, 
  DollarSign, Image as ImageIcon, Eye, EyeOff, Copy, Download, RefreshCw,
  Search, Filter, Grid, List, Zap, TrendingUp, Clock, Users, Heart,
  CheckCircle, AlertCircle, Info, Settings, Camera, Palette, Tags
} from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const MenuManagementMasterpiece = () => {
  // === STATE MANAGEMENT ===
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('specials');
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('name'); // name, price, category, created
  const [filterBy, setFilterBy] = useState('all'); // all, visible, hidden, popular
  const [showStats, setShowStats] = useState(true);
  const [notification, setNotification] = useState(null);
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'specials',
    image: '🍔',
    imageUrl: '',
    popular: false,
    visible: true,
    prepTime: '',
    calories: '',
    spicy: false,
    vegetarian: false,
    tags: []
  });

  // === CATEGORIES WITH ENHANCED DATA ===
  const categories = [
    { 
      id: 'specials', 
      name: '⭐ Today\'s Specials', 
      icon: '⭐', 
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Chef\'s special recommendations'
    },
    { 
      id: 'brekkie', 
      name: '🥓 Breakfast Rolls', 
      icon: '🥓', 
      gradient: 'from-orange-500 to-red-500',
      description: 'Fresh morning delights'
    },
    { 
      id: 'sandwiches', 
      name: '🍞 Gourmet Sandwiches', 
      icon: '🍞', 
      gradient: 'from-amber-500 to-orange-500',
      description: 'Artisanal sandwich creations'
    },
    { 
      id: 'tramezzini', 
      name: '🥪 Premium Tramezzini', 
      icon: '🥪', 
      gradient: 'from-green-500 to-teal-500',
      description: 'Italian-style perfection'
    },
    { 
      id: 'burgers', 
      name: '🍔 Flame Grilled Burgers', 
      icon: '🍔', 
      gradient: 'from-red-500 to-orange-500',
      description: 'Signature flame-grilled classics'
    },
    { 
      id: 'chicken', 
      name: '🍗 Chicken Specialties', 
      icon: '🍗', 
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Tender chicken perfection'
    },
    { 
      id: 'wraps', 
      name: '🌯 Fresh Wraps', 
      icon: '🌯', 
      gradient: 'from-purple-500 to-pink-500',
      description: 'Healthy wrap options'
    },
    { 
      id: 'salads', 
      name: '🥗 Garden Salads', 
      icon: '🥗', 
      gradient: 'from-green-500 to-emerald-500',
      description: 'Fresh garden selections'
    },
    { 
      id: 'chips', 
      name: '🍟 Hand Cut Chips', 
      icon: '🍟', 
      gradient: 'from-amber-500 to-orange-500',
      description: 'Crispy golden perfection'
    },
    { 
      id: 'beverages', 
      name: '☕ Beverages', 
      icon: '☕', 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Refreshing drink selections'
    }
  ];

  // === FIREBASE OPERATIONS ===
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'menu'), (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      }));
      setMenuItems(items);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching menu:', error);
      showNotification('Error loading menu items', 'error');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // === UTILITY FUNCTIONS ===
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: selectedCategory,
      image: '🍔',
      imageUrl: '',
      popular: false,
      visible: true,
      prepTime: '',
      calories: '',
      spicy: false,
      vegetarian: false,
      tags: []
    });
  };

  // === ITEM OPERATIONS ===
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      showNotification('Please fill in required fields', 'error');
      return;
    }

    try {
      const itemData = {
        ...newItem,
        price: parseFloat(newItem.price),
        calories: newItem.calories ? parseInt(newItem.calories) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'menu'), itemData);
      showNotification(`${newItem.name} added successfully!`, 'success');
      resetForm();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding item:', error);
      showNotification('Failed to add item', 'error');
    }
  };

  const handleUpdateItem = async (item) => {
    try {
      const itemData = {
        ...item,
        price: parseFloat(item.price),
        calories: item.calories ? parseInt(item.calories) : null,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'menu', item.id), itemData);
      showNotification(`${item.name} updated successfully!`, 'success');
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('Failed to update item', 'error');
    }
  };

  const handleDeleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'menu', item.id));
        showNotification(`${item.name} deleted successfully`, 'success');
      } catch (error) {
        console.error('Error deleting item:', error);
        showNotification('Failed to delete item', 'error');
      }
    }
  };

  const handleToggleVisibility = async (item) => {
    try {
      await updateDoc(doc(db, 'menu', item.id), {
        visible: !item.visible,
        updatedAt: new Date()
      });
      showNotification(`${item.name} ${item.visible ? 'hidden' : 'shown'} successfully`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showNotification('Failed to update visibility', 'error');
    }
  };

  const handleTogglePopular = async (item) => {
    try {
      await updateDoc(doc(db, 'menu', item.id), {
        popular: !item.popular,
        updatedAt: new Date()
      });
      showNotification(`${item.name} ${item.popular ? 'removed from' : 'added to'} popular items`, 'success');
    } catch (error) {
      console.error('Error toggling popular:', error);
      showNotification('Failed to update popular status', 'error');
    }
  };

  const duplicateItem = async (item) => {
    try {
      const duplicatedItem = {
        ...item,
        name: `${item.name} (Copy)`,
        id: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      delete duplicatedItem.id;

      await addDoc(collection(db, 'menu'), duplicatedItem);
      showNotification(`${item.name} duplicated successfully!`, 'success');
    } catch (error) {
      console.error('Error duplicating item:', error);
      showNotification('Failed to duplicate item', 'error');
    }
  };

  // === FILTERING AND SORTING ===
  const getFilteredAndSortedItems = () => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    switch (filterBy) {
      case 'visible':
        filtered = filtered.filter(item => item.visible !== false);
        break;
      case 'hidden':
        filtered = filtered.filter(item => item.visible === false);
        break;
      case 'popular':
        filtered = filtered.filter(item => item.popular === true);
        break;
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredItems = getFilteredAndSortedItems();

  // === STATISTICS ===
  const getStats = () => {
    const total = menuItems.length;
    const visible = menuItems.filter(item => item.visible !== false).length;
    const hidden = menuItems.filter(item => item.visible === false).length;
    const popular = menuItems.filter(item => item.popular === true).length;
    const avgPrice = menuItems.length > 0 
      ? (menuItems.reduce((sum, item) => sum + (item.price || 0), 0) / menuItems.length).toFixed(2)
      : '0.00';

    return { total, visible, hidden, popular, avgPrice };
  };

  const stats = getStats();

  // === COMPONENTS ===
  
  // Notification Component
  const Notification = () => {
    if (!notification) return null;

    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      info: Info
    };

    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };

    const Icon = icons[notification.type];

    return (
      <div className={`fixed top-4 right-4 z-50 ${colors[notification.type]} text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 animate-slide-in`}>
        <Icon className="w-5 h-5" />
        <span>{notification.message}</span>
        <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 rounded p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Header Component
  const Header = () => (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/admin"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Menu Management System</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Professional Restaurant Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Stats Bar Component
  const StatsBar = () => {
    if (!showStats) return null;

    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs opacity-90">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.visible}</div>
              <div className="text-xs opacity-90">Visible</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.hidden}</div>
              <div className="text-xs opacity-90">Hidden</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.popular}</div>
              <div className="text-xs opacity-90">Popular</div>
            </div>
            <div>
              <div className="text-2xl font-bold">R{stats.avgPrice}</div>
              <div className="text-xs opacity-90">Avg Price</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Category Tabs Component
  const CategoryTabs = () => (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 min-w-max ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-base">🍽️</span>
            <span className="font-medium text-sm">All Categories</span>
            <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{menuItems.length}</span>
          </button>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const categoryCount = menuItems.filter(item => item.category === category.id).length;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 min-w-max ${
                  isSelected
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span className="font-medium text-sm">{category.name}</span>
                {categoryCount > 0 && (
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{categoryCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Controls Bar Component
  const ControlsBar = () => (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Items</option>
              <option value="visible">Visible Only</option>
              <option value="hidden">Hidden Only</option>
              <option value="popular">Popular Only</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
              <option value="created">Sort by Date</option>
            </select>
            
            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500'} rounded-l-lg transition-colors`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500'} rounded-r-lg transition-colors`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Menu Item Card Component
  const EnhancedMenuItemCard = ({ item }) => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col relative group">
      {/* Admin Controls Overlay */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => handleToggleVisibility(item)}
              className={`${item.visible === false ? 'bg-gray-500' : 'bg-green-500'} hover:opacity-80 text-white p-2 rounded-full shadow-lg transition-colors`}
              title={item.visible === false ? 'Show Item' : 'Hide Item'}
            >
              {item.visible === false ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
            <button
              onClick={() => handleTogglePopular(item)}
              className={`${item.popular ? 'bg-yellow-500' : 'bg-gray-400'} hover:opacity-80 text-white p-2 rounded-full shadow-lg transition-colors`}
              title={item.popular ? 'Remove from Popular' : 'Mark as Popular'}
            >
              <Star className="w-3 h-3" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditingItem(item)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
              title="Edit Item"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button
              onClick={() => duplicateItem(item)}
              className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow-lg transition-colors"
              title="Duplicate Item"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleDeleteItem(item)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
              title="Delete Item"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
        {item.popular && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            <span>Popular</span>
          </div>
        )}
        {item.visible === false && (
          <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center space-x-1 shadow-lg">
            <EyeOff className="w-3 h-3" />
            <span>Hidden</span>
          </div>
        )}
        {item.vegetarian && (
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            🌱 Veg
          </div>
        )}
        {item.spicy && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            🌶️ Spicy
          </div>
        )}
      </div>

      {/* Food Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="food-emoji text-6xl lg:text-8xl transform hover:scale-110 transition-transform duration-300">
            {item.image}
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg lg:text-xl mb-2 line-clamp-2">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          
          {/* Enhanced info */}
          <div className="flex items-center space-x-2 mb-3 flex-wrap gap-1">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {categories.find(cat => cat.id === item.category)?.name || item.category}
            </span>
            {item.prepTime && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{item.prepTime}</span>
              </span>
            )}
            {item.calories && (
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                {item.calories} cal
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xl lg:text-2xl font-bold text-green-600">
            R{item.price?.toFixed(2)}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              ID: {item.id.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced Edit Modal Component
  const EnhancedEditModal = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      ...item,
      prepTime: item.prepTime || '',
      calories: item.calories || '',
      spicy: item.spicy || false,
      vegetarian: item.vegetarian || false,
      tags: item.tags || []
    });
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    const emojiOptions = ['🍔', '🍕', '🌭', '🥙', '🌮', '🍟', '🍗', '🥓', '🍖', '🥩', '🍞', '🥪', '🥗', '🍝', '🍜', '🍲', '🍛', '🍱', '🍣', '🍤', '🍰', '🧁', '🍪', '🍩', '☕', '🥤', '🍺', '🍷', '🥛'];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Menu Item</h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (R) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe this delicious item..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prep Time</label>
                  <input
                    type="text"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({...formData, prepTime: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10-15 min"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Emoji</label>
                <div className="grid grid-cols-10 gap-2 mb-3">
                  {emojiOptions.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({...formData, image: emoji})}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                        formData.image === emoji ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl"
                  placeholder="🍔"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calories (optional)</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 450"
                  />
                </div>

                <div className="flex flex-col space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.vegetarian}
                        onChange={(e) => setFormData({...formData, vegetarian: e.target.checked})}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm">🌱 Vegetarian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.spicy}
                        onChange={(e) => setFormData({...formData, spicy: e.target.checked})}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm">🌶️ Spicy</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.popular}
                        onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="text-sm">⭐ Popular</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.visible !== false}
                        onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">👁️ Visible</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-lg transition-all font-medium flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <Flame className="w-16 h-16 text-orange-500 animate-pulse mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Menu</h2>
            <p className="text-gray-600">Preparing your restaurant management system...</p>
            <div className="mt-4 flex justify-center">
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === MAIN RENDER ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Notification />
      <Header />
      <StatsBar />
      <CategoryTabs />
      <ControlsBar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCategory === 'all' 
                  ? 'All Menu Items' 
                  : categories.find(cat => cat.id === selectedCategory)?.name || 'Menu Items'
                }
              </h2>
              <p className="text-gray-600">
                {filteredItems.length} items 
                {searchQuery && ` matching "${searchQuery}"`}
                {filterBy !== 'all' && ` (${filterBy} items only)`}
              </p>
            </div>
          </div>
        </div>

        {/* Items Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <EnhancedMenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{item.image}</div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xl font-bold text-green-600">R{item.price?.toFixed(2)}</span>
                        {item.popular && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        {item.visible === false && <EyeOff className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-8xl mb-6">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchQuery ? 'No items found' : 'No items in this category'}
              </h3>
              <p className="text-gray-600 mb-8">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters'
                  : 'Add your first item to get started!'
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl flex items-center space-x-3 mx-auto transition-all shadow-lg transform hover:scale-105"
                >
                  <Plus className="w-6 h-6" />
                  <span className="font-medium">Add First Item</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EnhancedEditModal
          item={editingItem}
          onSave={handleUpdateItem}
          onCancel={() => setEditingItem(null)}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <EnhancedEditModal
          item={newItem}
          onSave={handleAddItem}
          onCancel={() => {
            setShowAddModal(false);
            resetForm();
          }}
        />
      )}
    </div>
  );
};

export default MenuManagementMasterpiece;
