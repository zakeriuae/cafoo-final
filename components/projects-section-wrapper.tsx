import { createClient } from "@/lib/supabase/server"
import ProjectsSectionClient from "./projects-section-client"

export async function ProjectsSection() {
  const supabase = await createClient()

  const { data: towers, error } = await supabase
    .from("towers")
    .select(`
      id, 
      name, 
      name_fa, 
      slug, 
      starting_price, 
      delivery_date, 
      is_off_plan, 
      featured,
      cover_image_url,
      payment_plan,
      area:areas(name, name_fa, slug),
      developer:developers(name, name_fa, slug, logo_url)
    `)
    .limit(6)

  if (error) console.error('Towers fetch error:', error.message)

  // Map database towers to the format expected by the client component
  const formattedProjects = towers?.map(t => ({
    id: t.id,
    name: t.name,
    developer: t.developer?.name || "Developer",
    developerLogo: t.developer?.logo_url,
    location: { 
      en: t.area?.name || "Dubai", 
      fa: t.area?.name_fa || t.area?.name || "دبی" 
    },
    launchPrice: t.starting_price?.toLocaleString() || "0",
    paymentPlan: t.payment_plan || "70/30",
    deliveryTime: t.delivery_date || "2027",
    type: { en: "Apartment", fa: "آپارتمان" },
    status: t.is_off_plan ? "Off-Plan" : "Ready",
    image: t.cover_image_url || "/images/hero/hero-bg.png",
    featured: t.featured,
    roi: "8.0%",
    slug: t.slug
  })) || []

  if (formattedProjects.length === 0) {
    console.log("No towers found in database, check status or table content");
  }

  return <ProjectsSectionClient projects={formattedProjects} />
}
