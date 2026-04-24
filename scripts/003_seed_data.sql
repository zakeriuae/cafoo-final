-- Seed Data for Cafoo Real Estate Platform

-- ===========================================
-- AMENITIES
-- ===========================================
INSERT INTO public.amenities (name, name_fa, slug, icon, category, sort_order) VALUES
('Swimming Pool', 'استخر شنا', 'swimming-pool', 'waves', 'leisure', 1),
('Gym', 'باشگاه ورزشی', 'gym', 'dumbbell', 'fitness', 2),
('Parking', 'پارکینگ', 'parking', 'car', 'facilities', 3),
('Security', 'امنیت ۲۴ ساعته', 'security', 'shield', 'services', 4),
('Balcony', 'بالکن', 'balcony', 'home', 'features', 5),
('Garden', 'باغ', 'garden', 'trees', 'outdoor', 6),
('Concierge', 'خدمات کنسیرژ', 'concierge', 'bell', 'services', 7),
('Sauna', 'سونا', 'sauna', 'flame', 'wellness', 8),
('Kids Play Area', 'زمین بازی کودکان', 'kids-play-area', 'baby', 'family', 9),
('BBQ Area', 'محوطه باربیکیو', 'bbq-area', 'flame', 'outdoor', 10),
('Jacuzzi', 'جکوزی', 'jacuzzi', 'droplets', 'wellness', 11),
('Steam Room', 'اتاق بخار', 'steam-room', 'cloud', 'wellness', 12),
('Infinity Pool', 'استخر بی‌نهایت', 'infinity-pool', 'waves', 'leisure', 13),
('Private Pool', 'استخر خصوصی', 'private-pool', 'waves', 'leisure', 14),
('Children Pool', 'استخر کودکان', 'children-pool', 'baby', 'family', 15),
('Tennis Court', 'زمین تنیس', 'tennis-court', 'circle', 'sports', 16),
('Basketball Court', 'زمین بسکتبال', 'basketball-court', 'circle', 'sports', 17),
('Spa', 'اسپا', 'spa', 'sparkles', 'wellness', 18),
('Cinema Room', 'سینما خانگی', 'cinema-room', 'film', 'entertainment', 19),
('Business Center', 'مرکز تجاری', 'business-center', 'briefcase', 'work', 20),
('Rooftop Terrace', 'تراس پشت‌بام', 'rooftop-terrace', 'sun', 'outdoor', 21),
('Beach Access', 'دسترسی به ساحل', 'beach-access', 'umbrella', 'outdoor', 22),
('Marina', 'مارینا', 'marina', 'anchor', 'outdoor', 23),
('Golf Course', 'زمین گلف', 'golf-course', 'flag', 'sports', 24),
('Central AC', 'تهویه مرکزی', 'central-ac', 'wind', 'utilities', 25),
('Built-in Wardrobes', 'کمد دیواری', 'built-in-wardrobes', 'box', 'features', 26),
('Maid Room', 'اتاق خدمتکار', 'maid-room', 'bed', 'rooms', 27),
('Study Room', 'اتاق مطالعه', 'study-room', 'book', 'rooms', 28),
('Storage Room', 'انبار', 'storage-room', 'archive', 'rooms', 29),
('Smart Home', 'خانه هوشمند', 'smart-home', 'wifi', 'technology', 30)
ON CONFLICT (slug) DO NOTHING;

-- ===========================================
-- DEVELOPERS
-- ===========================================
INSERT INTO public.developers (name, name_fa, slug, logo_url, description, description_fa, website, established_year, total_projects, status, sort_order) VALUES
('Emaar Properties', 'اعمار پراپرتیز', 'emaar', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emaar-kMJ6wvhYpIVfOmVwiKZze39Vo8kpQm.png', 'Emaar Properties is one of the world''s most valuable and admired real estate development companies.', 'اعمار پراپرتیز یکی از ارزشمندترین و مورد تحسین‌ترین شرکت‌های توسعه املاک در جهان است.', 'https://www.emaar.com', 1997, 60, 'published', 1),
('DAMAC Properties', 'داماک پراپرتیز', 'damac', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/damac-lMXfBEJo7d9d1gfvy5ujgYORKBb41M.png', 'DAMAC Properties has been shaping the Middle East''s luxury real estate market since 2002.', 'داماک پراپرتیز از سال ۲۰۰۲ در شکل‌دهی بازار املاک لوکس خاورمیانه پیشرو بوده است.', 'https://www.damacproperties.com', 2002, 45, 'published', 2),
('Sobha Realty', 'سوبها ریلتی', 'sobha', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sobhan-Zlw2e7CtkwQ0w4kHQLAugzYlySR8Ma.png', 'Sobha Realty is a luxury real estate developer known for its quality craftsmanship.', 'سوبها ریلتی یک توسعه‌دهنده املاک لوکس است که به خاطر کیفیت ساخت‌وساز شناخته شده است.', 'https://www.sobharealty.com', 1976, 25, 'published', 3),
('Nakheel', 'نخیل', 'nakheel', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nakheel-D08jZy7zeDxU7R9cFYP9l3zAUKmV9e.png', 'Nakheel is a world-leading developer that has reshaped Dubai''s skyline.', 'نخیل یک توسعه‌دهنده پیشرو جهانی است که افق دبی را متحول کرده است.', 'https://www.nakheel.com', 2000, 35, 'published', 4),
('Meraas', 'مراس', 'meraas', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meraas-e7rGZiR6vsMh4sGzyUoHCuFBb9Iqb4.png', 'Meraas is a Dubai-based holding company with interests in real estate, hospitality, and retail.', 'مراس یک شرکت هلدینگ مستقر در دبی با فعالیت در املاک، هتلداری و خرده‌فروشی است.', 'https://www.meraas.com', 2007, 20, 'published', 5),
('Dubai Properties', 'دبی پراپرتیز', 'dubai-properties', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dubai-YFXl9B9poFFqLW7F4I8UEGnCv4xzY2.png', 'Dubai Properties is a leading real estate master developer.', 'دبی پراپرتیز یک توسعه‌دهنده اصلی املاک پیشرو است.', 'https://www.dp.ae', 2002, 30, 'published', 6),
('Aldar Properties', 'الدار پراپرتیز', 'aldar', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aldar-hj3Fs5q4l0LtT7dXgPGhE4iSs9DuSw.png', 'Aldar Properties is a leading real estate developer in Abu Dhabi.', 'الدار پراپرتیز یک توسعه‌دهنده پیشرو املاک در ابوظبی است.', 'https://www.aldar.com', 2004, 40, 'published', 7),
('Binghatti', 'بن غاطی', 'binghatti', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/binghati-gq7dkP5dSvSQLxK6p86ApMO79YT1XZ.png', 'Binghatti Developers is known for its unique architectural designs.', 'بن غاطی به خاطر طرح‌های معماری منحصربه‌فرد خود شناخته شده است.', 'https://www.binghatti.com', 2008, 15, 'published', 8),
('ARADA', 'آرادا', 'arada', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/arada-eG44g8RQwCKwM76H7GcO71Sh8hfAnW.png', 'ARADA is a joint venture between KBW Investments and Basma Group.', 'آرادا یک سرمایه‌گذاری مشترک بین KBW سرمایه‌گذاری و گروه باسما است.', 'https://www.arada.com', 2017, 10, 'published', 9),
('Tiger Group', 'تایگر گروپ', 'tiger', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tiger-fiSDGfJivack9AGdp3DueGoSLdaTUU.png', 'Tiger Group is a leading real estate developer in the UAE.', 'تایگر گروپ یک توسعه‌دهنده پیشرو املاک در امارات است.', 'https://www.tigergroup.ae', 1976, 25, 'published', 10),
('RAK Properties', 'راس الخیمه پراپرتیز', 'rak-properties', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rak-k7bffxCBgBPj7VwJiX1o79nMhZLuPK.png', 'RAK Properties is the leading real estate development company in Ras Al Khaimah.', 'راس الخیمه پراپرتیز شرکت پیشرو توسعه املاک در راس الخیمه است.', 'https://www.rakproperties.ae', 2005, 15, 'published', 11),
('Nshama', 'نشاما', 'nshama', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nshama-o72DY8hc79nO9Xi8mzW37FpP38HlTW.png', 'Nshama is a Dubai-based developer focused on creating integrated communities.', 'نشاما یک توسعه‌دهنده مستقر در دبی است که بر ایجاد جوامع یکپارچه تمرکز دارد.', 'https://www.nshama.com', 2014, 5, 'published', 12),
('Imtiaz Developments', 'امتیاز', 'imtiaz', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/imtiaz-3z3P4DVNOWN1BqtlNikXxChIBIvJ3C.png', 'Imtiaz Developments is a real estate developer in the UAE.', 'امتیاز یک توسعه‌دهنده املاک در امارات است.', 'https://www.imtiaz.ae', 2015, 8, 'published', 13),
('Alef Group', 'الف گروپ', 'alef', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alef-h4qZeK6LMkfgnvdqqpmXKrTBAlQvVo.png', 'Alef Group is a Sharjah-based developer known for innovative projects.', 'الف گروپ یک توسعه‌دهنده مستقر در شارجه است که به پروژه‌های نوآورانه شناخته شده است.', 'https://www.alefgroup.ae', 2013, 10, 'published', 14),
('Wasl', 'وصل', 'wasl', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wasl-lbtkTxgqrFTpnWxUCYDb8v6ypdtCDS.png', 'Wasl is a Dubai-based real estate company managing government assets.', 'وصل یک شرکت املاک مستقر در دبی است که دارایی‌های دولتی را مدیریت می‌کند.', 'https://www.wasl.ae', 2008, 50, 'published', 15),
('Beyond', 'بیاند', 'beyond', 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/beyond-qWVgsJIjMEUGAPsac3ixrpkq6agwcw.png', 'Beyond is a modern real estate developer in Dubai.', 'بیاند یک توسعه‌دهنده مدرن املاک در دبی است.', 'https://www.beyond.ae', 2018, 5, 'published', 16)
ON CONFLICT (slug) DO NOTHING;

-- ===========================================
-- AREAS
-- ===========================================
INSERT INTO public.areas (name, name_fa, slug, short_description, short_description_fa, full_description, full_description_fa, cover_image_url, location_highlights, location_highlights_fa, latitude, longitude, average_price, price_growth_percent, status, featured, sort_order) VALUES
('Downtown Dubai', 'دانتاون دبی', 'downtown-dubai', 
'Home to Burj Khalifa and Dubai Mall, Downtown Dubai is the heart of the city.',
'خانه برج خلیفه و دبی مال، دانتاون دبی قلب شهر است.',
'Downtown Dubai is the flagship development of Emaar Properties, featuring the world''s tallest building, Burj Khalifa, and the world''s largest shopping mall, Dubai Mall. This master-planned community offers luxury living with stunning views of the Dubai Fountain.',
'دانتاون دبی پروژه شاخص اعمار پراپرتیز است که شامل بلندترین ساختمان جهان، برج خلیفه، و بزرگ‌ترین مرکز خرید جهان، دبی مال است. این جامعه برنامه‌ریزی شده زندگی لوکس با مناظر خیره‌کننده فواره دبی را ارائه می‌دهد.',
'/images/downtown-dubai.jpg',
ARRAY['Burj Khalifa', 'Dubai Mall', 'Dubai Fountain', 'Dubai Opera', 'Souk Al Bahar'],
ARRAY['برج خلیفه', 'دبی مال', 'فواره دبی', 'اپرای دبی', 'سوق البحر'],
25.1972, 55.2744, 2800000, 8.5, 'published', true, 1),

('Dubai Marina', 'دبی مارینا', 'dubai-marina',
'A vibrant waterfront community with stunning marina views and world-class dining.',
'یک جامعه ساحلی پرجنب‌وجوش با مناظر خیره‌کننده مارینا و رستوران‌های درجه یک.',
'Dubai Marina is one of the largest man-made marinas in the world, offering a sophisticated urban lifestyle with waterfront living, yacht clubs, and a beautiful promenade known as The Walk.',
'دبی مارینا یکی از بزرگ‌ترین مارینای ساخت بشر در جهان است که سبک زندگی شهری پیشرفته با زندگی ساحلی، باشگاه‌های قایق‌رانی و پیاده‌روی زیبا به نام The Walk را ارائه می‌دهد.',
'/images/dubai-marina.jpg',
ARRAY['The Walk', 'Marina Mall', 'JBR Beach', 'Dubai Marina Yacht Club', 'Bluewaters Island'],
ARRAY['پیاده‌رو', 'مارینا مال', 'ساحل جی‌بی‌آر', 'باشگاه قایق‌رانی مارینا', 'جزیره بلو واترز'],
25.0805, 55.1403, 2200000, 7.2, 'published', true, 2),

('Palm Jumeirah', 'پالم جمیرا', 'palm-jumeirah',
'The iconic palm-shaped island offering exclusive beachfront living.',
'جزیره نمادین به شکل نخل که زندگی انحصاری ساحلی را ارائه می‌دهد.',
'Palm Jumeirah is an engineering marvel and one of the most recognizable landmarks in Dubai. This man-made island offers ultra-luxury villas and apartments with private beach access.',
'پالم جمیرا یک شاهکار مهندسی و یکی از شناخته‌شده‌ترین نشانه‌ها در دبی است. این جزیره ساخت بشر ویلاها و آپارتمان‌های فوق لوکس با دسترسی خصوصی به ساحل را ارائه می‌دهد.',
'/images/luxury-apartment.jpg',
ARRAY['Atlantis The Palm', 'Nakheel Mall', 'The Pointe', 'Private Beaches', 'Aquaventure Waterpark'],
ARRAY['آتلانتیس پالم', 'نخیل مال', 'پوینت', 'ساحل‌های خصوصی', 'پارک آبی آکواونچر'],
25.1124, 55.1390, 4500000, 12.3, 'published', true, 3),

('Business Bay', 'بیزینس بی', 'business-bay',
'A thriving business district with modern towers and canal views.',
'یک منطقه تجاری پررونق با برج‌های مدرن و مناظر کانال.',
'Business Bay is Dubai''s central business district, featuring modern commercial and residential towers along the Dubai Water Canal. It offers easy access to Downtown Dubai and Sheikh Zayed Road.',
'بیزینس بی منطقه تجاری مرکزی دبی است که شامل برج‌های تجاری و مسکونی مدرن در امتداد کانال آب دبی است. دسترسی آسان به دانتاون دبی و شیخ زاید رود را فراهم می‌کند.',
'/images/downtown-dubai.jpg',
ARRAY['Dubai Canal', 'Executive Towers', 'Bay Square', 'Marasi Business Bay', 'Design District'],
ARRAY['کانال دبی', 'برج‌های اجرایی', 'میدان بی', 'مراسی بیزینس بی', 'منطقه طراحی'],
25.1850, 55.2666, 1800000, 6.8, 'published', true, 4),

('JVC - Jumeirah Village Circle', 'جی‌وی‌سی - دهکده جمیرا', 'jvc',
'A family-friendly community with affordable luxury and green spaces.',
'یک جامعه خانوادگی با لوکس مقرون‌به‌صرفه و فضاهای سبز.',
'Jumeirah Village Circle is a master-planned community offering affordable luxury living in the heart of new Dubai. It features parks, schools, and easy access to major highways.',
'دهکده جمیرا یک جامعه برنامه‌ریزی شده است که زندگی لوکس مقرون‌به‌صرفه در قلب دبی جدید را ارائه می‌دهد. شامل پارک‌ها، مدارس و دسترسی آسان به بزرگراه‌های اصلی است.',
'/images/dubai-marina.jpg',
ARRAY['Circle Mall', 'Parks', 'Community Centers', 'Schools', 'Al Khail Road Access'],
ARRAY['سیرکل مال', 'پارک‌ها', 'مراکز اجتماعی', 'مدارس', 'دسترسی به الخیل رود'],
25.0584, 55.2122, 950000, 9.5, 'published', true, 5),

('Dubai Hills Estate', 'دبی هیلز استیت', 'dubai-hills',
'A prestigious golf community with villas and modern apartments.',
'یک جامعه گلف معتبر با ویلاها و آپارتمان‌های مدرن.',
'Dubai Hills Estate is a premium mixed-use development by Emaar featuring an 18-hole championship golf course, Dubai Hills Mall, and a wide range of luxury homes.',
'دبی هیلز استیت یک توسعه ترکیبی برتر توسط اعمار است که شامل زمین گلف ۱۸ حفره‌ای، دبی هیلز مال و طیف گسترده‌ای از خانه‌های لوکس است.',
'/images/luxury-apartment.jpg',
ARRAY['Dubai Hills Golf Club', 'Dubai Hills Mall', 'Dubai Hills Park', 'King''s College Hospital', 'International Schools'],
ARRAY['باشگاه گلف دبی هیلز', 'دبی هیلز مال', 'پارک دبی هیلز', 'بیمارستان کینگز کالج', 'مدارس بین‌المللی'],
25.1105, 55.2531, 3200000, 10.2, 'published', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- ===========================================
-- AGENTS
-- ===========================================
INSERT INTO public.agents (name, name_fa, slug, title, title_fa, email, phone, whatsapp, bio, bio_fa, avatar_url, languages, specializations, experience_years, status, featured, sort_order) VALUES
('Ahmed Al Rashid', 'احمد الرشید', 'ahmed-al-rashid',
'Senior Property Consultant', 'مشاور ارشد املاک',
'ahmed@cafoo.ae', '+971501234567', '+971501234567',
'With over 10 years of experience in Dubai real estate, Ahmed specializes in luxury properties in Downtown Dubai and Palm Jumeirah. He has helped hundreds of clients find their dream homes.',
'با بیش از ۱۰ سال تجربه در املاک دبی، احمد در املاک لوکس دانتاون دبی و پالم جمیرا تخصص دارد. او به صدها مشتری کمک کرده تا خانه رویایی خود را پیدا کنند.',
'/images/agents/agent-1.jpg',
ARRAY['English', 'Arabic', 'Persian'],
ARRAY['Luxury Properties', 'Off-Plan', 'Investment'],
10, 'published', true, 1),

('Sara Mohammadi', 'سارا محمدی', 'sara-mohammadi',
'Property Investment Advisor', 'مشاور سرمایه‌گذاری املاک',
'sara@cafoo.ae', '+971502345678', '+971502345678',
'Sara is a certified property investment advisor with expertise in off-plan projects and ROI analysis. She helps investors make informed decisions in the Dubai property market.',
'سارا یک مشاور سرمایه‌گذاری املاک معتبر با تخصص در پروژه‌های آف‌پلان و تحلیل ROI است. او به سرمایه‌گذاران کمک می‌کند تا تصمیمات آگاهانه در بازار املاک دبی بگیرند.',
'/images/agents/agent-2.jpg',
ARRAY['English', 'Persian', 'Arabic'],
ARRAY['Off-Plan Projects', 'Investment Analysis', 'Market Research'],
7, 'published', true, 2),

('Michael Chen', 'مایکل چن', 'michael-chen',
'Luxury Homes Specialist', 'متخصص خانه‌های لوکس',
'michael@cafoo.ae', '+971503456789', '+971503456789',
'Michael brings international expertise to Dubai''s luxury real estate market. He specializes in high-end villas and penthouses, serving a global clientele.',
'مایکل تخصص بین‌المللی را به بازار املاک لوکس دبی می‌آورد. او در ویلاها و پنت‌هاوس‌های سطح بالا تخصص دارد و به مشتریان جهانی خدمت می‌کند.',
'/images/agents/agent-3.jpg',
ARRAY['English', 'Mandarin', 'Arabic'],
ARRAY['Luxury Villas', 'Penthouses', 'Waterfront Properties'],
8, 'published', true, 3),

('Elena Petrova', 'الینا پتروا', 'elena-petrova',
'Residential Sales Manager', 'مدیر فروش مسکونی',
'elena@cafoo.ae', '+971504567890', '+971504567890',
'Elena has been helping families find their perfect homes in Dubai for over 5 years. She specializes in family-friendly communities and school district expertise.',
'الینا بیش از ۵ سال است که به خانواده‌ها کمک می‌کند تا خانه‌های کامل خود را در دبی پیدا کنند. او در جوامع خانوادگی و تخصص منطقه مدرسه تخصص دارد.',
'/images/agents/agent-4.jpg',
ARRAY['English', 'Russian', 'Arabic'],
ARRAY['Family Homes', 'Apartments', 'Rental Properties'],
5, 'published', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Update areas with assigned agents
UPDATE public.areas SET assigned_agent_id = (SELECT id FROM public.agents WHERE slug = 'ahmed-al-rashid' LIMIT 1) WHERE slug = 'downtown-dubai';
UPDATE public.areas SET assigned_agent_id = (SELECT id FROM public.agents WHERE slug = 'sara-mohammadi' LIMIT 1) WHERE slug = 'dubai-marina';
UPDATE public.areas SET assigned_agent_id = (SELECT id FROM public.agents WHERE slug = 'michael-chen' LIMIT 1) WHERE slug = 'palm-jumeirah';
UPDATE public.areas SET assigned_agent_id = (SELECT id FROM public.agents WHERE slug = 'elena-petrova' LIMIT 1) WHERE slug = 'business-bay';
