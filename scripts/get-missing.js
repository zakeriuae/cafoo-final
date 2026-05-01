const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const { data: areas } = await supabase.from('areas').select('name').is('latitude', null)
  const { data: towers } = await supabase.from('towers').select('name').is('latitude', null)
  
  console.log('MISSING_AREAS:', JSON.stringify(areas))
  console.log('MISSING_TOWERS:', JSON.stringify(towers))
}

main()
