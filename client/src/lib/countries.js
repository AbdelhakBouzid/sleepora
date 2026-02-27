const countries = [
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "MA", name: "Morocco", dialCode: "+212" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "ES", name: "Spain", dialCode: "+34" },
  { code: "IT", name: "Italy", dialCode: "+39" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { code: "EG", name: "Egypt", dialCode: "+20" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "TR", name: "Turkey", dialCode: "+90" }
];

function countryFlag(isoCode) {
  const code = String(isoCode || "")
    .trim()
    .toUpperCase()
    .slice(0, 2);
  if (!/^[A-Z]{2}$/.test(code)) return "";
  return code.replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function getCountries() {
  return countries.map((item) => ({
    ...item,
    flag: countryFlag(item.code),
    label: `${countryFlag(item.code)} ${item.name} (${item.dialCode})`
  }));
}

export function findCountryByCode(code) {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  return getCountries().find((item) => item.code === normalized) || getCountries()[0];
}

