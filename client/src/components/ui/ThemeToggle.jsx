import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

function SunIcon() {
  return (
    <svg aria-hidden="true" className="theme-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" fill="none" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2.4v2.3M12 19.3v2.3M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.4 12h2.3M19.3 12h2.3M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="theme-icon" viewBox="0 0 24 24">
      <path d="M14.6 2.7a8.8 8.8 0 1 0 6.7 13.5 9.2 9.2 0 0 1-11.5-11.5 8.7 8.7 0 0 0 4.8-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function ThemeToggle({ withLabel = false }) {
  const { t } = useTranslation();
  const { theme, setTheme, toggleTheme } = useTheme();

  if (!withLabel) {
    const nextLabel = theme === "dark" ? t("theme.light") : t("theme.dark");
    return (
      <button className="toggle-chip" onClick={toggleTheme} title={nextLabel} type="button">
        {nextLabel}
      </button>
    );
  }

  return (
    <div className="theme-toggle-group" role="group" aria-label="Theme mode">
      <span className="drawer-setting-label">Mode</span>
      <div className="theme-toggle-actions">
        <button
          className={theme === "light" ? "toggle-chip active" : "toggle-chip"}
          onClick={() => setTheme("light")}
          title={t("theme.light")}
          type="button"
        >
          <span className="theme-chip-icon" aria-hidden="true">
            <SunIcon />
          </span>
          <span>{t("theme.light")}</span>
        </button>
        <button
          className={theme === "dark" ? "toggle-chip active" : "toggle-chip"}
          onClick={() => setTheme("dark")}
          title={t("theme.dark")}
          type="button"
        >
          <span className="theme-chip-icon" aria-hidden="true">
            <MoonIcon />
          </span>
          <span>{t("theme.dark")}</span>
        </button>
      </div>
    </div>
  );
}
