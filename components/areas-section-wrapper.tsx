import { createClient } from "@/lib/supabase/server"
import { AreasSectionClient } from "./areas-section-client"

export async function AreasSection() {
  const supabase = await createClient()
  
  const { data: areas } = await supabase
    .from("areas")
    .select("id, name, name_fa, slug, short_description, short_description_fa, cover_image_url, total_properties, average_price, price_growth_percent, location_highlights, location_highlights_fa")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order", { ascending: true })
    .limit(4)

  return <AreasSectionClient areas={areas || []} />
}
