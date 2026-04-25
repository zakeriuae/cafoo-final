import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function updateImages() {
  const opusImg = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200'
  const marinaImg = 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200'

  // Update The Opus
  const { error: errorOpus } = await supabase
    .from('towers')
    .update({ cover_image_url: opusImg })
    .ilike('name', 'THE OPUS')

  // Update Marina Promenade (in towers)
  const { error: errorMarinaTower } = await supabase
    .from('towers')
    .update({ cover_image_url: marinaImg })
    .ilike('name', '%Marina Promenade%')
    
  // Update Properties that might have hardcoded images or are linked
  const { error: errorMarinaProp } = await supabase
    .from('properties')
    .update({ image_url: marinaImg })
    .ilike('project_name', '%Marina Promenade%')

  console.log('Update results:', { errorOpus, errorMarinaTower, errorMarinaProp })
}

updateImages()
