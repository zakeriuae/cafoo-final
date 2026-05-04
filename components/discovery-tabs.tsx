import { createClient } from "@/lib/supabase/server"
import DiscoveryTabsClient from "./discovery-tabs-client"

export async function DiscoveryTabs() {
  const supabase = await createClient()

  // 1. Fetch Counts
  const [
    { count: propertiesCount },
    { count: towersCount },
    { data: properties },
    { data: towers }
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("content_status", "published"),
    supabase.from("towers").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("properties").select(`
      id, title, title_fa, slug, cover_image_url, price, bedrooms, bathrooms, size, listing_type, property_type, featured, roi_percent,
      area:areas(name, name_fa, slug),
      tower:towers(name, name_fa, developer:developers(name, name_fa, logo_url))
    `).eq("content_status", "published").limit(6),
    supabase.from("towers").select(`
      id, name, name_fa, slug, starting_price, delivery_date, is_off_plan, featured, cover_image_url, payment_plan,
      area:areas(name, name_fa, slug),
      developer:developers(name, name_fa, slug, logo_url)
    `).eq("status", "published").limit(6)
  ])

  // 2. Format Properties
  const formattedProperties = properties?.map(p => ({
    id: p.id,
    title: { en: p.title, fa: p.title_fa || p.title },
    location: { 
      en: p.area?.name || "Dubai", 
      fa: p.area?.name_fa || p.area?.name || "دبی" 
    },
    project: p.tower?.name || "",
    developerName: p.tower?.developer?.name,
    developerLogo: p.tower?.developer?.logo_url,
    price: p.price.toLocaleString(),
    rentPrice: p.listing_type === 'rent' ? p.price.toLocaleString() : "0",
    pricePerSqft: p.size ? Math.round(p.price / p.size).toLocaleString() : "0",
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    size: p.size?.toLocaleString() || "0",
    type: p.listing_type,
    image: p.cover_image_url || "/images/placeholder.jpg",
    featured: p.featured,
    roi: p.roi_percent ? `${p.roi_percent}%` : "7.0%",
    slug: p.slug,
    areaSlug: p.area?.slug,
    towerSlug: p.tower?.slug
  })) || []

  // 3. Format Towers
  const formattedTowers = towers?.map(t => ({
    id: t.id,
    name: t.name,
    developer: t.developer?.name || "Developer",
    developerLogo: t.developer?.logo_url,
    location: { 
      en: t.area?.name || "Dubai", 
      fa: t.area?.name_fa || t.area?.name || "دبی" 
    },
    launchPrice: t.starting_price?.toLocaleString() || "0",
    paymentPlan: t.payment_plan || "70/30",
    deliveryTime: t.delivery_date || "2027",
    type: { en: "Apartment", fa: "آپارتمان" },
    status: t.is_off_plan ? "Off-Plan" : "Ready",
    image: t.cover_image_url || "/images/hero/hero-bg.png",
    featured: t.featured,
    roi: "8.0%",
    slug: t.slug,
    areaSlug: t.area?.slug
  })) || []

  return (
    <DiscoveryTabsClient 
      properties={formattedProperties}
      towers={formattedTowers}
      propertiesCount={propertiesCount || 0}
      towersCount={towersCount || 0}
    />
  )
}
