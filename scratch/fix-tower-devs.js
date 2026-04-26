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

async function fix() {
  const { data: devs } = await supabase.from('developers').select('id, name');
  const emaar = devs.find(d => d.name.includes('Emaar')) || devs[0];
  const damac = devs.find(d => d.name.includes('DAMAC')) || devs[1] || devs[0];
  
  const { data: towers } = await supabase.from('towers').select('id, name, developer_id');
  
  for (const t of towers) {
    if (!t.developer_id) {
      const devId = t.name.includes('Ocean') || t.name.includes('Marina') ? damac.id : emaar.id;
      console.log(`Updating ${t.name} with developer ${devId}`);
      await supabase.from('towers').update({ developer_id: devId }).eq('id', t.id);
    }
  }
  console.log('Towers updated.');
}

fix();
