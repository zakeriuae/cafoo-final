import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AreasListClient } from "./areas-list-client"

export const metadata = {
  title: "Areas & Communities in Dubai | Cafoo Real Estate",
  description: "Explore the most popular areas and communities in Dubai to find your perfect home.",
}

export default async function AreasPage() {
  const supabase = await createClient()
  
  const { data: areas } = await supabase
    .from("areas")
    .select("*")
    .eq("status", "published") // Corrected column name to status
    .order("featured", { ascending: false })
    .order("name", { ascending: true })

  return (
    <main className="min-h-screen bg-slate-50/40">
      <Navigation />
      <div className="pt-24 pb-20">
        <AreasListClient 
          initialAreas={areas || []} 
        />
      </div>
      <Footer />
    </main>
  )
}
