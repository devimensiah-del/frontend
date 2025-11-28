"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Locale, defaultLocale, locales } from "./config";
import ptMessages from "./messages/pt.json";
import enMessages from "./messages/en.json";

type Messages = typeof ptMessages;

const messages: Record<Locale, Messages> = {
  pt: ptMessages,
  en: enMessages,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  messages: Messages;
}

const I18nContext = createContext<I18nContextType | null>(null);

const LOCALE_STORAGE_KEY = "imensiah-locale";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if not found
    }
  }

  return typeof result === "string" ? result : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load locale from localStorage on mount
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (storedLocale && locales.includes(storedLocale)) {
      setLocaleState(storedLocale);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(messages[locale] as unknown as Record<string, unknown>, key);
    },
    [locale]
  );

  // Prevent hydration mismatch by showing default locale until mounted
  const currentMessages = mounted ? messages[locale] : messages[defaultLocale];
  const currentLocale = mounted ? locale : defaultLocale;

  return (
    <I18nContext.Provider value={{ locale: currentLocale, setLocale, t, messages: currentMessages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslations() {
  const { t } = useI18n();
  return t;
}
