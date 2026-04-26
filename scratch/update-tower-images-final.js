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
  const verifiedImages = [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // Burj Khalifa/Skyline
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80', // Dubai Street
    'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=1200&q=80', // Modern Skyscraper
    'https://images.unsplash.com/photo-1526495124232-a02e18494d17?auto=format&fit=crop&w=1200&q=80', // Dubai Night
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', // Luxury Villa
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', // Resort/Pool
    'https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=1200&q=80', // Dubai Blue Hour
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80', // Interior/Lobby
    'https://images.unsplash.com/photo-1600585154526-990dcea464dd?auto=format&fit=crop&w=1200&q=80', // Modern House
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Architecture Detail
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80', // Cityscape
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', // Skyscraper Glass
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', // Modern Building
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80'  // Luxury Architecture
  ];

  const { data: allTowers } = await supabase.from('towers').select('id, name');
  
  if (!allTowers) return;

  for (let i = 0; i < allTowers.length; i++) {
    const tower = allTowers[i];
    const finalImage = verifiedImages[i % verifiedImages.length];
    
    console.log(`Updating image for ${tower.name} (${tower.id})...`);
    await supabase.from('towers').update({ cover_image_url: finalImage }).eq('id', tower.id);
  }

  console.log('All tower images updated with high-quality verified URLs.');
}

updateImages();
