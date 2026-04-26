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

async function updateImages() {
  const images = {
    'Atlantis The Royal': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop', // Dubai Skyline
    'The Address Sky View': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1974&auto=format&fit=crop', // Burj Khalifa view
    'Trump Tower': 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?q=80&w=2070&auto=format&fit=crop', // Modern Dubai Tower
    'Boulevard Crescent': 'https://images.unsplash.com/photo-1526495124232-a02e18494d17?q=80&w=1974&auto=format&fit=crop', // Downtown Dubai
    'Emirates Hills Villas': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', // Luxury Villa Dubai
    '340 Riverside Crescent': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop', // Luxury Dubai Interior/Pool
    'Burj Binghatti': 'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?q=80&w=1931&auto=format&fit=crop', // Dubai Skyscrapers
    'Sobha Hartland': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop', // Dubai Luxury Living
    'DAMAC Lagoons': 'https://images.unsplash.com/photo-1600585154526-990dcea464dd?q=80&w=1974&auto=format&fit=crop' // Dubai Waterfront Villa
  };

  // Also update all other towers that might have duplicate default image
  const { data: allTowers } = await supabase.from('towers').select('id, name');
  
  const skyscrapers = [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2080&auto=format&fit=crop'
  ];

  for (let i = 0; i < allTowers.length; i++) {
    const tower = allTowers[i];
    const specificImage = images[tower.name];
    const finalImage = specificImage || skyscrapers[i % skyscrapers.length];
    
    console.log(`Updating image for ${tower.name} (${tower.id})...`);
    await supabase.from('towers').update({ cover_image_url: finalImage }).eq('id', tower.id);
  }

  console.log('All tower images updated with variety.');
}

updateImages();
