import React, { createContext, useContext, useState, useEffect } from 'react';

const SimpleAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
};

export const SimpleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    try {
      const savedUser = localStorage.getItem('flameGrilledUser');
      console.log('SimpleAuthProvider loading user:', !!savedUser);
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('User parsed successfully:', parsedUser.role);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing saved user:', parseError);
          localStorage.removeItem('flameGrilledUser');
        }
      }
    } catch (storageError) {
      console.error('Error accessing localStorage:', storageError);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('SimpleAuth login:', userData);
    setUser(userData);
    try {
      localStorage.setItem('flameGrilledUser', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  const logout = () => {
    console.log('SimpleAuth logout');
    setUser(null);
    try {
      localStorage.removeItem('flameGrilledUser');
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};
