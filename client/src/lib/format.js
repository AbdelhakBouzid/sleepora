import { CURRENCY_STORAGE_KEY } from "./storage";

const localeMap = {
  en: "en-US",
  fr: "fr-FR",
  ar: "ar-MA",
  es: "es-ES",
  de: "de-DE",
  it: "it-IT"
};

const currencyMap = {
  en: "USD",
  fr: "EUR",
  ar: "MAD",
  es: "EUR",
  de: "EUR",
  it: "EUR"
};

export function getCurrencyForLanguage(language = "en") {
  return currencyMap[String(language || "en").toLowerCase()] || "USD";
}

function readStoredCurrency(fallbackCurrency = "USD") {
  if (typeof window === "undefined") return fallbackCurrency;
  const savedCurrency = String(window.localStorage.getItem(CURRENCY_STORAGE_KEY) || "").toUpperCase();
  return savedCurrency || fallbackCurrency;
}

export function formatPrice(value, language = "en", forcedCurrency = "") {
  const normalizedLanguage = String(language || "en").toLowerCase();
  const locale = localeMap[normalizedLanguage] || "en-US";
  const currency = String(forcedCurrency || readStoredCurrency(getCurrencyForLanguage(normalizedLanguage))).toUpperCase();
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    numberingSystem: "latn",
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}

export function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}
