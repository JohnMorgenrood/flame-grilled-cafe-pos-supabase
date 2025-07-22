import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoriesContext';
import { useOrders } from '../context/OrdersContext';
import { useMessaging } from '../context/MessagingContext';
import { useInventory } from '../contexts/InventoryContext';
import { useSettings } from '../contexts/SettingsContext';
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Clock,
  Star,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Upload,
  Flame,
  MessageCircle,
  Send,
  Mail,
  Smartphone,
  Target,
  Calendar,
  CheckCircle,
  PackageX,
  Cog,
  Phone,
  MapPin,
  UserCheck2
} from 'lucide-react';

const AdminDashboard = () => {
  console.log('AdminDashboard component rendering...');
  const navigate = useNavigate();
  
  // Context hooks with error handling
  let categories, addCategory, updateCategory, deleteCategory;
  let orders = [];
  let messages = [], sendBulkMessage, updateCustomerContacts, customerContacts = [];
  let stockAlerts = [], dismissAlert;
  let settings = {}, staff = [], getStaffOnDuty = () => [];
  
  try {
    console.log('Loading categories context...');
    const categoriesContext = useCategories();
    categories = categoriesContext.categories;
    addCategory = categoriesContext.addCategory;
    updateCategory = categoriesContext.updateCategory;
    deleteCategory = categoriesContext.deleteCategory;
    console.log('Categories loaded:', categories);
  } catch (error) {
    console.error('Categories context error:', error);
    categories = [];
    addCategory = () => {};
    updateCategory = () => {};
    deleteCategory = () => {};
  }
  
  try {
    const ordersContext = useOrders();
    orders = ordersContext.orders || [];
  } catch (error) {
    console.error('Orders context error:', error);
  }
  
  try {
    const messagingContext = useMessaging();
    messages = messagingContext.messages || [];
    sendBulkMessage = messagingContext.sendBulkMessage || (() => {});
    updateCustomerContacts = messagingContext.updateCustomerContacts || (() => {});
    customerContacts = messagingContext.customerContacts || [];
  } catch (error) {
    console.error('Messaging context error:', error);
  }
  
  try {
    const inventoryContext = useInventory();
    stockAlerts = inventoryContext.stockAlerts || [];
    dismissAlert = inventoryContext.dismissAlert || (() => {});
  } catch (error) {
    console.error('Inventory context error:', error);
  }
  
  try {
    const settingsContext = useSettings();
    settings = settingsContext.settings || {};
    staff = settingsContext.staff || [];
    getStaffOnDuty = settingsContext.getStaffOnDuty || (() => []);
  } catch (error) {
    console.error('Settings context error:', error);
    settings = {
      restaurant: {
        name: 'Flame Grilled Cafe',
        address: '123 Main Street, Cape Town',
        phone: '+27 21 123 4567'
      },
      operatingHours: {
        monday: { open: '09:00', close: '22:00', closed: false }
      }
    };
  }
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    description: '',
    category: 'burgers',
    image: '🍔',
    imageFile: null,
    imageUrl: '',
    calories: '',
    prepTime: ''
  });

  // Categories management state
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    icon: '🍽️',
    gradient: 'from-gray-500 to-gray-600'
  });

  // Messaging state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState({
    title: '',
    message: '',
    type: 'promotional', // promotional, notification, alert
    targetAudience: 'all', // all, recent, vip
    scheduledFor: '',
    includeOffer: false,
    offerDetails: ''
  });
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Update customer contacts when orders change
  React.useEffect(() => {
    if (orders.length > 0) {
      updateCustomerContacts(orders);
    }
  }, [orders, updateCustomerContacts]);

  // Sample menu data that can be edited
  const [menuItems, setMenuItems] = useState([
    { 
      id: 1, 
      name: 'Flame-Grilled Beef Burger', 
      price: 95, 
      category: 'burgers',
      image: '🍔',
      displayImage: '🍔',
      description: 'Juicy beef patty with flame-grilled flavor, lettuce, tomato, onion', 
      popular: true,
      rating: 4.8,
      prepTime: '15-20 min',
      calories: 550,
      sales: 156,
      active: true
    },
    { 
      id: 2, 
      name: 'Chicken Burger Deluxe', 
      price: 89, 
      category: 'burgers',
      image: '🍔',
      displayImage: '🍔',
      description: 'Grilled chicken breast, mayo, lettuce, tomato',
      rating: 4.6,
      prepTime: '12-15 min',
      calories: 480,
      sales: 132,
      active: true
    },
    { 
      id: 5, 
      name: 'Flame-Grilled Half Chicken', 
      price: 85, 
      category: 'chicken',
      image: '🍗',
      displayImage: '🍗',
      description: 'Marinated half chicken, flame-grilled to perfection', 
      popular: true,
      rating: 4.9,
      prepTime: '25-30 min',
      calories: 450,
      sales: 89,
      active: true
    },
    { 
      id: 12, 
      name: 'Hand-Cut Chips', 
      price: 35, 
      category: 'sides',
      image: '🍟',
      displayImage: '🍟',
      description: 'Crispy hand-cut potato chips',
      rating: 4.6,
      prepTime: '8-10 min',
      calories: 320,
      sales: 203,
      active: true
    }
  ]);

  // Analytics data
  const analytics = {
    totalRevenue: 15750,
    totalOrders: 342,
    averageOrder: 87.50,
    totalCustomers: 156,
    popularItems: 4,
    activeItems: menuItems.filter(item => item.active).length
  };

  const handleEditItem = (item) => {
    setEditingItem({ 
      ...item,
      imageFile: null,
      imageUrl: item.displayImage && item.displayImage.startsWith('data:') ? item.displayImage : ''
    });
  };

  // Handle image upload for editing
  const handleEditImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      setEditingItem({...editingItem, imageFile: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditingItem(prev => ({...prev, imageUrl: e.target.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image for editing
  const removeEditImageUpload = () => {
    setEditingItem({
      ...editingItem, 
      imageFile: null, 
      imageUrl: '',
      image: editingItem.image || '🍔'
    });
  };

  const handleSaveEdit = () => {
    setMenuItems(menuItems.map(item => 
      item.id === editingItem.id ? {
        ...editingItem,
        displayImage: editingItem.imageUrl || editingItem.image
      } : item
    ));
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const handleAddItem = () => {
    const id = Math.max(...menuItems.map(item => item.id)) + 1;
    setMenuItems([...menuItems, {
      ...newItem,
      id,
      price: parseFloat(newItem.price),
      calories: parseInt(newItem.calories),
      rating: 4.0,
      sales: 0,
      active: true,
      popular: false,
      // Use imageUrl if provided, otherwise use emoji
      displayImage: newItem.imageUrl || newItem.image
    }]);
    setNewItem({
      name: '',
      price: '',
      description: '',
      category: 'burgers',
      image: '🍔',
      imageFile: null,
      imageUrl: '',
      calories: '',
      prepTime: ''
    });
    setShowAddModal(false);
  };

  // Handle image file selection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      setNewItem({...newItem, imageFile: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItem(prev => ({...prev, imageUrl: e.target.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const removeUploadedImage = () => {
    setNewItem({
      ...newItem, 
      imageFile: null, 
      imageUrl: '',
      image: '🍔'
    });
  };

  const toggleItemStatus = (id) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, active: !item.active } : item
    ));
  };

  // Category management functions
  const handleAddCategory = () => {
    if (newCategory.name && newCategory.id) {
      addCategory({ ...newCategory });
      setNewCategory({
        id: '',
        name: '',
        icon: '🍽️',
        gradient: 'from-gray-500 to-gray-600'
      });
      setShowAddCategoryModal(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleSaveCategory = () => {
    updateCategory(editingCategory.id, editingCategory);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId) => {
    const success = deleteCategory(categoryId);
    if (success) {
      // Also remove any menu items from this category
      setMenuItems(menuItems.filter(item => item.category !== categoryId));
    }
  };

  const availableGradients = [
    'from-red-500 to-orange-500',
    'from-yellow-500 to-orange-500', 
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-gray-500 to-gray-600'
  ];

  const availableIcons = ['🍔', '🍗', '🍟', '🥤', '🌯', '🍰', '🥗', '🍕', '🌮', '🍜', '🍣', '🥙', '🍽️'];

  // Messaging functions
  const handleSendMessage = async () => {
    if (!newMessage.title || !newMessage.message) return;
    
    setIsSendingMessage(true);
    
    try {
      let recipients = [];
      
      // Filter recipients based on target audience
      switch (newMessage.targetAudience) {
        case 'all':
          recipients = customerContacts;
          break;
        case 'recent':
          // Customers who ordered in last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          recipients = customerContacts.filter(customer => 
            new Date(customer.lastOrder) > thirtyDaysAgo
          );
          break;
        case 'vip':
          // Customers with 5+ orders or spent 500+ total
          recipients = customerContacts.filter(customer => 
            customer.totalOrders >= 5 || customer.totalSpent >= 500
          );
          break;
        default:
          recipients = customerContacts;
      }
      
      const messageData = {
        ...newMessage,
        recipients: recipients.map(c => ({
          name: c.name,
          phone: c.phone,
          email: c.email
        })),
        recipientCount: recipients.length,
        // Firebase: Will be sent via FCM and stored in Firestore
        fcmTopic: `audience_${newMessage.targetAudience}`,
        firebaseReady: true
      };
      
      const result = await sendBulkMessage(messageData);
      
      if (result.success) {
        // Reset form
        setNewMessage({
          title: '',
          message: '',
          type: 'promotional',
          targetAudience: 'all',
          scheduledFor: '',
          includeOffer: false,
          offerDetails: ''
        });
        setShowMessageModal(false);
        alert(`Message sent successfully to ${recipients.length} customers!`);
      } else {
        alert('Failed to send message: ' + result.error);
      }
    } catch (error) {
      console.error('Message sending error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getAudienceCount = (audience) => {
    switch (audience) {
      case 'all':
        return customerContacts.length;
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return customerContacts.filter(customer => 
          new Date(customer.lastOrder) > thirtyDaysAgo
        ).length;
      case 'vip':
        return customerContacts.filter(customer => 
          customer.totalOrders >= 5 || customer.totalSpent >= 500
        ).length;
      default:
        return 0;
    }
  };

  // Header Component
  const Header = () => (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
      <div className="relative p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">Flame Grilled Cafe Management</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={() => setActiveTab('settings')}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hidden sm:block"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Business Info Bar Component
  const BusinessInfoBar = () => {
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
    const todayHours = settings?.operatingHours?.[currentDay] || { open: '09:00', close: '22:00', closed: false };
    const staffOnDuty = getStaffOnDuty ? getStaffOnDuty() : [];
    
    return (
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 space-y-2 sm:space-y-0">
            {/* Restaurant Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="hidden sm:inline">{settings?.restaurant?.address || '123 Main Street, Cape Town'}</span>
                <span className="sm:hidden">Cape Town, SA</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{settings?.restaurant?.phone || '+27 21 123 4567'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {todayHours.closed ? (
                  <span className="text-red-600 font-medium">Closed Today</span>
                ) : (
                  <span>Today: {todayHours.open} - {todayHours.close}</span>
                )}
              </div>
            </div>
            
            {/* Staff Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserCheck2 className="w-4 h-4 text-green-500" />
                <span className="font-medium">{staffOnDuty.length} staff on duty</span>
              </div>
              {staffOnDuty.length > 0 && (
                <div className="hidden sm:flex items-center space-x-1">
                  {staffOnDuty.slice(0, 3).map((member, index) => (
                    <div
                      key={member.id || index}
                      className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-medium"
                      title={member.name}
                    >
                      {member.name ? member.name.charAt(0) : 'S'}
                    </div>
                  ))}
                  {staffOnDuty.length > 3 && (
                    <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                      +{staffOnDuty.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Analytics Overview
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm">Total Revenue</p>
              <p className="text-xl sm:text-3xl font-bold">R{analytics.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 sm:w-12 sm:h-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">Total Orders</p>
              <p className="text-xl sm:text-3xl font-bold">{analytics.totalOrders}</p>
            </div>
            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm">Average Order</p>
              <p className="text-xl sm:text-3xl font-bold">R{analytics.averageOrder}</p>
            </div>
            <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-xs sm:text-sm">Total Customers</p>
              <p className="text-xl sm:text-3xl font-bold">{analytics.totalCustomers}</p>
            </div>
            <Users className="w-8 h-8 sm:w-12 sm:h-12 text-orange-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-xs sm:text-sm">Active Items</p>
              <p className="text-xl sm:text-3xl font-bold">{analytics.activeItems}</p>
            </div>
            <Eye className="w-8 h-8 sm:w-12 sm:h-12 text-indigo-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-xs sm:text-sm">Popular Items</p>
              <p className="text-xl sm:text-3xl font-bold">{analytics.popularItems}</p>
            </div>
            <Star className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Add New Item</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Export Data</span>
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">View Analytics</span>
          </button>
          <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Import Menu</span>
          </button>
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Top Selling Items</h3>
        <div className="space-y-3 sm:space-y-4">
          {menuItems
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5)
            .map((item, index) => (
              <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                <div className="flex-shrink-0 relative overflow-hidden rounded-lg">
                  {item.displayImage && item.displayImage.startsWith('data:') ? (
                    <img 
                      src={item.displayImage} 
                      alt={item.name}
                      className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-xl sm:text-2xl">{item.displayImage || item.image}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{item.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{item.sales} sold</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-green-600 text-sm sm:text-base">R{item.price}</p>
                  <p className="text-xs sm:text-sm text-gray-500">#{index + 1}</p>
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
      <BusinessInfoBar />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Tab Navigation */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="overview">📊 Overview</option>
              <option value="menu">📋 Menu Management</option>
              <option value="categories">🏷️ Categories</option>
              <option value="inventory">📦 Inventory</option>
              <option value="messaging">💬 Bulk Messaging</option>
              <option value="orders">🕐 Orders</option>
              <option value="customers">👥 Customers</option>
              <option value="settings">⚙️ Settings</option>
            </select>
          </div>
          
          {/* Desktop Tab Navigation */}
          <nav className="hidden md:flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'menu', label: 'Menu Management', icon: Package },
              { id: 'categories', label: 'Categories', icon: Settings },
              { id: 'inventory', label: 'Inventory', icon: PackageX },
              { id: 'messaging', label: 'Bulk Messaging', icon: MessageCircle },
              { id: 'orders', label: 'Orders', icon: Clock },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'settings', label: 'Settings', icon: Cog }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'menu' && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Menu Management</h3>
            <p className="text-gray-600">Menu management features coming soon...</p>
          </div>
        )}
        {activeTab === 'categories' && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Categories Management</h3>
            <p className="text-gray-600">Categories management features coming soon...</p>
          </div>
        )}
        {activeTab === 'inventory' && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventory Management</h3>
            <p className="text-gray-600">Inventory management features coming soon...</p>
          </div>
        )}
        {activeTab === 'messaging' && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bulk Messaging</h3>
            <p className="text-gray-600">Messaging features coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings Management</h3>
            <p className="text-gray-600">Settings management features coming soon...</p>
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
            <p className="text-gray-600">Order management features coming soon...</p>
          </div>
        )}
        {activeTab === 'customers' && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
            <p className="text-gray-600">Customer management features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
