import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import {
  loginUser,
  getSocialAuthUrl,
  isSocialAuthConfigured,
  requestPasswordResetOtp,
  resetPasswordWithOtp
} from "../lib/authPortalApi";
import { findCountryByCode, getCountries } from "../lib/countries";
import { persistUserSession } from "../lib/storage";

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

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [toastMessage, showToast] = useToast(2600);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(true);
  const countries = useMemo(() => getCountries(), []);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetMethod, setResetMethod] = useState("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCountryCode, setResetCountryCode] = useState("MA");
  const [resetPhone, setResetPhone] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpStep, setOtpStep] = useState("request");
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  useEffect(() => {
    document.title = t("meta.login");
  }, [t, i18n.language]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      showToast(t("auth.missingFields"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await loginUser({
        email: form.email.trim(),
        password: form.password
      });
      persistUserSession(response);
      showToast(t("auth.loginSuccess"));
      setTimeout(() => navigate("/profile"), 500);
    } catch (error) {
      showToast(String(error?.message || t("auth.requestFailed")));
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForgotForm() {
    setResetMethod("email");
    setResetEmail("");
    setResetCountryCode("MA");
    setResetPhone("");
    setChallengeId("");
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpStep("request");
  }

  async function handleOtpRequest(event) {
    event.preventDefault();

    setIsResetSubmitting(true);
    try {
      const response = await requestPasswordResetOtp(
        resetMethod === "email"
          ? {
              method: "email",
              email: resetEmail.trim()
            }
          : {
              method: "phone",
              phoneDialCode: findCountryByCode(resetCountryCode)?.dialCode || "",
              phoneNumber: resetPhone.trim()
            }
      );

      setChallengeId(String(response?.challengeId || ""));
      setOtpStep("verify");
      showToast(t("auth.otpSent"));
    } catch (error) {
      showToast(String(error?.message || t("auth.requestFailed")));
    } finally {
      setIsResetSubmitting(false);
    }
  }

  async function handleOtpVerify(event) {
    event.preventDefault();
    if (!otpCode.trim() || !newPassword || !confirmPassword) {
      showToast(t("auth.missingFields"));
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(t("auth.passwordsMismatch"));
      return;
    }

    setIsResetSubmitting(true);
    try {
      await resetPasswordWithOtp({
        challengeId,
        otp: otpCode.trim(),
        newPassword
      });
      showToast(t("auth.passwordResetSuccess"));
      setForgotOpen(false);
      resetForgotForm();
    } catch (error) {
      showToast(String(error?.message || t("auth.requestFailed")));
    } finally {
      setIsResetSubmitting(false);
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
            <div className="auth-head-row">
              <h1>{t("auth.loginTitle", { defaultValue: "Sign in" })}</h1>
              <Link className="btn btn-ghost btn-sm" to="/register">
                {t("nav.register", { defaultValue: "Register" })}
              </Link>
            </div>
            <form className="form-grid" onSubmit={handleLogin}>
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

              <div className="auth-inline-row">
                <label className="auth-stay-signed">
                  <input checked={staySignedIn} onChange={(event) => setStaySignedIn(event.target.checked)} type="checkbox" />
                  <span>Stay signed in</span>
                </label>
                <button className="text-link" onClick={() => setForgotOpen((open) => !open)} type="button">
                  {t("auth.forgotPassword", { defaultValue: "Forgot your password?" })}
                </button>
              </div>

              <button className="btn btn-primary btn-md" type="submit">
                {isSubmitting ? t("common.loading") : t("auth.signIn", { defaultValue: "Sign in" })}
              </button>
            </form>

            <p className="auth-help-link">Trouble signing in?</p>
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

            {forgotOpen ? (
              <div className="forgot-panel">
                <p className="caps-label">{t("auth.forgotPassword")}</p>
                {otpStep === "request" ? (
                  <form className="form-grid" onSubmit={handleOtpRequest}>
                    <label>
                      <span>{t("auth.otpMethod")}</span>
                      <select value={resetMethod} onChange={(event) => setResetMethod(event.target.value)}>
                        <option value="email">{t("auth.otpByEmail")}</option>
                        <option value="phone">{t("auth.otpByPhone")}</option>
                      </select>
                    </label>

                    {resetMethod === "email" ? (
                      <label>
                        <span>{t("auth.email")}</span>
                        <input type="email" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} />
                      </label>
                    ) : (
                      <div className="phone-field-wrap">
                        <label>
                          <span>{t("auth.countryPhone")}</span>
                          <select value={resetCountryCode} onChange={(event) => setResetCountryCode(event.target.value)}>
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          <span>{t("auth.phone")}</span>
                          <input value={resetPhone} onChange={(event) => setResetPhone(event.target.value)} />
                        </label>
                      </div>
                    )}

                    <button className="btn btn-secondary btn-md" disabled={isResetSubmitting} type="submit">
                      {isResetSubmitting ? t("common.loading") : t("auth.sendOtp")}
                    </button>
                  </form>
                ) : (
                  <form className="form-grid" onSubmit={handleOtpVerify}>
                    <label>
                      <span>{t("auth.otpCode")}</span>
                      <input value={otpCode} onChange={(event) => setOtpCode(event.target.value)} />
                    </label>
                    <label>
                      <span>{t("auth.newPassword")}</span>
                      <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                    </label>
                    <label>
                      <span>{t("auth.confirmPassword")}</span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                      />
                    </label>
                    <button className="btn btn-secondary btn-md" disabled={isResetSubmitting} type="submit">
                      {isResetSubmitting ? t("common.loading") : t("auth.resetPassword")}
                    </button>
                  </form>
                )}
              </div>
            ) : null}

            <p className="auth-legal">
              By clicking Sign in, Continue with Google, Facebook, or Apple, you agree to Sleepora Terms and Privacy Policy.
            </p>
          </article>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
