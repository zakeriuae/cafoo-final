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
  const { data: tower } = await supabase.from('towers').select('status').eq('slug', 'trump-tower').single();
  console.log('Trump Tower Status:', tower ? tower.status : 'Not found');
  
  if (tower && tower.status !== 'published') {
    console.log('Setting Trump Tower to published...');
    await supabase.from('towers').update({ status: 'published' }).eq('slug', 'trump-tower');
  }
}

check();
