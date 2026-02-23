export function formatPrice(value, language = "en") {
  const localeMap = {
    en: "en-US",
    fr: "fr-FR",
    ar: "en-US",
    es: "es-ES",
    de: "de-DE",
    it: "it-IT"
  };
  const locale = localeMap[language] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    numberingSystem: "latn",
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}

export function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}
