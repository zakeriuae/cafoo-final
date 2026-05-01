"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Search, Tag, MessageCircle } from "lucide-react"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface BlogPost {
  id: number
  title: { en: string; fa: string }
  excerpt: { en: string; fa: string }
  category: { en: string; fa: string }
  author: string
  date: string
  image: string
  slug: string
  readTime: string
}

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: { 
      en: "Dubai Real Estate Market Outlook 2026: Trends & Predictions", 
      fa: "چشم‌انداز بازار مسکن دبی در سال ۲۰۲۶: روندها و پیش‌بینی‌ها" 
    },
    excerpt: { 
      en: "Discover the key factors driving Dubai's property market growth in 2026 and what investors should expect in the coming years.", 
      fa: "عوامل کلیدی محرک رشد بازار املاک دبی در سال ۲۰۲۶ و انتظارات سرمایه‌گذاران در سال‌های پیش رو را کشف کنید." 
    },
    category: { en: "Market News", fa: "اخبار بازار" },
    author: "Isa Ghavasi",
    date: "2026-04-15",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000",
    slug: "dubai-real-estate-market-outlook-2026",
    readTime: "5 min"
  },
  {
    id: 2,
    title: { 
      en: "Top 5 Luxury Areas in Dubai for High-Yield Investments", 
      fa: "۵ منطقه برتر دبی برای سرمایه‌گذاری با سوددهی بالا" 
    },
    excerpt: { 
      en: "From Downtown Dubai to Palm Jumeirah, we analyze the best locations for maximizing your rental returns and capital appreciation.", 
      fa: "از داون‌تاون دبی تا پالم جمیرا، بهترین مکان‌ها را برای به حداکثر رساندن بازده اجاره و افزایش ارزش سرمایه تحلیل می‌کنیم." 
    },
    category: { en: "Investment", fa: "سرمایه‌گذاری" },
    author: "Cafoo Advisors",
    date: "2026-04-20",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=2000",
    slug: "top-5-luxury-areas-dubai-investment",
    readTime: "8 min"
  },
  {
    id: 3,
    title: { 
      en: "Everything You Need to Know About the Dubai Golden Visa", 
      fa: "هر آنچه باید درباره ویزای طلایی دبی بدانید" 
    },
    excerpt: { 
      en: "A comprehensive guide to obtaining a Golden Visa through real estate investment in the UAE, including requirements and benefits.", 
      fa: "راهنمای جامع دریافت ویزای طلایی از طریق سرمایه‌گذاری ملکی در امارات، شامل الزامات و مزایا." 
    },
    category: { en: "Guides", fa: "راهنما" },
    author: "Legal Team",
    date: "2026-04-22",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=2000",
    slug: "dubai-golden-visa-guide",
    readTime: "6 min"
  },
  {
    id: 4,
    title: { 
      en: "Off-Plan vs. Ready Properties: Which is Better for You?", 
      fa: "املاک پیش‌فروش در مقابل آماده: کدام برای شما بهتر است؟" 
    },
    excerpt: { 
      en: "We compare the pros and cons of buying off-plan versus ready properties in the current market environment.", 
      fa: "ما مزایا و معایب خرید ملک پیش‌فروش در مقابل ملک آماده را در شرایط فعلی بازار مقایسه می‌کنیم." 
    },
    category: { en: "Lifestyle", fa: "سبک زندگی" },
    author: "Market Analyst",
    date: "2026-04-25",
    image: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&q=80&w=2000",
    slug: "off-plan-vs-ready-properties",
    readTime: "7 min"
  },
  {
    id: 5,
    title: { 
      en: "Luxury Living in Palm Jumeirah: A Resident's Experience", 
      fa: "زندگی لوکس در پالم جمیرا: تجربه یک ساکن" 
    },
    excerpt: { 
      en: "Exploring the unique lifestyle, world-class amenities, and breathtaking views that make Palm Jumeirah a top destination.", 
      fa: "بررسی سبک زندگی منحصر به فرد، امکانات در سطح جهانی و مناظر خیره‌کننده که پالم جمیرا را به مقصدی برتر تبدیل کرده است." 
    },
    category: { en: "Lifestyle", fa: "سبک زندگی" },
    author: "Cafoo Team",
    date: "2026-04-28",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=2000",
    slug: "luxury-living-palm-jumeirah",
    readTime: "4 min"
  },
  {
    id: 6,
    title: { 
      en: "New Waterfront Projects Set to Redefine Dubai's Skyline", 
      fa: "پروژه‌های ساحلی جدید که خط افق دبی را بازتعریف می‌کنند" 
    },
    excerpt: { 
      en: "An exclusive first look at upcoming waterfront developments by Emaar, Nakheel, and Meraas.", 
      fa: "نگاهی اختصاصی به پروژه‌های ساحلی آینده توسط اعمار، نخیل و مراس." 
    },
    category: { en: "Market News", fa: "اخبار بازار" },
    author: "Architecture Critic",
    date: "2026-04-30",
    image: "https://images.unsplash.com/photo-1489514354504-1653aa9d631e?auto=format&fit=crop&q=80&w=2000",
    slug: "new-waterfront-projects-dubai",
    readTime: "10 min"
  }
]

const categories = [
  { id: "all", en: "All", fa: "همه" },
  { id: "news", en: "Market News", fa: "اخبار بازار" },
  { id: "investment", en: "Investment", fa: "سرمایه‌گذاری" },
  { id: "guides", en: "Guides", fa: "راهنما" },
  { id: "lifestyle", en: "Lifestyle", fa: "سبک زندگی" }
]

export default function BlogClient() {
  const { locale, isRtl } = useI18n()
  const content = useContent()
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = activeCategory === "all" || post.category.en.toLowerCase().includes(activeCategory.toLowerCase()) || post.category.fa.includes(activeCategory)
    const matchesSearch = post.title[locale].toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt[locale].toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000" 
            alt="Blog Background" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 py-1.5 px-4 rounded-full">
            {isRtl ? "وبلاگ تخصصی املاک" : "Real Estate Insights"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {isRtl ? "اخبار و تحلیل‌های بازار " : "Insights & Market "}
            <span className="text-primary">{isRtl ? "دبی" : "Analysis"}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            {isRtl 
              ? "آخرین روندها، راهنمای سرمایه‌گذاری و اخبار دست اول املاک امارات را از زبان متخصصان کافو بخوانید."
              : "Explore the latest trends, investment guides, and exclusive real estate news from the experts at Cafoo."}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input 
              type="text"
              placeholder={isRtl ? "جستجو در مطالب..." : "Search articles..."}
              className={cn(
                "h-14 bg-white/10 border-white/20 text-white rounded-2xl pl-12 focus:bg-white focus:text-slate-900 transition-all text-sm font-semibold",
                isRtl && "pr-12 pl-4 text-right"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto py-16">
        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id === "all" ? "all" : cat.en)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
                (activeCategory === "all" ? cat.id === "all" : (activeCategory === cat.en))
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border-slate-200 text-slate-500 hover:border-primary/50 hover:text-primary"
              )}
            >
              {cat[locale]}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article 
              key={post.id} 
              className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title[locale]} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-4 start-4">
                  <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {post.category[locale]}
                  </Badge>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(post.date).toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  <Link href={`/${locale}/blog/${post.slug}`}>
                    {post.title[locale]}
                  </Link>
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt[locale]}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {post.readTime} {isRtl ? "مطالعه" : "READ"}
                  </span>
                  <Link 
                    href={`/${locale}/blog/${post.slug}`}
                    className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group/link"
                  >
                    {isRtl ? "ادامه مطلب" : "READ MORE"}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <MessageCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">
              {isRtl ? "مطلبی یافت نشد" : "No articles found"}
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              {isRtl ? "لطفاً کلمات کلیدی دیگری را جستجو کنید." : "Please try searching for different keywords."}
            </p>
            <Button 
              variant="outline" 
              className="mt-6 rounded-xl"
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
            >
              {isRtl ? "پاک کردن فیلترها" : "Clear all filters"}
            </Button>
          </div>
        )}

        {/* Newsletter Section */}
        <section className="mt-20 bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-32 -mb-32" />
          
          <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            <div className="text-center lg:text-start">
              <h2 className="text-3xl font-black text-white mb-4">
                {isRtl ? "عضویت در خبرنامه ویژه" : "Join Our Newsletter"}
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                {isRtl 
                  ? "آخرین فرصت‌های سرمایه‌گذاری و تحلیل‌های بازار را مستقیماً در ایمیل خود دریافت کنید." 
                  : "Get the latest investment opportunities and market analysis sent directly to your inbox."}
              </p>
            </div>
            
            <div className="flex w-full lg:w-auto gap-3">
              <Input 
                placeholder={isRtl ? "ایمیل شما" : "Your email address"}
                className="h-14 bg-white/10 border-white/20 text-white rounded-2xl px-6 min-w-[300px]"
              />
              <Button className="h-14 bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-2xl shadow-xl shadow-primary/20">
                {isRtl ? "اشتراک" : "Subscribe"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
