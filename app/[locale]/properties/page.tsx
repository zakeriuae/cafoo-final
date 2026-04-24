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
  }>
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from("properties")
    .select("*, area:areas(name, name_fa, slug), tower:towers(name, name_fa)")
    .eq("content_status", "published")

  // Apply filters
  if (params.type) {
    query = query.eq("property_type", params.type)
  }
  if (params.listing) {
    query = query.eq("listing_type", params.listing)
  }
  if (params.bedrooms) {
    query = query.eq("bedrooms", parseInt(params.bedrooms))
  }

  const { data: properties } = await query
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50)

  // Fetch areas for filter
  const { data: areas } = await supabase
    .from("areas")
    .select("id, name, name_fa, slug")
    .eq("status", "published")
    .order("name")

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24">
        <PropertiesListClient 
          properties={properties || []} 
          areas={areas || []}
          initialFilters={params}
        />
      </div>
      <Footer />
    </main>
  )
}
