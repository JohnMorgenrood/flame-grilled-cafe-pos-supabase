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
  Loader,
  Zap,
  Award,
  Edit2,
  Info
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
import { db, storage } from '../firebase/firebase';

const PerfectAdminDashboard = () => {
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
  
  // Notification system
  const [notifications, setNotifications] = useState([]);
  
  // Form State with enhanced options
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    imageFile: null,
    available: true,
    featured: false,
    onSpecial: false
  });

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '',
    description: '',
    color: 'from-slate-900 via-purple-900 to-slate-900'
  });

  // Enhanced color options matching your store theme
  const colorOptions = [
    { value: 'from-slate-900 via-purple-900 to-slate-900', label: 'Store Header (Purple)', preview: 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900' },
    { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'from-red-500 to-orange-500', label: 'Red to Orange (Brand)', preview: 'bg-gradient-to-r from-red-500 to-orange-500' },
    { value: 'from-red-600 to-orange-600', label: 'Deep Red to Orange', preview: 'bg-gradient-to-r from-red-600 to-orange-600' },
    { value: 'from-indigo-500 to-purple-600', label: 'Indigo to Purple', preview: 'bg-gradient-to-r from-indigo-500 to-purple-600' },
    { value: 'from-blue-500 to-purple-500', label: 'Blue to Purple', preview: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { value: 'from-orange-500 to-red-500', label: 'Orange to Red', preview: 'bg-gradient-to-r from-orange-500 to-red-500' }
  ];

  // Default Categories with your store theme
  const defaultCategories = [
    { id: 'specials', name: '⭐ Specials', icon: '⭐', color: 'from-slate-900 via-purple-900 to-slate-900' },
    { id: 'burgers', name: '🍔 Burgers', icon: '🍔', color: 'from-red-500 to-orange-500' },
    { id: 'chicken', name: '🍗 Chicken', icon: '🍗', color: 'from-purple-500 to-pink-500' },
    { id: 'wraps', name: '🌯 Wraps', icon: '🌯', color: 'from-indigo-500 to-purple-600' },
    { id: 'salads', name: '🥗 Salads', icon: '🥗', color: 'from-blue-500 to-purple-500' },
    { id: 'beverages', name: '☕ Drinks', icon: '☕', color: 'from-red-600 to-orange-600' },
    { id: 'desserts', name: '🍰 Desserts', icon: '🍰', color: 'from-orange-500 to-red-500' }
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

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showNotification('Image size must be less than 10MB', 'error');
      return null;
    }

    try {
      setUploadingImage(true);
      showNotification('Uploading image...', 'info');
      
      console.log('🔥 Starting image upload:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const timestamp = Date.now();
      const fileName = `menu-images/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const storageRef = ref(storage, fileName);
      
      console.log('📁 Upload path:', fileName);
      
      // Upload with metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedAt': new Date().toISOString(),
          'originalName': file.name
        }
      };
      
      console.log('⬆️ Uploading to Firebase Storage...');
      const uploadResult = await uploadBytes(storageRef, file, metadata);
      console.log('✅ Upload successful:', uploadResult);
      
      console.log('🔗 Getting download URL...');
      const downloadURL = await getDownloadURL(storageRef);
      console.log('✅ Download URL obtained:', downloadURL);
      
      showNotification('Image uploaded successfully!', 'success');
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        name: error.name
      });
      showNotification(`Upload failed: ${error.message}`, 'error');
      return null;
    } finally {
      console.log('🏁 Upload process finished, resetting uploadingImage state');
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
      showNotification('Saving menu item...', 'info');
      
      let imageUrl = formData.image;
      if (formData.imageFile) {
        imageUrl = await handleImageUpload(formData.imageFile);
        if (!imageUrl) {
          // Upload failed, stop the process
          setLoading(false);
          return;
        }
      }

      const newItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: imageUrl || '🍽️',
        available: formData.available,
        featured: formData.featured,
        special: formData.onSpecial, // Fix: use 'special' instead of 'onSpecial'
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
      showNotification('Updating menu item...', 'info');
      
      let imageUrl = formData.image;
      if (formData.imageFile) {
        imageUrl = await handleImageUpload(formData.imageFile);
        if (!imageUrl) {
          // Upload failed, stop the process
          setLoading(false);
          return;
        }
      }

      const updatedItem = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: imageUrl,
        available: formData.available,
        featured: formData.featured,
        special: formData.onSpecial, // Fix: use 'special' instead of 'onSpecial'
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
  const handleDeleteItem = async (itemId) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!window.confirm(`Are you sure you want to delete "${item?.name}"?`)) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'menu', itemId));
      await fetchMenuItems();
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
    if (!categoryForm.name) {
      showNotification('Please enter a category name', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const newCategory = {
        id: categoryForm.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: categoryForm.name.trim(),
        icon: categoryForm.icon || '📁',
        description: categoryForm.description || '',
        color: categoryForm.color,
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
        name: categoryForm.name.trim(),
        icon: categoryForm.icon || '📁',
        description: categoryForm.description || '',
        color: categoryForm.color,
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

  const handleDeleteCategory = async (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!window.confirm(`Are you sure you want to delete "${category?.name}"? This will not delete menu items in this category.`)) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'categories', categoryId));
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
      featured: false,
      onSpecial: false
    });
    // Also reset upload states
    setUploadingImage(false);
    setLoading(false);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      icon: '',
      description: '',
      color: 'from-slate-900 via-purple-900 to-slate-900'
    });
  };

  // Start editing functions
  const handleEditItem = (item) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      imageFile: null,
      available: item.available !== false,
      featured: item.featured || false,
      onSpecial: item.onSpecial || false
    });
    setEditingItem(item);
  };

  const handleEditCategory = (category) => {
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      description: category.description || '',
      color: category.color || 'from-slate-900 via-purple-900 to-slate-900'
    });
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleToggleAvailability = async (item) => {
    try {
      const newAvailability = !item.available;
      await updateDoc(doc(db, 'menu', item.id), { 
        available: newAvailability,
        updatedAt: new Date()
      });
      await fetchMenuItems();
      showNotification(`Item ${newAvailability ? 'made available' : 'hidden'}`, 'success');
    } catch (error) {
      console.error('Error toggling availability:', error);
      showNotification('Failed to update availability', 'error');
    }
  };

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  // Header Component with your store theme
  const Header = () => (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10"></div>
      <div className="relative flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Restaurant</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">Flame Grilled Cafe</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-gray-300" />
            <span className="text-sm text-gray-200">{new Date().toLocaleDateString()}</span>
          </div>
          
          <button className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors"
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
      
      {/* Enhanced Notifications with your theme */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-2 ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : notification.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-purple-50 border-purple-200 text-purple-800'
            } animate-slide-in max-w-sm backdrop-blur-sm`}
          >
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'info' && <Bell className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards with your theme colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">R{todayRevenue.toFixed(2)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.filter(order => 
                  new Date(order.timestamp?.toDate?.() || order.timestamp).toDateString() === new Date().toDateString()
                ).length}</p>
                <p className="text-sm text-purple-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Menu Items</p>
                <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Eye className="w-3 h-3 mr-1" />
                  {menuItems.filter(item => item.available !== false).length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-sm text-indigo-600 flex items-center mt-1">
                  <Star className="w-3 h-3 mr-1" />
                  All active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions with themed buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add Menu Item</span>
            </button>
            
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              <FolderPlus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
            
            <button
              onClick={() => setActiveTab('menu')}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              <ChefHat className="w-5 h-5" />
              <span>Manage Menu</span>
            </button>
            
            <button
              onClick={() => setActiveTab('categories')}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Grid className="w-5 h-5" />
              <span>Manage Categories</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation with your theme */}
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
                        ? 'border-purple-500 text-purple-600'
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
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-purple-600" />
                      Recent Orders
                    </h4>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order, index) => (
                        <div key={order.id || index} className="flex items-center justify-between p-3 bg-white rounded border shadow-sm">
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
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-red-600" />
                      Popular Menu Items
                    </h4>
                    <div className="space-y-3">
                      {menuItems.slice(0, 5).map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded border shadow-sm">
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
                              <div className="flex space-x-2">
                                {item.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>}
                                {item.onSpecial && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Special</span>}
                              </div>
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

            {/* Continue with the rest of the tabs in the next part... */}
            
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Menu Management</h3>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => {
                    const category = categories.find(cat => (cat.id || cat.name) === item.category);
                    return (
                      <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all transform hover:scale-105">
                        <div className="aspect-w-16 aspect-h-9 relative">
                          {typeof item.image === 'string' && item.image.startsWith('http') ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`${(item.image && item.image.startsWith('http')) ? 'hidden' : 'flex'} w-full h-48 bg-gray-100 items-center justify-center text-6xl`}>
                            {item.image || '🍽️'}
                          </div>
                          
                          {/* Status badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                            {item.featured && <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">⭐ Featured</span>}
                            {item.onSpecial && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">🔥 Special</span>}
                            {item.available === false && <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">Unavailable</span>}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 flex-1">{item.name}</h4>
                            <span className="text-lg font-bold text-gray-900 ml-2">R{(item.price || 0).toFixed(2)}</span>
                          </div>
                          
                          {category && (
                            <div className="flex items-center space-x-1 mb-2">
                              <span className="text-sm">{category.icon}</span>
                              <span className="text-sm text-gray-600">{category.name}</span>
                            </div>
                          )}
                          
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                          )}
                          
                          <div className="flex items-center justify-between space-x-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            
                            <button
                              onClick={() => handleToggleAvailability(item)}
                              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                                item.available !== false
                                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                              <span>{item.available !== false ? 'Available' : 'Hidden'}</span>
                            </button>
                            
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {menuItems.length === 0 && (
                  <div className="text-center py-12">
                    <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
                    <p className="text-gray-500 mb-4">Get started by adding your first menu item</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Add Your First Item
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Category Management</h3>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-500">{menuItems.filter(item => item.category === (category.id || category.name)).length} items</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id || category.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-12">
                    <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                    <p className="text-gray-500 mb-4">Create categories to organize your menu items</p>
                    <button
                      onClick={() => setShowCategoryModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Create Your First Category
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Order History</h3>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order, index) => (
                          <tr key={order.id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id?.slice(-6) || index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.timestamp?.toDate?.() || order.timestamp || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.items?.length || 0} items
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              R{(order.total || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500">Orders will appear here when customers place them</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Add/Edit Modal with your requested structure */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Item Image Section - Exactly as you requested */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Item Image</label>
                <div className="flex items-start space-x-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group hover:border-purple-400 transition-colors">
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
                    <div className={`${(formData.imageFile || (formData.image && formData.image.startsWith('http'))) ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-3xl`}>
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
                      className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Or use emoji (e.g., 🍔)</p>
                      <input
                        type="text"
                        placeholder="🍔"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Supported: JPG, PNG, WEBP (max 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Dagwood Burger - Old Timer"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (R) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="102"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id || cat.name} value={cat.id || cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Made on 2 slices of toast, beef patty, bacon, ham, cheese, egg, lettuce"
                />
              </div>

              {/* Status Checkboxes - Exactly as you requested */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                    ✅ Available
                  </span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">
                    ⭐ Featured Item
                  </span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.onSpecial}
                    onChange={(e) => setFormData(prev => ({ ...prev, onSpecial: e.target.checked }))}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                    🔥 On Special
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  resetForm();
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={loading || uploadingImage}
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                disabled={loading || uploadingImage || !formData.name || !formData.price || !formData.category}
                className="px-6 py-2 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{loading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {(showCategoryModal || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    resetCategoryForm();
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Burgers"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl"
                  placeholder="🍔"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief description of this category"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  resetCategoryForm();
                }}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                disabled={loading || !categoryForm.name}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Add Category'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Notification */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-2 ${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : notification.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-purple-50 border-purple-200 text-purple-800'
            } animate-slide-in max-w-sm backdrop-blur-sm`}
          >
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'info' && <Bell className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerfectAdminDashboard;
