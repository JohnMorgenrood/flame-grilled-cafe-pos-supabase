import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple test component
const TestDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Test Dashboard</h1>
      <p className="text-gray-600">This is a test to verify the build system works.</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TestDashboard />} />
          <Route path="/test" element={<TestDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
