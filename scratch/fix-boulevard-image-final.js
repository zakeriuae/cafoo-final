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

async function fixBoulevardImage() {
  const newImageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop';
  
  const { data, error } = await supabase
    .from('towers')
    .update({ cover_image_url: newImageUrl })
    .ilike('name', '%Boulevard Crescent%');
    
  if (error) {
    console.error('Error updating Boulevard Crescent image:', error);
  } else {
    console.log('Boulevard Crescent image updated successfully.');
  }
}

fixBoulevardImage();
