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

export default supabase
