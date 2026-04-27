import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getI18n, getContent } from "@/lib/i18n"
import { Shield, Lock, Eye, FileText, Bell, MessageSquare, Globe, Info } from "lucide-react"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const content = getContent(locale as any)
  return {
    title: `${content.footer.links.privacy} | Cafoo Real Estate`,
    description: `Read the ${content.footer.links.privacy} of Cafoo Real Estate Advisors. We are committed to protecting your personal information and your right to privacy.`
  }
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isRtl = locale === "fa"
  const content = getContent(locale as any)

  const enContent = {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: April 2024",
    introduction: {
      title: "1. Introduction",
      text: "Welcome to Cafoo Real Estate Advisors. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at info@cafoo.ae.",
    },
    sections: [
      {
        title: "2. Information We Collect",
        icon: Eye,
        text: "We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.",
        list: [
          "Personal Information: Name, email address, phone number, and mailing address.",
          "Property Preferences: Information about the types of properties you are interested in.",
          "Payment Data: If you make a transaction, we collect data necessary to process your payment.",
        ],
      },
      {
        title: "3. How We Use Your Information",
        icon: Lock,
        text: "We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.",
        list: [
          "To facilitate account creation and logon process.",
          "To send you marketing and promotional communications.",
          "To fulfill and manage your property inquiries.",
          "To post testimonials with your consent.",
        ],
      },
      {
        title: "4. Information Sharing",
        icon: Globe,
        text: "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.",
        list: [
          "Vendors, Consultants and Other Third-Party Service Providers.",
          "Business Transfers in case of merger or sale.",
          "Legal Obligations such as government requests.",
        ],
      },
      {
        title: "5. Data Security",
        icon: Shield,
        text: "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.",
      },
    ],
    contact: {
      title: "Contact Us",
      text: "If you have questions or comments about this policy, you may email us at info@cafoo.ae or by post to:",
      address: "3202, Boulevard Plaza Tower 1, Downtown, Dubai, UAE",
    },
  }

  const faContent = {
    title: "سیاست حریم خصوصی",
    lastUpdated: "آخرین بروزرسانی: فروردین ۱۴۰۳",
    introduction: {
      title: "۱. مقدمه",
      text: "به کافو مشاوران املاک خوش آمدید. ما متعهد به محافظت از اطلاعات شخصی و حق حریم خصوصی شما هستیم. اگر سوال یا نگرانی در مورد خط‌مشی ما یا اقدامات ما در رابطه با اطلاعات شخصی خود دارید، لطفاً با ما در info@cafoo.ae تماس بگیرید.",
    },
    sections: [
      {
        title: "۲. اطلاعاتی که جمع‌آوری می‌کنیم",
        icon: Eye,
        text: "ما اطلاعات شخصی را که شما داوطلبانه هنگام ثبت‌نام در وب‌سایت، ابراز علاقه به کسب اطلاعات در مورد ما یا محصولات و خدمات ما، یا به هر طریق دیگری هنگام تماس با ما در اختیار ما قرار می‌دهید، جمع‌آوری می‌کنیم.",
        list: [
          "اطلاعات شخصی: نام، آدرس ایمیل، شماره تلفن و آدرس پستی.",
          "ترجیحات ملک: اطلاعات مربوط به انواع ملک‌هایی که به آن‌ها علاقه دارید.",
          "داده‌های پرداخت: در صورت انجام معامله، داده‌های لازم برای پردازش پرداخت شما را جمع‌آوری می‌کنیم.",
        ],
      },
      {
        title: "۳. نحوه استفاده از اطلاعات شما",
        icon: Lock,
        text: "ما از اطلاعات شخصی جمع‌آوری شده از طریق وب‌سایت خود برای اهداف تجاری مختلفی که در زیر توضیح داده شده است استفاده می‌کنیم. ما اطلاعات شخصی شما را برای این اهداف بر اساس منافع تجاری مشروع خود، به منظور انعقاد یا اجرای قرارداد با شما، با رضایت شما و/یا برای انطباق با تعهدات قانونی خود پردازش می‌کنیم.",
        list: [
          "برای تسهیل فرآیند ایجاد حساب کاربری و ورود به سیستم.",
          "برای ارسال ارتباطات بازاریابی و تبلیغاتی برای شما.",
          "برای انجام و مدیریت درخواست‌های ملک شما.",
          "برای انتشار نظرات با رضایت شما.",
        ],
      },
      {
        title: "۴. اشتراک‌گذاری اطلاعات",
        icon: Globe,
        text: "ما فقط با رضایت شما، برای رعایت قوانین، ارائه خدمات به شما، محافظت از حقوق شما، یا برای انجام تعهدات تجاری، اطلاعات را به اشتراک می‌گذاریم.",
        list: [
          "فروشندگان، مشاوران و سایر ارائه‌دهندگان خدمات شخص ثالث.",
          "انتقالات تجاری در صورت ادغام یا فروش.",
          "تعهدات قانونی مانند درخواست‌های دولتی.",
        ],
      },
      {
        title: "۵. امنیت داده‌ها",
        icon: Shield,
        text: "ما اقدامات امنیتی فنی و سازمانی مناسبی را برای محافظت از امنیت هرگونه اطلاعات شخصی که پردازش می‌کنیم، اجرا کرده‌ایم. با این حال، لطفاً این را هم به خاطر داشته باشید که ما نمی‌توانیم تضمین کنیم که خود اینترنت ۱۰۰٪ امن است.",
      },
    ],
    contact: {
      title: "تماس با ما",
      text: "اگر سوال یا نظری در مورد این سیاست دارید، می‌توانید به ما به آدرس info@cafoo.ae ایمیل بزنید یا از طریق پست به آدرس زیر ارسال کنید:",
      address: "امارات، دبی، مرکز شهر، برج بولوار پلازا ۱، واحد ۳۲۰۲",
    },
  }

  const activeContent = isRtl ? faContent : enContent

  return (
    <main className="min-h-screen bg-slate-50">
      <Navigation variant="light" />
      
      {/* Hero Header */}
      <div className="pt-32 pb-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container mx-auto relative z-10 px-4">
          <div className={`max-w-4xl mx-auto ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Shield className="w-3 h-3" />
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
      <div className="container mx-auto px-4 -mt-24 pb-24 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Introduction */}
              <div className={`mb-12 ${isRtl ? 'text-right' : 'text-left'}`}>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Info className="w-5 h-5" />
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
                        info@cafoo.ae
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
