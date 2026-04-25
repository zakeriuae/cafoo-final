import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function updateLogos() {
  const updates = [
    { name: 'Danube Properties', logo: '/images/developers/danube-logo.jpg' },
    { name: 'DAR AL ARKAN', logo: '/images/developers/dar-al-arkan-logo.jpg' },
    { name: 'EMAAR PROPERTIES', logo: '/images/developers/emaar-logo.jpg' },
    { name: 'Emaar Properties', logo: '/images/developers/emaar-logo.jpg' },
  ]

  for (const update of updates) {
    const { error } = await supabase
      .from('developers')
      .update({ logo_url: update.logo })
      .ilike('name', update.name)
    
    if (error) console.error(`Error updating ${update.name}:`, error)
    else console.log(`Updated ${update.name} with ${update.logo}`)
  }
}

updateLogos()
