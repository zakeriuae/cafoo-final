import BlogClient from "./blog-client"

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const isRtl = params.locale === 'fa'
  
  return {
    title: isRtl ? 'بلاگ | کافو املاک دبی' : 'Blog | Cafoo Real Estate Dubai',
    description: isRtl 
      ? 'آخرین اخبار، تحلیل‌ها و راهنمای سرمایه‌گذاری املاک دبی' 
      : 'Latest news, analysis and real estate investment guides in Dubai',
  }
}

export default function BlogPage() {
  return <BlogClient />
}
