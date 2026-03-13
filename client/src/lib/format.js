import { CURRENCY_STORAGE_KEY, EXCHANGE_RATES_STORAGE_KEY, readStorageValue, writeStorageValue } from "./storage";

const localeMap = {
  en: "en-US",
  fr: "fr-FR",
  ar: "ar-MA",
  es: "es-ES",
  de: "de-DE",
  it: "it-IT"
};

const currencyMap = {
  en: "MAD",
  fr: "MAD",
  ar: "MAD",
  es: "MAD",
  de: "MAD",
  it: "MAD"
};

export const STOREFRONT_BASE_CURRENCY = "USD";
export const SUPPORTED_CURRENCIES = ["MAD"];
export const EXCHANGE_RATE_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const EXCHANGE_RATE_API_URL = "https://api.frankfurter.dev/latest";

let exchangeRateRequest = null;

export function getCurrencyForLanguage(language = "en") {
  return currencyMap[String(language || "en").toLowerCase()] || STOREFRONT_BASE_CURRENCY;
}

export function normalizeSupportedCurrency(currency, fallbackCurrency = STOREFRONT_BASE_CURRENCY) {
  const normalizedCurrency = String(currency || "").trim().toUpperCase();
  if (SUPPORTED_CURRENCIES.includes(normalizedCurrency)) return normalizedCurrency;
  return String(fallbackCurrency || STOREFRONT_BASE_CURRENCY).trim().toUpperCase() || STOREFRONT_BASE_CURRENCY;
}

function readStoredCurrency(fallbackCurrency = "MAD") {
  if (typeof window === "undefined") return fallbackCurrency;
  const savedCurrency = String(window.localStorage.getItem(CURRENCY_STORAGE_KEY) || "").toUpperCase();
  return normalizeSupportedCurrency(savedCurrency, fallbackCurrency);
}

function normalizeRatesPayload(payload) {
  const base = normalizeSupportedCurrency(payload?.base || STOREFRONT_BASE_CURRENCY);
  const rawRates = payload?.rates && typeof payload.rates === "object" ? payload.rates : {};
  const rates = {
    [base]: 1
  };

  for (const currency of SUPPORTED_CURRENCIES) {
    if (currency === base) continue;
    const rate = Number(rawRates[currency]);
    if (Number.isFinite(rate) && rate > 0) {
      rates[currency] = rate;
    }
  }

  return {
    base,
    date: String(payload?.date || ""),
    fetchedAt: Number(payload?.fetchedAt || Date.now()),
    rates
  };
}

export function readCachedExchangeRates() {
  const cached = readStorageValue(EXCHANGE_RATES_STORAGE_KEY, null);
  if (!cached || typeof cached !== "object") {
    return normalizeRatesPayload({ base: STOREFRONT_BASE_CURRENCY, rates: {} });
  }
  return normalizeRatesPayload(cached);
}

function hasFreshExchangeRates(payload) {
  const fetchedAt = Number(payload?.fetchedAt || 0);
  return fetchedAt > 0 && Date.now() - fetchedAt < EXCHANGE_RATE_CACHE_TTL_MS;
}

function buildExchangeRateUrl(baseCurrency, currencies) {
  const params = new URLSearchParams({
    base: normalizeSupportedCurrency(baseCurrency)
  });

  const requestedCurrencies = (currencies || [])
    .map((currency) => normalizeSupportedCurrency(currency))
    .filter((currency, index, list) => currency !== normalizeSupportedCurrency(baseCurrency) && list.indexOf(currency) === index);

  if (requestedCurrencies.length) {
    params.set("symbols", requestedCurrencies.join(","));
  }

  return `${EXCHANGE_RATE_API_URL}?${params.toString()}`;
}

export async function fetchExchangeRates({
  baseCurrency = STOREFRONT_BASE_CURRENCY,
  currencies = SUPPORTED_CURRENCIES,
  forceRefresh = false
} = {}) {
  const cached = readCachedExchangeRates();
  const normalizedBaseCurrency = normalizeSupportedCurrency(baseCurrency);
  const hasAllCurrencies = currencies.every((currency) => {
    const normalized = normalizeSupportedCurrency(currency);
    return normalized === normalizedBaseCurrency || Number(cached?.rates?.[normalized]) > 0;
  });

  if (!forceRefresh && cached.base === normalizedBaseCurrency && hasAllCurrencies && hasFreshExchangeRates(cached)) {
    return cached;
  }

  if (!forceRefresh && exchangeRateRequest) {
    return exchangeRateRequest;
  }

  exchangeRateRequest = fetch(buildExchangeRateUrl(normalizedBaseCurrency, currencies))
    .then(async (response) => {
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload) {
        throw new Error(payload?.message || `Rates request failed (${response.status})`);
      }

      const normalizedPayload = normalizeRatesPayload({
        ...payload,
        base: payload?.base || normalizedBaseCurrency,
        fetchedAt: Date.now()
      });

      writeStorageValue(EXCHANGE_RATES_STORAGE_KEY, normalizedPayload);
      return normalizedPayload;
    })
    .finally(() => {
      exchangeRateRequest = null;
    });

  return exchangeRateRequest;
}

export function resolveDisplayCurrency(currency, ratesPayload = null, baseCurrency = STOREFRONT_BASE_CURRENCY) {
  const normalizedBaseCurrency = normalizeSupportedCurrency(baseCurrency);
  const normalizedCurrency = normalizeSupportedCurrency(currency, normalizedBaseCurrency);
  if (normalizedCurrency === normalizedBaseCurrency) return normalizedBaseCurrency;

  const rate = Number(ratesPayload?.rates?.[normalizedCurrency]);
  if (Number.isFinite(rate) && rate > 0) return normalizedCurrency;
  return normalizedBaseCurrency;
}

export function convertFromBaseCurrency(value, targetCurrency = STOREFRONT_BASE_CURRENCY, ratesPayload = null, baseCurrency = STOREFRONT_BASE_CURRENCY) {
  const normalizedBaseCurrency = normalizeSupportedCurrency(baseCurrency);
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue)) return 0;

  const effectiveCurrency = resolveDisplayCurrency(targetCurrency, ratesPayload, normalizedBaseCurrency);
  if (effectiveCurrency === normalizedBaseCurrency) {
    return Number(numericValue.toFixed(2));
  }

  const rate = Number(ratesPayload?.rates?.[effectiveCurrency]);
  if (!Number.isFinite(rate) || rate <= 0) {
    return Number(numericValue.toFixed(2));
  }

  return Number((numericValue * rate).toFixed(2));
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

export function formatBasePrice(value, language = "en", targetCurrency = "", ratesPayload = null, baseCurrency = STOREFRONT_BASE_CURRENCY) {
  const effectiveCurrency = resolveDisplayCurrency(targetCurrency || STOREFRONT_BASE_CURRENCY, ratesPayload, baseCurrency);
  const convertedValue = convertFromBaseCurrency(value, effectiveCurrency, ratesPayload, baseCurrency);
  return formatPrice(convertedValue, language, effectiveCurrency);
}

export function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}
