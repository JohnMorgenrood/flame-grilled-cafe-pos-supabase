import React from 'react';

const AdminDashboardTest = () => {
  console.log('AdminDashboardTest rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard Test</h1>
        <p className="text-lg text-gray-600">This is a test version to verify the route is working.</p>
      </div>
    </div>
  );
};

export default AdminDashboardTest;
