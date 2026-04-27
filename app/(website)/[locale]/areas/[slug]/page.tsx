import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AreaDetailClient } from "./area-detail-client"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: area } = await supabase
    .from("areas")
    .select("name, seo_title, seo_description")
    .eq("slug", slug)
    .single()

  return {
    title: area?.seo_title || `${area?.name} | Cafoo Real Estate`,
    description: area?.seo_description || `Explore properties in ${area?.name}`,
  }
}

export default async function AreaDetailPage({ params }: Props) {
  const { slug, locale } = await params
  const supabase = await createClient()
  
  const { data: area } = await supabase
    .from("areas")
    .select("*, assigned_agent:agents(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!area) {
    notFound()
  }

  // Fetch properties in this area
  const { data: properties } = await supabase
    .from("properties")
    .select("*, tower:towers(name, name_fa)")
    .eq("area_id", area.id)
    .eq("content_status", "published")
    .order("featured", { ascending: false })
    .limit(12)

  // Fetch towers in this area
  const { data: towers } = await supabase
    .from("towers")
    .select(`
      *,
      developer:developers(name, name_fa, logo_url)
    `)
    .eq("area_id", area.id)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .limit(6)

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <AreaDetailClient 
          area={area} 
          properties={properties || []} 
          towers={towers || []}
          locale={locale}
        />
      </div>
      <Footer />
    </main>
  )
}
