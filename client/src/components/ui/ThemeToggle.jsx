import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? t("theme.light") : t("theme.dark");

  return (
    <button className="toggle-chip" onClick={toggleTheme} title={label} type="button">
      {label}
    </button>
  );
}
