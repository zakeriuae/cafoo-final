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

async function check() {
  const { data: agents } = await supabase.from('agents').select('id, name, slug').eq('status', 'published');
  
  if (!agents) {
    console.error('No agents found');
    return;
  }

  for (const agent of agents) {
    const { count: tCount } = await supabase
      .from('towers')
      .select('*', { count: 'exact', head: true })
      .eq('assigned_agent_id', agent.id);
    
    const { count: pCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agent.id);
      
    console.log(`${agent.name} (${agent.slug}): ${tCount} towers, ${pCount} properties`);
  }
}

check();
