import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { TowerDetailClient } from "../tower-detail-client";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function TowerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data: tower } = await supabase
    .from("towers")
    .select(`
      *,
      area:areas(id, name, name_fa, slug),
      developer:developers(id, name, name_fa, logo_url),
      assigned_agent:agents(id, name, name_fa, slug, title, title_fa, avatar_url, phone, whatsapp, email)
    `)
    .eq("slug", slug)
    .single();

  if (!tower) notFound();

  // Fetch related properties for this tower
  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, title_fa, slug, cover_image_url, price, bedrooms, bathrooms, size, listing_type")
    .eq("content_status", "published")
    .eq("tower_id", tower.id)
    .order("featured", { ascending: false })
    .limit(20);

  return (
    <main className="min-h-screen">
      <Navigation variant="light" />
      <div className="pt-20">
        <TowerDetailClient 
          tower={tower}
          properties={properties || []}
          locale={locale}
        />
      </div>
      <Footer />
    </main>
  );
}
