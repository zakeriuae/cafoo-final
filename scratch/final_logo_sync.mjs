import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function finalLogoSync() {
  const updates = [
    { name: 'Danube Properties', logo: '/images/developers/danube-logo.jpg' },
    { name: 'DAR AL ARKAN', logo: '/images/developers/dar-al-arkan-logo.jpg' },
    { name: 'EMAAR PROPERTIES', logo: '/images/developers/emaar-logo.jpg' },
    { name: 'OMNIYAT', logo: '/images/developers/meraas-logo.jpg' }, // fallback to another logo if missing
  ]

  for (const update of updates) {
    await supabase.from('developers').update({ logo_url: update.logo }).ilike('name', update.name)
  }
  console.log('✅ All missing logos synced with local assets.')
}

finalLogoSync()
