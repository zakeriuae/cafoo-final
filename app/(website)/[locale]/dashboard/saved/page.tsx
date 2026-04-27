import { createClient } from "@/lib/supabase/server"
import { SavedPropertiesClient } from "./saved-properties-client"

export default async function SavedPropertiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: savedProperties } = await supabase
    .from("saved_properties")
    .select(`
      id,
      created_at,
      property:properties(
        id,
        title,
        title_fa,
        slug,
        price,
        bedrooms,
        bathrooms,
        area_sqft,
        cover_image_url,
        property_type,
        listing_type,
        area:areas(name, slug)
      )
    `)
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return <SavedPropertiesClient savedProperties={savedProperties || []} />
}
