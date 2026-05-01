const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const areaUpdates = [
  { name: "JBR - Jumeirah Beach Residence", lat: 25.0772, lng: 55.1306 },
  { name: "Dubai Hills Estate", lat: 25.1092, lng: 55.2458 },
  { name: "Creek Harbour", lat: 25.1977, lng: 55.3444 },
  { name: "Arabian Ranches", lat: 25.0450, lng: 55.2638 },
  { name: "Dubai Mina Rashid", lat: 25.2647, lng: 55.2754 },
  { name: "Dubai Za'abeel", lat: 25.2285, lng: 55.3031 },
  { name: "Downtown Dubai", lat: 25.1972, lng: 55.2744 },
  { name: "Dubai Marina", lat: 25.0819, lng: 55.1436 },
  { name: "Business Bay", lat: 25.1852, lng: 55.2717 },
  { name: "Emirates Hills", lat: 25.0744, lng: 55.1925 },
  { name: "Palm Jumeirah", lat: 25.1124, lng: 55.1390 },
  { name: "Sobha Hartland", lat: 25.1764, lng: 55.3134 }
]

const towerUpdates = [
  { name: "Emirates Hills Villas", lat: 25.0744, lng: 55.1925 },
  { name: "Marina Promenade", lat: 25.0772, lng: 55.1352 },
  { name: "The Address Sky View", lat: 25.1983, lng: 55.2758 },
  { name: "Boulevard Crescent", lat: 25.1928, lng: 55.2736 },
  { name: "Atlantis The Royal", lat: 25.1378, lng: 55.1278 },
  { name: "Trump Tower", lat: 25.0347, lng: 55.2347 },
  { name: "THE OPUS", lat: 25.1883, lng: 55.2694 },
  { name: "340 Riverside Crescent", lat: 25.1764, lng: 55.3134 },
  { name: "Ocean 2", lat: 25.1977, lng: 55.3444 }
]

async function main() {
  console.log('Updating Areas...')
  for (const item of areaUpdates) {
    const { error } = await supabase.from('areas').update({ latitude: item.lat, longitude: item.lng }).eq('name', item.name)
    if (error) console.error(`Error updating area ${item.name}:`, error)
    else console.log(`Updated Area: ${item.name}`)
  }

  console.log('\nUpdating Towers...')
  for (const item of towerUpdates) {
    const { error } = await supabase.from('towers').update({ latitude: item.lat, longitude: item.lng }).eq('name', item.name)
    if (error) console.error(`Error updating tower ${item.name}:`, error)
    else console.log(`Updated Tower: ${item.name}`)
  }
}

main()
