import { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n from "../i18n";
import { CURRENCY_STORAGE_KEY, LANGUAGE_STORAGE_KEY } from "../lib/storage";
import { getCurrencyForLanguage } from "../lib/format";

const SUPPORTED_LANGUAGES = ["en", "fr", "ar", "es", "de", "it"];
const SUPPORTED_CURRENCIES = ["USD", "EUR", "MAD"];
const LanguageContext = createContext(null);

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : "en";
}

function normalizeCurrency(currency, fallbackLanguage = "en") {
  const normalizedCurrency = String(currency || "").toUpperCase();
  if (SUPPORTED_CURRENCIES.includes(normalizedCurrency)) return normalizedCurrency;
  return getCurrencyForLanguage(fallbackLanguage);
}

function readInitialLanguage() {
  if (typeof window === "undefined") return normalizeLanguage(i18n.resolvedLanguage);
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return normalizeLanguage(savedLanguage || i18n.resolvedLanguage);
}

function readInitialCurrency(language) {
  if (typeof window === "undefined") return normalizeCurrency("", language);
  const savedCurrency = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
  return normalizeCurrency(savedCurrency, language);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readInitialLanguage);
  const [currency, setCurrency] = useState(() => readInitialCurrency(readInitialLanguage()));
  const isRtl = language === "ar";

  useEffect(() => {
    i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-currency", currency);
  }, [currency, language, isRtl]);

  useEffect(() => {
    setCurrency((currentCurrency) => normalizeCurrency(currentCurrency, language));
  }, [language, isRtl]);

  const value = useMemo(
    () => ({
      language,
      currency,
      isRtl,
      setLanguage: (nextLanguage) => setLanguage(normalizeLanguage(nextLanguage)),
      setCurrency: (nextCurrency) => setCurrency(normalizeCurrency(nextCurrency, language)),
      languages: SUPPORTED_LANGUAGES,
      currencies: SUPPORTED_CURRENCIES
    }),
    [currency, language, isRtl]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
