import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Need service role for updates

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('Fetching towers and areas...')

  const { data: areas } = await supabase.from('areas').select('id, name').is('latitude', null)
  const { data: towers } = await supabase.from('towers').select('id, name, area:areas(name)').is('latitude', null)

  console.log(`Found ${areas?.length || 0} areas and ${towers?.length || 0} towers missing coordinates.`)

  if (areas) {
    for (const area of areas) {
      console.log(`- Area: ${area.name}`)
    }
  }

  if (towers) {
    for (const tower of towers) {
      console.log(`- Tower: ${tower.name} (in ${(tower as any).area?.name || 'unknown'})`)
    }
  }
}

main().catch(console.error)
