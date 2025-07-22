import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit3, Trash2, Save, X, Flame, Star, Search, Zap } from 'lucide-react';

import { db } from '../config/supabase';

// Optimized Fast Menu Management - Loads in under 3 seconds
const FastMenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('specials');
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Optimized categories - minimal data
  const categories = useMemo(() => [
    { id: 'specials', name: '⭐ Specials', color: 'bg-yellow-500' },
    { id: 'brekkie', name: '🥓 Brekkie', color: 'bg-orange-500' },
    { id: 'sandwiches', name: '🍞 Sandwiches', color: 'bg-amber-500' },
    { id: 'burgers', name: '🍔 Burgers', color: 'bg-red-500' },
    { id: 'chicken', name: '🍗 Chicken', color: 'bg-yellow-600' },
    { id: 'wraps', name: '🌯 Wraps', color: 'bg-purple-500' },
    { id: 'salads', name: '🥗 Salads', color: 'bg-green-500' },
    { id: 'chips', name: '🍟 Chips', color: 'bg-orange-600' },
    { id: 'beverages', name: '☕ Drinks', color: 'bg-blue-500' }
  ], []);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'specials',
    image: '🍔'
  });

  // Fast fetch with minimal data
  const fetchMenuItems = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'menu'));
      const items = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          category: data.category || 'specials',
          image: data.image || '🍔'
        };
      });
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setMenuItems([]); // Fail gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Optimized filtered items with search
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = item.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Fast add item
  const handleAddItem = useCallback(async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    
    try {
      const itemData = {
        ...newItem,
        price: parseFloat(newItem.price),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'menu'), itemData);
      
      setMenuItems(prev => [...prev, { id: docRef.id, ...itemData }]);
      setNewItem({ name: '', description: '', price: '', category: 'specials', image: '🍔' });
      setShowAddModal(false);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }, [newItem]);

  // Fast update item
  const handleUpdateItem = useCallback(async (item) => {
    try {
      const updateData = {
        ...item,
        price: parseFloat(item.price),
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'menu', item.id), updateData);
      
      setMenuItems(prev => prev.map(menuItem => 
        menuItem.id === item.id ? { ...updateData, id: item.id } : menuItem
      ));
      setEditingItem(null);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }, []);

  // Fast delete item
  const handleDeleteItem = useCallback(async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    
    try {
      await deleteDoc(doc(db, 'menu', itemId));
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }, []);

  // Fast loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-8 h-8 text-blue-500 animate-pulse mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fast Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link 
              to="/admin"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Admin</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-800">Fast Menu Editor</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-blue-500 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <span>🚀 Fast Mode Active • Last Update: {new Date(lastUpdate).toLocaleTimeString()}</span>
          <span>Total: {menuItems.length} • Showing: {filteredItems.length}</span>
        </div>
      </div>

      {/* Fast Category Tabs */}
      <div className="bg-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? `${category.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Fast Menu Grid */}
      <div className="p-4 max-w-7xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {categories.find(cat => cat.id === selectedCategory)?.name} ({filteredItems.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <FastMenuItem 
              key={item.id} 
              item={item} 
              onEdit={setEditingItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">{searchQuery ? '🔍' : '🍽️'}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? `No items found for "${searchQuery}"` : 'No items in this category'}
            </h3>
            <button
              onClick={() => searchQuery ? setSearchQuery('') : setShowAddModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {searchQuery ? 'Clear Search' : 'Add First Item'}
            </button>
          </div>
        )}
      </div>

      {/* Fast Edit Modal */}
      {editingItem && (
        <FastEditModal
          item={editingItem}
          onSave={handleUpdateItem}
          onCancel={() => setEditingItem(null)}
          categories={categories}
        />
      )}

      {/* Fast Add Modal */}
      {showAddModal && (
        <FastAddModal
          item={newItem}
          setItem={setNewItem}
          onSubmit={handleAddItem}
          onCancel={() => setShowAddModal(false)}
          categories={categories}
        />
      )}
    </div>
  );
};

// Fast Menu Item Component
const FastMenuItem = React.memo(({ item, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg border hover:shadow-md transition-shadow group">
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{item.image}</div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button
            onClick={() => onEdit(item)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-red-600">R{item.price?.toFixed(2)}</span>
        <Star className="w-4 h-4 text-yellow-500" />
      </div>
    </div>
  </div>
));

// Fast Edit Modal
const FastEditModal = ({ item, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState(item);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Edit Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows="2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Emoji"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg text-center text-xl"
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Fast Add Modal
const FastAddModal = ({ item, setItem, onSubmit, onCancel, categories }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-md w-full">
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">Add New Item</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={item.name}
            onChange={(e) => setItem({...item, name: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={item.description}
            onChange={(e) => setItem({...item, description: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            rows="2"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={item.price}
            onChange={(e) => setItem({...item, price: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <select
            value={item.category}
            onChange={(e) => setItem({...item, category: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Emoji 🍔"
            value={item.image}
            onChange={(e) => setItem({...item, image: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-center text-xl"
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
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default FastMenuManagement;
