import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PropertiesListClient } from "./properties-list-client"

export const metadata = {
  title: "Properties | Cafoo Real Estate",
  description: "Browse luxury properties for sale and rent in Dubai",
}

interface Props {
  searchParams: Promise<{ 
    area?: string
    type?: string
    listing?: string
    bedrooms?: string
    priceMin?: string
    priceMax?: string
    areaMin?: string
    areaMax?: string
    handover?: string
  }>
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from("properties")
    .select("*, area:areas(name, name_fa, slug), tower:towers(name, name_fa, slug)")
    .eq("content_status", "published")

  // 1. Transaction Type
  if (params.listing) query = query.eq("listing_type", params.listing)

  // 2. Property Type
  if (params.type && params.type !== "any") query = query.eq("property_type", params.type)

  // 3. Bedrooms
  if (params.bedrooms && params.bedrooms !== "any") {
    if (params.bedrooms === "studio") query = query.eq("bedrooms", 0)
    else {
      const beds = parseInt(params.bedrooms)
      if (!isNaN(beds)) {
        if (beds >= 4) query = query.gte("bedrooms", 4)
        else query = query.eq("bedrooms", beds)
      }
    }
  }

  // 4. Price Range
  if (params.priceMin) {
    const min = parseInt(params.priceMin.replace(/[^0-9]/g, ""))
    if (!isNaN(min)) query = query.gte("price", min)
  }
  if (params.priceMax) {
    const max = parseInt(params.priceMax.replace(/[^0-9]/g, ""))
    if (!isNaN(max)) query = query.lte("price", max)
  }

  // 5. Area Range
  if (params.areaMin) {
    const min = parseInt(params.areaMin)
    if (!isNaN(min)) query = query.gte("sqft", min)
  }
  if (params.areaMax) {
    const max = parseInt(params.areaMax)
    if (!isNaN(max)) query = query.lte("sqft", max)
  }

  // 6. Handover
  if (params.handover && params.handover !== "any") query = query.gte("handover_date", `${params.handover}-01-01`)

  // 7. ADVANCED SEARCH
  if (params.area) {
    const search = params.area.trim()
    const pattern = `%${search}%`
    
    // Try to find IDs of matching towers or areas first
    const [towersRes, areasRes] = await Promise.all([
      supabase.from('towers').select('id').or(`name.ilike.${pattern},name_fa.ilike.${pattern}`),
      supabase.from('areas').select('id').or(`name.ilike.${pattern},name_fa.ilike.${pattern}`)
    ])

    const tIds = towersRes.data?.map(t => t.id) || []
    const aIds = areasRes.data?.map(a => a.id) || []

    // Build OR conditions array
    let conditions = [
      `title.ilike.${pattern}`,
      `title_fa.ilike.${pattern}`,
      `full_description.ilike.${pattern}`,
      `full_description_fa.ilike.${pattern}`
    ]

    if (tIds.length > 0) conditions.push(`tower_id.in.(${tIds.join(',')})`)
    if (aIds.length > 0) conditions.push(`area_id.in.(${aIds.join(',')})`)
    
    query = query.or(conditions.join(','))
  }

  const { data: properties, error } = await query
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("SEARCH_ERROR_DEBUG:", JSON.stringify(error, null, 2))
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <PropertiesListClient 
          properties={properties || []} 
          initialFilters={params}
        />
      </div>
      <Footer />
    </main>
  )
}
