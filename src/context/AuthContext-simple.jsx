// Temporary simplified AuthContext for testing
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut 
} from 'firebase/auth';

import { auth, db, googleProvider, facebookProvider } from '../config/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        setCurrentUser(user);
        
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const profileData = userDoc.data();
              setUserProfile(profileData);
              setRole(profileData.role || 'customer');
            } else {
              setRole('customer');
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
            setRole('customer');
          }
        } else {
          setUserProfile(null);
          setRole(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Still set loading to false even if there's an error
      } finally {
        setLoading(false);
      }
    });

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - setting loading to false');
        setLoading(false);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []); // Remove loading dependency to prevent re-running

  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Google Sign In with automatic sign-up and remember account
  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign-in/sign-up...');
      console.log('Auth domain:', auth.app.options.authDomain);
      console.log('Current URL:', window.location.href);
      
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      console.log('Google authentication successful:', firebaseUser);
      
      // Check if this is a new user (first time with Google)
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const isNewUser = !userDoc.exists();
      
      if (isNewUser) {
        // Create new user profile for first-time Google users
        const userProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          role: 'customer', // Default role for new users
          createdAt: new Date().toISOString(),
          phoneNumber: firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
          provider: 'google',
          isVerified: true, // Google accounts are pre-verified
          lastLoginAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
        console.log('Created new Google user profile');
        toast.success('🎉 Welcome! Your Google account has been registered successfully!');
      } else {
        // Update last login for existing users
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          lastLoginAt: new Date().toISOString(),
          photoURL: firebaseUser.photoURL || userDoc.data().photoURL
        }, { merge: true });
        console.log('Updated existing user login time');
        toast.success(`🔥 Welcome back, ${firebaseUser.displayName || 'User'}!`);
      }
      
      return firebaseUser;
    } catch (error) {
      console.error('Google sign in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Handle popup blocked error specifically
      if (error.code === 'auth/popup-blocked') {
        toast.error('🚫 Popup blocked! Please allow popups for this site or try refreshing the page.');
        // Optionally provide instructions
        setTimeout(() => {
          toast('💡 Tip: Look for the popup blocker icon (🚫) in your address bar and click "Always allow"', {
            duration: 6000,
            icon: '💡'
          });
        }, 2000);
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('Please open this in a new tab: flame-grilled-cafe-pos.web.app and try again');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in was cancelled.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Google sign-in is not enabled. Please contact support.');
      } else if (error.code === 'auth/invalid-api-key') {
        toast.error('Invalid API key configuration.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection.');
      } else if (error.code === 'auth/internal-error') {
        toast.error('Internal error. Please try again in a few moments.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Don't show error for cancelled requests
        console.log('Popup request was cancelled');
      } else {
        toast.error(`Google sign-in failed. Please try again.`);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    currentUser,
    userProfile,
    role,
    loading,
    login,
    logout,
    signInWithGoogle,
    // Stub functions for compatibility
    register: () => Promise.reject('Not implemented'),
    signInWithFacebook: () => Promise.reject('Not implemented'),
    sendPhoneOTP: () => Promise.reject('Not implemented'),
    verifyPhoneOTP: () => Promise.reject('Not implemented'),
    resetPassword: () => Promise.reject('Not implemented'),
    updateUserProfile: () => Promise.reject('Not implemented'),
    initializeRecaptcha: () => Promise.reject('Not implemented')
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
