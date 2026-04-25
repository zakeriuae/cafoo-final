import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { parseSeoRoute, buildSeoUrl } from "@/lib/seo-router";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PropertiesListClient } from "@/app/[locale]/properties/properties-list-client";
import { PropertyDetailClient } from "@/app/[locale]/properties/[slug]/property-detail-client";
import { TowerDetailClient } from "@/app/[locale]/towers/tower-detail-client";

interface Props {
  params: Promise<{
    locale: string;
    transactionType: string;
    propertyType: string;
    slug?: string[];
  }>;
  searchParams: Promise<{
    bedrooms?: string;
  }>;
}

export default async function SeoPropertyPage({ params, searchParams }: Props) {
  const { locale, transactionType, propertyType, slug } = await params;
  const sParams = await searchParams;

  // 1. Parse and validate the route parameters
  const routeParams = parseSeoRoute(transactionType, propertyType, slug);
  if (!routeParams) {
    notFound();
  }

  const supabase = await createClient();
  const hierarchyLevel = slug ? slug.length : 0;

  // Level 4: Specific Property/Unit Detail Page
  if (hierarchyLevel === 4) {
    const { data: property } = await supabase
      .from("properties")
      .select(`
        *,
        area:areas(id, name, name_fa, slug),
        tower:towers(id, name, name_fa, slug),
        developer:developers(id, name, name_fa, logo_url),
        assigned_agent:agents(id, name, name_fa, slug, title, title_fa, avatar_url, phone, whatsapp, email)
      `)
      .eq("slug", routeParams.unit)
      .eq("content_status", "published")
      .single();

    if (!property) notFound();

    // SEO Canonical Verification
    if (
      property.area?.slug !== routeParams.area ||
      property.tower?.slug !== routeParams.project
    ) {
      // Redirect to correct canonical URL
      const correctUrl = buildSeoUrl({
        transactionType: routeParams.transactionType,
        propertyType: routeParams.propertyType,
        city: 'dubai', // Hardcoded city for now
        area: property.area?.slug,
        project: property.tower?.slug,
        unit: property.slug
      }, locale);
      redirect(correctUrl);
    }

    // Fetch similar properties
    const { data: similarProperties } = await supabase
      .from("properties")
      .select("id, title, title_fa, slug, cover_image_url, price, bedrooms, bathrooms, size, listing_type")
      .eq("content_status", "published")
      .eq("property_type", property.property_type)
      .neq("id", property.id)
      .order("featured", { ascending: false })
      .limit(3);

    return (
      <main className="min-h-screen">
        <Navigation variant="light" />
        <div className="pt-20">
          <PropertyDetailClient 
            property={property}
            similarProperties={similarProperties || []}
            locale={locale}
          />
        </div>
        <Footer />
      </main>
    );
  }

  // Level 3: Specific Tower/Project Detail Page
  if (hierarchyLevel === 3) {
    const { data: tower } = await supabase
      .from("towers")
      .select(`
        *,
        area:areas(id, name, name_fa, slug),
        developer:developers(id, name, name_fa, logo_url)
      `)
      .eq("slug", routeParams.project)
      .single();

    if (!tower) notFound();

    // SEO Canonical Verification
    if (tower.area?.slug !== routeParams.area) {
      const correctUrl = buildSeoUrl({
        transactionType: routeParams.transactionType,
        propertyType: routeParams.propertyType,
        city: 'dubai',
        area: tower.area?.slug,
        project: tower.slug
      }, locale);
      redirect(correctUrl);
    }

    // Fetch related properties for this tower based on current filters
    let query = supabase
      .from("properties")
      .select("id, title, title_fa, slug, cover_image_url, price, bedrooms, bathrooms, size, listing_type")
      .eq("content_status", "published")
      .eq("tower_id", tower.id);
      
    let dbListingType = '';
    if (routeParams.transactionType === 'for-sale') dbListingType = 'sale';
    if (routeParams.transactionType === 'for-rent') dbListingType = 'rent';
    if (routeParams.transactionType === 'off-plan') dbListingType = 'off_plan';
    
    if (dbListingType) query = query.eq("listing_type", dbListingType);
    if (routeParams.propertyType !== 'property') query = query.eq("property_type", routeParams.propertyType);
    if (sParams.bedrooms) query = query.eq("bedrooms", parseInt(sParams.bedrooms));

    const { data: properties } = await query
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
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

  // Levels 0-2: Listings Page
  // Map transaction type to DB listing_type
  let dbListingType = '';
  if (routeParams.transactionType === 'for-sale') dbListingType = 'sale';
  if (routeParams.transactionType === 'for-rent') dbListingType = 'rent';
  if (routeParams.transactionType === 'off-plan') dbListingType = 'off_plan';

  let query = supabase
    .from("properties")
    .select("*, area:areas!inner(name, name_fa, slug), tower:towers!inner(name, name_fa, slug)")
    .eq("content_status", "published");

  // Apply filters from route
  if (dbListingType) query = query.eq("listing_type", dbListingType);
  if (routeParams.propertyType !== 'property') query = query.eq("property_type", routeParams.propertyType);
  if (routeParams.area) query = query.eq("area.slug", routeParams.area);
  if (routeParams.project) query = query.eq("tower.slug", routeParams.project);
  if (sParams.bedrooms) query = query.eq("bedrooms", parseInt(sParams.bedrooms));

  const { data: properties } = await query
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: areas } = await supabase
    .from("areas")
    .select("id, name, name_fa, slug")
    .eq("status", "published")
    .order("name");

  return (
    <main className="min-h-screen">
      <Navigation variant="light" />
      <div className="pt-24">
        {/* Pass route parameters as initialFilters if needed */}
        <PropertiesListClient 
          properties={properties || []} 
          areas={areas || []}
          initialFilters={{
            type: routeParams.propertyType !== 'property' ? routeParams.propertyType : undefined,
            listing: dbListingType,
            area: routeParams.area,
            bedrooms: sParams.bedrooms
          }}
        />
      </div>
      <Footer />
    </main>
  );
}
