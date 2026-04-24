import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AgentsListClient } from "./agents-list-client"

export const metadata = {
  title: "Our Agents | Cafoo Real Estate",
  description: "Meet our expert real estate consultants in Dubai",
}

export default async function AgentsPage() {
  const supabase = await createClient()
  
  const { data: agents } = await supabase
    .from("agents")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-24">
        <AgentsListClient agents={agents || []} />
      </div>
      <Footer />
    </main>
  )
}
