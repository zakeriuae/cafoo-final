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
  // THE OPUS image
  const opusUrl = 'https://images.unsplash.com/photo-1697730215350-c1c52a233700?q=80&w=1200&auto=format&fit=crop';
  
  // Boulevard Crescent image (uj_G_PMUHiw)
  const boulevardUrl = 'https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=1200&auto=format&fit=crop';

  console.log('Updating THE OPUS...');
  await supabase.from('towers').update({ cover_image_url: opusUrl }).eq('name', 'THE OPUS');
  
  console.log('Updating Boulevard Crescent...');
  await supabase.from('towers').update({ cover_image_url: boulevardUrl }).eq('name', 'Boulevard Crescent');

  console.log('Images updated successfully.');
}

updateSpecificImages();
