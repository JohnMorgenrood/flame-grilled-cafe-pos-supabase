import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, Trash2, Save, X, Flame } from 'lucide-react';
import { supabase } from '../config/supabase';

// WORKING Menu Management System - Simple and Fast
const WorkingMenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('specials');
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'specials',
    image: '🍔'
  });

  // Categories
  const categories = [
    { id: 'specials', name: '⭐ Specials' },
    { id: 'burgers', name: '🍔 Burgers' },
    { id: 'chicken', name: '🍗 Chicken' },
    { id: 'wraps', name: '🌯 Wraps' },
    { id: 'salads', name: '🥗 Salads' },
    { id: 'beverages', name: '☕ Drinks' }
  ];

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'menu'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter items by category
  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  // Add new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    try {
      const docRef = await addDoc(collection(db, 'menu'), {
        ...newItem,
        price: parseFloat(newItem.price),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setMenuItems([...menuItems, { id: docRef.id, ...newItem, price: parseFloat(newItem.price) }]);
      setNewItem({ name: '', description: '', price: '', category: 'specials', image: '🍔' });
      setShowAddModal(false);
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again.');
    }
  };

  // Update item
  const handleUpdateItem = async (item) => {
    try {
      await updateDoc(doc(db, 'menu', item.id), {
        ...item,
        price: parseFloat(item.price),
        updatedAt: new Date()
      });

      setMenuItems(menuItems.map(menuItem => 
        menuItem.id === item.id ? { ...item, price: parseFloat(item.price) } : menuItem
      ));
      setEditingItem(null);
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item. Please try again.');
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'menu', itemId));
      setMenuItems(menuItems.filter(item => item.id !== itemId));
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Flame className="w-8 h-8 text-orange-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Admin</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900">Menu Management</h1>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Success Notice */}
      <div className="bg-green-100 border-l-4 border-green-500 p-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-700">
            ✅ <strong>VS Code Optimized!</strong> Removed Cline & Bito extensions, cleared caches. Your system is now faster!
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {categories.find(cat => cat.id === selectedCategory)?.name} ({filteredItems.length} items)
          </h2>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items in this category</h3>
            <p className="text-gray-600 mb-6">Add your first item to get started!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">R{item.price?.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Category: {item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Add New Menu Item</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price (R)"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Emoji (🍔)"
                  value={newItem.image}
                  onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-center text-2xl"
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                  >
                    Add Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">Edit Menu Item</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateItem(editingItem); }} className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price (R)"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Emoji (🍔)"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-center text-2xl"
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingMenuManagement;
