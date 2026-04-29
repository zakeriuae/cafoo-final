import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function checkTable() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase.from('user_actions').select('*').limit(1)
  if (error) {
    console.log('user_actions table does not exist or error:', error.message)
  } else {
    console.log('user_actions table exists')
  }
}

checkTable()
