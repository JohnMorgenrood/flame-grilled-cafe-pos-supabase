import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  Store,
  Users,
  Flame
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('LoginPage loaded on mobile:', /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Demo credentials
  const credentials = {
    admin: {
      email: 'admin@flamme.com',
      password: 'admin123',
      name: 'Restaurant Owner'
    },
    cashier: {
      email: 'cashier@flamme.com',
      password: 'cashier123',
      name: 'Store Cashier'
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Login attempt:', { loginType, formData });

    // Simple auth without complex context
    setTimeout(() => {
      try {
        if (loginType === 'customer') {
          const customerUser = {
            uid: `customer_${Date.now()}`,
            email: formData.email || 'customer@example.com',
            displayName: 'Customer',
            role: 'customer',
            phone: formData.phone
          };
          localStorage.setItem('flameGrilledUser', JSON.stringify(customerUser));
          console.log('Customer logged in, navigating to /dashboard');
          navigate('/dashboard');
        } else if (loginType === 'admin' && 
                   formData.email === credentials.admin.email && 
                   formData.password === credentials.admin.password) {
          const adminUser = {
            uid: 'admin_001',
            email: credentials.admin.email,
            displayName: credentials.admin.name,
            role: 'admin'
          };
          localStorage.setItem('flameGrilledUser', JSON.stringify(adminUser));
          console.log('Admin logged in, navigating to /admin');
          navigate('/admin');
        } else if (loginType === 'cashier' && 
                   formData.email === credentials.cashier.email && 
                   formData.password === credentials.cashier.password) {
          const cashierUser = {
            uid: 'cashier_001',
            email: credentials.cashier.email,
            displayName: credentials.cashier.name,
            role: 'cashier'
          };
          localStorage.setItem('flameGrilledUser', JSON.stringify(cashierUser));
          console.log('Cashier logged in, navigating to /cashier');
          navigate('/cashier');
        } else if (loginType !== 'customer') {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const LoginTypeCard = ({ type, icon: Icon, title, description, gradient, isSelected, onClick }) => (
    <button
      onClick={() => onClick(type)}
      className={`w-full p-6 rounded-3xl border-2 transition-all duration-300 transform hover:scale-105 ${
        isSelected
          ? `border-red-500 bg-gradient-to-r ${gradient} text-white shadow-lg`
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <Icon className={`w-8 h-8 mx-auto mb-3 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
      <h3 className={`font-bold text-lg mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
        {description}
      </p>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Flame Grilled Cafe</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Login Type Selection */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Welcome Back
              </h2>
              
              <div className="space-y-3 mb-6">
                <LoginTypeCard
                  type="customer"
                  icon={Users}
                  title="Customer"
                  description="Track your orders & favorites"
                  gradient="from-blue-500 to-cyan-500"
                  isSelected={loginType === 'customer'}
                  onClick={setLoginType}
                />
                <LoginTypeCard
                  type="cashier"
                  icon={Store}
                  title="Cashier"
                  description="Process orders & payments"
                  gradient="from-green-500 to-teal-500"
                  isSelected={loginType === 'cashier'}
                  onClick={setLoginType}
                />
                <LoginTypeCard
                  type="admin"
                  icon={Shield}
                  title="Owner/Admin"
                  description="Manage products & analytics"
                  gradient="from-red-500 to-orange-500"
                  isSelected={loginType === 'admin'}
                  onClick={setLoginType}
                />
              </div>
            </div>

            {/* Login Form */}
            <div className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {loginType === 'customer' ? (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Enter your phone number to access your account
                    </p>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 transition-colors"
                        required
                      />
                    </div>
                    
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-red-500 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Demo Credentials Info */}
                    <div className="bg-gray-50 rounded-2xl p-4 text-sm">
                      <p className="font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                      <div className="space-y-1 text-gray-600">
                        <p><strong>Admin:</strong> admin@flamme.com / admin123</p>
                        <p><strong>Cashier:</strong> cashier@flamme.com / cashier123</p>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading || (loginType !== 'customer' && (!formData.email || !formData.password)) || (loginType === 'customer' && !formData.phone)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    loginType === 'customer'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                      : loginType === 'cashier'
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                      : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                  } text-white shadow-lg hover:shadow-xl`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    `Sign In as ${loginType.charAt(0).toUpperCase() + loginType.slice(1)}`
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
