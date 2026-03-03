import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import useLocalStorage from "../hooks/useLocalStorage";
import { changeCurrentUserPassword, updateCurrentUserProfile } from "../lib/authPortalApi";
import { USER_PROFILE_STORAGE_KEY, persistUserSession } from "../lib/storage";
import LanguageSwitch from "../components/ui/LanguageSwitch";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [toastMessage, showToast] = useToast(2600);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    document.title = t("meta.settings");
  }, [t, i18n.language]);

  useEffect(() => {
    setProfileForm({
      firstName: String(user?.first_name || ""),
      lastName: String(user?.last_name || "")
    });
  }, [user]);

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      showToast(t("auth.missingFields"));
      return;
    }

    setIsProfileSubmitting(true);
    try {
      const response = await updateCurrentUserProfile(profileForm);
      persistUserSession(response);
      showToast(t("settings.profileSaved"));
    } catch (error) {
      showToast(String(error?.message || t("auth.requestFailed")));
    } finally {
      setIsProfileSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast(t("auth.missingFields"));
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast(t("auth.passwordsMismatch"));
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      const response = await changeCurrentUserPassword(passwordForm);
      persistUserSession(response);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      showToast(t("settings.passwordSaved"));
    } catch (error) {
      showToast(String(error?.message || t("auth.requestFailed")));
    } finally {
      setIsPasswordSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="page-section">
        <Container className="account-shell">
          <article className="account-card settings-card">
            <div className="account-card-head">
              <div>
                <p className="caps-label">{t("brand.name")}</p>
                <h1>{t("settings.title")}</h1>
                <p>{t("settings.subtitle")}</p>
              </div>
            </div>

            <div className="settings-sections">
              <form className="settings-section form-grid" onSubmit={handleProfileSubmit}>
                <h2>{t("settings.profileSection")}</h2>
                <label>
                  <span>{t("auth.firstName")}</span>
                  <input
                    value={profileForm.firstName}
                    onChange={(event) => setProfileForm((current) => ({ ...current, firstName: event.target.value }))}
                  />
                </label>
                <label>
                  <span>{t("auth.lastName")}</span>
                  <input
                    value={profileForm.lastName}
                    onChange={(event) => setProfileForm((current) => ({ ...current, lastName: event.target.value }))}
                  />
                </label>
                <button className="btn btn-primary btn-sm" disabled={isProfileSubmitting} type="submit">
                  {isProfileSubmitting ? t("common.loading") : t("settings.saveProfile")}
                </button>
              </form>

              <form className="settings-section form-grid" onSubmit={handlePasswordSubmit}>
                <h2>{t("settings.passwordSection")}</h2>
                <label>
                  <span>{t("settings.currentPassword")}</span>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                    }
                  />
                </label>
                <label>
                  <span>{t("settings.newPassword")}</span>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))
                    }
                  />
                </label>
                <label>
                  <span>{t("auth.confirmPassword")}</span>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) =>
                      setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                  />
                </label>
                <button className="btn btn-primary btn-sm" disabled={isPasswordSubmitting} type="submit">
                  {isPasswordSubmitting ? t("common.loading") : t("settings.savePassword")}
                </button>
              </form>

              <div className="settings-section">
                <h2>{t("settings.appearance")}</h2>
                <ThemeToggle />
              </div>

              <div className="settings-section">
                <h2>{t("settings.language")}</h2>
                <LanguageSwitch />
              </div>
            </div>
          </article>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
