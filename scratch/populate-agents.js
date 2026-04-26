
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://navwagghjtiokeatqjdu.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const agentsData = [
  {
    id: "68cb42f0-e813-43e0-83f1-f171e8ef484d", // Mohammad Rezaei
    title: "Senior Luxury Property Consultant",
    title_fa: "مشاور ارشد املاک لوکس",
    bio: "Mohammad brings over 10 years of experience in the Dubai luxury market. Specializing in Palm Jumeirah and Emirates Hills, he has a proven track record of finding exclusive off-market opportunities for high-net-worth individuals.",
    bio_fa: "محمد با بیش از ۱۰ سال تجربه در بازار لوکس دبی فعالیت می‌کند. او متخصص در مناطق پالم جمیرا و امارات هیلز است و سابقه درخشانی در یافتن فرصت‌های منحصر به فرد برای سرمایه‌گذاران خاص دارد.",
    languages: ["English", "Persian", "Arabic"],
    specializations: ["Luxury Villas", "Investment Portfolios", "Off-Market Deals"],
    experience_years: 10,
    total_listings: 124,
    phone: "+971501234567",
    whatsapp: "+971501234567",
    social_instagram: "mohammad_realty",
    social_linkedin: "mohammad-rezaei-dubai"
  },
  {
    id: "4502066a-2eca-445c-94d7-e66e5e6b3a2b", // Ahmad Al Rashid
    title: "Off-Plan Investment Specialist",
    title_fa: "متخصص سرمایه‌گذاری پروژه‌های در حال ساخت",
    bio: "Ahmad is known for his deep analytical approach to off-plan investments. He helps clients navigate the complex landscape of developer payment plans and ROI forecasts in Downtown Dubai and Business Bay.",
    bio_fa: "احمد به دلیل رویکرد تحلیلی عمیق خود در سرمایه‌گذاری‌های پیش‌فروش شناخته شده است. او به مشتریان کمک می‌کند تا در فضای پیچیده طرح‌های پرداخت سازندگان و پیش‌بینی سودآوری در مرکز شهر دبی و بیزینس بی بهترین تصمیم را بگیرند.",
    languages: ["Arabic", "English", "French"],
    specializations: ["Off-Plan Projects", "ROI Analysis", "Commercial Spaces"],
    experience_years: 8,
    total_listings: 85,
    phone: "+971509876543",
    whatsapp: "+971509876543",
    social_instagram: "ahmad_invest_dxb",
    social_linkedin: "ahmad-al-rashid"
  },
  {
    id: "d943e6e6-7eee-4204-8ac9-98c51ee2fa61", // Fatima Hassan
    title: "Waterfront Property Expert",
    title_fa: "کارشناس املاک ساحلی",
    bio: "Fatima specializes in Dubai Marina and Emaar Beachfront. Her passion for waterfront living translates into finding the perfect home for families seeking a coastal lifestyle with premium amenities.",
    bio_fa: "فاطمه متخصص در مناطق دبی مارینا و ساحل اعمار است. اشتیاق او به زندگی ساحلی باعث شده تا بهترین خانه‌ها را برای خانواده‌هایی که به دنبال سبک زندگی دریایی با امکانات رفاهی عالی هستند، پیدا کند.",
    languages: ["English", "Arabic", "Urdu"],
    specializations: ["Waterfront Living", "Residential Sales", "Holiday Homes"],
    experience_years: 6,
    total_listings: 62,
    phone: "+971551122334",
    whatsapp: "+971551122334",
    social_instagram: "fatima_h_dubai",
    social_linkedin: "fatima-hassan-realty"
  },
  {
    id: "de52d53b-f96d-4517-9698-0b588a682096", // Sarah Al-Maktoum
    title: "Commercial & Industrial Consultant",
    title_fa: "مشاور املاک تجاری و صنعتی",
    bio: "Sarah focuses on the growing commercial sector in JLT and DIFC. She assists international firms in establishing their presence in Dubai by finding optimal office spaces and logistics hubs.",
    bio_fa: "سارا بر بخش تجاری رو به رشد در مناطق جی‌ال‌تی و دی‌آی‌اف‌سی تمرکز دارد. او به شرکت‌های بین‌المللی کمک می‌کند تا با یافتن فضاهای اداری و مراکز لجستیکی بهینه، حضور خود را در دبی تثبیت کنند.",
    languages: ["English", "Arabic", "German"],
    specializations: ["Office Spaces", "Retail Units", "Corporate Relocation"],
    experience_years: 12,
    total_listings: 156,
    phone: "+971523344556",
    whatsapp: "+971523344556",
    social_instagram: "sarah_commercial",
    social_linkedin: "sarah-al-maktoum"
  }
];

async function updateAgents() {
  console.log('Starting agents update...');
  for (const agentData of agentsData) {
    const { error } = await supabase
      .from('agents')
      .update({
        title: agentData.title,
        title_fa: agentData.title_fa,
        bio: agentData.bio,
        bio_fa: agentData.bio_fa,
        languages: agentData.languages,
        specializations: agentData.specializations,
        experience_years: agentData.experience_years,
        total_listings: agentData.total_listings,
        phone: agentData.phone,
        whatsapp: agentData.whatsapp,
        social_instagram: agentData.social_instagram,
        social_linkedin: agentData.social_linkedin
      })
      .eq('id', agentData.id);
    
    if (error) {
      console.error(`Error updating agent ${agentData.id}:`, error.message);
    } else {
      console.log(`Successfully updated agent: ${agentData.id}`);
    }
  }
  console.log('All 4 agents updated!');
}

updateAgents();
