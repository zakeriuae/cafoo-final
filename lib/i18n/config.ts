export const locales = ['en', 'fa'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fa: 'فارسی',
};

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  fa: 'rtl',
};

export function isRtl(locale: Locale): boolean {
  return localeDirections[locale] === 'rtl';
}
