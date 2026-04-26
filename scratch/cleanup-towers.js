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

async function cleanup() {
  const { data: towers } = await supabase.from('towers').select('id, name');
  const seen = new Set();
  const toDelete = [];

  for (const tower of towers) {
    if (seen.has(tower.name)) {
      toDelete.push(tower.id);
    } else {
      seen.add(tower.name);
    }
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} duplicate towers...`);
    await supabase.from('towers').delete().in('id', toDelete);
  }

  // Update Boulevard Crescent image
  console.log('Updating Boulevard Crescent image...');
  await supabase.from('towers').update({ 
    cover_image_url: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&w=1200&q=80' 
  }).eq('name', 'Boulevard Crescent');

  console.log('Cleanup complete.');
}

cleanup();
