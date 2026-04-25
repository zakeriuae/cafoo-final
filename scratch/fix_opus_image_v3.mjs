import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function fixOpusImage() {
  const opusImage = 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?auto=format&fit=crop&q=80&w=1200'
  
  const { error } = await supabase
    .from('towers')
    .update({ cover_image_url: opusImage })
    .ilike('name', 'THE OPUS')

  if (error) console.error('Error fixing Opus image:', error)
  else console.log('✅ Successfully fixed THE OPUS image with a new URL.')
}

fixOpusImage()
