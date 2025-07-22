import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogIn } from 'lucide-react';

const SignIn = () => {
  const { signInWithGoogle, signInWithEmail, loading, currentUser, logout, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const from = location.state?.from?.pathname || '/customer/dashboard';

  useEffect(() => {
    if (currentUser) navigate('/customer/dashboard');
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Signed in successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error(error.message || 'Failed to sign in with Google.');
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter both email and password.');
    }
    try {
      await signInWithEmail(email, password);
      toast.success('Signed in successfully!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Email sign in error:', error);
      let msg = "Sign in failed.";
      if (error.code === "auth/wrong-password") msg = "Incorrect password.";
      if (error.code === "auth/user-not-found") msg = "No account with this email.";
      toast.error(msg);
    }
  };

  const handleReset = async () => {
    try {
      await resetPassword(resetEmail || email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Could not send reset email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 space-y-6 border border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
          <p className="mt-2 text-gray-400">Sign in to continue to Flame-Grilled Café.</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-white rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
          <span className="font-medium text-gray-800">
            {loading ? 'Signing in...' : 'Continue with Google'}
          </span>
        </button>
        <div className="w-full border-t border-gray-600" />
        <div className="relative">
          <div className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
        </div>
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a onClick={handleReset} className="cursor-pointer text-red-500 hover:text-red-400">
                Forgot your password?
              </a>
            </div>
          </div>
          <div className="text-sm">
            <span>Don't have an account? </span>
            <Link to="/signup" className="font-medium text-red-500 hover:text-red-400">
              Sign up
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 disabled:opacity-50"
          >
            <LogIn className="mr-2 h-5 w-5" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-4">
            <svg className="animate-spin h-6 w-6 text-red-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
