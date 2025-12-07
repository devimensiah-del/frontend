import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Supabase client for auth only
// Data fetching should use the backend API via api.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
