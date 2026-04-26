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

async function debug() {
  const { data: agent } = await supabase
    .from('agents')
    .select('id, name')
    .eq('slug', 'fatemeh-ramezani')
    .single();

  console.log('Agent:', agent);

  const { data: towers, error: tError } = await supabase
    .from('towers')
    .select('*')
    .eq('assigned_agent_id', agent.id);
  
  if (tError) console.error('Towers Error:', tError);
  else console.log('Assigned Towers:', towers.map(t => t.name));

  const { data: props, error: pError } = await supabase
    .from('properties')
    .select('*')
    .eq('assigned_agent_id', agent.id);
    
  if (pError) console.error('Properties Error:', pError);
  else console.log('Assigned Properties:', props.map(p => p.title));

  // Let's re-run the sync for HER specifically if needed
}

debug();
