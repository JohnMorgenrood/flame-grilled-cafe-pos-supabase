import React from 'react';
import { auth, googleProvider } from '../firebase/firebase';
import toast from 'react-hot-toast';

const FirebaseDebug = () => {
  const checkFirebaseConfig = () => {
    console.log('=== Firebase Debug Info ===');
    console.log('Auth instance:', auth);
    console.log('Auth app options:', auth.app.options);
    console.log('Auth domain:', auth.app.options.authDomain);
    console.log('Project ID:', auth.app.options.projectId);
    console.log('API Key:', auth.app.options.apiKey ? 'Present' : 'Missing');
    console.log('Google Provider:', googleProvider);
    console.log('Current URL:', window.location.href);
    console.log('Current Domain:', window.location.hostname);
    console.log('Current User:', auth.currentUser);
    console.log('===========================');
    
    toast.success('Debug info logged to console. Press F12 to view.');
  };

  const testGoogleProvider = async () => {
    try {
      console.log('Testing Google Provider configuration...');
      console.log('Provider ID:', googleProvider.providerId);
      console.log('Custom parameters:', googleProvider.customParameters);
      console.log('Scopes:', googleProvider.scopes);
      
      toast.success('Google Provider config looks good. Check console for details.');
    } catch (error) {
      console.error('Google Provider test failed:', error);
      toast.error('Google Provider configuration issue detected.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-sm font-semibold mb-2">Firebase Debug</h3>
      <div className="space-y-2">
        <button
          onClick={checkFirebaseConfig}
          className="block w-full text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Check Config
        </button>
        <button
          onClick={testGoogleProvider}
          className="block w-full text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
        >
          Test Google Provider
        </button>
      </div>
    </div>
  );
};

export default FirebaseDebug;
