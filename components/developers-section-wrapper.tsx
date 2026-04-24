import { createClient } from "@/lib/supabase/server"
import { DevelopersSectionClient } from "./developers-section-client"

export async function DevelopersSection() {
  const supabase = await createClient()
  
  const { data: developers } = await supabase
    .from("developers")
    .select("id, name, name_fa, slug, logo_url")
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  return <DevelopersSectionClient developers={developers || []} />
}
