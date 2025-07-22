import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../context/CategoriesContext';
import { useOrders } from '../context/OrdersContext';
import { useMessaging } from '../context/MessagingContext';
import { useInventory } from '../contexts/InventoryContext';
import { useSettings } from '../contexts/SettingsContext';
import ManageMenu from './dashboard/admin/ManageMenu';
import '../styles/admin.css';
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
  UserCheck2,
  Coffee,
  Pizza,
  Sandwich,
  IceCream,
  Cookie,
  Salad,
  Fish,
  Beef,
  Apple,
  Wine,
  Utensils,
  ChefHat,
  Image
} from 'lucide-react';

const AdminDashboard = () => {
  console.log('AdminDashboard_fixed component rendering...');
  const navigate = useNavigate();
  
  // Simple logout function
  const handleLogout = () => {
    try {
      localStorage.removeItem('flameGrilledUser');
      localStorage.removeItem('simpleAuth');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };
  
  // All context hooks must be called at the top level - no conditional calling!
  const { categories = [], addCategory, updateCategory, deleteCategory } = useCategories() || {};
  const { orders = [] } = useOrders() || {};
  const { messages = [], sendBulkMessage, updateCustomerContacts, customerContacts = [] } = useMessaging() || {};
  const { inventory = [], stockAlerts = [], dismissAlert } = useInventory() || {};
  const { settings = {}, staff = [], getStaffOnDuty, updateSettings } = useSettings() || {};

  // Component state
  const [activeTab, setActiveTab] = useState('overview');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategory, setEditCategory] = useState({ name: '', description: '', image: '', icon: '', imageType: 'icon' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '', icon: '', imageType: 'icon' });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [editCategoryImageFile, setEditCategoryImageFile] = useState(null);
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newInventoryItem, setNewInventoryItem] = useState({
    name: '',
    currentStock: 0,
    unit: '',
    minimumStock: 0,
    cost: 0
  });
  const [showAddInventoryItem, setShowAddInventoryItem] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    recipients: 'all'
  });
  const [showComposeMessage, setShowComposeMessage] = useState(false);
  const [restaurantSettings, setRestaurantSettings] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    currency: 'ZAR',
    currencySymbol: 'R'
  });
  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '09:00', close: '22:00', isOpen: true },
    tuesday: { open: '09:00', close: '22:00', isOpen: true },
    wednesday: { open: '09:00', close: '22:00', isOpen: true },
    thursday: { open: '09:00', close: '22:00', isOpen: true },
    friday: { open: '09:00', close: '22:00', isOpen: true },
    saturday: { open: '09:00', close: '22:00', isOpen: true },
    sunday: { open: '09:00', close: '22:00', isOpen: true }
  });
  // Menu management state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    available: true,
    preparationTime: 15,
    ingredients: '',
    allergens: '',
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  console.log('Context data loaded:', {
    categoriesCount: categories.length,
    ordersCount: orders.length,
    messagesCount: messages.length,
    inventoryCount: inventory.length,
    restaurantName: settings.restaurant?.name || settings.restaurantName
  });

  // Initialize settings when component mounts or settings change
  React.useEffect(() => {
    if (settings.restaurant) {
      setRestaurantSettings({
        restaurantName: settings.restaurant.name || '',
        address: settings.restaurant.address || '',
        phone: settings.restaurant.phone || '',
        email: settings.restaurant.email || '',
        currency: settings.restaurant.currency || 'ZAR',
        currencySymbol: settings.restaurant.currencySymbol || 'R'
      });
    } else {
      // Fallback for old structure
      setRestaurantSettings({
        restaurantName: settings.restaurantName || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        currency: settings.currency || 'ZAR',
        currencySymbol: settings.currencySymbol || 'R'
      });
    }

    if (settings.operatingHours) {
      setOperatingHours(settings.operatingHours);
    }
  }, [settings]);

  // Helper functions
  const getStaffOnDutyCount = () => {
    if (typeof getStaffOnDuty === 'function') {
      return getStaffOnDuty().length;
    }
    return staff?.filter(s => s.onDuty)?.length || 0;
  };

  const getTodayOrders = () => {
    const today = new Date().toDateString();
    return orders.filter(order => new Date(order.timestamp).toDateString() === today);
  };

  const getTodayRevenue = () => {
    const todayOrders = getTodayOrders();
    return todayOrders.reduce((total, order) => total + (order.total || 0), 0);
  };

  // Currency formatting helper
  const formatCurrency = (amount) => {
    const currency = restaurantSettings.currency || 'ZAR';
    const symbol = restaurantSettings.currencySymbol || 'R';
    return `${symbol}${amount.toFixed(2)}`;
  };

  // Category icon options
  const categoryIcons = [
    { name: 'Coffee', icon: Coffee, color: 'text-amber-600' },
    { name: 'Pizza', icon: Pizza, color: 'text-red-600' },
    { name: 'Sandwich', icon: Sandwich, color: 'text-yellow-600' },
    { name: 'Ice Cream', icon: IceCream, color: 'text-pink-600' },
    { name: 'Cookie', icon: Cookie, color: 'text-orange-600' },
    { name: 'Salad', icon: Salad, color: 'text-green-600' },
    { name: 'Fish', icon: Fish, color: 'text-blue-600' },
    { name: 'Beef', icon: Beef, color: 'text-red-700' },
    { name: 'Apple', icon: Apple, color: 'text-green-500' },
    { name: 'Wine', icon: Wine, color: 'text-purple-600' },
    { name: 'Utensils', icon: Utensils, color: 'text-gray-600' },
    { name: 'Chef Hat', icon: ChefHat, color: 'text-gray-700' },
    { name: 'Flame', icon: Flame, color: 'text-orange-500' }
  ];

  // Category image upload handler
  const handleCategoryImageUpload = async (file) => {
    setUploadingCategoryImage(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      setUploadingCategoryImage(false);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading category image:', error);
      setUploadingCategoryImage(false);
      alert('Error uploading image. Please try again.');
      return null;
    }
  };

  // Handle functions with error checking
  const handleAddCategory = async () => {
    if (addCategory && newCategory.name.trim()) {
      try {
        let imageUrl = newCategory.image;
        
        // Upload image if file is selected
        if (newCategory.imageType === 'upload' && categoryImageFile) {
          imageUrl = await handleCategoryImageUpload(categoryImageFile);
          if (!imageUrl) return; // Upload failed
        }

        addCategory({
          ...newCategory,
          id: Date.now().toString(),
          image: imageUrl,
          items: []
        });
        setNewCategory({ name: '', description: '', image: '', icon: '', imageType: 'icon' });
        setCategoryImageFile(null);
        setShowAddCategory(false);
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleUpdateCategory = (categoryId, updates) => {
    if (updateCategory) {
      try {
        updateCategory(categoryId, updates);
        setEditingCategory(null);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      icon: category.icon || '',
      imageType: category.icon ? 'icon' : 'upload'
    });
    setEditingCategory(category.id);
    setEditCategoryImageFile(null);
  };

  const handleSaveEditCategory = async () => {
    if (!editCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      let imageUrl = editCategory.image;
      
      // Upload new image if file is selected
      if (editCategory.imageType === 'upload' && editCategoryImageFile) {
        imageUrl = await handleCategoryImageUpload(editCategoryImageFile);
        if (!imageUrl) return; // Upload failed
      }

      const updates = {
        ...editCategory,
        image: imageUrl
      };

      handleUpdateCategory(editingCategory, updates);
      setEditCategoryImageFile(null);
    } catch (error) {
      console.error('Error saving category edits:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (deleteCategory && window.confirm('Are you sure you want to delete this category?')) {
      try {
        deleteCategory(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleDismissAlert = (alertId) => {
    if (dismissAlert) {
      try {
        dismissAlert(alertId);
      } catch (error) {
        console.error('Error dismissing alert:', error);
      }
    }
  };

  // Inventory handlers
  const handleAddInventoryItem = () => {
    if (newInventoryItem.name.trim()) {
      try {
        const newItem = {
          ...newInventoryItem,
          id: Date.now().toString(),
          lastUpdated: new Date().toISOString()
        };
        // Add to inventory context (if available)
        console.log('Adding inventory item:', newItem);
        setNewInventoryItem({
          name: '',
          currentStock: 0,
          unit: '',
          minimumStock: 0,
          cost: 0
        });
        setShowAddInventoryItem(false);
      } catch (error) {
        console.error('Error adding inventory item:', error);
      }
    }
  };

  // Messaging handlers
  const handleSendMessage = () => {
    if (sendBulkMessage && newMessage.content.trim()) {
      try {
        sendBulkMessage({
          ...newMessage,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          sender: 'Admin'
        });
        setNewMessage({
          subject: '',
          content: '',
          recipients: 'all'
        });
        setShowComposeMessage(false);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Order status update
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      // Update order status logic would go here
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Settings handlers
  const handleSaveRestaurantSettings = () => {
    if (updateSettings) {
      try {
        updateSettings('restaurant', restaurantSettings);
        alert('Restaurant settings saved successfully!');
      } catch (error) {
        console.error('Error saving restaurant settings:', error);
        alert('Error saving settings. Please try again.');
      }
    }
  };

  const handleSaveOperatingHours = () => {
    if (updateSettings) {
      try {
        updateSettings('operatingHours', operatingHours);
        alert('Operating hours saved successfully!');
      } catch (error) {
        console.error('Error saving operating hours:', error);
        alert('Error saving operating hours. Please try again.');
      }
    }
  };

  const handleOperatingHourChange = (day, field, value) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Menu/Product handlers
  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      // Simulate image upload - in real app, upload to cloud storage
      const formData = new FormData();
      formData.append('image', file);
      
      // For now, create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setUploadingImage(false);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
      alert('Error uploading image. Please try again.');
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.category) {
      alert('Please fill in all required fields (Name and Category)');
      return;
    }

    try {
      let imageUrl = newProduct.image;
      
      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) return; // Upload failed
      }

      const product = {
        ...newProduct,
        id: Date.now().toString(),
        image: imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Find category and add product to it
      const categoryToUpdate = categories.find(cat => cat.id === newProduct.category);
      if (categoryToUpdate && updateCategory) {
        const updatedItems = [...(categoryToUpdate.items || []), product];
        updateCategory(categoryToUpdate.id, { items: updatedItems });
        
        // Reset form
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          category: '',
          image: '',
          available: true,
          preparationTime: 15,
          ingredients: '',
          allergens: '',
          nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
        });
        setImageFile(null);
        setShowAddProduct(false);
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };

  const handleEditProduct = async (categoryId, productId, updates) => {
    try {
      const category = categories.find(cat => cat.id === categoryId);
      if (category && updateCategory) {
        const updatedItems = category.items.map(item => 
          item.id === productId 
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        );
        updateCategory(categoryId, { items: updatedItems });
        setEditingProduct(null);
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  };

  const handleDeleteProduct = (categoryId, productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const category = categories.find(cat => cat.id === categoryId);
        if (category && updateCategory) {
          const updatedItems = category.items.filter(item => item.id !== productId);
          updateCategory(categoryId, { items: updatedItems });
          alert('Product deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const getAllProducts = () => {
    return categories.reduce((allProducts, category) => {
      const categoryProducts = (category.items || []).map(item => ({
        ...item,
        categoryId: category.id,
        categoryName: category.name
      }));
      return [...allProducts, ...categoryProducts];
    }, []);
  };

  // Header Component
  const Header = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border-b border-gray-200 gap-4">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Restaurant</span>
        </button>
        <div className="flex items-center space-x-2">
          <Flame className="w-8 h-8 text-orange-500" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="p-2 text-gray-600 hover:text-gray-800">
          <Settings className="w-5 h-5" />
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );

  // Business Info Bar Component
  const BusinessInfoBar = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-2">
            <Flame className="w-6 h-6" />
            <span className="text-lg sm:text-xl font-bold">
              {settings.restaurant?.name || settings.restaurantName || 'Flame Grilled Cafe'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm sm:text-base">
              {settings.restaurant?.address || settings.address || 'Restaurant Address'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span className="text-sm sm:text-base">
              {settings.restaurant?.phone || settings.phone || 'Phone Number'}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <UserCheck2 className="w-4 h-4" />
            <span className="text-sm">Staff on Duty: {getStaffOnDutyCount()}</span>
          </div>
          <div className="text-xs sm:text-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Overview Tab Component
  const OverviewTab = () => (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Analytics Cards */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(getTodayRevenue())}</p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{getTodayOrders().length}</p>
            </div>
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Alerts</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stockAlerts.length}</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Stock Alerts</h3>
          <div className="space-y-2">
            {stockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div>
                  <span className="font-medium">{alert.itemName}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    Current: {alert.currentStock} {alert.unit} (Min: {alert.minimumStock} {alert.unit})
                  </span>
                </div>
                <button
                  onClick={() => handleDismissAlert(alert.id)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
        </div>
        <div className="p-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(order.total || 0)}</p>
                <p className="text-sm text-gray-600">{order.status || 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BusinessInfoBar />
      
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'categories', label: 'Categories', icon: Package },
            { id: 'menu', label: 'Menu Items', icon: Users },
            { id: 'orders', label: 'Orders', icon: Users },
            { id: 'inventory', label: 'Inventory', icon: PackageX },
            { id: 'messaging', label: 'Messaging', icon: MessageCircle },
            { id: 'settings', label: 'Settings', icon: Cog }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'categories' && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Categories Management</h2>
              <button
                onClick={() => setShowAddCategory(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Brief description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Image Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category Image</label>
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={() => setNewCategory({...newCategory, imageType: 'icon', image: ''})}
                      className={`px-4 py-2 rounded-lg border ${
                        newCategory.imageType === 'icon'
                          ? 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      Choose Icon
                    </button>
                    <button
                      onClick={() => setNewCategory({...newCategory, imageType: 'upload', icon: ''})}
                      className={`px-4 py-2 rounded-lg border ${
                        newCategory.imageType === 'upload'
                          ? 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      Upload Image
                    </button>
                  </div>

                  {/* Icon Selection */}
                  {newCategory.imageType === 'icon' && (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">Select an icon for your category:</p>
                      <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-3">
                        {categoryIcons.map((iconOption) => {
                          const IconComponent = iconOption.icon;
                          return (
                            <button
                              key={iconOption.name}
                              onClick={() => setNewCategory({...newCategory, icon: iconOption.name})}
                              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                newCategory.icon === iconOption.name
                                  ? 'border-orange-500 bg-orange-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              title={iconOption.name}
                            >
                              <IconComponent className={`w-6 h-6 mx-auto ${iconOption.color}`} />
                            </button>
                          );
                        })}
                      </div>
                      {newCategory.icon && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {newCategory.icon}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Image Upload */}
                  {newCategory.imageType === 'upload' && (
                    <div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                          <Image className="w-4 h-4" />
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setCategoryImageFile(file);
                                setNewCategory({...newCategory, image: file.name});
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {categoryImageFile && (
                          <span className="text-sm text-gray-600">
                            {categoryImageFile.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleAddCategory}
                    disabled={!newCategory.name.trim() || (!newCategory.icon && !categoryImageFile)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{uploadingCategoryImage ? 'Uploading...' : 'Save Category'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory({ name: '', description: '', image: '', icon: '', imageType: 'icon' });
                      setCategoryImageFile(null);
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Edit Category Form */}
            {editingCategory && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6 border-l-4 border-l-blue-500">
                <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
                
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      placeholder="Enter category name"
                      value={editCategory.name}
                      onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Brief description"
                      value={editCategory.description}
                      onChange={(e) => setEditCategory({...editCategory, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Image Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category Image</label>
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={() => setEditCategory({...editCategory, imageType: 'icon', image: ''})}
                      className={`px-4 py-2 rounded-lg border ${
                        editCategory.imageType === 'icon'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      Choose Icon
                    </button>
                    <button
                      onClick={() => setEditCategory({...editCategory, imageType: 'upload', icon: ''})}
                      className={`px-4 py-2 rounded-lg border ${
                        editCategory.imageType === 'upload'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      Upload Image
                    </button>
                  </div>

                  {/* Icon Selection */}
                  {editCategory.imageType === 'icon' && (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">Select an icon for your category:</p>
                      <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-3">
                        {categoryIcons.map((iconOption) => {
                          const IconComponent = iconOption.icon;
                          return (
                            <button
                              key={iconOption.name}
                              onClick={() => setEditCategory({...editCategory, icon: iconOption.name})}
                              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                editCategory.icon === iconOption.name
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              title={iconOption.name}
                            >
                              <IconComponent className={`w-6 h-6 mx-auto ${iconOption.color}`} />
                            </button>
                          );
                        })}
                      </div>
                      {editCategory.icon && (
                        <p className="text-sm text-gray-600 mt-2">
                          Selected: {editCategory.icon}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Image Upload */}
                  {editCategory.imageType === 'upload' && (
                    <div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                          <Image className="w-4 h-4" />
                          <span>Choose New File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setEditCategoryImageFile(file);
                                setEditCategory({...editCategory, image: file.name});
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {editCategoryImageFile && (
                          <span className="text-sm text-gray-600">
                            New: {editCategoryImageFile.name}
                          </span>
                        )}
                        {editCategory.image && !editCategoryImageFile && (
                          <span className="text-sm text-gray-500">
                            Current: {editCategory.image.split('/').pop()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleSaveEditCategory}
                    disabled={!editCategory.name.trim()}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{uploadingCategoryImage ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setEditCategory({ name: '', description: '', image: '', icon: '', imageType: 'icon' });
                      setEditCategoryImageFile(null);
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => {
                // Find the icon component if category has an icon
                const iconOption = categoryIcons.find(icon => icon.name === category.icon);
                const IconComponent = iconOption?.icon;
                
                return (
                  <div key={category.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {/* Icon or Image Display */}
                        <div className="flex-shrink-0">
                          {IconComponent ? (
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                              <IconComponent className={`w-8 h-8 ${iconOption.color}`} />
                            </div>
                          ) : category.image ? (
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.items?.length || 0} items</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Category Description */}
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    )}
                    
                    {/* Category Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                      <span>Items: {category.items?.length || 0}</span>
                      <span className="text-xs">ID: {category.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {activeTab === 'menu' && (
          <ManageMenu />
        )}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Orders Management</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Orders</option>
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Ready</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
              <p className="text-gray-600">Order management features coming soon...</p>
            </div>
          </div>
        )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                      <input
                        type="text"
                        placeholder="Enter product name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        placeholder="Enter product description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ({restaurantSettings.currencySymbol})</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                        <input
                          type="number"
                          placeholder="15"
                          value={newProduct.preparationTime}
                          onChange={(e) => setNewProduct({...newProduct, preparationTime: parseInt(e.target.value) || 15})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newProduct.available}
                          onChange={(e) => setNewProduct({...newProduct, available: e.target.checked})}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Available for order</span>
                      </label>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files[0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="url"
                          placeholder="Or enter image URL"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {(newProduct.image || imageFile) && (
                          <div className="mt-2">
                            <img 
                              src={imageFile ? URL.createObjectURL(imageFile) : newProduct.image} 
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                      <textarea
                        placeholder="List main ingredients (comma separated)"
                        value={newProduct.ingredients}
                        onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Allergens</label>
                      <input
                        type="text"
                        placeholder="e.g., Nuts, Dairy, Gluten"
                        value={newProduct.allergens}
                        onChange={(e) => setNewProduct({...newProduct, allergens: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nutritional Info (optional)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Calories"
                          value={newProduct.nutritionalInfo.calories}
                          onChange={(e) => setNewProduct({
                            ...newProduct, 
                            nutritionalInfo: {
                              ...newProduct.nutritionalInfo,
                              calories: parseInt(e.target.value) || 0
                            }
                          })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Protein (g)"
                          value={newProduct.nutritionalInfo.protein}
                          onChange={(e) => setNewProduct({
                            ...newProduct, 
                            nutritionalInfo: {
                              ...newProduct.nutritionalInfo,
                              protein: parseInt(e.target.value) || 0
                            }
                          })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Carbs (g)"
                          value={newProduct.nutritionalInfo.carbs}
                          onChange={(e) => setNewProduct({
                            ...newProduct, 
                            nutritionalInfo: {
                              ...newProduct.nutritionalInfo,
                              carbs: parseInt(e.target.value) || 0
                            }
                          })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Fat (g)"
                          value={newProduct.nutritionalInfo.fat}
                          onChange={(e) => setNewProduct({
                            ...newProduct, 
                            nutritionalInfo: {
                              ...newProduct.nutritionalInfo,
                              fat: parseInt(e.target.value) || 0
                            }
                          })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    disabled={uploadingImage}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Save Product'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowAddProduct(false);
                      setImageFile(null);
                      setNewProduct({
                        name: '', description: '', price: 0, category: '', image: '', available: true,
                        preparationTime: 15, ingredients: '', allergens: '',
                        nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
                      });
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                {(() => {
                  const allProducts = getAllProducts();
                  const filteredProducts = selectedCategory 
                    ? allProducts.filter(product => product.categoryId === selectedCategory)
                    : allProducts;
                  
                  return filteredProducts.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      {selectedCategory ? 'No products found in this category' : 'No products found'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredProducts.map((product) => (
                        <div key={product.id} className="product-card border border-gray-200 rounded-lg p-4 bg-white">
                          {product.image && (
                            <div className="relative mb-3">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className={`absolute top-2 right-2 status-badge ${
                                product.available ? 'status-available' : 'status-unavailable'
                              }`}>
                                {product.available ? 'Available' : 'Unavailable'}
                              </div>
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-lg truncate pr-2">{product.name}</h4>
                              <div className="flex space-x-1 flex-shrink-0">
                                <button
                                  onClick={() => setEditingProduct(product)}
                                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.categoryId, product.id)}
                                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {product.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xl font-bold text-green-600">{formatCurrency(product.price)}</span>
                              <span className="text-sm text-gray-500">{product.preparationTime} min</span>
                            </div>
                            {!product.image && (
                              <div className={`status-badge ${
                                product.available ? 'status-available' : 'status-unavailable'
                              }`}>
                                {product.available ? 'Available' : 'Unavailable'}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 space-y-1">
                              <p><span className="font-medium">Category:</span> {product.categoryName}</p>
                              {product.allergens && (
                                <p><span className="font-medium">Allergens:</span> {product.allergens}</p>
                              )}
                              {product.ingredients && (
                                <p className="line-clamp-2"><span className="font-medium">Ingredients:</span> {product.ingredients}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Orders Management</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All Orders</option>
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Ready</option>
                  <option>Completed</option>
                </select>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders found</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            <p className="text-gray-600 text-sm">{new Date(order.timestamp).toLocaleString()}</p>
                            {order.customerInfo && (
                              <p className="text-sm text-gray-500">Customer: {order.customerInfo.name}</p>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <p className="font-semibold">{formatCurrency(order.total || 0)}</p>
                            <select 
                              value={order.status || 'Pending'}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option>Pending</option>
                              <option>Preparing</option>
                              <option>Ready</option>
                              <option>Completed</option>
                              <option>Cancelled</option>
                            </select>
                          </div>
                        </div>
                        {order.items && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'inventory' && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Inventory Management</h2>
              <button
                onClick={() => setShowAddInventoryItem(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Add Inventory Item Form */}
            {showAddInventoryItem && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">Add New Inventory Item</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={newInventoryItem.name}
                    onChange={(e) => setNewInventoryItem({...newInventoryItem, name: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Current Stock"
                    value={newInventoryItem.currentStock}
                    onChange={(e) => setNewInventoryItem({...newInventoryItem, currentStock: parseFloat(e.target.value) || 0})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Unit (kg, pcs, etc.)"
                    value={newInventoryItem.unit}
                    onChange={(e) => setNewInventoryItem({...newInventoryItem, unit: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Minimum Stock"
                    value={newInventoryItem.minimumStock}
                    onChange={(e) => setNewInventoryItem({...newInventoryItem, minimumStock: parseFloat(e.target.value) || 0})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Cost per Unit"
                    value={newInventoryItem.cost}
                    onChange={(e) => setNewInventoryItem({...newInventoryItem, cost: parseFloat(e.target.value) || 0})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                  <button
                    onClick={handleAddInventoryItem}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setShowAddInventoryItem(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                {inventory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No inventory items found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Item Name</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Current Stock</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Unit</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Min Stock</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-2 sm:px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-3 px-2 sm:px-4 font-medium">{item.name}</td>
                            <td className="py-3 px-2 sm:px-4">{item.currentStock}</td>
                            <td className="py-3 px-2 sm:px-4">{item.unit}</td>
                            <td className="py-3 px-2 sm:px-4">{item.minimumStock}</td>
                            <td className="py-3 px-2 sm:px-4">
                              {item.currentStock <= item.minimumStock ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                  ⚠️ Low Stock
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  ✓ In Stock
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2 sm:px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingItem(item.id)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'messaging' && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Customer Messaging</h2>
              <button
                onClick={() => setShowComposeMessage(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Compose Message</span>
              </button>
            </div>

            {/* Compose Message Form */}
            {showComposeMessage && (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold mb-4">Compose New Message</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                    <select 
                      value={newMessage.recipients}
                      onChange={(e) => setNewMessage({...newMessage, recipients: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Customers</option>
                      <option value="recent">Recent Customers</option>
                      <option value="loyalty">Loyalty Members</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Message Subject"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      placeholder="Type your message here..."
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                  <button
                    onClick={handleSendMessage}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  <button
                    onClick={() => setShowComposeMessage(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Message History</h3>
                  <p className="text-sm text-gray-600">Manage customer communications and promotional messages</p>
                </div>
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No messages found</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <h4 className="font-semibold">{message.subject || 'No Subject'}</h4>
                            <p className="text-sm text-gray-600">
                              To: {message.recipients || 'All Customers'} • 
                              Sent: {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 flex-shrink-0">
                            <button className="p-2 text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base">{message.content}</p>
                        {message.status && (
                          <div className="mt-2">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {message.status}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Restaurant Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Restaurant Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Restaurant Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                    <input 
                      type="text"
                      value={restaurantSettings.restaurantName}
                      onChange={(e) => setRestaurantSettings(prev => ({
                        ...prev,
                        restaurantName: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea 
                      value={restaurantSettings.address}
                      onChange={(e) => setRestaurantSettings(prev => ({
                        ...prev,
                        address: e.target.value
                      }))}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={restaurantSettings.phone}
                      onChange={(e) => setRestaurantSettings(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email"
                      value={restaurantSettings.email}
                      onChange={(e) => setRestaurantSettings(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select 
                      value={restaurantSettings.currency}
                      onChange={(e) => {
                        const currencyMap = {
                          'ZAR': 'R',
                          'USD': '$',
                          'EUR': '€',
                          'GBP': '£',
                          'JPY': '¥',
                          'CAD': 'C$',
                          'AUD': 'A$'
                        };
                        setRestaurantSettings(prev => ({
                          ...prev,
                          currency: e.target.value,
                          currencySymbol: currencyMap[e.target.value] || e.target.value
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ZAR">South African Rand (ZAR)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="GBP">British Pound (GBP)</option>
                      <option value="JPY">Japanese Yen (JPY)</option>
                      <option value="CAD">Canadian Dollar (CAD)</option>
                      <option value="AUD">Australian Dollar (AUD)</option>
                    </select>
                    <div className="mt-1 text-xs text-gray-500">
                      Currency Symbol: {restaurantSettings.currencySymbol}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSaveRestaurantSettings}
                  className="mt-4 w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>

              {/* Operating Hours */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
                <div className="space-y-3">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <div className="w-full sm:w-20 text-sm font-medium capitalize">{day}</div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="time" 
                          value={operatingHours[day]?.open || '09:00'}
                          onChange={(e) => handleOperatingHourChange(day, 'open', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <span className="text-gray-500 text-sm">to</span>
                        <input 
                          type="time" 
                          value={operatingHours[day]?.close || '22:00'}
                          onChange={(e) => handleOperatingHourChange(day, 'close', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-1" 
                            checked={operatingHours[day]?.isOpen !== false}
                            onChange={(e) => handleOperatingHourChange(day, 'isOpen', e.target.checked)}
                          />
                          <span className="text-sm">Open</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleSaveOperatingHours}
                  className="mt-4 w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Update Hours
                </button>
              </div>

              {/* Staff Management */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                  <h3 className="text-lg font-semibold">Staff Management</h3>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Staff</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {staff && staff.length > 0 ? staff.slice(0, 5).map((member, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 border-b border-gray-100 space-y-2 sm:space-y-0">
                      <div>
                        <p className="font-medium">{member.name || `Staff Member ${index + 1}`}</p>
                        <p className="text-sm text-gray-600">{member.role || 'Staff'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.isOnDuty ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.isOnDuty ? 'On Duty' : 'Off Duty'}
                        </span>
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-4">No staff members found</p>
                  )}
                </div>
              </div>

              {/* System Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Online Ordering</p>
                      <p className="text-sm text-gray-600">Allow customers to place orders online</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Send order updates via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Marketing</p>
                      <p className="text-sm text-gray-600">Send promotional emails to customers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit Product</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ({restaurantSettings.currencySymbol})</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (min)</label>
                      <input
                        type="number"
                        value={editingProduct.preparationTime || 15}
                        onChange={(e) => setEditingProduct({...editingProduct, preparationTime: parseInt(e.target.value) || 15})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingProduct.available}
                        onChange={(e) => setEditingProduct({...editingProduct, available: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Available for order</span>
                    </label>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <input
                      type="url"
                      placeholder="Enter image URL"
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {editingProduct.image && (
                      <div className="mt-2">
                        <img 
                          src={editingProduct.image} 
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                    <textarea
                      value={editingProduct.ingredients || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, ingredients: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergens</label>
                    <input
                      type="text"
                      value={editingProduct.allergens || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, allergens: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={() => handleEditProduct(editingProduct.categoryId, editingProduct.id, editingProduct)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Product</span>
                </button>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
