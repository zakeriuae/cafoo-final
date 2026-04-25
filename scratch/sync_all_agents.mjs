import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function syncAllAgents() {
  console.log('🔄 Syncing ALL agents with local images...')

  const bucketName = 'agents'
  const files = ['agent-1.jpg', 'agent-2.jpg', 'agent-3.jpg', 'agent-4.jpg']
  const urls = files.map(file => `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${file}`)

  const { data: agents, error: fetchError } = await supabase.from('agents').select('id, name, slug')
  if (fetchError) throw fetchError

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i]
    const url = urls[i % urls.length]

    const { error: updateError } = await supabase
      .from('agents')
      .update({ avatar_url: url })
      .eq('id', agent.id)

    if (updateError) {
      console.error(`Error updating ${agent.name}:`, updateError)
    } else {
      console.log(`Updated ${agent.name} with ${url}`)
    }
  }

  console.log('✅ All agents synced!')
}

syncAllAgents().catch(console.error)
