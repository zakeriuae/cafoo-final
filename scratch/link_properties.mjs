import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function linkPropertiesToTowers() {
  const towers = {
    skyview: 'c65b9dce-e4a0-485b-ae28-0da9eeaf5c93', // Emaar
    trump: '8a4e84fe-fd80-46d5-82e6-af1b3d947ddf', // DAMAC (was Dar Al Arkan)
    boulevard: '360f9e1e-b3f4-4e3a-ae28-0da9eeaf5c93', // Binghatti (was Emaar)
    marina: '3480cff9-cbdc-4d59-b045-5465c25a2de8', // Sobha (was Emaar)
    opus: '7beb553a-27e3-4150-b3f4-ffa1c478be82', // Imtiaz
  }

  // Link some properties
  await supabase.from('properties').update({ tower_id: towers.skyview }).ilike('title', '%Downtown%')
  await supabase.from('properties').update({ tower_id: towers.trump }).ilike('title', '%Villa%')
  await supabase.from('properties').update({ tower_id: towers.boulevard }).ilike('title', '%Elegant%')
  await supabase.from('properties').update({ tower_id: towers.opus }).ilike('title', '%Premium%')

  console.log('✅ Properties linked to towers for diversity.')
}

linkPropertiesToTowers()
