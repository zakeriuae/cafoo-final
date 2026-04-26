const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncAgents() {
  const { data: agents } = await supabase.from('agents').select('id').eq('status', 'published');
  const { data: towers } = await supabase.from('towers').select('id');
  const { data: properties } = await supabase.from('properties').select('id');

  console.log(`Syncing ${towers.length} towers and ${properties.length} properties to ${agents.length} agents...`);

  for (let i = 0; i < towers.length; i++) {
    const agent = agents[i % agents.length];
    await supabase.from('towers').update({ assigned_agent_id: agent.id }).eq('id', towers[i].id);
  }

  for (let i = 0; i < properties.length; i++) {
    const agent = agents[i % agents.length];
    const { error } = await supabase.from('properties').update({ agent_id: agent.id }).eq('id', properties[i].id);
    if (error) console.error('Property sync error:', error);
  }

  console.log('Sync complete.');
}

syncAgents();
