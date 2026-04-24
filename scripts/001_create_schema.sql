-- Cafoo Real Estate Platform Database Schema
-- Version 1.0

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUMS
-- ===========================================

CREATE TYPE user_role AS ENUM ('admin', 'agent', 'user');
CREATE TYPE listing_type AS ENUM ('sale', 'rent', 'off_plan');
CREATE TYPE property_type AS ENUM ('apartment', 'villa', 'townhouse', 'penthouse', 'studio', 'duplex', 'office', 'retail', 'warehouse', 'land', 'hotel_apartment');
CREATE TYPE property_status AS ENUM ('available', 'sold', 'rented', 'reserved', 'off_market');
CREATE TYPE furnishing_status AS ENUM ('furnished', 'semi_furnished', 'unfurnished');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE lead_source AS ENUM ('call', 'whatsapp', 'email', 'register_viewing', 'contact_form', 'referral');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'negotiating', 'won', 'lost');

-- ===========================================
-- PROFILES TABLE (extends auth.users)
-- ===========================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  full_name_fa TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- DEVELOPERS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.developers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_fa TEXT,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  description TEXT,
  description_fa TEXT,
  website TEXT,
  established_year INTEGER,
  total_projects INTEGER DEFAULT 0,
  status content_status DEFAULT 'published',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AGENTS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  name_fa TEXT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  title_fa TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  bio TEXT,
  bio_fa TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  languages TEXT[],
  specializations TEXT[],
  experience_years INTEGER DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  social_instagram TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_facebook TEXT,
  status content_status DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  -- SEO Fields
  seo_title TEXT,
  seo_title_fa TEXT,
  seo_description TEXT,
  seo_description_fa TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AMENITIES TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_fa TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- AREAS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_fa TEXT,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  short_description_fa TEXT,
  full_description TEXT,
  full_description_fa TEXT,
  cover_image_url TEXT,
  gallery TEXT[],
  location_highlights TEXT[],
  location_highlights_fa TEXT[],
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  -- Agent assignment
  assigned_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  -- Stats
  total_towers INTEGER DEFAULT 0,
  total_properties INTEGER DEFAULT 0,
  average_price DECIMAL(15, 2),
  price_growth_percent DECIMAL(5, 2),
  -- Status
  status content_status DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  -- SEO Fields
  seo_title TEXT,
  seo_title_fa TEXT,
  seo_description TEXT,
  seo_description_fa TEXT,
  seo_keywords TEXT[],
  canonical_url TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TOWERS & DISTRICTS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.towers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_fa TEXT,
  slug TEXT UNIQUE NOT NULL,
  -- Relations
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  assigned_agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  -- Description
  short_description TEXT,
  short_description_fa TEXT,
  full_description TEXT,
  full_description_fa TEXT,
  -- Key Info
  starting_price DECIMAL(15, 2),
  currency TEXT DEFAULT 'AED',
  payment_plan TEXT,
  payment_plan_fa TEXT,
  delivery_date TEXT,
  delivery_date_fa TEXT,
  total_units INTEGER,
  floors_count INTEGER,
  -- Media
  cover_image_url TEXT,
  gallery TEXT[],
  video_url TEXT,
  brochure_url TEXT,
  floor_plan_url TEXT,
  -- Location
  address TEXT,
  address_fa TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  -- Stats
  total_properties INTEGER DEFAULT 0,
  -- Status
  status content_status DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  is_off_plan BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  -- SEO Fields
  seo_title TEXT,
  seo_title_fa TEXT,
  seo_description TEXT,
  seo_description_fa TEXT,
  seo_keywords TEXT[],
  canonical_url TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tower Amenities Junction Table
CREATE TABLE IF NOT EXISTS public.tower_amenities (
  tower_id UUID REFERENCES public.towers(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (tower_id, amenity_id)
);

-- ===========================================
-- PROPERTIES TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Basic Info
  title TEXT NOT NULL,
  title_fa TEXT,
  slug TEXT UNIQUE NOT NULL,
  ad_code TEXT UNIQUE,
  -- Relations
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  tower_id UUID REFERENCES public.towers(id) ON DELETE SET NULL,
  developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  -- Type & Status
  listing_type listing_type NOT NULL,
  property_type property_type NOT NULL,
  status property_status DEFAULT 'available',
  furnishing furnishing_status,
  -- Pricing
  price DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'AED',
  price_per_sqft DECIMAL(10, 2),
  service_charge DECIMAL(10, 2),
  down_payment DECIMAL(15, 2),
  payment_plan_available BOOLEAN DEFAULT FALSE,
  yearly_rent DECIMAL(15, 2),
  monthly_rent DECIMAL(15, 2),
  roi_percent DECIMAL(5, 2),
  -- Specifications
  bedrooms INTEGER,
  bathrooms INTEGER,
  size DECIMAL(10, 2),
  size_unit TEXT DEFAULT 'sqft',
  floor INTEGER,
  total_floors INTEGER,
  parking_spaces INTEGER DEFAULT 0,
  balcony BOOLEAN DEFAULT FALSE,
  view_type TEXT,
  view_type_fa TEXT,
  -- Description
  short_description TEXT,
  short_description_fa TEXT,
  full_description TEXT,
  full_description_fa TEXT,
  -- Location
  address TEXT,
  address_fa TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  -- Media
  cover_image_url TEXT,
  gallery TEXT[],
  video_url TEXT,
  floor_plan_url TEXT,
  virtual_tour_url TEXT,
  brochure_url TEXT,
  -- Condition
  is_off_plan BOOLEAN DEFAULT FALSE,
  handover_date TEXT,
  is_vacant BOOLEAN DEFAULT TRUE,
  is_upgraded BOOLEAN DEFAULT FALSE,
  -- Stats
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  -- Status
  content_status content_status DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  -- SEO Fields
  seo_title TEXT,
  seo_title_fa TEXT,
  seo_description TEXT,
  seo_description_fa TEXT,
  seo_keywords TEXT[],
  canonical_url TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Amenities Junction Table
CREATE TABLE IF NOT EXISTS public.property_amenities (
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

-- ===========================================
-- CRM / LEADS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- User Info
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  -- Source
  source lead_source NOT NULL,
  source_url TEXT,
  -- Related Entity
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  tower_id UUID REFERENCES public.towers(id) ON DELETE SET NULL,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  -- Referral
  referral_code TEXT,
  referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- Status
  status lead_status DEFAULT 'new',
  notes TEXT,
  -- Timestamps
  contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- REFERRAL CLICKS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.referral_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_code TEXT NOT NULL,
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Related Entity
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  tower_id UUID REFERENCES public.towers(id) ON DELETE SET NULL,
  area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
  -- Info
  ip_address TEXT,
  user_agent TEXT,
  converted_to_lead BOOLEAN DEFAULT FALSE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- FAVORITES TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ===========================================
-- SITE SETTINGS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- FAQs TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  question_fa TEXT,
  answer TEXT NOT NULL,
  answer_fa TEXT,
  category TEXT,
  -- Related Entity (optional)
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  tower_id UUID REFERENCES public.towers(id) ON DELETE CASCADE,
  area_id UUID REFERENCES public.areas(id) ON DELETE CASCADE,
  -- Status
  status content_status DEFAULT 'published',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- TESTIMONIALS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_fa TEXT,
  title TEXT,
  title_fa TEXT,
  content TEXT NOT NULL,
  content_fa TEXT,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status content_status DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_properties_area ON public.properties(area_id);
CREATE INDEX IF NOT EXISTS idx_properties_tower ON public.properties(tower_id);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON public.properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON public.properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON public.properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);

CREATE INDEX IF NOT EXISTS idx_towers_area ON public.towers(area_id);
CREATE INDEX IF NOT EXISTS idx_towers_developer ON public.towers(developer_id);
CREATE INDEX IF NOT EXISTS idx_towers_slug ON public.towers(slug);
CREATE INDEX IF NOT EXISTS idx_towers_featured ON public.towers(featured);

CREATE INDEX IF NOT EXISTS idx_areas_slug ON public.areas(slug);
CREATE INDEX IF NOT EXISTS idx_areas_featured ON public.areas(featured);

CREATE INDEX IF NOT EXISTS idx_agents_slug ON public.agents(slug);
CREATE INDEX IF NOT EXISTS idx_agents_featured ON public.agents(featured);

CREATE INDEX IF NOT EXISTS idx_leads_user ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_agent ON public.leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);

CREATE INDEX IF NOT EXISTS idx_referral_clicks_code ON public.referral_clicks(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_referrer ON public.referral_clicks(referrer_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property ON public.favorites(property_id);

-- ===========================================
-- TRIGGERS FOR updated_at
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON public.developers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_areas_updated_at BEFORE UPDATE ON public.areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_towers_updated_at BEFORE UPDATE ON public.towers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- PROFILE TRIGGER (Auto-create on signup)
-- ===========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', NULL),
    UPPER(SUBSTRING(MD5(NEW.id::text) FROM 1 FOR 8))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
