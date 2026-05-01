import { createClient } from "@/lib/supabase/server"
import MapClient from "./map-client"
import { Navigation } from "@/components/navigation"

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const isRtl = params.locale === 'fa'
  
  return {
    title: isRtl ? 'نقشه املاک دبی | کافو' : 'Dubai Property Map | Cafoo',
    description: isRtl 
      ? 'مشاهده تمامی املاک و پروژه‌های دبی بر روی نقشه هوشمند' 
      : 'View all Dubai properties and projects on an interactive map',
  }
}

export default async function MapPage() {
  const supabase = await createClient()
  
  const { data: properties } = await supabase
    .from("properties")
    .select("*, area:areas(name, name_fa, slug, latitude, longitude), tower:towers(name, name_fa, slug, latitude, longitude)")
    .eq("content_status", "published")
    .limit(1000)

  return (
    <main className="h-screen overflow-hidden">
      <Navigation />
      <MapClient initialProperties={properties || []} />
    </main>
  )
}
