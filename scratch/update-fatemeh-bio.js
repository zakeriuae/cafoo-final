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

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBio() {
  const bioEn = "Fatemeh brings over 10 years of experience in the Dubai luxury market. Specializing in Palm Jumeirah and Emirates Hills, she has a proven track record of finding exclusive off-market opportunities for high-net-worth individuals. Her commitment to excellence and deep understanding of market trends make her a trusted advisor for discerning clients.";
  const bioFa = "فاطمه رمضانی با بیش از ۱۰ سال تجربه در بازار املاک لوکس دبی، یکی از مشاوران خبره در مناطق پالم جمیرا و امارات هیلز است. او سابقه درخشانی در یافتن فرصت‌های منحصر به فرد و خارج از بازار برای مشتریان با سرمایه بالا دارد. تعهد او به برتری و درک عمیق از روندهای بازار، او را به یک مشاور مورد اعتماد برای مشتریان خاص تبدیل کرده است.";

  const { error } = await supabase
    .from('agents')
    .update({
      bio: bioEn,
      bio_fa: bioFa
    })
    .eq('slug', 'fatemeh-ramezani');

  if (error) {
    console.error('Error updating bio:', error);
  } else {
    console.log('Successfully updated bio for Fatemeh Ramezani');
  }
}

updateBio();
