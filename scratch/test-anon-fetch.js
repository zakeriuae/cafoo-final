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
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, anonKey);

async function check() {
  const agentId = '21299c5d-cbd0-4107-9b6f-801b5b1fead2'; // Elena Volkov
  const { data, error } = await supabase
    .from('towers')
    .select('*')
    .eq('assigned_agent_id', agentId);
  
  console.log('Fetch with ANON key:', { count: data?.length || 0, error });
}

check();
