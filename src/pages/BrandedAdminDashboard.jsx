import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Flame,
  Calendar,
  LogOut,
  ChefHat,
  DollarSign,
  Package,
  Users,
  Clock,
  UserCheck2,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Image,
  Save,
  X,
  Search,
  Filter,
  Eye,
  Star,
  TrendingUp,
  Settings as SettingsIcon,
  Bell,
  BarChart3,
  FolderPlus,
  Grid,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  onSnapshot 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/supabase';

const BrandedAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Menu Management State
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    imageFile: null,
    available: true,
    featured: false
  });

  // Category Form State
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    icon: '',
    color: 'from-red-500 to-orange-500'
  });

  // Default Categories with your brand colors
  const defaultCategories = [
    { id: 'specials', name: '⭐ Specials', icon: '⭐', color: 'from-red-500 to-orange-500' },
    { id: 'burgers', name: '🍔 Burgers', icon: '🍔', color: 'from-red-600 to-orange-600' },
    { id: 'chicken', name: '🍗 Chicken', icon: '🍗', color: 'from-red-500 to-orange-500' },
    { id: 'wraps', name: '🌯 Wraps', icon: '🌯', color: 'from-red-600 to-orange-600' },
    { id: 'salads', name: '🥗 Salads', icon: '🥗', color: 'from-red-500 to-orange-500' },
    { id: 'beverages', name: '☕ Drinks', icon: '☕', color: 'from-red-600 to-orange-600' },
    { id: 'desserts', name: '🍰 Desserts', icon: '🍰', color: 'from-red-500 to-orange-500' }
  ];

  // Color options for categories
  const colorOptions = [
    { value: 'from-red-500 to-orange-500', label: 'Red to Orange (Brand)', preview: 'bg-gradient-to-r from-red-500 to-orange-500' },
    { value: 'from-red-600 to-orange-600', label: 'Deep Red to Orange', preview: 'bg-gradient-to-r from-red-600 to-orange-600' },
    { value: 'from-orange-500 to-red-500', label: 'Orange to Red', preview: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { value: 'from-red-500 to-pink-500', label: 'Red to Pink', preview: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { value: 'from-orange-500 to-yellow-500', label: 'Orange to Yellow', preview: 'bg-gradient-to-r from-orange-500 to-yellow-500' }
  ];

  // Fetch all data on mount
  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
    fetchOrders();
  }, []);

  // Calculate stats when data changes
  useEffect(() => {
    calculateTodayRevenue();
  }, [orders]);

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      if (querySnapshot.empty) {
        // If no categories in Firebase, use defaults and save them
        setCategories(defaultCategories);
        await saveDefaultCategories();
      } else {
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesList);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(defaultCategories);
      showNotification('Using default categories', 'info');
    }
  };

  // Save default categories to Firebase
  const saveDefaultCategories = async () => {
    try {
      for (const category of defaultCategories) {
        await addDoc(collection(db, 'categories'), category);
      }
    } catch (error) {
      console.error('Error saving default categories:', error);
    }
  };

  // Fetch menu items from Firebase with real-time updates
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'menu'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      showNotification('Error loading menu items', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Calculate today's revenue
  const calculateTodayRevenue = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.timestamp?.toDate?.() || order.timestamp).toDateString() === today
    );
    const revenue = todayOrders.reduce((total, order) => total + (order.total || 0), 0);
    setTodayRevenue(revenue);
  };

  // Enhanced image upload with validation and error handling
  const handleImageUpload = async (file) => {
    if (!file) return null;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload a valid image file (JPG, PNG, WEBP)', 'error');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showNotification('Image size must be less than 5MB', 'error');
      return null;
    }

    try {
      setUploadingImage(true);
      const timestamp = Date.now();
      const fileName = `menu-images/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const storageRef = ref(storage, fileName);
      
      // Upload with metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedAt': new Date().toISOString(),
          'originalName': file.name
        }
      };
      
      await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      
      showNotification('Image uploaded successfully!', 'success');
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification(`Upload failed: ${error.message}`, 'error');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Add menu item with enhanced error handling
  const handleAddItem = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = formData.image;
      if (formData.imageFile) {
        imageUrl = await handleImageUpload(formData.imageFile);
        if (!imageUrl) return; // Upload failed
      }

      const newItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: imageUrl || '🍽️',
        available: formData.available,
        featured: formData.featured,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'menu'), newItem);
      console.log('Item added with ID:', docRef.id);
      
      await fetchMenuItems(); // Refresh the list
      resetForm();
      setShowAddModal(false);
      showNotification('Menu item added successfully!', 'success');
    } catch (error) {
      console.error('Error adding menu item:', error);
      showNotification(`Failed to add item: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update menu item with enhanced validation
  const handleUpdateItem = async () => {
    if (!editingItem) return;

    try {
      setLoading(true);
      
      let imageUrl = formData.image;
      if (formData.imageFile) {
        imageUrl = await handleImageUpload(formData.imageFile);
        if (!imageUrl) return; // Upload failed
      }

      const updatedItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: imageUrl,
        available: formData.available,
        featured: formData.featured,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'menu', editingItem.id), updatedItem);
      console.log('Item updated:', editingItem.id);
      
      await fetchMenuItems(); // Refresh the list
      resetForm();
      setEditingItem(null);
      showNotification('Menu item updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating menu item:', error);
      showNotification(`Failed to update item: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'menu', item.id));
      console.log('Item deleted:', item.id);
      
      await fetchMenuItems(); // Refresh the list
      showNotification('Menu item deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      showNotification(`Failed to delete item: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Category Management Functions
  const handleAddCategory = async () => {
    if (!categoryFormData.name) {
      showNotification('Please enter a category name', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const newCategory = {
        id: categoryFormData.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: categoryFormData.name.trim(),
        icon: categoryFormData.icon || '📁',
        color: categoryFormData.color,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'categories'), newCategory);
      await fetchCategories();
      resetCategoryForm();
      setShowCategoryModal(false);
      showNotification('Category added successfully!', 'success');
    } catch (error) {
      console.error('Error adding category:', error);
      showNotification(`Failed to add category: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      setLoading(true);
      
      const updatedCategory = {
        name: categoryFormData.name.trim(),
        icon: categoryFormData.icon || '📁',
        color: categoryFormData.color,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'categories', editingCategory.id), updatedCategory);
      await fetchCategories();
      resetCategoryForm();
      setEditingCategory(null);
      showNotification('Category updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating category:', error);
      showNotification(`Failed to update category: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This will not delete menu items in this category.`)) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'categories', category.id));
      await fetchCategories();
      showNotification('Category deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification(`Failed to delete category: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset form functions
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      imageFile: null,
      available: true,
      featured: false
    });
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      icon: '',
      color: 'from-red-500 to-orange-500'
    });
  };

  // Start editing functions
  const startEditing = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      imageFile: null,
      available: item.available !== false,
      featured: item.featured || false
    });
    setEditingItem(item);
  };

  const startEditingCategory = (category) => {
    setCategoryFormData({
      name: category.name,
      icon: category.icon,
      color: category.color
    });
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Notification system
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('flameGrilledUser');
    localStorage.removeItem('simpleAuth');
    navigate('/login');
  };

  // Header Component with your brand colors
  const Header = () => (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Restaurant</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Flame Grilled Cafe</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{new Date().toLocaleDateString()}</span>
          </div>
          
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Enhanced Notifications with brand colors */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-2 ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : notification.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            } animate-slide-in max-w-sm`}
          >
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'info' && <Bell className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards with your brand colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">R{todayRevenue.toFixed(2)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(order => 
                  new Date(order.timestamp?.toDate?.() || order.timestamp).toDateString() === new Date().toDateString()
                ).length}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Menu Items</p>
                <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <Eye className="w-3 h-3 mr-1" />
                  {menuItems.filter(item => item.available !== false).length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-sm text-orange-600 flex items-center mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  All active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions with brand colors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Menu Item</span>
            </button>
            
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <FolderPlus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
            
            <button
              onClick={() => setActiveTab('menu')}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg"
            >
              <ChefHat className="w-5 h-5" />
              <span>Manage Menu</span>
            </button>
            
            <button
              onClick={() => setActiveTab('categories')}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <Grid className="w-5 h-5" />
              <span>Manage Categories</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation with brand colors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'menu', label: 'Menu Management', icon: ChefHat },
                { id: 'categories', label: 'Categories', icon: Grid },
                { id: 'orders', label: 'Orders', icon: Package }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h4>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order, index) => (
                        <div key={order.id || index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.id?.slice(-6) || index + 1}</p>
                            <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">R{(order.total || 0).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{new Date(order.timestamp?.toDate?.() || order.timestamp || Date.now()).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Menu Items */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Menu Items</h4>
                    <div className="space-y-3">
                      {menuItems.slice(0, 5).map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-lg">
                              {typeof item.image === 'string' && item.image.startsWith('http') ? (
                                <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                              ) : (
                                <span>{item.image || '🍽️'}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">R{(item.price || 0).toFixed(2)}</p>
                            <p className={`text-sm ${item.available !== false ? 'text-green-600' : 'text-red-600'}`}>
                              {item.available !== false ? 'Available' : 'Unavailable'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                {/* Category Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                      <div className={`h-20 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {menuItems.filter(item => item.category === category.id).length} items
                        </p>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingCategory(category)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-12">
                    <Grid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first category</p>
                    <button
                      onClick={() => setShowCategoryModal(true)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-6">
                {/* Menu Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Menu Items Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="relative">
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            {typeof item.image === 'string' && item.image.startsWith('http') ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`${typeof item.image === 'string' && item.image.startsWith('http') ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-4xl`}>
                              {item.image || '🍽️'}
                            </div>
                          </div>
                          {item.featured && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Featured
                            </div>
                          )}
                          {!item.available && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Unavailable
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold text-gray-900">R{(item.price || 0).toFixed(2)}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {categories.find(cat => cat.id === item.category)?.name || item.category}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(item)}
                              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first menu item</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Menu Item</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
                <p className="text-gray-600">Advanced order management features coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Menu Item Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Enhanced Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
                <div className="flex items-start space-x-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                    {formData.imageFile ? (
                      <img 
                        src={URL.createObjectURL(formData.imageFile)} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : formData.image && formData.image.startsWith('http') ? (
                      <img 
                        src={formData.image} 
                        alt="Current" 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`${(formData.imageFile || (formData.image && formData.image.startsWith('http'))) ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-2xl`}>
                      {formData.image || '🍽️'}
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData(prev => ({ ...prev, imageFile: file }));
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Or use emoji (e.g., 🍔)</p>
                      <input
                        type="text"
                        placeholder="🍔"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Supported: JPG, PNG, WEBP (max 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Flame Grilled Burger"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (R) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Describe your delicious menu item..."
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Item</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading || uploadingImage}
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                disabled={loading || uploadingImage || !formData.name || !formData.price || !formData.category}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{loading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  resetCategoryForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Main Courses"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                <input
                  type="text"
                  value={categoryFormData.icon}
                  onChange={(e) => setCategoryFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="🍔"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                <div className="space-y-2">
                  {colorOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={option.value}
                        checked={categoryFormData.color === option.value}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-4 h-4 text-red-600 focus:ring-red-500"
                      />
                      <div className={`w-8 h-4 rounded ${option.preview}`}></div>
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  resetCategoryForm();
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                disabled={loading || !categoryFormData.name}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Continue with the rest of the component in the next part... */}
    </div>
  );
};

export default BrandedAdminDashboard;
