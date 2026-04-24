
-- Update Seed script for Cafoo Real Estate Platform

DO $$ 
DECLARE 
  emaar_id UUID;
  sobha_id UUID;
  nakheel_id UUID;
  meraas_id UUID;
  danube_id UUID;
  dar_al_arkan_id UUID;
  omniyat_id UUID;
  
  downtown_id UUID;
  marina_id UUID;
  palm_id UUID;
  business_bay_id UUID;
  mina_rashid_id UUID;
  sobha_hartland_id UUID;
  zaabeel_id UUID;
  emirates_hills_id UUID;
  
  agent_ahmad UUID;
  agent_fatima UUID;
  agent_raj UUID;
BEGIN
  -- Ensure Developers exist
  INSERT INTO developers (id, name, slug, status) VALUES (gen_random_uuid(), 'Danube Properties', 'danube-properties', 'published') ON CONFLICT (slug) DO NOTHING;
  INSERT INTO developers (id, name, slug, status) VALUES (gen_random_uuid(), 'DAR AL ARKAN', 'dar-al-arkan', 'published') ON CONFLICT (slug) DO NOTHING;
  INSERT INTO developers (id, name, slug, status) VALUES (gen_random_uuid(), 'OMNIYAT', 'omniyat', 'published') ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO emaar_id FROM developers WHERE name ILIKE '%EMAAR%' LIMIT 1;
  SELECT id INTO sobha_id FROM developers WHERE name ILIKE '%SOBHA%' LIMIT 1;
  SELECT id INTO nakheel_id FROM developers WHERE name ILIKE '%Nakheel%' LIMIT 1;
  SELECT id INTO meraas_id FROM developers WHERE name ILIKE '%MERAAS%' LIMIT 1;
  SELECT id INTO danube_id FROM developers WHERE name ILIKE '%Danube%' LIMIT 1;
  SELECT id INTO dar_al_arkan_id FROM developers WHERE name ILIKE '%DAR AL ARKAN%' LIMIT 1;
  SELECT id INTO omniyat_id FROM developers WHERE name ILIKE '%OMNIYAT%' LIMIT 1;
  
  -- Ensure Areas exist
  INSERT INTO areas (id, name, slug, status) VALUES (gen_random_uuid(), 'Dubai Mina Rashid', 'mina-rashid', 'published') ON CONFLICT (slug) DO NOTHING;
  INSERT INTO areas (id, name, slug, status) VALUES (gen_random_uuid(), 'Sobha Hartland', 'sobha-hartland', 'published') ON CONFLICT (slug) DO NOTHING;
  INSERT INTO areas (id, name, slug, status) VALUES (gen_random_uuid(), 'Dubai Za''abeel', 'dubai-zaabeel', 'published') ON CONFLICT (slug) DO NOTHING;
  INSERT INTO areas (id, name, slug, status) VALUES (gen_random_uuid(), 'Emirates Hills', 'emirates-hills', 'published') ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO downtown_id FROM areas WHERE name ILIKE '%Downtown%' LIMIT 1;
  SELECT id INTO marina_id FROM areas WHERE name ILIKE '%Marina%' LIMIT 1;
  SELECT id INTO palm_id FROM areas WHERE name ILIKE '%Palm Jumeirah%' LIMIT 1;
  SELECT id INTO business_bay_id FROM areas WHERE name ILIKE '%Business Bay%' LIMIT 1;
  SELECT id INTO mina_rashid_id FROM areas WHERE name ILIKE '%Mina Rashid%' LIMIT 1;
  SELECT id INTO sobha_hartland_id FROM areas WHERE name ILIKE '%Sobha Hartland%' LIMIT 1;
  SELECT id INTO zaabeel_id FROM areas WHERE name ILIKE '%Za''abeel%' LIMIT 1;
  SELECT id INTO emirates_hills_id FROM areas WHERE name ILIKE '%Emirates Hills%' LIMIT 1;

  SELECT id INTO agent_ahmad FROM agents WHERE name ILIKE '%Ahmad%' LIMIT 1;
  SELECT id INTO agent_fatima FROM agents WHERE name ILIKE '%Fatima%' LIMIT 1;
  SELECT id INTO agent_raj FROM agents WHERE name ILIKE '%Raj%' LIMIT 1;

  -- Insert Remaining Towers (Projects)
  INSERT INTO towers (id, name, slug, area_id, developer_id, assigned_agent_id, starting_price, status, featured, is_off_plan)
  VALUES 
    (gen_random_uuid(), 'Ocean 2', 'ocean-2', mina_rashid_id, danube_id, agent_ahmad, 900000, 'published', true, true),
    (gen_random_uuid(), 'Trump Tower', 'trump-tower', zaabeel_id, dar_al_arkan_id, agent_ahmad, 3800000, 'published', true, true),
    (gen_random_uuid(), 'The Address Sky View', 'address-sky-view', downtown_id, emaar_id, agent_ahmad, 2500000, 'published', true, false),
    (gen_random_uuid(), 'THE OPUS', 'the-opus', business_bay_id, omniyat_id, agent_ahmad, 3000000, 'published', true, false),
    (gen_random_uuid(), 'Marina Promenade', 'marina-promenade', marina_id, emaar_id, agent_ahmad, 1950000, 'published', true, false),
    (gen_random_uuid(), 'Emirates Hills Villas', 'emirates-hills-villas', emirates_hills_id, emaar_id, agent_ahmad, 8200000, 'published', true, false)
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Remaining Properties
  INSERT INTO properties (id, title, title_fa, slug, area_id, tower_id, developer_id, agent_id, listing_type, property_type, price, size, bedrooms, bathrooms, status, featured, cover_image_url)
  VALUES 
    (gen_random_uuid(), 'Stunning 2BR with Marina View', 'آپارتمان ۲ خوابه با چشم‌انداز مارینا', 'stunning-2br-marina-view', marina_id, (SELECT id FROM towers WHERE name = 'Marina Promenade' LIMIT 1), emaar_id, agent_raj, 'sale', 'apartment', 1950000, 1083, 2, 3, 'available', true, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'),
    (gen_random_uuid(), 'Premium 1BR in Business Bay', 'آپارتمان ممتاز ۱ خوابه در بیزینس بی', 'premium-1br-business-bay', business_bay_id, (SELECT id FROM towers WHERE name = 'THE OPUS' LIMIT 1), omniyat_id, agent_fatima, 'rent', 'apartment', 1100000, 850, 1, 2, 'available', false, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'),
    (gen_random_uuid(), 'Modern 2BR with Burj View', 'آپارتمان مدرن ۲ خوابه با نمای برج خلیفه', 'modern-2br-burj-view', downtown_id, (SELECT id FROM towers WHERE name = 'The Address Sky View' LIMIT 1), emaar_id, agent_ahmad, 'sale', 'apartment', 2400000, 1200, 2, 2, 'available', false, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'),
    (gen_random_uuid(), 'Spacious 3BR Villa', 'ویلای وسیع ۳ خوابه', 'spacious-3br-villa', emirates_hills_id, (SELECT id FROM towers WHERE name = 'Emirates Hills Villas' LIMIT 1), emaar_id, agent_ahmad, 'rent', 'villa', 8200000, 4205, 3, 4, 'available', false, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80')
  ON CONFLICT (slug) DO NOTHING;
END $$;
