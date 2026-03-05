import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { registerUser } from "../lib/authPortalApi";
import { findCountryByCode, getCountries } from "../lib/countries";

function isStrongPassword(password) {
  const text = String(password || "");
  return (
    text.length >= 8 &&
    /[a-z]/.test(text) &&
    /[A-Z]/.test(text) &&
    /\d/.test(text) &&
    /[^A-Za-z0-9]/.test(text)
  );
}

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [toastMessage, showToast] = useToast(2600);
  const countries = useMemo(() => getCountries(), []);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    phoneCountryCode: "MA",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = t("meta.register");
  }, [t, i18n.language]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.gender.trim() ||
      !form.age ||
      !form.phoneCountryCode ||
      !form.phoneNumber.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      showToast(t("auth.missingFields"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast(t("auth.passwordsMismatch"));
      return;
    }

    if (!isStrongPassword(form.password)) {
      showToast(t("auth.passwordPolicy"));
      return;
    }

    const country = findCountryByCode(form.phoneCountryCode);

    setIsSubmitting(true);
    try {
      await registerUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender.trim(),
        age: Number(form.age),
        email: form.email.trim(),
        phoneCountryName: country?.name || "",
        phoneCountryCode: country?.code || "",
        phoneDialCode: country?.dialCode || "",
        phoneNumber: form.phoneNumber.trim(),
        password: form.password
      });
      showToast(t("auth.registerSuccess"));
      setTimeout(() => navigate("/login"), 550);
    } catch (error) {
      showToast(String(error?.message || t("auth.requestFailed")));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <section className="page-section">
        <Container className="auth-wrap">
          <article className="auth-card auth-login-card">
            <p className="caps-label">Sleepora</p>
            <h1>{t("auth.registerTitle")}</h1>
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                <span>{t("auth.firstName")}</span>
                <input value={form.firstName} onChange={(event) => setField("firstName", event.target.value)} />
              </label>
              <label>
                <span>{t("auth.lastName")}</span>
                <input value={form.lastName} onChange={(event) => setField("lastName", event.target.value)} />
              </label>
              <label>
                <span>{t("auth.gender")}</span>
                <select value={form.gender} onChange={(event) => setField("gender", event.target.value)}>
                  <option value="">{t("auth.selectGender")}</option>
                  <option value="male">{t("auth.male")}</option>
                  <option value="female">{t("auth.female")}</option>
                </select>
              </label>
              <label>
                <span>{t("auth.age")}</span>
                <input
                  min="13"
                  max="120"
                  type="number"
                  value={form.age}
                  onChange={(event) => setField("age", event.target.value)}
                />
              </label>
              <label>
                <span>{t("auth.countryPhone")}</span>
                <select
                  value={form.phoneCountryCode}
                  onChange={(event) => setField("phoneCountryCode", event.target.value)}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>{t("auth.phone")}</span>
                <input value={form.phoneNumber} onChange={(event) => setField("phoneNumber", event.target.value)} />
              </label>
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
                <small className="field-help">{t("auth.passwordPolicy")}</small>
              </label>
              <label>
                <span>{t("auth.confirmPassword")}</span>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setField("confirmPassword", event.target.value)}
                />
              </label>
              <button className="btn btn-primary btn-md" type="submit">
                {isSubmitting ? t("common.loading") : t("auth.create")}
              </button>
            </form>

            <p className="auth-switch">
              {t("auth.already")} <Link to="/login">{t("auth.signIn")}</Link>
            </p>
            <div className="auth-divider">OR</div>
            <div className="auth-social-stack">
              <button className="auth-social-btn" type="button">
                <span className="auth-social-icon">G</span>
                <span>Continue with Google</span>
              </button>
              <button className="auth-social-btn" type="button">
                <span className="auth-social-icon">f</span>
                <span>Continue with Facebook</span>
              </button>
              <button className="auth-social-btn" type="button">
                <span className="auth-social-icon">a</span>
                <span>Continue with Apple</span>
              </button>
            </div>
          </article>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
