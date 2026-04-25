import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function findLogos() {
  const { data } = await supabase.from('developers').select('name, logo_url')
  
  const danube = data.find(d => d.name.includes('Danube') && d.logo_url)
  const arkan = data.find(d => d.name.includes('Arkan') && d.logo_url)
  const omniyat = data.find(d => d.name.includes('Omniyat') && d.logo_url)
  const emaar = data.find(d => d.name.includes('Emaar') && d.logo_url)

  console.log('Danube:', danube)
  console.log('Arkan:', arkan)
  console.log('Omniyat:', omniyat)
  console.log('Emaar:', emaar)
}

findLogos()
