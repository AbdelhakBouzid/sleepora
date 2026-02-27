import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import {
  loginUser,
  requestPasswordResetOtp,
  resetPasswordWithOtp
} from "../lib/authPortalApi";
import { findCountryByCode, getCountries } from "../lib/countries";
import { USER_PROFILE_STORAGE_KEY, USER_TOKEN_STORAGE_KEY } from "../lib/storage";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [toastMessage, showToast] = useToast(2600);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (typeof window !== "undefined") {
        if (response?.token) {
          window.localStorage.setItem(USER_TOKEN_STORAGE_KEY, response.token);
        }
        if (response?.user) {
          window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(response.user));
        }
      }
      showToast(t("auth.loginSuccess"));
      setTimeout(() => navigate("/products"), 500);
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

  return (
    <SiteLayout>
      <section className="page-section">
        <Container className="auth-wrap">
          <article className="auth-card">
            <p className="caps-label">Sleepora</p>
            <h1>{t("auth.loginTitle")}</h1>
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
              <button className="text-link" onClick={() => setForgotOpen((open) => !open)} type="button">
                {t("auth.forgotPassword")}
              </button>
              <button className="btn btn-primary btn-md" type="submit">
                {isSubmitting ? t("common.loading") : t("auth.signIn")}
              </button>
            </form>

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

            <p className="auth-switch">
              {t("auth.noAccount")} <Link to="/register">{t("auth.createAccount")}</Link>
            </p>
          </article>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
