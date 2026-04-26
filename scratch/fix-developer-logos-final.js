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

async function fixLogos() {
  const logos = {
    'DAMAC Properties': 'https://www.damacproperties.com/sites/default/files/damac_logo.png',
    'OMNIYAT': 'https://www.omniyat.com/wp-content/themes/omniyat/assets/images/logo.svg',
    'Danube Properties': 'https://danubeproperties.ae/wp-content/uploads/2021/04/danube-logo.png',
    'DAR AL ARKAN': 'https://www.daralarkan.com/wp-content/themes/daralarkan/assets/images/logo.png',
    'Emaar Properties': 'https://www.emaar.com/wp-content/themes/emaar/assets/images/logo.svg'
  };

  for (const [name, url] of Object.entries(logos)) {
    console.log(`Updating logo for ${name}...`);
    await supabase.from('developers').update({ logo_url: url }).ilike('name', `%${name}%`);
  }
  
  // Ensure Ocean 2 has a developer with a logo
  const { data: damac } = await supabase.from('developers').select('id').ilike('name', '%DAMAC%').single();
  if (damac) {
    await supabase.from('towers').update({ developer_id: damac.id }).eq('name', 'Ocean 2');
  }

  console.log('Logos and Ocean 2 updated.');
}

fixLogos();
