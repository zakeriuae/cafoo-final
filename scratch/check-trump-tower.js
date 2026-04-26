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
  const { data: agent } = await supabase.from('agents').select('id, name').eq('slug', 'elena-volkov').single();
  const { data: tower } = await supabase.from('towers').select('id, name, assigned_agent_id').eq('slug', 'trump-tower').single();
  
  console.log('Agent:', agent);
  console.log('Trump Tower:', tower);

  if (agent && tower) {
    if (tower.assigned_agent_id === agent.id) {
      console.log('Match! They are connected.');
    } else {
      console.log('No Match! Updating now...');
      await supabase.from('towers').update({ assigned_agent_id: agent.id }).eq('id', tower.id);
      console.log('Updated Trump Tower assigned_agent_id.');
    }
  }
}

check();
