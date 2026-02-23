import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSwitch() {
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  return (
    <label className="lang-select-wrap">
      <select aria-label="Language" className="lang-select" onChange={(event) => setLanguage(event.target.value)} value={language}>
        {languages.map((item) => (
          <option key={item} value={item}>
            {t(`language.${item}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
