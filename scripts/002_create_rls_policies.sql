-- Row Level Security Policies for Cafoo Real Estate Platform

-- ===========================================
-- PROFILES
-- ===========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public can view profiles
CREATE POLICY "profiles_select_public" ON public.profiles 
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "profiles_admin_all" ON public.profiles 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- DEVELOPERS (Public read, Admin write)
-- ===========================================
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "developers_select_public" ON public.developers 
  FOR SELECT USING (status = 'published' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "developers_admin_insert" ON public.developers 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "developers_admin_update" ON public.developers 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "developers_admin_delete" ON public.developers 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- AGENTS (Public read, Admin write, Agent update own)
-- ===========================================
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agents_select_public" ON public.agents 
  FOR SELECT USING (status = 'published' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "agents_admin_insert" ON public.agents 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "agents_admin_update" ON public.agents 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR user_id = auth.uid()
  );

CREATE POLICY "agents_admin_delete" ON public.agents 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- AMENITIES (Public read, Admin write)
-- ===========================================
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "amenities_select_public" ON public.amenities 
  FOR SELECT USING (true);

CREATE POLICY "amenities_admin_all" ON public.amenities 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- AREAS (Public read published, Admin/Agent write)
-- ===========================================
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "areas_select_public" ON public.areas 
  FOR SELECT USING (status = 'published' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "areas_admin_insert" ON public.areas 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "areas_admin_update" ON public.areas 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "areas_admin_delete" ON public.areas 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- TOWERS (Public read published, Admin write)
-- ===========================================
ALTER TABLE public.towers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "towers_select_public" ON public.towers 
  FOR SELECT USING (status = 'published' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "towers_admin_insert" ON public.towers 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "towers_admin_update" ON public.towers 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "towers_admin_delete" ON public.towers 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Tower Amenities
ALTER TABLE public.tower_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tower_amenities_select_public" ON public.tower_amenities 
  FOR SELECT USING (true);

CREATE POLICY "tower_amenities_admin_all" ON public.tower_amenities 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- PROPERTIES (Public read published, Admin/Agent write)
-- ===========================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_select_public" ON public.properties 
  FOR SELECT USING (content_status = 'published' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent')));

CREATE POLICY "properties_admin_insert" ON public.properties 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  );

CREATE POLICY "properties_update" ON public.properties 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.agents 
      WHERE agents.id = properties.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "properties_admin_delete" ON public.properties 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Property Amenities
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_amenities_select_public" ON public.property_amenities 
  FOR SELECT USING (true);

CREATE POLICY "property_amenities_admin_all" ON public.property_amenities 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
  );

-- ===========================================
-- LEADS (Admin/Agent see assigned, User see own)
-- ===========================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_select" ON public.leads 
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.agents 
      WHERE agents.id = leads.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "leads_insert_authenticated" ON public.leads 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "leads_update" ON public.leads 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM public.agents 
      WHERE agents.id = leads.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "leads_admin_delete" ON public.leads 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- REFERRAL CLICKS
-- ===========================================
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referral_clicks_insert_public" ON public.referral_clicks 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "referral_clicks_select" ON public.referral_clicks 
  FOR SELECT USING (
    referrer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- FAVORITES
-- ===========================================
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select_own" ON public.favorites 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "favorites_insert_own" ON public.favorites 
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "favorites_delete_own" ON public.favorites 
  FOR DELETE USING (user_id = auth.uid());

-- ===========================================
-- SITE SETTINGS
-- ===========================================
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_select_public" ON public.site_settings 
  FOR SELECT USING (true);

CREATE POLICY "site_settings_admin_all" ON public.site_settings 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- FAQS
-- ===========================================
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faqs_select_public" ON public.faqs 
  FOR SELECT USING (status = 'published' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "faqs_admin_all" ON public.faqs 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===========================================
-- TESTIMONIALS
-- ===========================================
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_select_public" ON public.testimonials 
  FOR SELECT USING (status = 'published' OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "testimonials_admin_all" ON public.testimonials 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
