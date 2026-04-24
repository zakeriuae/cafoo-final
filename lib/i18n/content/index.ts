import type { Locale } from '../config';
import type { LocaleContent } from './types';
import { en } from './en';
import { fa } from './fa';

const content: Record<Locale, LocaleContent> = {
  en,
  fa,
};

export function getContent(locale: Locale): LocaleContent {
  return content[locale] || content.en;
}

export type { LocaleContent };
