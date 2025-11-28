"use client";

import { useI18n } from "@/lib/i18n/context";
import { locales, localeNames, localeFlags, Locale } from "@/lib/i18n/config";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    setLocale(locales[nextIndex]);
  };

  const otherLocale = locales.find((l) => l !== locale) as Locale;

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-line hover:bg-surface-paper hover:border-navy-900 transition-all duration-200"
      aria-label={`Switch to ${localeNames[otherLocale]}`}
      title={`Switch to ${localeNames[otherLocale]}`}
    >
      <Globe className="w-4 h-4 text-navy-700" />
      <span className="hidden sm:inline">{localeFlags[locale]}</span>
      <span className="text-navy-900 font-medium uppercase text-xs">
        {locale}
      </span>
    </button>
  );
}
