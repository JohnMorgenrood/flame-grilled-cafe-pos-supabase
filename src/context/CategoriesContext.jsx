import React, { createContext, useContext, useState } from 'react';

const CategoriesContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([
    { id: 'specials', name: '⭐ Specials', icon: '⭐', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'brekkie', name: 'Brekkie Rolls', icon: '🥓', gradient: 'from-orange-500 to-red-500' },
    { id: 'sandwiches', name: 'Toasted Sandwiches', icon: '🍞', gradient: 'from-amber-500 to-yellow-500' },
    { id: 'tramezzini', name: 'Gourmet Tramezzini', icon: '🥪', gradient: 'from-green-500 to-teal-500' },
    { id: 'burgers', name: 'Flame Grilled Burgers', icon: '🍔', gradient: 'from-red-500 to-orange-500' },
    { id: 'chicken', name: 'Chicken', icon: '🍗', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'wraps', name: 'Wraps', icon: '�', gradient: 'from-purple-500 to-pink-500' },
    { id: 'salads', name: 'Salads', icon: '🥗', gradient: 'from-green-500 to-emerald-500' },
    { id: 'chips', name: 'Hand Cut Chips', icon: '🍟', gradient: 'from-amber-500 to-orange-500' },
    { id: 'beverages', name: 'Beverages', icon: '☕', gradient: 'from-blue-500 to-cyan-500' }
  ]);

  const addCategory = (category) => {
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (categoryId, updatedCategory) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? updatedCategory : cat
    ));
  };

  const deleteCategory = (categoryId) => {
    if (categories.length > 1) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      return true;
    }
    return false;
  };

  const value = {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};
