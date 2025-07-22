// Import Supabase configuration
import { supabase } from '../config/supabase.js'

// Export Supabase client as default
export default supabase;

// Export auth for compatibility with existing code
export const auth = supabase.auth;

// Export database reference for compatibility (Supabase uses different API)
export const db = supabase;

// Export storage for compatibility
export const storage = supabase.storage;

// Create compatibility functions for Google/Facebook auth
// Note: Supabase handles OAuth differently than Firebase
export const googleProvider = {
  // Supabase OAuth will be handled differently
  providerId: 'google'
};

export const facebookProvider = {
  // Supabase OAuth will be handled differently  
  providerId: 'facebook'
};

// Analytics placeholder - you can integrate with your preferred analytics service
export const analytics = {
  logEvent: (eventName, parameters) => {
    console.log('Analytics event:', eventName, parameters);
    // Replace with your preferred analytics solution
  }
};
