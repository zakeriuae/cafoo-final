import { useI18n } from "@/lib/i18n"

export function useLocale() {
  const { locale, isRtl } = useI18n()
  
  return {
    locale,
    isRTL: isRtl
  }
}
