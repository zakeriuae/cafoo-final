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

async function updateSpecificImages() {
  const specificImages = {
    'The Address Sky View': 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&w=1200&q=80',
    'Atlantis The Royal': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    'Trump Tower': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'Boulevard Crescent': 'https://images.unsplash.com/photo-1526495124232-a02e18494d17?auto=format&fit=crop&w=1200&q=80'
  };

  for (const [name, url] of Object.entries(specificImages)) {
    console.log(`Updating iconic image for ${name}...`);
    await supabase.from('towers').update({ cover_image_url: url }).eq('name', name);
  }

  console.log('Iconic tower images updated.');
}

updateSpecificImages();
