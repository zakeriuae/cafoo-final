import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { locales, type Locale, isRtl, localeNames } from '@/lib/i18n';
import { getContent } from '@/lib/i18n';
import { I18nProvider } from '@/lib/i18n';
import { SmoothScroll } from '@/components/smooth-scroll';
import '../globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

// Persian font
const vazirmatn = localFont({
  src: [
    {
      path: '../../public/fonts/Vazirmatn-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;

  if (!locales.includes(locale)) {
    return {};
  }

  const content = getContent(locale);
  const baseUrl = 'https://cafoo.ae';

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fa: `${baseUrl}/fa`,
      },
    },
    openGraph: {
      title: content.seo.ogTitle,
      description: content.seo.ogDescription,
      url: `${baseUrl}/${locale}`,
      siteName: 'Cafoo Real Estate',
      locale: locale === 'fa' ? 'fa_IR' : 'en_AE',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: content.seo.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seo.ogTitle,
      description: content.seo.ogDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        {
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
      ],
      apple: '/icon.svg',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  const rtl = isRtl(locale);
  const fontClass = locale === 'fa' 
    ? `${vazirmatn.variable} ${geist.variable} ${geistMono.variable} ${playfair.variable}`
    : `${geist.variable} ${geistMono.variable} ${playfair.variable}`;

  return (
    <html 
      lang={locale} 
      dir={rtl ? 'rtl' : 'ltr'} 
      className={fontClass}
    >
      <head>
        {/* Structured Data for Real Estate Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: locale === 'fa' ? 'کافو مشاوران املاک' : 'Cafoo Real Estate Advisors',
              description: getContent(locale).seo.description,
              url: `https://cafoo.ae/${locale}`,
              logo: 'https://cafoo.ae/logo.jpg',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dubai',
                addressRegion: 'Dubai',
                addressCountry: 'AE',
              },
              telephone: '+971585022028',
              email: 'info@cafoo.ae',
              sameAs: [
                'https://instagram.com/cafoo.ae',
                'https://linkedin.com/company/cafoo',
                'https://facebook.com/cafoo.ae',
              ],
              areaServed: {
                '@type': 'City',
                name: 'Dubai',
              },
              priceRange: '$$$',
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '09:00',
                closes: '21:00',
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased ${rtl ? 'font-vazirmatn' : ''}`}>
        <I18nProvider locale={locale}>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
