import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([
    {
      id: '1',
      name: 'Lettuce',
      currentStock: 5.2,
      unit: 'kg',
      minimumStock: 2,
      cost: 3.50,
      supplier: 'Fresh Produce Co',
      lastRestocked: '2025-07-18',
      category: 'Vegetables'
    },
    {
      id: '2',
      name: 'Tomatoes',
      currentStock: 8.5,
      unit: 'kg',
      minimumStock: 3,
      cost: 4.20,
      supplier: 'Fresh Produce Co',
      lastRestocked: '2025-07-19',
      category: 'Vegetables'
    },
    {
      id: '3',
      name: 'Beef Patties',
      currentStock: 24,
      unit: 'pieces',
      minimumStock: 10,
      cost: 2.50,
      supplier: 'Quality Meats Ltd',
      lastRestocked: '2025-07-20',
      category: 'Meat'
    },
    {
      id: '4',
      name: 'Burger Buns',
      currentStock: 48,
      unit: 'pieces',
      minimumStock: 20,
      cost: 0.35,
      supplier: 'City Bakery',
      lastRestocked: '2025-07-20',
      category: 'Bakery'
    },
    {
      id: '5',
      name: 'Cheese Slices',
      currentStock: 15,
      unit: 'pieces',
      minimumStock: 8,
      cost: 0.45,
      supplier: 'Dairy Fresh',
      lastRestocked: '2025-07-19',
      category: 'Dairy'
    },
    {
      id: '6',
      name: 'French Fries',
      currentStock: 12,
      unit: 'kg',
      minimumStock: 5,
      cost: 2.80,
      supplier: 'Frozen Foods Inc',
      lastRestocked: '2025-07-18',
      category: 'Frozen'
    },
    {
      id: '7',
      name: 'Coca Cola Syrup',
      currentStock: 3.2,
      unit: 'liters',
      minimumStock: 1,
      cost: 12.50,
      supplier: 'Beverage Supplies',
      lastRestocked: '2025-07-17',
      category: 'Beverages'
    }
  ]);

  const [recipes, setRecipes] = useState([
    {
      itemId: '1', // Classic Burger
      ingredients: [
        { inventoryId: '3', quantity: 1, unit: 'pieces' }, // Beef Patty
        { inventoryId: '4', quantity: 1, unit: 'pieces' }, // Burger Bun
        { inventoryId: '1', quantity: 0.05, unit: 'kg' }, // Lettuce
        { inventoryId: '2', quantity: 0.03, unit: 'kg' }, // Tomatoes
        { inventoryId: '5', quantity: 1, unit: 'pieces' }  // Cheese
      ]
    },
    {
      itemId: '2', // Cheeseburger
      ingredients: [
        { inventoryId: '3', quantity: 1, unit: 'pieces' },
        { inventoryId: '4', quantity: 1, unit: 'pieces' },
        { inventoryId: '1', quantity: 0.05, unit: 'kg' },
        { inventoryId: '2', quantity: 0.03, unit: 'kg' },
        { inventoryId: '5', quantity: 2, unit: 'pieces' }
      ]
    },
    {
      itemId: '5', // French Fries
      ingredients: [
        { inventoryId: '6', quantity: 0.2, unit: 'kg' }
      ]
    },
    {
      itemId: '8', // Coca Cola
      ingredients: [
        { inventoryId: '7', quantity: 0.03, unit: 'liters' }
      ]
    }
  ]);

  const [stockAlerts, setStockAlerts] = useState([]);

  // Add new inventory item
  const addInventoryItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      lastRestocked: new Date().toISOString().split('T')[0]
    };
    setInventory(prev => [...prev, newItem]);
  };

  // Update inventory item
  const updateInventoryItem = (id, updates) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // Delete inventory item
  const deleteInventoryItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    setRecipes(prev => prev.map(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.filter(ing => ing.inventoryId !== id)
    })));
  };

  // Restock item
  const restockItem = (id, quantity) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? {
        ...item,
        currentStock: item.currentStock + quantity,
        lastRestocked: new Date().toISOString().split('T')[0]
      } : item
    ));
  };

  // Deduct stock when order is placed
  const deductStock = (orderedItems) => {
    const newAlerts = [];
    
    setInventory(prev => {
      const updatedInventory = [...prev];
      
      orderedItems.forEach(orderItem => {
        const recipe = recipes.find(r => r.itemId === orderItem.id);
        if (recipe) {
          recipe.ingredients.forEach(ingredient => {
            const inventoryItemIndex = updatedInventory.findIndex(
              item => item.id === ingredient.inventoryId
            );
            
            if (inventoryItemIndex !== -1) {
              const totalUsed = ingredient.quantity * orderItem.quantity;
              updatedInventory[inventoryItemIndex].currentStock -= totalUsed;
              
              // Check if stock is running low
              const item = updatedInventory[inventoryItemIndex];
              if (item.currentStock <= item.minimumStock && !stockAlerts.find(alert => alert.itemId === item.id)) {
                newAlerts.push({
                  id: Date.now() + Math.random(),
                  itemId: item.id,
                  itemName: item.name,
                  currentStock: item.currentStock,
                  minimumStock: item.minimumStock,
                  message: `⚠️ LOW STOCK ALERT: ${item.name} is running low (${item.currentStock.toFixed(2)} ${item.unit} remaining)`,
                  timestamp: new Date().toISOString(),
                  severity: item.currentStock <= 0 ? 'critical' : 'warning'
                });
              }
            }
          });
        }
      });
      
      return updatedInventory;
    });

    if (newAlerts.length > 0) {
      setStockAlerts(prev => [...prev, ...newAlerts]);
    }
  };

  // Get low stock items
  const getLowStockItems = () => {
    return inventory.filter(item => item.currentStock <= item.minimumStock);
  };

  // Dismiss alert
  const dismissAlert = (alertId) => {
    setStockAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Get recipe for item
  const getRecipeForItem = (itemId) => {
    return recipes.find(recipe => recipe.itemId === itemId);
  };

  // Update recipe
  const updateRecipe = (itemId, ingredients) => {
    setRecipes(prev => {
      const existingIndex = prev.findIndex(recipe => recipe.itemId === itemId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = { itemId, ingredients };
        return updated;
      } else {
        return [...prev, { itemId, ingredients }];
      }
    });
  };

  // Calculate total inventory value
  const getTotalInventoryValue = () => {
    return inventory.reduce((total, item) => {
      return total + (item.currentStock * item.cost);
    }, 0);
  };

  // Get inventory analytics
  const getInventoryAnalytics = () => {
    const totalItems = inventory.length;
    const lowStockCount = getLowStockItems().length;
    const totalValue = getTotalInventoryValue();
    const categories = [...new Set(inventory.map(item => item.category))];
    
    const categoryBreakdown = categories.map(category => {
      const categoryItems = inventory.filter(item => item.category === category);
      const categoryValue = categoryItems.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);
      return {
        category,
        itemCount: categoryItems.length,
        totalValue: categoryValue
      };
    });

    return {
      totalItems,
      lowStockCount,
      totalValue,
      categories: categoryBreakdown
    };
  };

  const value = {
    inventory,
    recipes,
    stockAlerts,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    restockItem,
    deductStock,
    getLowStockItems,
    dismissAlert,
    getRecipeForItem,
    updateRecipe,
    getTotalInventoryValue,
    getInventoryAnalytics
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
