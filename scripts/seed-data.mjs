import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://navwagghjtiokeatqjdu.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function seed() {
  console.log('🌱 Starting comprehensive database seed with unique images...\n')

  // 1. AREAS
  console.log('📍 Inserting areas...')
  const { data: areas, error: areasError } = await supabase
    .from('areas')
    .upsert([
      { name: 'Downtown Dubai',    name_fa: 'داون‌تاون دبی',  slug: 'downtown-dubai',    short_description: 'Heart of Dubai', status: 'published', featured: true },
      { name: 'Dubai Marina',      name_fa: 'دبی مارینا',     slug: 'dubai-marina',      short_description: 'Waterfront living', status: 'published', featured: true },
      { name: 'Business Bay',      name_fa: 'بیزینس بی',      slug: 'business-bay',      short_description: 'Business hub', status: 'published', featured: true },
      { name: 'Palm Jumeirah',     name_fa: 'پالم جمیرا',     slug: 'palm-jumeirah',     short_description: 'Iconic island', status: 'published', featured: true },
      { name: 'Emirates Hills',    name_fa: 'امارات هیلز',    slug: 'emirates-hills',    short_description: 'Luxury villas', status: 'published', featured: false },
      { name: 'Sobha Hartland',    name_fa: 'سبحا هارتلند',   slug: 'sobha-hartland',    short_description: 'Green community', status: 'published', featured: false },
    ], { onConflict: 'slug' })
    .select()

  if (areasError) throw areasError
  const areaId = (slug) => areas.find(a => a.slug === slug)?.id

  // 2. DEVELOPERS
  console.log('🏗️  Inserting developers...')
  const { data: devs, error: devsError } = await supabase
    .from('developers')
    .upsert([
      { name: 'Danube Properties', name_fa: 'دانوب پراپرتیز', slug: 'danube-properties', status: 'published' },
      { name: 'SOBHA REALTY',      name_fa: 'سوبها ریلتی',    slug: 'sobha-realty',     status: 'published' },
      { name: 'DAR AL ARKAN',      name_fa: 'دار الارکان',    slug: 'dar-al-arkan',     status: 'published' },
      { name: 'EMAAR PROPERTIES',  name_fa: 'امار پراپرتیز',  slug: 'emaar-properties', status: 'published' },
      { name: 'NAKHEEL',           name_fa: 'نخیل',           slug: 'nakheel',          status: 'published' },
    ], { onConflict: 'slug' })
    .select()

  if (devsError) throw devsError
  const devId = (slug) => devs.find(d => d.slug === slug)?.id

  // 3. TOWERS (Unique Images for each)
  console.log('🏢 Inserting towers with unique images...')
  const { error: towersError } = await supabase
    .from('towers')
    .upsert([
      {
        name: 'Atlantis The Royal', name_fa: 'آتلانتیس د رویال', slug: 'atlantis-the-royal',
        status: 'published', starting_price: 15500000, delivery_date: 'Ready',
        is_off_plan: false, featured: true, payment_plan: 'Ready',
        area_id: areaId('palm-jumeirah'), developer_id: devId('nakheel'),
        cover_image_url: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80'
      },
      {
        name: 'The Address Sky View', name_fa: 'ادرس اسکای ویو', slug: 'the-address-sky-view',
        status: 'published', starting_price: 2500000, delivery_date: 'Ready',
        is_off_plan: false, featured: true, payment_plan: 'Ready',
        area_id: areaId('downtown-dubai'), developer_id: devId('emaar-properties'),
        cover_image_url: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=80'
      },
      {
        name: 'THE OPUS', name_fa: 'اوپوس', slug: 'the-opus',
        status: 'published', starting_price: 3000000, delivery_date: '2025',
        is_off_plan: false, featured: true,
        area_id: areaId('business-bay'), developer_id: devId('omniyat'),
        cover_image_url: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&q=80'
      },
      {
        name: 'Emirates Hills Villas', name_fa: 'ویلاهای امارات هیلز', slug: 'emirates-hills-villas',
        status: 'published', starting_price: 8200000, delivery_date: 'Ready',
        is_off_plan: false, featured: true,
        area_id: areaId('emirates-hills'), developer_id: devId('emaar-properties'),
        cover_image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80'
      },
      {
        name: 'Ocean 2', name_fa: 'اوشن ۲', slug: 'ocean-2',
        status: 'published', starting_price: 900000, delivery_date: '2027',
        is_off_plan: true, featured: true, payment_plan: '70/30',
        area_id: areaId('dubai-marina'), developer_id: devId('danube-properties'),
        cover_image_url: 'https://images.unsplash.com/photo-1545331055-63e8006e885c?w=800&q=80'
      },
      {
        name: '340 Riverside Crescent', name_fa: '۳۴۰ ریورساید کرسنت', slug: '340-riverside-crescent',
        status: 'published', starting_price: 1320000, delivery_date: '2027',
        is_off_plan: true, featured: true, payment_plan: '50/50',
        area_id: areaId('sobha-hartland'), developer_id: devId('sobha-realty'),
        cover_image_url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80'
      }
    ], { onConflict: 'slug' })

  if (towersError) throw towersError

  // 4. PROPERTIES (Unique Images for each)
  console.log('🏠 Inserting properties with unique images...')
  const { error: propsError } = await supabase
    .from('properties')
    .upsert([
      {
        title: 'Modern Penthouse with Burj View', title_fa: 'پنت‌هاوس مدرن با نمای برج',
        slug: 'modern-penthouse-burj', listing_type: 'sale', property_type: 'penthouse',
        status: 'available', content_status: 'published', featured: true,
        price: 4500000, price_per_sqft: 2500, roi_percent: 7.5,
        bedrooms: 4, bathrooms: 5, size: 3200,
        area_id: areaId('downtown-dubai'),
        cover_image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
        published_at: new Date().toISOString()
      },
      {
        title: 'Luxury Villa in Palm Jumeirah', title_fa: 'ویلای لوکس در پالم جمیرا',
        slug: 'luxury-villa-palm', listing_type: 'sale', property_type: 'villa',
        status: 'available', content_status: 'published', featured: true,
        price: 12000000, price_per_sqft: 3000, roi_percent: 6.2,
        bedrooms: 5, bathrooms: 6, size: 5500,
        area_id: areaId('palm-jumeirah'),
        cover_image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        published_at: new Date().toISOString()
      },
      {
        title: 'Cozy 1BR in Business Bay', title_fa: 'واحد ۱ خوابه در بیزینس بی',
        slug: 'cozy-1br-business-bay', listing_type: 'rent', property_type: 'apartment',
        status: 'available', content_status: 'published', featured: true,
        price: 95000, price_per_sqft: 1200, roi_percent: 8.1,
        bedrooms: 1, bathrooms: 1, size: 850,
        area_id: areaId('business-bay'),
        cover_image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        published_at: new Date().toISOString()
      }
    ], { onConflict: 'slug' })

  if (propsError) throw propsError

  console.log('🎉 Success! All data refreshed with unique images.')
}

seed().catch(console.error)
