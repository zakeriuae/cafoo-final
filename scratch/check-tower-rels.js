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
  const { data, error } = await supabase.from('towers').select('*, assigned_agent:agents(id)').limit(1);
  if (error) {
    console.error('assigned_agent relation FAIL:', error.message);
    const { data: data2, error: error2 } = await supabase.from('towers').select('*, agents(id)').limit(1);
    if (error2) {
       console.error('agents relation FAIL:', error2.message);
    } else {
       console.log('agents relation WORKS');
    }
  } else {
    console.log('assigned_agent relation WORKS');
  }
}

check();
