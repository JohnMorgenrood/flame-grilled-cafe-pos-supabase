import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  console.log('AdminDashboard_debug component rendering...');
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState({});

  // Test Categories Context
  const testCategories = () => {
    try {
      console.log('Importing Categories Context...');
      import('../context/CategoriesContext').then(module => {
        console.log('Categories module loaded:', module);
        setTestResults(prev => ({...prev, categories: 'Import successful'}));
      }).catch(error => {
        console.error('Categories import error:', error);
        setTestResults(prev => ({...prev, categories: `Import error: ${error.message}`}));
      });
    } catch (error) {
      console.error('Categories test error:', error);
      setTestResults(prev => ({...prev, categories: `Test error: ${error.message}`}));
    }
  };

  // Test Orders Context  
  const testOrders = () => {
    try {
      console.log('Importing Orders Context...');
      import('../context/OrdersContext').then(module => {
        console.log('Orders module loaded:', module);
        setTestResults(prev => ({...prev, orders: 'Import successful'}));
      }).catch(error => {
        console.error('Orders import error:', error);
        setTestResults(prev => ({...prev, orders: `Import error: ${error.message}`}));
      });
    } catch (error) {
      console.error('Orders test error:', error);
      setTestResults(prev => ({...prev, orders: `Test error: ${error.message}`}));
    }
  };

  // Test Messaging Context
  const testMessaging = () => {
    try {
      console.log('Importing Messaging Context...');
      import('../context/MessagingContext').then(module => {
        console.log('Messaging module loaded:', module);
        setTestResults(prev => ({...prev, messaging: 'Import successful'}));
      }).catch(error => {
        console.error('Messaging import error:', error);
        setTestResults(prev => ({...prev, messaging: `Import error: ${error.message}`}));
      });
    } catch (error) {
      console.error('Messaging test error:', error);
      setTestResults(prev => ({...prev, messaging: `Test error: ${error.message}`}));
    }
  };

  // Test Inventory Context
  const testInventory = () => {
    try {
      console.log('Importing Inventory Context...');
      import('../contexts/InventoryContext').then(module => {
        console.log('Inventory module loaded:', module);
        setTestResults(prev => ({...prev, inventory: 'Import successful'}));
      }).catch(error => {
        console.error('Inventory import error:', error);
        setTestResults(prev => ({...prev, inventory: `Import error: ${error.message}`}));
      });
    } catch (error) {
      console.error('Inventory test error:', error);
      setTestResults(prev => ({...prev, inventory: `Test error: ${error.message}`}));
    }
  };

  // Test Settings Context
  const testSettings = () => {
    try {
      console.log('Importing Settings Context...');
      import('../contexts/SettingsContext').then(module => {
        console.log('Settings module loaded:', module);
        setTestResults(prev => ({...prev, settings: 'Import successful'}));
      }).catch(error => {
        console.error('Settings import error:', error);
        setTestResults(prev => ({...prev, settings: `Import error: ${error.message}`}));
      });
    } catch (error) {
      console.error('Settings test error:', error);
      setTestResults(prev => ({...prev, settings: `Test error: ${error.message}`}));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Dashboard Debug</h1>
      <button onClick={() => navigate('/')}>Back to Home</button>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Context Import Tests</h2>
        <p>Click each button to test importing individual contexts:</p>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testCategories}>Test Categories Context Import</button>
          <span style={{ marginLeft: '10px', color: testResults.categories?.includes('error') ? 'red' : 'green' }}>
            {testResults.categories || 'Not tested'}
          </span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testOrders}>Test Orders Context Import</button>
          <span style={{ marginLeft: '10px', color: testResults.orders?.includes('error') ? 'red' : 'green' }}>
            {testResults.orders || 'Not tested'}
          </span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testMessaging}>Test Messaging Context Import</button>
          <span style={{ marginLeft: '10px', color: testResults.messaging?.includes('error') ? 'red' : 'green' }}>
            {testResults.messaging || 'Not tested'}
          </span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testInventory}>Test Inventory Context Import</button>
          <span style={{ marginLeft: '10px', color: testResults.inventory?.includes('error') ? 'red' : 'green' }}>
            {testResults.inventory || 'Not tested'}
          </span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <button onClick={testSettings}>Test Settings Context Import</button>
          <span style={{ marginLeft: '10px', color: testResults.settings?.includes('error') ? 'red' : 'green' }}>
            {testResults.settings || 'Not tested'}
          </span>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => {
            testCategories();
            testOrders();
            testMessaging();
            testInventory();
            testSettings();
          }}>
            Test All Imports
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Console Output</h2>
        <p>Check the browser console (F12) for detailed error messages.</p>
        <button onClick={() => console.log('Current test results:', testResults)}>
          Log Results to Console
        </button>
      </div>
    </div>
  );

  console.log('Context Results:', contextResults);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Dashboard Debug</h1>
      <button onClick={() => navigate('/')}>Back to Home</button>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Debug Controls</h2>
        <p>Current Debug Step: {debugStep}</p>
        <button onClick={() => setDebugStep(Math.max(0, debugStep - 1))}>
          Previous Step
        </button>
        <button onClick={() => setDebugStep(Math.min(5, debugStep + 1))}>
          Next Step
        </button>
        <button onClick={() => setDebugStep(5)}>
          Test All
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Context Test Results</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {JSON.stringify(contextResults, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Console Output</h2>
        <p>Check the browser console for detailed error messages.</p>
        <button onClick={() => console.log('Manual console test')}>
          Test Console Log
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
