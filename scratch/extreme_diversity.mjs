import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function applyDiversityMore() {
  const devs = {
    tiger: '659983a9-d9d0-4302-a8be-7c07b08fba04',
    wasl: 'fd5b37d8-db93-4c7e-a509-95c5092563eb',
    aldar: '6001402e-b3f4-4e3a-ae28-0da9eeaf5c93',
    nshama: 'a418690d-5668-4bd2-a042-b675860d39c9',
    damac: '3c2e0cd2-a96f-43b1-acdf-57cd349902ff'
  }

  const towers = {
    skyview: 'c65b9dce-e4a0-485b-ae28-0da9eeaf5c93',
    trump: '8a4e84fe-fd80-46d5-82e6-af1b3d947ddf',
    boulevard: '360f9e1e-b3f4-4e3a-ae28-0da9eeaf5c93',
    marina: '3480cff9-cbdc-4d59-b045-5465c25a2de8',
    opus: '7beb553a-27e3-4150-b3f4-ffa1c478be82',
    hills: '64b09e78-f64d-47bd-ba47-14c83285b0ed',
    ocean: 'c2ee19e0-0e17-474d-9e83-4c60ab7e223f'
  }

  // Update towers with new developers
  await supabase.from('towers').update({ developer_id: devs.tiger }).eq('id', towers.opus)
  await supabase.from('towers').update({ developer_id: devs.wasl }).eq('id', towers.hills)
  await supabase.from('towers').update({ developer_id: devs.aldar }).eq('id', towers.ocean)
  await supabase.from('towers').update({ developer_id: devs.nshama }).eq('id', towers.boulevard)

  // Link properties showing "by Developer"
  await supabase.from('properties').update({ tower_id: towers.opus }).ilike('title', '%Modern Penthouse%')
  await supabase.from('properties').update({ tower_id: towers.hills }).ilike('title', '%Elegant 4BR%')
  await supabase.from('properties').update({ tower_id: towers.ocean }).ilike('title', '%Spacious 3BR Villa%')

  console.log('✅ Extreme diversity applied to properties.')
}

applyDiversityMore()
