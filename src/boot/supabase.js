import { createClient } from '@supabase/supabase-js'
import { boot } from 'quasar/wrappers'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NODE_ENV === 'production' 
  ? 'YOUR_PRODUCTION_SUPABASE_URL' 
  : 'http://localhost:8000'
  
const supabaseAnonKey = process.env.NODE_ENV === 'production'
  ? 'YOUR_PRODUCTION_SUPABASE_KEY'
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.ZopqoUt20nEV9cklpv9e3yw3PVyZLmKs5qLD6nGL1SI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default boot(({ app }) => {
  // Make supabase available in the app
  app.config.globalProperties.$supabase = supabase
})

export { supabase } 