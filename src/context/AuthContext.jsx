// Temporary simplified AuthContext for testing
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

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
      setUser(user);
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            setUserProfile(profileData);
            setRole(profileData.role);
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
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
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
    // Stub functions for compatibility
    register: () => Promise.reject('Not implemented'),
    signInWithGoogle: () => Promise.reject('Not implemented'),
    signInWithFacebook: () => Promise.reject('Not implemented'),
    sendPhoneOTP: () => Promise.reject('Not implemented'),
    verifyPhoneOTP: () => Promise.reject('Not implemented'),
    resetPassword: () => Promise.reject('Not implemented'),
    updateUserProfile: () => Promise.reject('Not implemented'),
    initializeRecaptcha: () => Promise.reject('Not implemented')
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
