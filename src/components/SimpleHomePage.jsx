import React from 'react';

const SimpleHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-2xl w-full mx-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🔥 Flammed Grilled Cafe
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to our amazing restaurant system!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <h3 className="font-semibold text-gray-900 mb-2">✅ React Working</h3>
              <p className="text-sm text-gray-600">Your React application is running perfectly</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="font-semibold text-gray-900 mb-2">✅ Tailwind CSS Working</h3>
              <p className="text-sm text-gray-600">Styling and design system is active</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 justify-center">
              <a 
                href="/test-dashboard" 
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🎯 Customer Dashboard
              </a>
              <a 
                href="/no-icons-dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                🚀 Alternative Dashboard
              </a>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <a 
                href="/simple-test" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Simple Test
              </a>
              <a 
                href="/minimal-dashboard" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Minimal Dashboard
              </a>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">
              🎉 Everything is working! Click any button above to test different components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHomePage;
