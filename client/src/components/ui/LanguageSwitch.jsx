import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

const languageMeta = {
  en: { flag: "US", label: "English" },
  fr: { flag: "FR", label: "Francais" },
  ar: { flag: "MA", label: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629" },
  es: { flag: "ES", label: "Espanol" },
  de: { flag: "DE", label: "Deutsch" },
  it: { flag: "IT", label: "Italiano" }
};

function flagEmoji(countryCode = "US") {
  return String(countryCode || "US")
    .toUpperCase()
    .slice(0, 2)
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export default function LanguageSwitch({ withLabel = false }) {
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  return (
    <label className={withLabel ? "lang-select-wrap drawer-setting-control" : "lang-select-wrap lang-select-compact"}>
      {withLabel ? <span className="drawer-setting-label">Language</span> : null}
      <select aria-label="Language" className="lang-select" onChange={(event) => setLanguage(event.target.value)} value={language}>
        {languages.map((item) => (
          <option key={item} value={item}>
            {`${flagEmoji(languageMeta[item]?.flag)} ${languageMeta[item]?.label || t(`language.${item}`)}`}
          </option>
        ))}
      </select>
    </label>
  );
}
