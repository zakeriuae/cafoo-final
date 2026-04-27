import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AgentDetailClient } from "./agent-detail-client"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: agent } = await supabase
    .from("agents")
    .select("name, title")
    .eq("slug", slug)
    .single()

  return {
    title: `${agent?.name} - ${agent?.title} | Cafoo Real Estate`,
    description: `Contact ${agent?.name}, ${agent?.title} at Cafoo Real Estate Dubai`,
  }
}

export default async function AgentDetailPage({ params }: Props) {
  const { slug, locale } = await params
  const supabase = await createClient()
  
  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!agent) {
    notFound()
  }

  // Fetch agent's towers/projects
  const { data: towers, error: tError } = await supabase
    .from("towers")
    .select(`
      id, name, name_fa, slug, cover_image_url, starting_price, delivery_date, payment_plan, is_off_plan,
      area:areas!towers_area_id_fkey(id, name, name_fa, slug),
      developer:developers!towers_developer_id_fkey(id, name, name_fa, logo_url)
    `)
    .eq("assigned_agent_id", agent.id)
    .limit(10)

  if (tError) {
    console.error(`Error fetching towers for agent ${agent.id}:`, JSON.stringify(tError, null, 2));
  }

  // Fetch agent's properties
  const { data: properties, error: pError } = await supabase
    .from("properties")
    .select(`
      id, title, title_fa, slug, cover_image_url, price, bedrooms, bathrooms, size, listing_type, property_type,
      area:areas(id, name, name_fa, slug),
      tower:towers(id, name, name_fa, slug),
      developer:developers(id, name, logo_url)
    `)
    .eq("agent_id", agent.id)
    .eq("content_status", "published")
    .order("featured", { ascending: false })
    .limit(10)

  if (pError) {
    console.error(`Error fetching properties for agent ${agent.id}:`, pError);
  }

  console.log(`Agent ID: ${agent.id}, Towers fetched: ${towers?.length || 0}, Properties fetched: ${properties?.length || 0}`);

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <AgentDetailClient 
          agent={agent}
          properties={properties || []}
          towers={towers || []}
          locale={locale}
        />
      </div>
      <Footer />
    </main>
  )
}
