import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PropertyDetailClient } from "./property-detail-client"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: property } = await supabase
    .from("properties")
    .select("title, seo_title, seo_description")
    .eq("slug", slug)
    .single()

  return {
    title: property?.seo_title || `${property?.title} | Cafoo Real Estate`,
    description: property?.seo_description || `View details for ${property?.title}`,
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug, locale } = await params
  const supabase = await createClient()
  
  const { data: property } = await supabase
    .from("properties")
    .select(`
      *,
      area:areas(*),
      tower:towers(*, developer:developers(*)),
      developer:developers(*),
      assigned_agent:agents(*)
    `)
    .eq("slug", slug)
    .eq("content_status", "published")
    .single()

  if (!property) {
    notFound()
  }

  // Fetch similar properties
  const { data: similarProperties } = await supabase
    .from("properties")
    .select("id, title, title_fa, slug, cover_image_url, price, bedrooms, bathrooms, size, listing_type")
    .eq("content_status", "published")
    .eq("property_type", property.property_type)
    .neq("id", property.id)
    .order("featured", { ascending: false })
    .limit(4)

  return (
    <main className="min-h-screen">
      <Navigation variant="light" />
      <div className="pt-20">
        <PropertyDetailClient 
          property={property}
          similarProperties={similarProperties || []}
          locale={locale}
        />
      </div>
      <Footer />
    </main>
  )
}
