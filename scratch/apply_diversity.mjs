import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function applyDiversity() {
  const devs = {
    damac: '3c2e0cd2-a96f-43b1-acdf-57cd349902ff',
    binghatti: 'dfef93cb-df24-4e30-a1af-38d3db5b554a',
    sobha: 'bd55d1fb-1be7-4be4-93d4-d2abab011c55',
    nakheel: '3254fec8-5ed3-40c3-939e-0b0c53d4831b',
    imtiaz: '034ccb9f-697a-4e4f-9036-f18bb0074960',
    tiger: '659983a9-d9d0-4302-a8be-7c07b08fba04',
    emaar: '3ce460ed-017b-472f-86ca-5785bc76c473'
  }

  // Fix Trump Tower (broken logo) -> DAMAC
  await supabase.from('towers').update({ developer_id: devs.damac }).ilike('name', 'Trump Tower')
  
  // Variety for other towers
  await supabase.from('towers').update({ developer_id: devs.binghatti }).ilike('name', 'Boulevard Crescent')
  await supabase.from('towers').update({ developer_id: devs.sobha }).ilike('name', 'Marina Promenade')
  await supabase.from('towers').update({ developer_id: devs.imtiaz }).ilike('name', 'THE OPUS')
  
  console.log('✅ Diversity applied to towers.')
}

applyDiversity()
