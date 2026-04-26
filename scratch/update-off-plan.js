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

async function updateTowers() {
  // 1. Update Specific Images (Dubai Skyscraper style)
  const opusUrl = 'https://images.unsplash.com/photo-1574359411659-15573a27f812?q=80&w=1200&auto=format&fit=crop'; // Modern Architecture
  const boulevardUrl = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop'; // Dubai Downtown

  console.log('Updating THE OPUS image...');
  await supabase.from('towers').update({ cover_image_url: opusUrl }).eq('name', 'THE OPUS');
  
  console.log('Updating Boulevard Crescent image...');
  await supabase.from('towers').update({ cover_image_url: boulevardUrl }).eq('name', 'Boulevard Crescent');

  // 2. Set 50% of towers to Off Plan
  const { data: towers } = await supabase.from('towers').select('id');
  console.log(`Setting ${Math.ceil(towers.length / 2)} towers to Off Plan...`);
  
  for (let i = 0; i < towers.length; i++) {
    const isOffPlan = i % 2 === 0;
    await supabase.from('towers').update({ is_off_plan: isOffPlan }).eq('id', towers[i].id);
  }

  console.log('Update complete.');
}

updateTowers();
