import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  console.log('AdminDashboard_hook_test component rendering...');
  const navigate = useNavigate();
  const [results, setResults] = useState({});
  const [currentTest, setCurrentTest] = useState(0);

  useEffect(() => {
    console.log('Starting context hook tests...');
    
    const runTests = async () => {
      // Test 1: Categories Hook
      try {
        console.log('Testing Categories hook...');
        setCurrentTest(1);
        const { useCategories } = await import('../context/CategoriesContext');
        const categoriesContext = useCategories();
        console.log('✓ Categories hook SUCCESS', categoriesContext);
        setResults(prev => ({...prev, categories: `SUCCESS - ${categoriesContext.categories?.length || 0} categories`}));
      } catch (error) {
        console.error('✗ Categories hook ERROR:', error);
        setResults(prev => ({...prev, categories: `ERROR: ${error.message}`}));
        return; // Stop testing if this fails
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));

      // Test 2: Orders Hook
      try {
        console.log('Testing Orders hook...');
        setCurrentTest(2);
        const { useOrders } = await import('../context/OrdersContext');
        const ordersContext = useOrders();
        console.log('✓ Orders hook SUCCESS', ordersContext);
        setResults(prev => ({...prev, orders: `SUCCESS - ${ordersContext.orders?.length || 0} orders`}));
      } catch (error) {
        console.error('✗ Orders hook ERROR:', error);
        setResults(prev => ({...prev, orders: `ERROR: ${error.message}`}));
        return; // Stop testing if this fails
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      // Test 3: Messaging Hook
      try {
        console.log('Testing Messaging hook...');
        setCurrentTest(3);
        const { useMessaging } = await import('../context/MessagingContext');
        const messagingContext = useMessaging();
        console.log('✓ Messaging hook SUCCESS', messagingContext);
        setResults(prev => ({...prev, messaging: `SUCCESS - ${messagingContext.messages?.length || 0} messages`}));
      } catch (error) {
        console.error('✗ Messaging hook ERROR:', error);
        setResults(prev => ({...prev, messaging: `ERROR: ${error.message}`}));
        return; // Stop testing if this fails
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      // Test 4: Inventory Hook
      try {
        console.log('Testing Inventory hook...');
        setCurrentTest(4);
        const { useInventory } = await import('../contexts/InventoryContext');
        const inventoryContext = useInventory();
        console.log('✓ Inventory hook SUCCESS', inventoryContext);
        setResults(prev => ({...prev, inventory: `SUCCESS - ${inventoryContext.inventory?.length || 0} items`}));
      } catch (error) {
        console.error('✗ Inventory hook ERROR:', error);
        setResults(prev => ({...prev, inventory: `ERROR: ${error.message}`}));
        return; // Stop testing if this fails
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      // Test 5: Settings Hook
      try {
        console.log('Testing Settings hook...');
        setCurrentTest(5);
        const { useSettings } = await import('../contexts/SettingsContext');
        const settingsContext = useSettings();
        console.log('✓ Settings hook SUCCESS', settingsContext);
        setResults(prev => ({...prev, settings: `SUCCESS - Restaurant: ${settingsContext.settings?.restaurantName || 'Unknown'}`}));
      } catch (error) {
        console.error('✗ Settings hook ERROR:', error);
        setResults(prev => ({...prev, settings: `ERROR: ${error.message}`}));
        return; // Stop testing if this fails
      }

      console.log('All context hook tests completed successfully!');
      setCurrentTest(0);
    };

    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Dashboard - Hook Test</h1>
      <button onClick={() => navigate('/')}>Back to Home</button>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Context Hook Test Results</h2>
        <p>Tests run automatically on page load. Currently testing: {
          currentTest === 0 ? 'Complete' :
          currentTest === 1 ? 'Categories' :
          currentTest === 2 ? 'Orders' :
          currentTest === 3 ? 'Messaging' :
          currentTest === 4 ? 'Inventory' :
          currentTest === 5 ? 'Settings' : 'Unknown'
        }</p>
        
        <div style={{ marginTop: '15px' }}>
          <div>Categories: <span style={{ color: results.categories?.includes('SUCCESS') ? 'green' : 'red' }}>{results.categories || 'Testing...'}</span></div>
          <div>Orders: <span style={{ color: results.orders?.includes('SUCCESS') ? 'green' : 'red' }}>{results.orders || 'Waiting...'}</span></div>
          <div>Messaging: <span style={{ color: results.messaging?.includes('SUCCESS') ? 'green' : 'red' }}>{results.messaging || 'Waiting...'}</span></div>
          <div>Inventory: <span style={{ color: results.inventory?.includes('SUCCESS') ? 'green' : 'red' }}>{results.inventory || 'Waiting...'}</span></div>
          <div>Settings: <span style={{ color: results.settings?.includes('SUCCESS') ? 'green' : 'red' }}>{results.settings || 'Waiting...'}</span></div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Console Instructions</h2>
        <p>Open browser console (F12) and look for messages starting with ✓ or ✗</p>
        <p><strong>Note:</strong> If the page goes white, the last test shown above is the one that caused the crash.</p>
        <button onClick={() => console.log('Test button clicked - JavaScript is working', results)}>
          Log Current Results
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
