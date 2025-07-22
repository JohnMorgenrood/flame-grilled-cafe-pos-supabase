import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { auth, googleProvider } from '../firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import { locationService } from '../services/LocationService';

const ConfigChecker = () => {
  const [checks, setChecks] = useState({
    firebase: null,
    googleAuth: null,
    googleMaps: null,
    geolocation: null
  });
  const [testing, setTesting] = useState(false);

  const runAllChecks = async () => {
    setTesting(true);
    const results = {};

    // Check Firebase
    try {
      results.firebase = {
        status: auth ? 'success' : 'error',
        message: auth ? 'Firebase initialized' : 'Firebase not initialized'
      };
    } catch (error) {
      results.firebase = {
        status: 'error',
        message: `Firebase error: ${error.message}`
      };
    }

    // Check Google Auth
    try {
      // Just check if we can create the provider
      if (googleProvider) {
        results.googleAuth = {
          status: 'success',
          message: 'Google Auth provider configured'
        };
      } else {
        results.googleAuth = {
          status: 'error',
          message: 'Google Auth provider not configured'
        };
      }
    } catch (error) {
      results.googleAuth = {
        status: 'error',
        message: `Google Auth error: ${error.message}`
      };
    }

    // Check Google Maps API
    const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!mapsApiKey || mapsApiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      results.googleMaps = {
        status: 'warning',
        message: 'Google Maps API key not configured. Using fallback service.'
      };
    } else {
      try {
        // Test the API key with a simple request
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=Johannesburg&key=${mapsApiKey}`
        );
        const data = await response.json();
        
        if (data.status === 'OK') {
          results.googleMaps = {
            status: 'success',
            message: 'Google Maps API working correctly'
          };
        } else if (data.status === 'REQUEST_DENIED') {
          results.googleMaps = {
            status: 'error',
            message: 'Google Maps API key invalid or restricted'
          };
        } else {
          results.googleMaps = {
            status: 'warning',
            message: `Google Maps API issue: ${data.status}`
          };
        }
      } catch (error) {
        results.googleMaps = {
          status: 'error',
          message: `Google Maps API error: ${error.message}`
        };
      }
    }

    // Check Geolocation
    if ('geolocation' in navigator) {
      results.geolocation = {
        status: 'success',
        message: 'Geolocation supported by browser'
      };
    } else {
      results.geolocation = {
        status: 'error',
        message: 'Geolocation not supported by browser'
      };
    }

    setChecks(results);
    setTesting(false);
  };

  const testGoogleSignIn = async () => {
    try {
      toast.loading('Testing Google Sign-in...', { id: 'google-test' });
      await signInWithPopup(auth, googleProvider);
      toast.success('Google Sign-in working!', { id: 'google-test' });
    } catch (error) {
      console.error('Google sign-in test error:', error);
      toast.error(`Google Sign-in failed: ${error.code}`, { id: 'google-test' });
    }
  };

  const testLocationServices = async () => {
    try {
      toast.loading('Testing location services...', { id: 'location-test' });
      const position = await locationService.getCurrentPosition();
      const address = await locationService.getAddressFromCoordinates(
        position.latitude, 
        position.longitude
      );
      toast.success(`Location detected: ${address.city}, ${address.province}`, { id: 'location-test' });
    } catch (error) {
      console.error('Location test error:', error);
      toast.error(`Location test failed: ${error.message}`, { id: 'location-test' });
    }
  };

  const getIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error':
        return <FaTimes className="text-red-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-pulse" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Configuration Checker</h2>
      
      <div className="space-y-4">
        <button
          onClick={runAllChecks}
          disabled={testing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Checking...' : 'Run Configuration Check'}
        </button>

        {Object.keys(checks).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                {getIcon(checks.firebase?.status)}
                <span className="font-medium">Firebase</span>
              </div>
              <span className="text-sm text-gray-600">{checks.firebase?.message}</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                {getIcon(checks.googleAuth?.status)}
                <span className="font-medium">Google Authentication</span>
              </div>
              <span className="text-sm text-gray-600">{checks.googleAuth?.message}</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                {getIcon(checks.googleMaps?.status)}
                <span className="font-medium">Google Maps API</span>
              </div>
              <span className="text-sm text-gray-600">{checks.googleMaps?.message}</span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center space-x-3">
                {getIcon(checks.geolocation?.status)}
                <span className="font-medium">Browser Geolocation</span>
              </div>
              <span className="text-sm text-gray-600">{checks.geolocation?.message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={testGoogleSignIn}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Test Google Sign-In
          </button>
          
          <button
            onClick={testLocationServices}
            className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
          >
            Test Location Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigChecker;
