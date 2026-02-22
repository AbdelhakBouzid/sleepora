import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    document.title = t("meta.login");
  }, [t, i18n.language]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <SiteLayout>
      <section className="page-section">
        <Container className="auth-wrap">
          <article className="auth-card">
            <p className="caps-label">Sleepora</p>
            <h1>{t("auth.loginTitle")}</h1>
            <form className="form-grid" onSubmit={(event) => event.preventDefault()}>
              <label>
                <span>{t("auth.email")}</span>
                <input type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} />
              </label>
              <label>
                <span>{t("auth.password")}</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setField("password", event.target.value)}
                />
              </label>
              <button className="btn btn-primary btn-md" type="submit">
                {t("auth.signIn")}
              </button>
            </form>

            <p className="auth-switch">
              {t("auth.noAccount")} <Link to="/register">{t("auth.createAccount")}</Link>
            </p>
          </article>
        </Container>
      </section>
    </SiteLayout>
  );
}
