// Database types for Cafoo Real Estate Platform

export type UserRole = 'admin' | 'agent' | 'user'
export type ListingType = 'sale' | 'rent' | 'off_plan'
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'studio' | 'duplex' | 'office' | 'retail' | 'warehouse' | 'land' | 'hotel_apartment'
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'reserved' | 'off_market'
export type FurnishingStatus = 'furnished' | 'semi_furnished' | 'unfurnished'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type LeadSource = 'call' | 'whatsapp' | 'email' | 'register_viewing' | 'contact_form' | 'referral'
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiating' | 'won' | 'lost'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  full_name_fa: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  referral_code: string | null
  referred_by: string | null
  created_at: string
  updated_at: string
}

export interface Developer {
  id: string
  name: string
  name_fa: string | null
  slug: string
  logo_url: string | null
  description: string | null
  description_fa: string | null
  website: string | null
  established_year: number | null
  total_projects: number
  status: ContentStatus
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Agent {
  id: string
  user_id: string | null
  name: string
  name_fa: string | null
  slug: string
  title: string | null
  title_fa: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  bio: string | null
  bio_fa: string | null
  avatar_url: string | null
  cover_image_url: string | null
  languages: string[]
  specializations: string[]
  experience_years: number
  total_listings: number
  social_instagram: string | null
  social_linkedin: string | null
  social_twitter: string | null
  social_facebook: string | null
  status: ContentStatus
  featured: boolean
  sort_order: number
  seo_title: string | null
  seo_title_fa: string | null
  seo_description: string | null
  seo_description_fa: string | null
  seo_keywords: string[]
  created_at: string
  updated_at: string
}

export interface Amenity {
  id: string
  name: string
  name_fa: string | null
  slug: string
  icon: string | null
  category: string | null
  sort_order: number
  created_at: string
}

export interface Area {
  id: string
  name: string
  name_fa: string | null
  slug: string
  short_description: string | null
  short_description_fa: string | null
  full_description: string | null
  full_description_fa: string | null
  cover_image_url: string | null
  gallery: string[]
  location_highlights: string[]
  location_highlights_fa: string[]
  latitude: number | null
  longitude: number | null
  assigned_agent_id: string | null
  total_towers: number
  total_properties: number
  average_price: number | null
  price_growth_percent: number | null
  rental_yield: number | null
  connectivity: { location: string; time: string }[] | null
  connectivity_fa: { location: string; time: string }[] | null
  amenities: string[] | null
  amenities_fa: string[] | null
  video_url: string | null
  status: ContentStatus
  featured: boolean
  sort_order: number
  seo_title: string | null
  seo_title_fa: string | null
  seo_description: string | null
  seo_description_fa: string | null
  seo_keywords: string[]
  canonical_url: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
  // Relations
  assigned_agent?: Agent | null
}

export interface Tower {
  id: string
  name: string
  name_fa: string | null
  slug: string
  area_id: string | null
  developer_id: string | null
  assigned_agent_id: string | null
  short_description: string | null
  short_description_fa: string | null
  full_description: string | null
  full_description_fa: string | null
  starting_price: number | null
  currency: string
  payment_plan: string | null
  payment_plan_fa: string | null
  payment_plan_details: { phase: string; percent: string }[] | null
  payment_plan_details_fa: { phase: string; percent: string }[] | null
  connectivity: { location: string; time: string }[] | null
  connectivity_fa: { location: string; time: string }[] | null
  delivery_date: string | null
  delivery_date_fa: string | null
  total_units: number | null
  floors_count: number | null
  cover_image_url: string | null
  gallery: string[]
  video_url: string | null
  brochure_url: string | null
  floor_plan_url: string | null
  address: string | null
  address_fa: string | null
  latitude: number | null
  longitude: number | null
  total_properties: number
  status: ContentStatus
  featured: boolean
  is_off_plan: boolean
  sort_order: number
  seo_title: string | null
  seo_title_fa: string | null
  seo_description: string | null
  seo_description_fa: string | null
  seo_keywords: string[]
  canonical_url: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
  // Relations
  area?: Area | null
  developer?: Developer | null
  assigned_agent?: Agent | null
}

export interface Property {
  id: string
  title: string
  title_fa: string | null
  slug: string
  ad_code: string | null
  area_id: string | null
  tower_id: string | null
  developer_id: string | null
  agent_id: string | null
  listing_type: ListingType
  property_type: PropertyType
  status: PropertyStatus
  furnishing: FurnishingStatus | null
  price: number
  currency: string
  price_per_sqft: number | null
  service_charge: number | null
  down_payment: number | null
  payment_plan_available: boolean
  yearly_rent: number | null
  monthly_rent: number | null
  roi_percent: number | null
  bedrooms: number | null
  bathrooms: number | null
  size: number | null
  size_unit: string
  floor: number | null
  total_floors: number | null
  parking_spaces: number
  balcony: boolean
  view_type: string | null
  view_type_fa: string | null
  short_description: string | null
  short_description_fa: string | null
  full_description: string | null
  full_description_fa: string | null
  address: string | null
  address_fa: string | null
  latitude: number | null
  longitude: number | null
  cover_image_url: string | null
  gallery: string[]
  video_url: string | null
  floor_plan_url: string | null
  virtual_tour_url: string | null
  brochure_url: string | null
  is_off_plan: boolean
  handover_date: string | null
  is_vacant: boolean
  is_upgraded: boolean
  views_count: number
  inquiries_count: number
  content_status: ContentStatus
  featured: boolean
  verified: boolean
  sort_order: number
  published_at: string | null
  seo_title: string | null
  seo_title_fa: string | null
  seo_description: string | null
  seo_description_fa: string | null
  seo_keywords: string[]
  canonical_url: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
  // Relations
  area?: Area | null
  tower?: Tower | null
  developer?: Developer | null
  agent?: Agent | null
  amenities?: Amenity[]
}

export interface Lead {
  id: string
  user_id: string | null
  name: string | null
  email: string | null
  phone: string | null
  source: LeadSource
  source_url: string | null
  property_id: string | null
  tower_id: string | null
  area_id: string | null
  agent_id: string | null
  referral_code: string | null
  referred_by: string | null
  status: LeadStatus
  notes: string | null
  contacted_at: string | null
  created_at: string
  updated_at: string
  // Relations
  property?: Property | null
  tower?: Tower | null
  area?: Area | null
  agent?: Agent | null
}

export interface ReferralClick {
  id: string
  referral_code: string
  referrer_id: string
  property_id: string | null
  tower_id: string | null
  area_id: string | null
  ip_address: string | null
  user_agent: string | null
  converted_to_lead: boolean
  lead_id: string | null
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  property_id: string
  created_at: string
  // Relations
  property?: Property | null
}

export interface SiteSetting {
  id: string
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface FAQ {
  id: string
  question: string
  question_fa: string | null
  answer: string
  answer_fa: string | null
  category: string | null
  property_id: string | null
  tower_id: string | null
  area_id: string | null
  status: ContentStatus
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  name_fa: string | null
  title: string | null
  title_fa: string | null
  content: string
  content_fa: string | null
  avatar_url: string | null
  rating: number | null
  status: ContentStatus
  featured: boolean
  sort_order: number
  created_at: string
}
