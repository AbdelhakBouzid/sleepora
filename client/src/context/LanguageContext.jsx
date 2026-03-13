import { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n from "../i18n";
import { CURRENCY_STORAGE_KEY, LANGUAGE_STORAGE_KEY } from "../lib/storage";
import {
  STOREFRONT_BASE_CURRENCY,
  SUPPORTED_CURRENCIES,
  convertFromBaseCurrency,
  fetchExchangeRates,
  formatPrice,
  getCurrencyForLanguage,
  readCachedExchangeRates,
  normalizeSupportedCurrency
} from "../lib/format";

const SUPPORTED_LANGUAGES = ["en", "fr", "ar", "es", "de", "it"];
const LanguageContext = createContext(null);

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : "en";
}

function readInitialLanguage() {
  if (typeof window === "undefined") return normalizeLanguage(i18n.resolvedLanguage);
  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return normalizeLanguage(savedLanguage || i18n.resolvedLanguage);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readInitialLanguage);
  const [rates, setRates] = useState(() => readCachedExchangeRates());
  const [ratesStatus, setRatesStatus] = useState(() => (Object.keys(readCachedExchangeRates()?.rates || {}).length > 1 ? "ready" : "idle"));
  const isRtl = language === "ar";
  const effectiveCurrency = normalizeSupportedCurrency(getCurrencyForLanguage(language), "MAD");

  useEffect(() => {
    i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, effectiveCurrency);
  }, [effectiveCurrency]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-currency", effectiveCurrency);
  }, [effectiveCurrency, language, isRtl]);

  useEffect(() => {
    let active = true;

    async function syncExchangeRates(forceRefresh = false) {
      setRatesStatus((current) => (current === "ready" && !forceRefresh ? current : "loading"));
      try {
        const nextRates = await fetchExchangeRates({
          baseCurrency: STOREFRONT_BASE_CURRENCY,
          currencies: SUPPORTED_CURRENCIES,
          forceRefresh
        });
        if (!active) return;
        setRates(nextRates);
        setRatesStatus("ready");
      } catch (_error) {
        if (!active) return;
        setRates(readCachedExchangeRates());
        setRatesStatus("error");
      }
    }

    syncExchangeRates(false);
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      language,
      currency: effectiveCurrency,
      effectiveCurrency,
      baseCurrency: STOREFRONT_BASE_CURRENCY,
      isRtl,
      rates,
      ratesStatus,
      setLanguage: (nextLanguage) => setLanguage(normalizeLanguage(nextLanguage)),
      setCurrency: () => {},
      convertPrice: (amount, targetCurrency = effectiveCurrency) =>
        convertFromBaseCurrency(amount, targetCurrency, rates, STOREFRONT_BASE_CURRENCY),
      formatMoney: (amount, targetCurrency = effectiveCurrency) =>
        formatPrice(
          convertFromBaseCurrency(amount, targetCurrency, rates, STOREFRONT_BASE_CURRENCY),
          language,
          targetCurrency || effectiveCurrency
        ),
      languages: SUPPORTED_LANGUAGES,
      currencies: SUPPORTED_CURRENCIES
    }),
    [effectiveCurrency, isRtl, language, rates, ratesStatus]
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
