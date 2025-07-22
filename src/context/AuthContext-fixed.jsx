import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithCredential,
  PhoneAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../firebase/firebase';
import toast from 'react-hot-toast';

// Create the context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Initialize user state and fetch profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setCurrentUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            setUserProfile(profileData);
            setRole(profileData.role || 'customer');
          } else {
            // Create basic profile for new users
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              role: 'customer',
              createdAt: new Date().toISOString(),
              phoneNumber: firebaseUser.phoneNumber || '',
              photoURL: firebaseUser.photoURL || ''
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setUserProfile(newProfile);
            setRole('customer');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setRole('customer');
        }
      } else {
        setUserProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Initialize reCAPTCHA for phone authentication
  const initializeRecaptcha = () => {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
      setRecaptchaVerifier(verifier);
      return verifier;
    }
    return recaptchaVerifier;
  };

  // Email/Password Registration
  const register = async (email, password, additionalData = {}) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (additionalData.displayName) {
        await updateProfile(firebaseUser, {
          displayName: additionalData.displayName
        });
      }

      // Create user profile in Firestore
      const userProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: additionalData.displayName || '',
        role: additionalData.role || 'customer',
        createdAt: new Date().toISOString(),
        phoneNumber: additionalData.phoneNumber || '',
        address: additionalData.address || '',
        ...additionalData
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      toast.success('Account created successfully!');
      return firebaseUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Email/Password Login
  const login = async (email, password) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      return firebaseUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        const userProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          role: 'customer',
          createdAt: new Date().toISOString(),
          phoneNumber: firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
          provider: 'google'
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      }
      
      toast.success('Signed in with Google successfully!');
      return firebaseUser;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Facebook Sign In
  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const firebaseUser = result.user;
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        const userProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          role: 'customer',
          createdAt: new Date().toISOString(),
          phoneNumber: firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
          provider: 'facebook'
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      }
      
      toast.success('Signed in with Facebook successfully!');
      return firebaseUser;
    } catch (error) {
      console.error('Facebook sign in error:', error);
      throw error;
    }
  };

  // Send Phone OTP
  const sendPhoneOTP = async (phoneNumber) => {
    try {
      const appVerifier = initializeRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      toast.success('OTP sent successfully!');
      return confirmation;
    } catch (error) {
      console.error('Phone OTP error:', error);
      throw error;
    }
  };

  // Verify Phone OTP
  const verifyPhoneOTP = async (otp, userData = {}) => {
    try {
      if (!confirmationResult) {
        throw new Error('No OTP session found. Please request a new OTP.');
      }

      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;

      // Create user profile if new user
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        const userProfile = {
          uid: firebaseUser.uid,
          email: userData.email || '',
          displayName: userData.displayName || '',
          role: 'customer',
          createdAt: new Date().toISOString(),
          phoneNumber: firebaseUser.phoneNumber || '',
          provider: 'phone',
          ...userData
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      }

      toast.success('Phone verified successfully!');
      setConfirmationResult(null);
      return firebaseUser;
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Update User Profile
  const updateUserProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      // Update Firebase Auth profile
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await updateProfile(user, {
          displayName: updates.displayName,
          photoURL: updates.photoURL
        });
      }

      // Update Firestore profile
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // Update local state
      setUserProfile(prev => ({ ...prev, ...updates }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setConfirmationResult(null);
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        setRecaptchaVerifier(null);
      }
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    // User state
    user,
    currentUser,
    userProfile,
    role,
    loading,
    
    // Authentication methods
    register,
    login,
    signInWithGoogle,
    signInWithFacebook,
    sendPhoneOTP,
    verifyPhoneOTP,
    resetPassword,
    logout,
    
    // Profile management
    updateUserProfile,
    
    // Phone auth utilities
    initializeRecaptcha,
    confirmationResult
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Default export
export default AuthProvider;
