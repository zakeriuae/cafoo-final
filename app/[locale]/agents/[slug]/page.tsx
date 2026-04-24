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

  // Fetch agent's properties
  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, title_fa, slug, cover_image_url, price, bedrooms, bathrooms, size, listing_type")
    .eq("assigned_agent_id", agent.id)
    .eq("content_status", "published")
    .order("featured", { ascending: false })
    .limit(6)

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-20">
        <AgentDetailClient 
          agent={agent}
          properties={properties || []}
          locale={locale}
        />
      </div>
      <Footer />
    </main>
  )
}
