'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from './config';
import { defaultLocale, isRtl } from './config';
import { getContent, type LocaleContent } from './content';

interface I18nContextType {
  locale: Locale;
  content: LocaleContent;
  isRtl: boolean;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  locale: Locale;
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  const rtl = isRtl(locale);
  const content = getContent(locale);

  return (
    <I18nContext.Provider
      value={{
        locale,
        content,
        isRtl: rtl,
        dir: rtl ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    // Return default values if outside provider
    return {
      locale: defaultLocale,
      content: getContent(defaultLocale),
      isRtl: false,
      dir: 'ltr',
    };
  }
  return context;
}

export function useContent(): LocaleContent {
  return useI18n().content;
}
