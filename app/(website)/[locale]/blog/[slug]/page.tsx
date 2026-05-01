"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowLeft, Share2, Bookmark, MessageCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function BlogPostPage() {
  const { locale } = useI18n()
  const isRtl = locale === 'fa'
  
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <article className="pt-32 pb-20">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link 
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-primary mb-8 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isRtl ? "بازگشت به بلاگ" : "Back to Blog"}
          </Link>

          {/* Header */}
          <header className="mb-12">
            <Badge className="mb-6 bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              {isRtl ? "تحلیل بازار" : "Market Analysis"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              {isRtl 
                ? "چشم‌انداز بازار مسکن دبی در سال ۲۰۲۶: روندها و پیش‌بینی‌ها" 
                : "Dubai Real Estate Market Outlook 2026: Trends & Predictions"}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">Isa Ghavasi</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Property Advisor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold">April 15, 2026</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="hover:text-primary transition-colors"><Share2 className="w-4 h-4" /></button>
                  <button className="hover:text-primary transition-colors"><Bookmark className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl shadow-black/5">
            <Image 
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000" 
              alt="Dubai Skyline" 
              fill 
              className="object-cover"
            />
          </div>

          {/* Content Mockup */}
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed">
            <p className="text-xl font-bold text-slate-900 leading-relaxed mb-8">
              {isRtl 
                ? "با نزدیک شدن به نیمه دوم دهه، بازار املاک دبی همچنان به عنوان یکی از منعطف‌ترین و جذاب‌ترین مقاصد سرمایه‌گذاری جهان خودنمایی می‌کند." 
                : "As we approach the second half of the decade, Dubai's real estate market continues to assert itself as one of the world's most resilient and attractive investment destinations."}
            </p>
            
            <p className="mb-6">
              {isRtl
                ? "در این مقاله، ما به بررسی عوامل کلیدی می‌پردازیم که رشد سال ۲۰۲۶ را هدایت می‌کنند. از پروژه‌های زیرساختی عظیم گرفته تا تغییرات در سیاست‌های ویزا، دبی در حال آماده‌سازی برای مرحله جدیدی از توسعه شهری است."
                : "In this article, we examine the key drivers behind the growth expected in 2026. From massive infrastructure projects to shifts in visa policies, Dubai is preparing for a new phase of urban evolution."}
            </p>

            <h2 className="text-2xl font-black mt-10 mb-4">{isRtl ? "۱. تداوم تقاضا برای املاک لوکس" : "1. Sustained Demand for Luxury Properties"}</h2>
            <p className="mb-6">
              {isRtl
                ? "بخش فوق‌لوکس (Ultra-luxury) همچنان پیشتاز است. خریداران بین‌المللی با ثروت بالا به دنبال خانه‌هایی هستند که نه تنها فضای زندگی، بلکه سبک زندگی منحصر به فردی را ارائه دهند."
                : "The ultra-luxury segment continues to lead the way. High-net-worth international buyers are looking for homes that offer not just living space, but a unique lifestyle experience."}
            </p>

            <div className="bg-slate-50 rounded-[2rem] p-8 my-10 border-l-4 border-primary">
              <p className="italic text-slate-700 font-medium text-lg">
                {isRtl
                  ? "«دبی دیگر فقط یک بازار موقت نیست، بلکه به خانه‌ای دائمی برای نخبگان جهان تبدیل شده است.»"
                  : "\"Dubai is no longer just a transient market; it has become a permanent home for the world's elite.\""}
              </p>
            </div>

            <h2 className="text-2xl font-black mt-10 mb-4">{isRtl ? "نتیجه‌گیری" : "Conclusion"}</h2>
            <p className="mb-6">
              {isRtl
                ? "سرمایه‌گذاری در سال ۲۰۲۶ نیازمند دقت و انتخاب هوشمندانه است. مناطق جدیدی در حال ظهور هستند که پتانسیل رشد بسیار بالایی دارند."
                : "Investing in 2026 requires precision and smart selection. New areas are emerging with high growth potential."}
            </p>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 p-10 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-4">{isRtl ? "نیاز به مشاوره تخصصی دارید؟" : "Need Professional Advice?"}</h3>
              <p className="text-slate-400 mb-8">{isRtl ? "تیم ما آماده پاسخگویی به سوالات شما در زمینه سرمایه‌گذاری ملکی است." : "Our team is ready to answer your questions about real estate investment."}</p>
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold px-10 h-14 rounded-2xl shadow-xl shadow-primary/20">
                {isRtl ? "تماس با ما" : "Contact Us"}
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
