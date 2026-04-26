import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getI18n, getContent } from "@/lib/i18n"
import { Scale, FileText, UserCheck, ShieldAlert, Gavel, Globe, MessageSquare, AlertCircle } from "lucide-react"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const content = getContent(locale as any)
  return {
    title: `${content.footer.links.terms} | Cafoo Real Estate`,
    description: `Read the ${content.footer.links.terms} of Cafoo Real Estate Advisors. Our services description, user obligations, and legal terms.`
  }
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isRtl = locale === "fa"
  const content = getContent(locale as any)

  const enContent = {
    title: "Terms of Service",
    lastUpdated: "Last Updated: April 2024",
    introduction: {
      title: "1. Acceptance of Terms",
      text: "By accessing or using the Cafoo Real Estate Advisors website (cafoo.ae), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.",
    },
    sections: [
      {
        title: "2. Services Description",
        icon: Globe,
        text: "Cafoo provides a platform for browsing real estate listings, connecting with agents, and accessing market insights in Dubai. We do not own the properties listed unless explicitly stated.",
      },
      {
        title: "3. User Obligations",
        icon: UserCheck,
        text: "You agree to use the website only for lawful purposes. You are prohibited from:",
        list: [
          "Providing false or misleading information.",
          "Attempting to interfere with the website's security or functionality.",
          "Using automated systems (bots) to scrape data without authorization.",
          "Impersonating any person or entity.",
        ],
      },
      {
        title: "4. Intellectual Property",
        icon: Scale,
        text: "All content on this website, including logos, text, graphics, and images, is the property of Cafoo Real Estate Advisors or its content suppliers and is protected by UAE and international copyright laws.",
      },
      {
        title: "5. Limitation of Liability",
        icon: ShieldAlert,
        text: "Cafoo Real Estate Advisors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services or for the cost of procurement of substitute goods and services.",
      },
      {
        title: "6. Governing Law",
        icon: Gavel,
        text: "These terms shall be governed by and construed in accordance with the laws of the Emirate of Dubai and the federal laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the Dubai courts.",
      },
    ],
    contact: {
      title: "Contact Information",
      text: "If you have any questions about these Terms, please contact us at:",
      email: "info@cafoo.ae",
      phone: "+971 50 349 1050",
      address: "3202, Boulevard Plaza Tower 1, Downtown, Dubai, UAE",
    },
  }

  const faContent = {
    title: "شرایط خدمات",
    lastUpdated: "آخرین بروزرسانی: فروردین ۱۴۰۳",
    introduction: {
      title: "۱. پذیرش شرایط",
      text: "با دسترسی یا استفاده از وب‌سایت کافو مشاوران املاک (cafoo.ae)، شما موافقت می‌کنید که از این شرایط خدمات پیروی کرده و به آن‌ها پایبند باشید. اگر با این شرایط موافق نیستید، لطفاً از وب‌سایت ما استفاده نکنید.",
    },
    sections: [
      {
        title: "۲. توصیف خدمات",
        icon: Globe,
        text: "کافو پلتفرمی برای مرور لیست‌های املاک، برقراری ارتباط با مشاوران و دسترسی به تحلیل‌های بازار در دبی فراهم می‌کند. ما مالک املاک لیست شده نیستیم مگر اینکه صراحتاً ذکر شده باشد.",
      },
      {
        title: "۳. تعهدات کاربر",
        icon: UserCheck,
        text: "شما موافقت می‌کنید که از وب‌سایت فقط برای مقاصد قانونی استفاده کنید. موارد زیر برای شما ممنوع است:",
        list: [
          "ارائه اطلاعات نادرست یا گمراه‌کننده.",
          "تلاش برای تداخل در امنیت یا عملکرد وب‌سایت.",
          "استفاده از سیستم‌های خودکار (ربات‌ها) برای استخراج داده‌ها بدون مجوز.",
          "جعل هویت هر شخص یا نهادی.",
        ],
      },
      {
        title: "۴. مالکیت معنوی",
        icon: Scale,
        text: "تمام محتوای این وب‌سایت، شامل لوگوها، متن، گرافیک و تصاویر، متعلق به کافو مشاوران املاک یا تامین‌کنندگان محتوای آن است و توسط قوانین کپی‌رایت امارات و بین‌المللی محافظت می‌شود.",
      },
      {
        title: "۵. محدودیت مسئولیت",
        icon: ShieldAlert,
        text: "کافو مشاوران املاک در قبال هیچ‌گونه خسارت مستقیم، غیرمستقیم، تصادفی یا تبعی ناشی از استفاده یا ناتوانی در استفاده از خدمات ما یا هزینه تهیه کالاها و خدمات جایگزین مسئولیتی نخواهد داشت.",
      },
      {
        title: "۶. قانون حاکم",
        icon: Gavel,
        text: "این شرایط طبق قوانین امارت دبی و قوانین فدرال امارات متحده عربی تنظیم و تفسیر می‌شوند. هرگونه اختلاف مشمول صلاحیت انحصاری دادگاه‌های دبی خواهد بود.",
      },
    ],
    contact: {
      title: "اطلاعات تماس",
      text: "اگر سوالی در مورد این شرایط دارید، لطفاً با ما تماس بگیرید:",
      email: "info@cafoo.ae",
      phone: "+۹۷۱ ۵۰ ۳۴۹ ۱۰۵۰",
      address: "امارات، دبی، مرکز شهر، برج بولوار پلازا ۱، واحد ۳۲۰۲",
    },
  }

  const activeContent = isRtl ? faContent : enContent

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation variant="light" />
      
      {/* Hero Header */}
      <div className="pt-32 pb-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto relative z-10 px-4">
          <div className={`max-w-4xl mx-auto ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <FileText className="w-3 h-3" />
              {activeContent.title}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair">
              {activeContent.title}
            </h1>
            <p className="text-slate-400 text-sm">
              {activeContent.lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 -mt-10 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Introduction */}
              <div className={`mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <AlertCircle className="w-5 h-5" />
                  </span>
                  {activeContent.introduction.title}
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {activeContent.introduction.text}
                </p>
              </div>

              {/* Main Sections */}
              <div className="space-y-12">
                {activeContent.sections.map((section, index) => (
                  <div key={index} className={`relative ${isRtl ? 'text-right' : 'text-left'}`}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <section.icon className="w-5 h-5" />
                      </span>
                      {section.title}
                    </h2>
                    <div className="pl-0 md:pl-11 pr-0 md:pr-11">
                      <p className="text-slate-600 leading-relaxed mb-6">
                        {section.text}
                      </p>
                      {section.list && (
                        <ul className="space-y-3">
                          {section.list.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className={`mt-16 pt-12 border-t border-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="bg-slate-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary flex-shrink-0">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {activeContent.contact.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      {activeContent.contact.text}
                    </p>
                    <div className="flex flex-col gap-2">
                      <a href="mailto:info@cafoo.ae" className="text-primary font-bold hover:underline">
                        {activeContent.contact.email}
                      </a>
                      <a href="tel:+971503491050" className="text-slate-900 font-medium">
                        {activeContent.contact.phone}
                      </a>
                      <p className="text-slate-500 text-xs italic">
                        {activeContent.contact.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 text-xs">
              {content.footer.copyright}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
