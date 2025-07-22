import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../../../firebase/firebase';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'specials',
    emoji: '🍽️',
    imageFile: null
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    'specials',
    'brekkie', 
    'sandwiches',
    'tramezzini',
    'burgers',
    'chicken',
    'wraps',
    'salads',
    'chips',
    'beverages'
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      console.log('Testing Firebase connection...');
      const testDoc = await addDoc(collection(db, 'test'), {
        message: 'Test connection',
        timestamp: new Date()
      });
      console.log('Firebase connection successful, test doc ID:', testDoc.id);
      toast.success('Firebase connection working!');
    } catch (error) {
      console.error('Firebase connection failed:', error);
      toast.error('Firebase connection failed: ' + error.message);
    }
  };

  const fetchMenuItems = async () => {
    try {
      console.log('Fetching menu items from Firebase...');
      const querySnapshot = await getDocs(collection(db, 'menu'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched items:', items);
      setMenuItems(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items: ' + error.message);
      setLoading(false);
    }
  };



  const importExistingMenu = async () => {
    if (!window.confirm('This will import all current menu items from the restaurant app. Continue?')) {
      return;
    }

    try {
      setUploading(true);
      console.log('Starting menu import...');
      
      // Clear existing menu items first
      const querySnapshot = await getDocs(collection(db, 'menu'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('Cleared existing menu items');

      const currentMenuItems = {
        specials: [
          { name: 'Bacon, Egg, Cheese & Hash Brown Brekkie Roll', price: 50, image: '🥪', description: 'Bacon, egg, cheese and hash brown in a fresh roll', imageUrl: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop' },
          { name: 'Bacon, Egg & Cheese Burger & Chips', price: 75, image: '🍔', description: 'Classic breakfast burger served with crispy chips', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
          { name: 'Chicken Mayo, Cheese & Bacon Tramezzini', price: 75, image: '🥪', description: 'Delicious tramezzini with chicken mayo, cheese and bacon', imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop' },
          { name: 'Crumbed Chicken Cheese Mushroom Burger', price: 70, image: '🍗', description: 'Crumbed chicken with cheese and mushroom sauce', imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop' },
          { name: 'Loaded Chicken, Cheese & Bacon Fries', price: 60, image: '🍟', description: 'Hand-cut fries loaded with chicken, cheese and bacon', imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop' }
        ],
        brekkie: [
          { name: 'Egg Roll', price: 24, image: '🥚', description: 'Fresh egg roll', imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop' },
          { name: 'Bacon Roll', price: 35, image: '🥓', description: 'Crispy bacon in a fresh roll', imageUrl: 'https://images.unsplash.com/photo-1504185945330-7a3ca1174571?w=400&h=300&fit=crop' },
          { name: 'Bacon & Egg Roll', price: 43, image: '🍳', description: 'Bacon and egg in a fresh roll', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop' },
          { name: 'Bacon, Egg & Cheese Roll', price: 49, image: '🧀', description: 'Bacon, egg and cheese in a fresh roll', imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=300&fit=crop' },
          { name: 'Bacon, Egg, Cheese & Hash Brown Roll', price: 60, image: '🥪', description: 'Complete breakfast roll with hash brown', imageUrl: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&h=300&fit=crop' }
        ],
        sandwiches: [
          { name: 'Toasted Cheese Sandwich', price: 39, image: '🧀', description: 'Classic toasted cheese sandwich', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop' },
          { name: 'Toasted Cheese & Tomato Sandwich', price: 45, image: '🍅', description: 'Cheese and tomato toasted sandwich', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
          { name: 'Toasted Bacon & Cheese Sandwich', price: 56, image: '🥓', description: 'Bacon and cheese toasted sandwich', imageUrl: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop' },
          { name: 'Toasted Chicken Mayonnaise Sandwich', price: 65, image: '🍗', description: 'Chicken mayonnaise toasted sandwich', imageUrl: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&h=300&fit=crop' },
          { name: 'Toasted Chicken Mayo, Cheese & Bacon Sandwich', price: 82, image: '🥪', description: 'Chicken mayo, cheese and bacon toasted sandwich', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e2d5314f?w=400&h=300&fit=crop' }
        ],
        tramezzini: [
          { name: 'Biltong, Cream Cheese, Peppadew & Sweet Chili Tramezzini', price: 82, image: '🥩', description: 'Gourmet tramezzini with biltong, cream cheese, peppadew and sweet chili', imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop' },
          { name: 'Bacon, Avo, Feta & Sweet Chili Mayo Tramezzini', price: 82, image: '🥑', description: 'Bacon, avocado, feta and sweet chili mayo tramezzini', imageUrl: 'https://images.unsplash.com/photo-1521390188864-8c4bdfe79d99?w=400&h=300&fit=crop' },
          { name: 'Jalapeno, Bacon, Cream Cheese, Feta & Sweet Chili Mayo Tramezzini', price: 82, image: '🌶️', description: 'Spicy tramezzini with jalapeno, bacon, cream cheese and feta', imageUrl: 'https://images.unsplash.com/photo-1564213095753-ea72e32e8b1f?w=400&h=300&fit=crop' },
          { name: 'Grilled Chicken, Bacon, Chipotle Mayo Tramezzini', price: 85, image: '🔥', description: 'Grilled chicken, bacon, chipotle mayo, tomato, red onion and cheese', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e2d5314f?w=400&h=300&fit=crop' }
        ],
        burgers: [
          { name: 'Classic Beef Burger', price: 66, image: '🍔', description: 'Flame grilled beef patty, lettuce, onions, tomato basted with BBQ sauce', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
          { name: 'Cheese Beef Burger', price: 75, image: '🧀', description: 'Flame grilled beef patty with cheddar cheese, lettuce, onions, tomato', imageUrl: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop' },
          { name: 'Bacon & Cheese Beef Burger', price: 90, image: '🥓', description: 'Flame grilled beef patty, cheddar cheese, bacon, lettuce, onions, tomato', imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop' },
          { name: 'Dagwood Burger - Old Timer', price: 102, image: '🍔', description: 'Made on 2 slices of toast, beef patty, bacon, ham, cheese, egg, lettuce', imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=300&fit=crop' },
          { name: 'Double Cheese Burger', price: 104, image: '🍔', description: '2 Flame grilled beef patties with cheese, lettuce, onions, tomato', imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop' }
        ],
        chicken: [
          { name: 'Crumbed Chicken Burger', price: 73, image: '🍗', description: 'Crumbed chicken fillet, lettuce, onions, tomato with tangy mayo', imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e2d5314f?w=400&h=300&fit=crop' },
          { name: 'Crumbed Chicken Cheese Burger', price: 80, image: '🧀', description: 'Crumbed chicken fillet with cheese, lettuce, onions, tomato', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop' },
          { name: 'Crumbed Chicken Cheese & Bacon Burger', price: 98, image: '🥓', description: 'Crumbed chicken fillet, cheese, bacon, lettuce, onions, tomato', imageUrl: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&h=300&fit=crop' },
          { name: 'Chicken Schnitzel', price: 89, image: '🍽️', description: 'Chicken schnitzel with chips or salad', imageUrl: 'https://images.unsplash.com/photo-1598514983318-2f64c8b18724?w=400&h=300&fit=crop' },
          { name: 'Crumbed Chicken Strips', price: 69, image: '🍗', description: 'Crumbed chicken strips with chips', imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop' }
        ],
        wraps: [
          { name: 'Sunrise Surprise Wrap', price: 60, image: '🌯', description: 'Scrambled eggs, bacon, cheese and tomato', imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop' },
          { name: 'Sunshine Brekkie Wrap', price: 78, image: '🌅', description: 'Scrambled eggs, bacon, cheddar, tomato, feta and avocado', imageUrl: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop' },
          { name: 'Chicken Wrap', price: 72, image: '🍗', description: 'Grilled/crumbed chicken, lettuce, tomato, cucumber, red onion, feta', imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop' },
          { name: 'Peri-Peri Chicken, Feta, Avocado Wrap', price: 94, image: '🔥', description: 'Peri-peri chicken, feta, avocado, cream cheese, peppadew and jalapeno', imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop' }
        ],
        salads: [
          { name: 'Greek Salad', price: 69, image: '🥗', description: 'Lettuce, peppers, red onion, tomato, cucumber, olives and feta', imageUrl: 'https://images.unsplash.com/photo-1544041943-de5e60aed1d7?w=400&h=300&fit=crop' },
          { name: 'Chicken Salad', price: 80, image: '🍗', description: 'Grilled/crumbed chicken, lettuce, tomato, red onion, feta and seeds', imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
          { name: 'Bacon, Avo & Feta Salad', price: 85, image: '🥑', description: 'Bacon, lettuce, tomato, red onion, peppadew and seeds', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
          { name: 'Chicken Caesar Salad', price: 99, image: '👑', description: 'Grilled chicken, cheddar cheese, croutons, caesar dressing', imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=300&fit=crop' }
        ],
        chips: [
          { name: 'Hand Cut Chips', price: 37, image: '🍟', description: 'Crispy hand-cut potato chips', imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop' },
          { name: 'Bacon & Cheese Chips', price: 53, image: '🧀', description: 'Hand-cut chips with bacon and cheese sauce', imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop' },
          { name: 'Bacon & Mushroom Chips', price: 53, image: '🍄', description: 'Hand-cut chips with bacon and mushroom sauce', imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop' }
        ],
        beverages: [
          { name: 'Americano', price: 20, image: '☕', description: 'Classic black coffee', imageUrl: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop' },
          { name: 'Cappuccino', price: 20, image: '☕', description: 'Espresso with steamed milk and foam', imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
          { name: 'Latte', price: 22, image: '🥛', description: 'Espresso with steamed milk', imageUrl: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop' },
          { name: 'Chocolate Milkshake', price: 35, image: '🍫', description: 'Rich chocolate milkshake', imageUrl: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=400&h=300&fit=crop' },
          { name: 'Vanilla Milkshake', price: 35, image: '🍦', description: 'Creamy vanilla milkshake', imageUrl: 'https://images.unsplash.com/photo-1523040690464-3a883c3b4bf1?w=400&h=300&fit=crop' },
          { name: 'Strawberry Milkshake', price: 35, image: '🍓', description: 'Fresh strawberry milkshake', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop' }
        ]
      };

      let importedCount = 0;
      for (const [category, items] of Object.entries(currentMenuItems)) {
        console.log(`Importing ${items.length} items from ${category}...`);
        for (const item of items) {
          const menuData = {
            name: item.name,
            description: item.description,
            price: item.price,
            category: category,
            image: item.image,
            imageUrl: item.imageUrl,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await addDoc(collection(db, 'menu'), menuData);
          importedCount++;
        }
      }

      console.log(`Successfully imported ${importedCount} menu items!`);
      toast.success(`Successfully imported ${importedCount} menu items!`);
      fetchMenuItems();
    } catch (error) {
      console.error('Error importing menu:', error);
      toast.error('Error importing menu items: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    console.log('Uploading image:', file.name, file.size, 'bytes');
    const fileName = `menu/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    try {
      console.log('Starting Firebase Storage upload...');
      const snapshot = await uploadBytes(storageRef, file);
      console.log('Upload successful, getting download URL...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Image upload failed: ' + error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log('Starting form submission...', formData);
      let imageUrl = editingItem?.imageUrl || null;
      
      // Upload new image if provided
      if (formData.imageFile) {
        console.log('Uploading new image...');
        imageUrl = await uploadImage(formData.imageFile);
      }

      const menuData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.emoji,
        imageUrl,
        updatedAt: new Date()
      };

      console.log('Menu data to save:', menuData);

      if (editingItem) {
        // Update existing item
        console.log('Updating existing item with ID:', editingItem.id);
        await updateDoc(doc(db, 'menu', editingItem.id), menuData);
        toast.success('Menu item updated successfully');
      } else {
        // Create new item
        console.log('Creating new menu item...');
        menuData.createdAt = new Date();
        const docRef = await addDoc(collection(db, 'menu'), menuData);
        console.log('New item created with ID:', docRef.id);
        toast.success('Menu item added successfully');
      }

      fetchMenuItems();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Error saving menu item: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      emoji: item.image || '🍽️',
      imageFile: null
    });
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      // Delete image from storage if exists
      if (item.imageUrl) {
        const imageRef = ref(storage, item.imageUrl);
        await deleteObject(imageRef);
      }
      
      // Delete document from Firestore
      await deleteDoc(doc(db, 'menu', item.id));
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Error deleting menu item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'specials',
      emoji: '🍽️',
      imageFile: null
    });
    setEditingItem(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Menu</h1>
          <p className="text-gray-600">Add, edit, and manage your restaurant's menu items</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Menu Item
          </button>
          <button
            onClick={importExistingMenu}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
            disabled={uploading}
          >
            <Upload size={20} className="mr-2" />
            {uploading ? 'Importing...' : 'Import Current Menu'}
          </button>
          <button
            onClick={testFirebaseConnection}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
          >
            Test Firebase
          </button>
        </div>
      </motion.div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">{item.image || '🍽️'}</div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-primary-500">
                  R{item.price}
                </span>
                <span className="text-sm text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full">
                  {item.category === 'brekkie' ? 'Breakfast' : 
                   item.category === 'tramezzini' ? 'Tramezzini' :
                   item.category === 'beverages' ? 'Drinks' :
                   item.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No menu items found</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Add Your First Menu Item
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Menu item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                  placeholder="Item description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Emoji *
                </label>
                <input
                  type="text"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleInputChange}
                  required
                  className="input-field text-center text-4xl"
                  placeholder="🍔"
                  maxLength="2"
                />
                <p className="text-xs text-gray-500 mt-1">Choose an emoji to represent this food item</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="input-field"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 btn-primary ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? 'Saving...' : (editingItem ? 'Update' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
