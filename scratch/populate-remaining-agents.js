
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://navwagghjtiokeatqjdu.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdndhZ2doanRpb2tlYXRxamR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAwMDc0OCwiZXhwIjoyMDkyNTc2NzQ4fQ.HLimNsxIEphTy5xaQ2a1YpJ0hISkloY9sqZZ-XC6N7A";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const agentsData = [
  {
    id: "3434226c-10a7-44f8-86d1-27cab50c36af", // Raj Patel
    title: "Senior Investment Advisor",
    title_fa: "مشاور ارشد سرمایه‌گذاری",
    bio: "Raj is a veteran in the Dubai real estate scene with 15 years of experience. He specializes in high-yield commercial investments and large-scale residential portfolios across Jumeirah and Downtown.",
    bio_fa: "راج با ۱۵ سال تجربه، از پیشکسوتان بازار املاک دبی است. او متخصص در سرمایه‌گذاری‌های تجاری با بازده بالا و سبدهای املاک مسکونی بزرگ در مناطق جمیرا و مرکز شهر است.",
    languages: ["English", "Hindi", "Gujarati"],
    specializations: ["Commercial Real Estate", "Portfolio Management", "High-Yield Investments"],
    experience_years: 15,
    total_listings: 210,
    phone: "+971561234567",
    whatsapp: "+971561234567",
    social_instagram: "raj_dxb_realty",
    social_linkedin: "raj-patel-dubai"
  },
  {
    id: "21299c5d-cbd0-4107-9b6f-801b5b1fead2", // Elena Volkov
    title: "International Sales Director",
    title_fa: "مدیر فروش بین‌الملل",
    bio: "Elena specializes in assisting European investors in finding luxury holiday homes in Dubai. With a background in finance, she provides comprehensive market analysis and tax optimization advice.",
    bio_fa: "النا متخصص در کمک به سرمایه‌گذاران اروپایی برای یافتن خانه‌های تعطیلات لوکس در دبی است. او با پیش‌زمینه مالی، تحلیل‌های جامع بازار و مشاوره‌های بهینه‌سازی مالیاتی ارائه می‌دهد.",
    languages: ["Russian", "English", "German"],
    specializations: ["Luxury Apartments", "International Sales", "Financial Consulting"],
    experience_years: 12,
    total_listings: 145,
    phone: "+971581234567",
    whatsapp: "+971581234567",
    social_instagram: "elena_dxb_homes",
    social_linkedin: "elena-volkov-real-estate"
  },
  {
    id: "96a18fe8-7790-406f-8da0-84a6db7d3664", // Ali Karimi
    title: "Community Specialist - Dubai Hills",
    title_fa: "متخصص منطقه دبی هیلز",
    bio: "Ali is the go-to expert for Dubai Hills Estate. Having lived in the community for years, he offers unparalleled insights into the lifestyle, schools, and investment potential of the area.",
    bio_fa: "علی کارشناس خبره منطقه دبی هیلز است. او با سال‌ها زندگی در این منطقه، بینش بی‌نظیری در مورد سبک زندگی، مدارس و پتانسیل سرمایه‌گذاری این منطقه ارائه می‌دهد.",
    languages: ["Persian", "English", "Arabic"],
    specializations: ["Family Homes", "Community Living", "Secondary Market"],
    experience_years: 5,
    total_listings: 48,
    phone: "+971541234567",
    whatsapp: "+971541234567",
    social_instagram: "ali_dxb_hills",
    social_linkedin: "ali-karimi-dubai"
  }
];

async function updateAgents() {
  console.log('Starting remaining agents update...');
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
  console.log('Remaining agents updated!');
}

updateAgents();
