import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function setLocalLogos() {
  // These developers don't have matching local files - set logo_url to the Supabase storage path
  // which uses the files we know exist
  const updates = [
    // Set DAR AL ARKAN to use alef.png as a placeholder (we'll note this)
    // Better: clear their logo_url so the frontend filter removes them from the marquee
    { name: 'DAR AL ARKAN', logo_url: null },
    { name: 'Danube Properties', logo_url: null },
    { name: 'OMNIYAT', logo_url: null },
  ]

  for (const update of updates) {
    const { error } = await supabase
      .from('developers')
      .update({ logo_url: update.logo_url })
      .eq('name', update.name)
    
    if (error) console.error(`Error updating ${update.name}:`, error)
    else console.log(`✅ Cleared logo_url for ${update.name}`)
  }
}

setLocalLogos()
