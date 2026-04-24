import { createClient } from "@/lib/supabase/server"
import AgentsSectionClient from "./agents-section-client"

export async function AgentsSection() {
  const supabase = await createClient()
  
  const { data: agents } = await supabase
    .from("agents")
    .select("id, name, name_fa, slug, title, title_fa, avatar_url, phone, whatsapp, bio, bio_fa, specializations, languages, experience_years, total_listings")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(4)
  
  return <AgentsSectionClient agents={agents || []} />
}
