import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ecbzccrvurjuvsscfpop.supabase.co' // Replace with your Supabase URL
const supabaseAnonKey = 'sb_secret_zabEpN8ZfDC8J-E356cOdQ_K0mvEZbC' // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
