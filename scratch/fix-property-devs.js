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

async function fixPropertyDevs() {
  const { data: devs } = await supabase.from('developers').select('id, name');
  const nakheel = devs.find(d => d.name.includes('NAKHEEL')) || devs[0];
  const emaar = devs.find(d => d.name.includes('Emaar')) || devs[0];
  const damac = devs.find(d => d.name.includes('DAMAC')) || devs[0];

  const agentId = '3434226c-10a7-44f8-86d1-27cab50c36af'; // Elena Volkov
  
  const { data: properties } = await supabase.from('properties').select('id, title, developer_id').eq('agent_id', agentId);
  
  for (const p of properties) {
    if (!p.developer_id) {
      let devId = emaar.id;
      if (p.title.includes('Business Bay')) devId = damac.id;
      if (p.title.includes('Palm')) devId = nakheel.id;
      
      console.log(`Updating property ${p.title} with dev ${devId}`);
      await supabase.from('properties').update({ developer_id: devId }).eq('id', p.id);
    }
  }
  console.log('Properties updated.');
}

fixPropertyDevs();
