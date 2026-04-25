import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function updateToListingRent() {
  const idsToChange = [
    '46149d12-13b6-4c17-8424-43a2fa636f21', // Elegant 4BR Penthouse
    '5e341c03-8933-4395-8735-d4f063b824c6'  // Modern 2BR with Burj View
  ]

  const { error } = await supabase
    .from('properties')
    .update({ listing_type: 'rent' })
    .in('id', idsToChange)

  if (error) console.error('Error updating to rent:', error)
  else console.log('✅ Successfully updated 2 properties to "rent".')
}

updateToListingRent()
