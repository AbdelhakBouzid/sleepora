import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import useLocalStorage from "../hooks/useLocalStorage";
import { USER_PROFILE_STORAGE_KEY } from "../lib/storage";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);

  useEffect(() => {
    document.title = t("meta.profile");
  }, [t, i18n.language]);

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return (
    <SiteLayout>
      <section className="page-section">
        <Container className="account-shell">
          <article className="account-card">
            <div className="account-card-head">
              <div>
                <p className="caps-label">{t("brand.name")}</p>
                <h1>{t("profile.title")}</h1>
                <p>{t("profile.subtitle")}</p>
              </div>
              <Link className="btn btn-secondary btn-sm" to="/settings">
                {t("profile.menuSettings")}
              </Link>
            </div>

            <div className="account-details-grid">
              <div className="account-detail">
                <span>{t("auth.firstName")}</span>
                <strong>{user?.first_name || "-"}</strong>
              </div>
              <div className="account-detail">
                <span>{t("auth.lastName")}</span>
                <strong>{user?.last_name || "-"}</strong>
              </div>
              <div className="account-detail">
                <span>{t("auth.email")}</span>
                <strong>{user?.email || "-"}</strong>
              </div>
              <div className="account-detail">
                <span>{t("auth.phone")}</span>
                <strong>{user?.phone_e164 || "-"}</strong>
              </div>
              <div className="account-detail">
                <span>{t("auth.gender")}</span>
                <strong>{user?.gender || "-"}</strong>
              </div>
              <div className="account-detail">
                <span>{t("auth.age")}</span>
                <strong>{user?.age || "-"}</strong>
              </div>
            </div>

            <div className="account-quick-links">
              <Link className="btn btn-primary btn-sm" to="/settings">
                {t("profile.updateAccount")}
              </Link>
              <Link className="btn btn-secondary btn-sm" to="/cart">
                {t("profile.menuCart")}
              </Link>
              <Link className="btn btn-secondary btn-sm" to="/products">
                {t("cart.continue")}
              </Link>
            </div>
          </article>
        </Container>
      </section>
    </SiteLayout>
  );
}
