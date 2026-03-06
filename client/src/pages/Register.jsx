import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { getSocialAuthUrl, isSocialAuthConfigured, registerUser } from "../lib/authPortalApi";
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

const socialProviders = [
  { key: "google", label: "Continue with Google" },
  { key: "facebook", label: "Continue with Facebook" },
  { key: "apple", label: "Continue with Apple" }
];

function SocialIcon({ provider }) {
  if (provider === "google") {
    return (
      <svg aria-hidden="true" className="auth-social-svg" viewBox="0 0 24 24">
        <path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.8 3.1-4.5 3.1-7.5Z" fill="#4285F4" />
        <path d="M12 22c2.7 0 5-1 6.7-2.6l-3.2-2.6c-.9.6-2 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H3v2.7A10 10 0 0 0 12 22Z" fill="#34A853" />
        <path d="M6.3 13.6A6 6 0 0 1 6 12c0-.5.1-1.1.3-1.6V7.7H3A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.3l3.2-2.7Z" fill="#FBBC05" />
        <path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 12 2 10 10 0 0 0 3 7.7l3.3 2.7C7.1 7.8 9.3 6 12 6Z" fill="#EA4335" />
      </svg>
    );
  }

  if (provider === "facebook") {
    return (
      <svg aria-hidden="true" className="auth-social-svg" viewBox="0 0 24 24">
        <path d="M24 12a12 12 0 1 0-13.9 11.8v-8.3H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.3A12 12 0 0 0 24 12Z" fill="#1877F2" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="auth-social-svg" viewBox="0 0 24 24">
      <path d="M16.8 12.6c0-2.5 2.1-3.7 2.2-3.8-1.2-1.8-3.1-2.1-3.8-2.1-1.6-.2-3.1 1-3.9 1-.8 0-2-.9-3.3-.8-1.7 0-3.2 1-4.1 2.5-1.8 3.1-.5 7.8 1.3 10.3.8 1.2 1.8 2.6 3.2 2.5 1.3-.1 1.8-.8 3.4-.8s2.1.8 3.5.8c1.4 0 2.4-1.2 3.2-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-3-1.2-3-4.5Zm-2.7-7.6c.6-.8 1.1-1.9 1-3-1 .1-2.2.7-2.9 1.5-.6.7-1.2 1.9-1.1 3 1.1.1 2.3-.6 3-1.5Z" fill="#111111" />
    </svg>
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

  function handleSocialLogin(provider) {
    const url = getSocialAuthUrl(provider);
    if (!url) {
      showToast("Social login needs provider setup (client ID + redirect URI).");
      return;
    }
    window.location.assign(url);
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
              {socialProviders.map((provider) => {
                const configured = isSocialAuthConfigured(provider.key);
                return (
                  <button
                    className="auth-social-btn"
                    disabled={!configured}
                    key={provider.key}
                    onClick={() => handleSocialLogin(provider.key)}
                    type="button"
                  >
                    <span className="auth-social-icon">
                      <SocialIcon provider={provider.key} />
                    </span>
                    <span>{provider.label}</span>
                    {!configured ? <small>Setup required</small> : null}
                  </button>
                );
              })}
            </div>
          </article>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
