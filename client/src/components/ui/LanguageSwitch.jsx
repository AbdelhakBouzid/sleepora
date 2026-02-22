import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSwitch() {
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {languages.map((item) => (
        <button
          key={item}
          className={item === language ? "lang-btn active" : "lang-btn"}
          onClick={() => setLanguage(item)}
          type="button"
        >
          {t(`language.${item}`)}
        </button>
      ))}
    </div>
  );
}
