'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales, localeNames, type Locale } from '@/lib/i18n';
import { useI18n } from '@/lib/i18n';

interface LocaleSwitcherProps {
  variant?: "transparent" | "light"
}

export function LocaleSwitcher({ variant = "transparent" }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale: currentLocale } = useI18n();
  const [mounted, setMounted] = useState(false);

  const isLight = variant === "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className={cn(
          "gap-2",
          isLight ? "text-slate-600" : "text-white/90"
        )} 
        disabled
      >
        <Globe className="h-4 w-4" />
      </Button>
    );
  }

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    // Set cookie for locale preference
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-9 px-3 gap-2 rounded-full transition-all duration-300",
            isLight 
              ? "text-slate-600 hover:text-primary hover:bg-slate-50 border border-slate-200"
              : "text-white/80 hover:text-white hover:bg-white/5 border border-white/20 hover:border-white/40"
          )}
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium tracking-wide">{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className={`cursor-pointer ${
              locale === currentLocale ? 'bg-primary/10 text-primary font-medium' : ''
            }`}
          >
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
