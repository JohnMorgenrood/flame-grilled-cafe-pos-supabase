import React from 'react';

const SimpleCustomerTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Customer Dashboard Test</h1>
        <p className="text-gray-600 mb-6">
          This is a simple test to verify the routing and build system are working correctly.
        </p>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">✅ React is working</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">✅ Tailwind CSS is working</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">✅ Routing is working</p>
          </div>
        </div>
        <div className="mt-6">
          <a 
            href="/dashboard" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 block text-center"
          >
            Try Full Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimpleCustomerTest;
