import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AreasListClient } from "./areas-list-client"

export const metadata = {
  title: "Areas | Cafoo Real Estate",
  description: "Explore the most sought-after neighborhoods in Dubai",
}

export default async function AreasPage() {
  const supabase = await createClient()
  
  const { data: areas } = await supabase
    .from("areas")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24">
        <AreasListClient areas={areas || []} />
      </div>
      <Footer />
    </main>
  )
}
