import { createClient } from "@/lib/supabase/server"
import ProjectsSectionClient from "./projects-section-client"

export async function ProjectsSection() {
  const supabase = await createClient()

  const { data: towers } = await supabase
    .from("towers")
    .select(`
      id, 
      name, 
      name_fa, 
      slug, 
      starting_price, 
      handover_date, 
      is_off_plan, 
      featured,
      area:areas(name, name_fa, slug),
      developer:developers(name, name_fa, slug)
    `)
    .eq("status", "published")
    .limit(6)

  // Map database towers to the format expected by the client component
  const formattedProjects = towers?.map(t => ({
    id: t.id,
    name: t.name,
    developer: t.developer?.name || "",
    location: {
      en: t.area?.name || "Dubai",
      fa: t.area?.name_fa || t.area?.name || "دبی"
    },
    launchPrice: t.starting_price?.toLocaleString() || "0",
    paymentPlan: "70/30", // This could be added to DB
    deliveryTime: t.handover_date || "2027",
    type: { en: "Apartment", fa: "آپارتمان" }, // Default for now
    status: t.is_off_plan ? "Off-Plan" : "Ready",
    image: "/images/downtown-dubai.jpg", // Placeholder or from DB if added
    featured: t.featured,
    roi: "8.0%",
    slug: t.slug
  })) || []

  return <ProjectsSectionClient projects={formattedProjects} />
}
