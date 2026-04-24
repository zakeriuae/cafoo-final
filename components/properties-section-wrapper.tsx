import { createClient } from "@/lib/supabase/server"
import PropertiesSectionClient from "./properties-section-client"

export async function PropertiesSection() {
  const supabase = await createClient()
  
  const { data: properties } = await supabase
    .from("properties")
    .select(`
      id, 
      title, 
      title_fa, 
      slug, 
      cover_image_url, 
      price, 
      bedrooms, 
      bathrooms, 
      size, 
      listing_type, 
      property_type, 
      featured,
      area:areas(name, name_fa, slug),
      tower:towers(name, name_fa)
    `)
    .eq("content_status", "published")
    .limit(6)

  // Map database properties to the format expected by the client component
  const formattedProperties = properties?.map(p => ({
    id: p.id,
    title: { en: p.title, fa: p.title_fa || p.title },
    location: { 
      en: p.area?.name || "Dubai", 
      fa: p.area?.name_fa || p.area?.name || "دبی" 
    },
    project: p.tower?.name || "",
    price: p.price.toLocaleString(),
    rentPrice: p.listing_type === 'rent' ? p.price.toLocaleString() : "0",
    pricePerSqft: p.size ? Math.round(p.price / p.size).toLocaleString() : "0",
    bedrooms: p.bedrooms || 0,
    bathrooms: p.bathrooms || 0,
    size: p.size?.toLocaleString() || "0",
    type: p.listing_type,
    image: p.cover_image_url || "/images/placeholder.jpg",
    featured: p.featured,
    roi: "7.0%", // Hardcoded for now or can be added to DB
    slug: p.slug
  })) || []

  return <PropertiesSectionClient initialProperties={formattedProperties} />
}
