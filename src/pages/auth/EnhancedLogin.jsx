import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext-simple';
import { FaGoogle, FaFacebook, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const EnhancedLogin = () => {
  const navigate = useNavigate();
  const { login, signInWithGoogle, signInWithFacebook, sendPhoneOTP, verifyPhoneOTP, resetPassword, user, currentUser, role, userProfile } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [phoneAuth, setPhoneAuth] = useState({
    phoneNumber: '',
    otpCode: '',
    step: 'phone' // 'phone' or 'otp'
  });

  const [authMode, setAuthMode] = useState('email'); // 'email' or 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Handle navigation when user is authenticated
  useEffect(() => {
    if (user || currentUser) {
      console.log('User authenticated, navigating based on role...');
      console.log('User role:', role);
      console.log('User profile:', userProfile);
      
      let redirectPath = '/customer/dashboard'; // Default for customers
      let welcomeMessage = 'Welcome! Opening your dashboard...';
      
      // Navigate based on user role
      if (role === 'admin') {
        redirectPath = '/admin/enhanced';
        welcomeMessage = '🔥 Welcome Admin! Opening Restaurant Management...';
      } else if (role === 'cashier') {
        redirectPath = '/cashier';
        welcomeMessage = '💼 Welcome Cashier! Opening POS System...';
      } else {
        redirectPath = '/customer/dashboard';
        // Check if user has displayName to personalize message
        const userName = (user?.displayName || currentUser?.displayName || '').split(' ')[0];
        if (userName) {
          welcomeMessage = `🎉 Welcome ${userName}! Opening your order dashboard...`;
        } else {
          welcomeMessage = '🍔 Welcome! Opening your order dashboard...';
        }
      }
      
      toast.success(welcomeMessage);
      
      setTimeout(() => {
        navigate(redirectPath);
      }, 1500);
    }
  }, [user, currentUser, role, userProfile, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e) => {
    setPhoneAuth({
      ...phoneAuth,
      [e.target.name]: e.target.value
    });
  };

  // Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email address');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many failed attempts. Please try again later');
          break;
        default:
          toast.error('Login failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      console.log('Google sign-in completed:', user);
      // Navigation will be handled by useEffect when user state changes
    } catch (error) {
      console.error('Google sign in error:', error);
      
      // Don't show additional error toast as AuthContext already handles it
      if (error.code === 'auth/popup-blocked') {
        // AuthContext already shows the detailed popup blocked message
        console.log('Popup blocked error handled by AuthContext');
      } else if (error.code !== 'auth/cancelled-popup-request') {
        toast.error('Google sign in failed. Please try again');
      }
      setLoading(false); // Only set loading to false on error
    }
    // Don't set loading to false here - let useEffect handle navigation and then clear loading
  };

  // Facebook Sign In
  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      await signInWithFacebook();
      toast.success('Welcome! Signed in with Facebook');
      navigate('/dashboard');
    } catch (error) {
      console.error('Facebook sign in error:', error);
      toast.error('Facebook sign in failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP - Send Code
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneAuth.phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setOtpLoading(true);
    try {
      // Format phone number (add +27 for South Africa if needed)
      let formattedPhone = phoneAuth.phoneNumber;
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+27' + formattedPhone.substring(1);
        } else {
          formattedPhone = '+27' + formattedPhone;
        }
      }

      await sendPhoneOTP(formattedPhone);
      setPhoneAuth({ ...phoneAuth, step: 'otp' });
      toast.success('OTP sent to your phone!');
    } catch (error) {
      console.error('OTP send error:', error);
      toast.error('Failed to send OTP. Please check your phone number');
    } finally {
      setOtpLoading(false);
    }
  };

  // Phone OTP - Verify Code
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!phoneAuth.otpCode) {
      toast.error('Please enter the OTP code');
      return;
    }

    setOtpLoading(true);
    try {
      await verifyPhoneOTP(phoneAuth.otpCode);
      toast.success('Phone verified! Welcome!');
      navigate('/dashboard');
    } catch (error) {
      console.error('OTP verify error:', error);
      toast.error('Invalid OTP code. Please try again');
    } finally {
      setOtpLoading(false);
    }
  };

  // Password Reset
  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    try {
      await resetPassword(formData.email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in or Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            New to Flame Grilled Cafe?{' '}
            <span className="font-medium text-orange-600">
              Use Google to sign up instantly
            </span>{' '}
            or{' '}
            <Link
              to="/register"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              create account with email
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Authentication Mode Toggle */}
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setAuthMode('email')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                authMode === 'email'
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Email / Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('phone')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border-t border-r border-b ${
                authMode === 'phone'
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FaPhone className="inline mr-2" />
              Phone OTP
            </button>
          </div>

          {/* Email/Password Form */}
          {authMode === 'email' && (
            <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm text-orange-600 hover:text-orange-500"
                >
                  Forgot your password?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {/* Phone OTP Form */}
          {authMode === 'phone' && (
            <div className="mt-8 space-y-6">
              {phoneAuth.step === 'phone' ? (
                <form onSubmit={handleSendOTP}>
                  <div>
                    <label htmlFor="phoneNumber" className="sr-only">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Phone number (e.g., 0821234567)"
                      value={phoneAuth.phoneNumber}
                      onChange={handlePhoneChange}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your South African phone number
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <div>
                    <label htmlFor="otpCode" className="sr-only">
                      OTP Code
                    </label>
                    <input
                      id="otpCode"
                      name="otpCode"
                      type="text"
                      required
                      maxLength="6"
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-center text-2xl tracking-widest"
                      placeholder="000000"
                      value={phoneAuth.otpCode}
                      onChange={handlePhoneChange}
                    />
                    <p className="mt-1 text-xs text-gray-500 text-center">
                      Enter the 6-digit code sent to {phoneAuth.phoneNumber}
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button
                      type="submit"
                      disabled={otpLoading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                      {otpLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhoneAuth({ phoneNumber: '', otpCode: '', step: 'phone' })}
                      className="w-full text-sm text-orange-600 hover:text-orange-500"
                    >
                      Change phone number
                    </button>
                  </div>
                </form>
              )}
              <div id="recaptcha-container"></div>
            </div>
          )}

          {/* Social Login Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-orange-50 to-red-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <FaGoogle className="h-5 w-5 text-red-500" />
                <span className="ml-2">Continue with Google</span>
                <span className="ml-1 text-xs text-gray-500">(Sign in or Sign up)</span>
              </button>

              <div className="grid grid-cols-1 gap-3 mt-2">
                <button
                  onClick={handleFacebookSignIn}
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <FaFacebook className="h-5 w-5 text-blue-500" />
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLogin;
