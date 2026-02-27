import { createContext, useContext, useEffect, useMemo, useState } from "react";
import i18n from "../i18n";
import { LANGUAGE_STORAGE_KEY } from "../lib/storage";

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
  const isRtl = language === "ar";

  useEffect(() => {
    i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [language, isRtl]);

  const value = useMemo(
    () => ({
      language,
      isRtl,
      setLanguage: (nextLanguage) => setLanguage(normalizeLanguage(nextLanguage)),
      languages: SUPPORTED_LANGUAGES
    }),
    [language, isRtl]
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
