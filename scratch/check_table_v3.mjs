import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://navwagghjtiokeatqjdu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMDA3NDgsImV4cCI6MjA5MjU3Njc0OH0.aWcIJU8_ggUlDfEUgVYanM9rZmXMfBgWcmC5Swdyw3A'

async function checkTable() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { count, error } = await supabase.from('user_actions').select('*', { count: 'exact', head: true })
  if (error) {
    console.log('Error:', error.message)
  } else {
    console.log('Count:', count)
  }
}

checkTable()
