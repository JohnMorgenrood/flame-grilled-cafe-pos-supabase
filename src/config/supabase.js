import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export auth for compatibility with existing code
export const auth = supabase.auth

// Export database reference for compatibility
export const db = supabase

// Export storage for compatibility
export const storage = supabase.storage

// Create compatibility functions for authentication
export const signInWithEmailAndPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return { user: data.user }
}

export const createUserWithEmailAndPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return { user: data.user }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const onAuthStateChanged = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// Google Auth Provider compatibility
export const googleProvider = {
  providerId: 'google',
  signIn: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) throw error
    return data
  }
}

// Facebook Auth Provider compatibility
export const facebookProvider = {
  providerId: 'facebook',
  signIn: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
    })
    if (error) throw error
    return data
  }
}

// Analytics placeholder
export const analytics = {
  logEvent: (eventName, parameters) => {
    console.log('Analytics event:', eventName, parameters)
  }
}

export default supabase
