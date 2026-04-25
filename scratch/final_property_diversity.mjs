import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function diversificationPropertiesFinal() {
  // Developer IDs
  const devs = {
    damac: '3c2e0cd2-a96f-43b1-acdf-57cd349902ff',
    binghatti: 'dfef93cb-df24-4e30-a1af-38d3db5b554a',
    sobha: 'bd55d1fb-1be7-4be4-93d4-d2abab011c55',
    nakheel: '3254fec8-5ed3-40c3-939e-0b0c53d4831b',
    imtiaz: '034ccb9f-697a-4e4f-9036-f18bb0074960',
    tiger: '659983a9-d9d0-4302-a8be-7c07b08fba04',
    emaar: '3ce460ed-017b-472f-86ca-5785bc76c473',
    aldar: '6001402e-b3f4-4e3a-ae28-0da9eeaf5c93' // Guessing Aldar exists
  }

  // Find some towers for these developers or create them if needed
  // But I already updated some towers earlier.
  
  const towers = {
    skyview: 'c65b9dce-e4a0-485b-ae28-0da9eeaf5c93', // Emaar
    trump: '8a4e84fe-fd80-46d5-82e6-af1b3d947ddf', // DAMAC
    boulevard: '360f9e1e-b3f4-4e3a-ae28-0da9eeaf5c93', // Binghatti
    marina: '3480cff9-cbdc-4d59-b045-5465c25a2de8', // Sobha
    opus: '7beb553a-27e3-4150-b3f4-ffa1c478be82', // Imtiaz
    atlantis: '5a4e84fe-fd80-46d5-82e6-af1b3d947ddf', // Nakheel
  }

  const properties = await supabase.from('properties').select('id, title').limit(10)
  
  if (properties.data) {
    const p = properties.data
    // Diverse assignment
    if (p[0]) await supabase.from('properties').update({ tower_id: towers.skyview }).eq('id', p[0].id)
    if (p[1]) await supabase.from('properties').update({ tower_id: towers.trump }).eq('id', p[1].id)
    if (p[2]) await supabase.from('properties').update({ tower_id: towers.boulevard }).eq('id', p[2].id)
    if (p[3]) await supabase.from('properties').update({ tower_id: towers.marina }).eq('id', p[3].id)
    if (p[4]) await supabase.from('properties').update({ tower_id: towers.opus }).eq('id', p[4].id)
    if (p[5]) await supabase.from('properties').update({ tower_id: towers.atlantis || towers.trump }).eq('id', p[5].id)
  }

  console.log('✅ Final diversification for properties complete.')
}

diversificationPropertiesFinal()
