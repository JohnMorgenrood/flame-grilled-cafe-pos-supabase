import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  console.log('AdminDashboard_simple_test component rendering...');
  const navigate = useNavigate();
  const [results, setResults] = useState({});

  useEffect(() => {
    console.log('Starting context tests...');
    
    // Test 1: Categories Context
    try {
      console.log('Testing Categories Context import...');
      import('../context/CategoriesContext').then(module => {
        console.log('✓ Categories Context imported successfully', module);
        setResults(prev => ({...prev, categories: 'SUCCESS'}));
      }).catch(error => {
        console.error('✗ Categories Context import failed:', error);
        setResults(prev => ({...prev, categories: `ERROR: ${error.message}`}));
      });
    } catch (error) {
      console.error('✗ Categories Context test failed:', error);
      setResults(prev => ({...prev, categories: `SYNC ERROR: ${error.message}`}));
    }

    // Test 2: Orders Context
    try {
      console.log('Testing Orders Context import...');
      import('../context/OrdersContext').then(module => {
        console.log('✓ Orders Context imported successfully', module);
        setResults(prev => ({...prev, orders: 'SUCCESS'}));
      }).catch(error => {
        console.error('✗ Orders Context import failed:', error);
        setResults(prev => ({...prev, orders: `ERROR: ${error.message}`}));
      });
    } catch (error) {
      console.error('✗ Orders Context test failed:', error);
      setResults(prev => ({...prev, orders: `SYNC ERROR: ${error.message}`}));
    }

    // Test 3: Messaging Context
    try {
      console.log('Testing Messaging Context import...');
      import('../context/MessagingContext').then(module => {
        console.log('✓ Messaging Context imported successfully', module);
        setResults(prev => ({...prev, messaging: 'SUCCESS'}));
      }).catch(error => {
        console.error('✗ Messaging Context import failed:', error);
        setResults(prev => ({...prev, messaging: `ERROR: ${error.message}`}));
      });
    } catch (error) {
      console.error('✗ Messaging Context test failed:', error);
      setResults(prev => ({...prev, messaging: `SYNC ERROR: ${error.message}`}));
    }

    // Test 4: Inventory Context
    try {
      console.log('Testing Inventory Context import...');
      import('../contexts/InventoryContext').then(module => {
        console.log('✓ Inventory Context imported successfully', module);
        setResults(prev => ({...prev, inventory: 'SUCCESS'}));
      }).catch(error => {
        console.error('✗ Inventory Context import failed:', error);
        setResults(prev => ({...prev, inventory: `ERROR: ${error.message}`}));
      });
    } catch (error) {
      console.error('✗ Inventory Context test failed:', error);
      setResults(prev => ({...prev, inventory: `SYNC ERROR: ${error.message}`}));
    }

    // Test 5: Settings Context
    try {
      console.log('Testing Settings Context import...');
      import('../contexts/SettingsContext').then(module => {
        console.log('✓ Settings Context imported successfully', module);
        setResults(prev => ({...prev, settings: 'SUCCESS'}));
      }).catch(error => {
        console.error('✗ Settings Context import failed:', error);
        setResults(prev => ({...prev, settings: `ERROR: ${error.message}`}));
      });
    } catch (error) {
      console.error('✗ Settings Context test failed:', error);
      setResults(prev => ({...prev, settings: `SYNC ERROR: ${error.message}`}));
    }

    console.log('All context import tests initiated');
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Dashboard - Simple Test</h1>
      <button onClick={() => navigate('/')}>Back to Home</button>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Auto Context Import Test Results</h2>
        <p>Tests run automatically on page load. Check console for details.</p>
        
        <div style={{ marginTop: '15px' }}>
          <div>Categories: <span style={{ color: results.categories === 'SUCCESS' ? 'green' : 'red' }}>{results.categories || 'Testing...'}</span></div>
          <div>Orders: <span style={{ color: results.orders === 'SUCCESS' ? 'green' : 'red' }}>{results.orders || 'Testing...'}</span></div>
          <div>Messaging: <span style={{ color: results.messaging === 'SUCCESS' ? 'green' : 'red' }}>{results.messaging || 'Testing...'}</span></div>
          <div>Inventory: <span style={{ color: results.inventory === 'SUCCESS' ? 'green' : 'red' }}>{results.inventory || 'Testing...'}</span></div>
          <div>Settings: <span style={{ color: results.settings === 'SUCCESS' ? 'green' : 'red' }}>{results.settings || 'Testing...'}</span></div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Console Instructions</h2>
        <p>Open browser console (F12) and look for messages starting with ✓ or ✗</p>
        <button onClick={() => console.log('Test button clicked - check if JavaScript is working')}>
          Test Console Log
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
