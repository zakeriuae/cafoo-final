import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TowersListClient } from "./towers-list-client"

export const metadata = {
  title: "Towers & Districts in Dubai | Cafoo Real Estate",
  description: "Explore the most prestigious towers and districts in Dubai's real estate market.",
}

export default async function TowersPage() {
  const supabase = await createClient()
  
  const { data: towers } = await supabase
    .from("towers")
    .select(`
      *, 
      area:areas(id, name, name_fa, slug),
      developer:developers(id, name, logo_url)
    `)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("name", { ascending: true })
    .limit(50)

  const { data: areas } = await supabase
    .from("areas")
    .select("id, name, name_fa, slug")
    .eq("status", "published")

  return (
    <main className="min-h-screen bg-slate-50/40">
      <Navigation />
      <div className="pt-24 pb-20">
        <TowersListClient 
          initialTowers={towers || []} 
          areas={areas || []}
        />
      </div>
      <Footer />
    </main>
  )
}
