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

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function renameAgent() {
  const { data: agents, error: fetchError } = await supabase
    .from('agents')
    .select('*')
    .ilike('name', '%Mohammad%');

  if (fetchError) {
    console.error('Error fetching agent:', fetchError);
    return;
  }

  if (!agents || agents.length === 0) {
    console.log('No agent found with name Mohammad');
    return;
  }

  const agent = agents[0];
  console.log(`Found agent: ${agent.name} (ID: ${agent.id})`);

  const { error: updateError } = await supabase
    .from('agents')
    .update({
      name: 'Fatemeh Ramezani',
      name_fa: 'فاطمه رمضانی',
      slug: 'fatemeh-ramezani'
    })
    .eq('id', agent.id);

  if (updateError) {
    console.error('Error updating agent:', updateError);
  } else {
    console.log('Successfully updated agent name to Fatemeh Ramezani');
  }
}

renameAgent();
