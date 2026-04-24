-- =============================================
-- CAFOO REAL ESTATE - DATABASE SEED
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. AREAS (مناطق دبی)
INSERT INTO public.areas (name, name_fa, slug, short_description, short_description_fa, status, featured)
VALUES
  ('Downtown Dubai',    'داون‌تاون دبی',  'downtown-dubai',   'Heart of Dubai with iconic Burj Khalifa', 'قلب دبی با برج خلیفه',      'published', true),
  ('Dubai Marina',      'دبی مارینا',     'dubai-marina',     'Vibrant waterfront living',               'زندگی لب‌آب پرجنب‌وجوش',     'published', true),
  ('Business Bay',      'بیزینس بی',      'business-bay',     'Dynamic business and residential hub',    'مرکز تجاری و مسکونی پویا',   'published', true),
  ('Palm Jumeirah',     'پالم جمیرا',     'palm-jumeirah',    'Iconic palm-shaped island',               'جزیره نخل معروف',            'published', true),
  ('Emirates Hills',    'امارات هیلز',    'emirates-hills',   'Prestigious gated villa community',       'محله ویلایی معتبر',          'published', false),
  ('Sobha Hartland',    'سبحا هارتلند',   'sobha-hartland',   'Green urban community',                   'محله سبز شهری',              'published', false),
  ('Dubai Za''abeel',   'دبی زعبیل',      'dubai-zaabeel',    'Historic and vibrant district',           'محله تاریخی و پرجنب‌وجوش',   'published', false),
  ('Dubai Mina Rashid', 'دبی مینا راشد',  'dubai-mina-rashid','Waterfront community near the creek',    'محله لب‌آب نزدیک خور دبی',   'published', false)
ON CONFLICT (slug) DO NOTHING;

-- 2. DEVELOPERS (سازندگان)
INSERT INTO public.developers (name, name_fa, slug, status)
VALUES
  ('Danube Properties', 'دانوب پراپرتیز', 'danube-properties', 'published'),
  ('SOBHA REALTY',      'سوبها ریلتی',    'sobha-realty',     'published'),
  ('DAR AL ARKAN',      'دار الارکان',    'dar-al-arkan',     'published'),
  ('EMAAR PROPERTIES',  'امار پراپرتیز',  'emaar-properties', 'published'),
  ('OMNIYAT',           'امنیات',         'omniyat',          'published')
ON CONFLICT (slug) DO NOTHING;

-- 3. TOWERS / PROJECTS (پروژه‌ها)
INSERT INTO public.towers (
  name, name_fa, slug, status, starting_price, delivery_date,
  is_off_plan, featured, payment_plan, area_id, developer_id,
  cover_image_url
)
VALUES
  (
    'Ocean 2', 'اوشن ۲', 'ocean-2', 'published', 900000, '2027 Q1',
    true, true, '70/30',
    (SELECT id FROM public.areas WHERE slug = 'dubai-mina-rashid'),
    (SELECT id FROM public.developers WHERE slug = 'danube-properties'),
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'
  ),
  (
    '340 Riverside Crescent', '۳۴۰ ریورساید کرسنت', '340-riverside-crescent', 'published', 1320000, '2027',
    true, true, '50/50',
    (SELECT id FROM public.areas WHERE slug = 'sobha-hartland'),
    (SELECT id FROM public.developers WHERE slug = 'sobha-realty'),
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80'
  ),
  (
    'Trump Tower', 'ترامپ تاور', 'trump-tower', 'published', 3800000, '2031 Q3',
    true, true, '90/10',
    (SELECT id FROM public.areas WHERE slug = 'dubai-zaabeel'),
    (SELECT id FROM public.developers WHERE slug = 'dar-al-arkan'),
    'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80'
  ),
  (
    'The Address Sky View', 'ادرس اسکای ویو', 'the-address-sky-view', 'published', 2500000, 'Ready',
    false, false, '0/100',
    (SELECT id FROM public.areas WHERE slug = 'downtown-dubai'),
    (SELECT id FROM public.developers WHERE slug = 'emaar-properties'),
    'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80'
  ),
  (
    'Boulevard Crescent', 'بلوار کرسنت', 'boulevard-crescent', 'published', 2000000, 'Ready',
    false, false, '0/100',
    (SELECT id FROM public.areas WHERE slug = 'downtown-dubai'),
    (SELECT id FROM public.developers WHERE slug = 'emaar-properties'),
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80'
  ),
  (
    'THE OPUS', 'اوپوس', 'the-opus', 'published', 3000000, '2025',
    false, false, '100/0',
    (SELECT id FROM public.areas WHERE slug = 'business-bay'),
    (SELECT id FROM public.developers WHERE slug = 'omniyat'),
    'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80'
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. PROPERTIES (املاک)
-- Note: listing_type must be 'sale', 'rent', or 'off_plan'
-- Note: property_type must match the enum values
INSERT INTO public.properties (
  title, title_fa, slug,
  listing_type, property_type, status, content_status, featured,
  price, price_per_sqft, roi_percent,
  bedrooms, bathrooms, size,
  area_id, cover_image_url, published_at
)
VALUES
  (
    'Luxurious 3BR Apartment in Downtown', 'آپارتمان لوکس ۳ خوابه در داون‌تاون',
    'luxurious-3br-downtown',
    'sale', 'apartment', 'available', 'published', true,
    2850000, 2100, 7.2,
    3, 4, 1357,
    (SELECT id FROM public.areas WHERE slug = 'downtown-dubai'),
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    NOW()
  ),
  (
    'Stunning 2BR with Marina View', 'آپارتمان ۲ خوابه با چشم‌انداز مارینا',
    'stunning-2br-marina-view',
    'sale', 'apartment', 'available', 'published', true,
    1950000, 1800, 6.8,
    2, 3, 1083,
    (SELECT id FROM public.areas WHERE slug = 'dubai-marina'),
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    NOW()
  ),
  (
    'Premium 1BR in Business Bay', 'آپارتمان ممتاز ۱ خوابه در بیزینس بی',
    'premium-1br-business-bay',
    'rent', 'apartment', 'available', 'published', false,
    1100000, 1294, 8.6,
    1, 2, 850,
    (SELECT id FROM public.areas WHERE slug = 'business-bay'),
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    NOW()
  ),
  (
    'Elegant 4BR Penthouse', 'پنت‌هاوس مجلل ۴ خوابه',
    'elegant-4br-penthouse-palm',
    'sale', 'penthouse', 'available', 'published', true,
    15500000, 3500, 5.5,
    4, 5, 4428,
    (SELECT id FROM public.areas WHERE slug = 'palm-jumeirah'),
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    NOW()
  ),
  (
    'Modern 2BR with Burj View', 'آپارتمان مدرن ۲ خوابه با نمای برج خلیفه',
    'modern-2br-burj-view',
    'sale', 'apartment', 'available', 'published', false,
    2400000, 2000, 6.0,
    2, 2, 1200,
    (SELECT id FROM public.areas WHERE slug = 'downtown-dubai'),
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    NOW()
  ),
  (
    'Spacious 3BR Villa', 'ویلای وسیع ۳ خوابه',
    'spacious-3br-villa-emirates-hills',
    'rent', 'villa', 'available', 'published', false,
    8200000, 1950, 5.4,
    3, 4, 4205,
    (SELECT id FROM public.areas WHERE slug = 'emirates-hills'),
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- DONE! Your database is now seeded with
-- 8 areas, 5 developers, 6 towers, 6 properties
-- =============================================
SELECT 'Areas: ' || COUNT(*) FROM public.areas;
SELECT 'Developers: ' || COUNT(*) FROM public.developers;
SELECT 'Towers: ' || COUNT(*) FROM public.towers;
SELECT 'Properties: ' || COUNT(*) FROM public.properties;
