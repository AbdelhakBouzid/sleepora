import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import useCart from "../hooks/useCart";
import useToast from "../hooks/useToast";
import useLocalStorage from "../hooks/useLocalStorage";
import Toast from "../components/Toast";
import {
  CART_STORAGE_KEY,
  CHECKOUT_FORM_STORAGE_KEY,
  LAST_SUCCESS_ORDER_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
  removeStorageValue,
  writeStorageValue
} from "../lib/storage";
import { buildCartLines, calculateCartTotal } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { fetchCatalog } from "../lib/catalog";
import { capturePayPalCheckoutOrder, createPayPalCheckoutOrder, fetchPayPalClientConfig, loadPayPalSdk } from "../lib/paypal";
import TrustBadges from "../components/store/TrustBadges";
import PaymentIconsRow from "../components/store/PaymentIconsRow";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  country: "US"
};

function buildInitialCheckoutForm(savedForm, user) {
  const legacyFullName = String(savedForm?.fullName || "").trim();
  const [legacyFirstName = "", ...legacyLastNameParts] = legacyFullName.split(" ").filter(Boolean);
  return {
    firstName: String(savedForm?.firstName || legacyFirstName || user?.first_name || ""),
    lastName: String(savedForm?.lastName || legacyLastNameParts.join(" ") || user?.last_name || ""),
    email: String(savedForm?.email || user?.email || ""),
    phone: String(savedForm?.phone || user?.phone_e164 || ""),
    address: String(savedForm?.address || ""),
    city: String(savedForm?.city || ""),
    zip: String(savedForm?.zip || ""),
    country: String(savedForm?.country || "US")
  };
}

function normalizePhoneInput(value) {
  return String(value || "").replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

function normalizeZipInput(value) {
  return String(value || "").replace(/[^\d]/g, "").slice(0, 12);
}

function buildValidationErrors(form) {
  return {
    firstName: String(form?.firstName || "").trim() ? "" : "firstName",
    lastName: String(form?.lastName || "").trim() ? "" : "lastName",
    email: String(form?.email || "").trim().includes("@") ? "" : "email",
    phone: String(form?.phone || "").trim() ? "" : "phone",
    address: String(form?.address || "").trim() ? "" : "address",
    city: String(form?.city || "").trim() ? "" : "city",
    zip: String(form?.zip || "").trim() ? "" : "zip",
    country: String(form?.country || "").trim() ? "" : "country"
  };
}

function isCheckoutFormValid(form) {
  return Object.values(buildValidationErrors(form)).every((value) => !value);
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart(CART_STORAGE_KEY);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const [savedForm] = useLocalStorage(CHECKOUT_FORM_STORAGE_KEY, initialForm);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(() => buildInitialCheckoutForm(savedForm, user));
  const [toastMessage, showToast] = useToast();
  const [payPalClientId, setPayPalClientId] = useState("");
  const [payPalCurrency, setPayPalCurrency] = useState("USD");
  const [payPalError, setPayPalError] = useState("");
  const [isPayPalLoading, setIsPayPalLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeMethod, setActiveMethod] = useState("paypal");
  const [touched, setTouched] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const payPalButtonContainerRef = useRef(null);

  useEffect(() => {
    document.title = t("meta.checkout");
  }, [t, i18n.language]);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      firstName: current.firstName || String(user?.first_name || ""),
      lastName: current.lastName || String(user?.last_name || ""),
      email: current.email || String(user?.email || ""),
      phone: current.phone || String(user?.phone_e164 || "")
    }));
  }, [user]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const total = useMemo(() => calculateCartTotal(lines), [lines]);
  const shipping = 0;
  const validationErrors = useMemo(() => buildValidationErrors(form), [form]);
  const canSubmitPayment = useMemo(() => isCheckoutFormValid(form) && termsAccepted, [form, termsAccepted]);
  const linesSignature = useMemo(
    () =>
      lines
        .map((line) => `${line.productId}:${line.quantity}`)
        .sort()
        .join("|"),
    [lines]
  );

  useEffect(() => {
    writeStorageValue(CHECKOUT_FORM_STORAGE_KEY, form);
  }, [form]);

  useEffect(() => {
    let active = true;
    async function loadClientConfig() {
      try {
        const config = await fetchPayPalClientConfig();
        if (!active) return;
        const clientId = String(config?.clientId || "");
        const currency = String(config?.currency || "USD").toUpperCase();
        setPayPalClientId(clientId);
        setPayPalCurrency(currency);
        setPayPalError("");
        loadPayPalSdk(clientId, currency).catch(() => {});
      } catch (error) {
        if (!active) return;
        setPayPalError(String(error?.message || t("checkout.paypalUnavailable")));
      } finally {
        if (active) setIsPayPalLoading(false);
      }
    }
    loadClientConfig();
    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    let canceled = false;

    async function renderPayPalButtons() {
      if (!payPalClientId || !payPalButtonContainerRef.current || !lines.length) return;
      setPayPalError("");

      try {
        const paypal = await loadPayPalSdk(payPalClientId, payPalCurrency);
        if (canceled || !paypal?.Buttons || !payPalButtonContainerRef.current) return;
        const buttonContainer = payPalButtonContainerRef.current;
        buttonContainer.innerHTML = "";
        const fundingSource = activeMethod === "card" ? paypal.FUNDING.CARD : paypal.FUNDING.PAYPAL;

        const buttonHandlers = {
          onClick: (_data, actions) => {
            if (!canSubmitPayment) {
              setTouched({
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                address: true,
                city: true,
                zip: true,
                country: true
              });
              if (!termsAccepted) {
                showToast(t("checkout.acceptPoliciesError"));
              } else {
                showToast(t("checkout.validationError"));
              }
              return actions.reject();
            }
            return actions.resolve();
          },
          createOrder: async () => {
            if (!canSubmitPayment) {
              showToast(t("checkout.validationError"));
              throw new Error("Invalid checkout form");
            }

            const response = await createPayPalCheckoutOrder({
              customer: {
                name: `${String(form.firstName || "").trim()} ${String(form.lastName || "").trim()}`.trim(),
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                address: form.address,
                city: form.city,
                zip: form.zip,
                country: form.country
              },
              items: lines.map((line) => ({
                id: line.productId || line.id,
                quantity: line.quantity
              })),
              currency: payPalCurrency
            });
            return String(response?.orderId || "");
          },
          onApprove: async (data) => {
            setIsCapturing(true);
            try {
              const result = await capturePayPalCheckoutOrder(data.orderID);
              writeStorageValue(LAST_SUCCESS_ORDER_STORAGE_KEY, result);
              clearCart();
              removeStorageValue(CHECKOUT_FORM_STORAGE_KEY);
              navigate("/checkout/success", {
                replace: true,
                state: { order: result }
              });
            } catch (error) {
              const message = String(error?.message || "");
              const safeMessage = /fetch|network/i.test(message) ? t("checkout.connectionIssue") : t("checkout.paymentFailed");
              setPayPalError(safeMessage);
              showToast(safeMessage);
            } finally {
              setIsCapturing(false);
            }
          },
          onCancel: () => navigate("/checkout/cancel"),
          onError: (error) => {
            const message = String(error?.message || "");
            const safeMessage = /fetch|network/i.test(message) ? t("checkout.connectionIssue") : t("checkout.paymentFailed");
            setPayPalError(safeMessage);
            showToast(safeMessage);
          }
        };

        const paymentButton = paypal.Buttons({
          ...buttonHandlers,
          fundingSource,
          style: {
            shape: "pill",
            label: activeMethod === "card" ? "pay" : "paypal",
            layout: "vertical",
            height: 48,
            tagline: false
          }
        });

        if (!paymentButton?.isEligible?.()) {
          setPayPalError(t("checkout.paypalUnavailable"));
          return;
        }

        await paymentButton.render(buttonContainer);
      } catch (error) {
        if (!canceled) {
          setPayPalError(String(error?.message || t("checkout.paypalUnavailable")));
        }
      }
    }

    renderPayPalButtons();
    return () => {
      canceled = true;
    };
  }, [
    activeMethod,
    canSubmitPayment,
    clearCart,
    form,
    lines,
    linesSignature,
    navigate,
    payPalClientId,
    payPalCurrency,
    showToast,
    t,
    termsAccepted
  ]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function setTouchedField(field) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function renderFieldError(field) {
    if (!touched[field] || !validationErrors[field]) return null;
    return <small className="field-error">{t(`checkout.errors.${validationErrors[field]}`)}</small>;
  }

  return (
    <SiteLayout>
      <section className="page-section">
        <Container className="checkout-grid">
          <article className="checkout-panel">
            <h1>{t("checkout.title")}</h1>
            <p>{t("checkout.subtitle")}</p>

            {!lines.length ? (
              <div className="empty-state">
                <p>{t("cart.empty")}</p>
                <Link className="btn btn-secondary btn-md" to="/products">
                  {t("cart.continue")}
                </Link>
              </div>
            ) : (
              <div className="form-grid">
                <label>
                  <span>{t("auth.firstName")}</span>
                  <input
                    value={form.firstName}
                    onBlur={() => setTouchedField("firstName")}
                    onChange={(event) => setField("firstName", event.target.value)}
                  />
                  {renderFieldError("firstName")}
                </label>
                <label>
                  <span>{t("auth.lastName")}</span>
                  <input
                    value={form.lastName}
                    onBlur={() => setTouchedField("lastName")}
                    onChange={(event) => setField("lastName", event.target.value)}
                  />
                  {renderFieldError("lastName")}
                </label>
                <label>
                  <span>{t("checkout.email")}</span>
                  <input
                    type="email"
                    value={form.email}
                    onBlur={() => setTouchedField("email")}
                    onChange={(event) => setField("email", event.target.value)}
                  />
                  {renderFieldError("email")}
                </label>
                <label>
                  <span>{t("checkout.phone")}</span>
                  <input
                    inputMode="tel"
                    value={form.phone}
                    onBlur={() => setTouchedField("phone")}
                    onChange={(event) => setField("phone", normalizePhoneInput(event.target.value))}
                  />
                  {renderFieldError("phone")}
                </label>
                <label>
                  <span>{t("checkout.address")}</span>
                  <input
                    value={form.address}
                    onBlur={() => setTouchedField("address")}
                    onChange={(event) => setField("address", event.target.value)}
                  />
                  {renderFieldError("address")}
                </label>
                <div className="payment-grid">
                  <label>
                    <span>{t("checkout.city")}</span>
                    <input
                      value={form.city}
                      onBlur={() => setTouchedField("city")}
                      onChange={(event) => setField("city", event.target.value)}
                    />
                    {renderFieldError("city")}
                  </label>
                  <label>
                    <span>{t("checkout.zip")}</span>
                    <input
                      inputMode="numeric"
                      value={form.zip}
                      onBlur={() => setTouchedField("zip")}
                      onChange={(event) => setField("zip", normalizeZipInput(event.target.value))}
                    />
                    {renderFieldError("zip")}
                  </label>
                  <label>
                    <span>{t("checkout.country")}</span>
                    <input
                      value={form.country}
                      onBlur={() => setTouchedField("country")}
                      onChange={(event) => setField("country", event.target.value)}
                    />
                    {renderFieldError("country")}
                  </label>
                </div>

                <div className="payment-card checkout-payment-card">
                  <div className="checkout-payment-head">
                    <div>
                      <p className="payment-method-label">{t("checkout.secureTitle")}</p>
                      <h2 className="checkout-payment-title">{t("checkout.sleeporaCheckoutTitle")}</h2>
                      <p className="payment-note payment-note-strong">{t("checkout.chooseMethod")}</p>
                    </div>
                    <div className="checkout-payment-badge">{t("brand.name")}</div>
                  </div>

                  <div className="checkout-method-selector">
                    <button
                      className={activeMethod === "paypal" ? "checkout-method-chip active" : "checkout-method-chip"}
                      onClick={() => setActiveMethod("paypal")}
                      type="button"
                    >
                      {t("checkout.paypalMethod")}
                    </button>
                    <button
                      className={activeMethod === "card" ? "checkout-method-chip active" : "checkout-method-chip"}
                      onClick={() => setActiveMethod("card")}
                      type="button"
                    >
                      {t("checkout.cardMethod")}
                    </button>
                  </div>

                  {isPayPalLoading ? <p className="payment-note">{t("checkout.loadingGateway")}</p> : null}
                  {payPalError ? <p className="payment-note payment-error">{payPalError}</p> : null}
                  {isCapturing ? <p className="payment-note">{t("checkout.processing")}</p> : null}
                  <p className="payment-security-note">{t("checkout.securityMessage")}</p>

                  <div className="checkout-method-panels">
                    <div className="checkout-method-panel active">
                      <p className="payment-note">
                        {activeMethod === "card" ? t("checkout.cardMethodHint") : t("checkout.paypalMethodHint")}
                      </p>
                      <div className={canSubmitPayment ? "paypal-buttons-stack" : "paypal-buttons-stack is-disabled"}>
                        <div className="paypal-buttons" ref={payPalButtonContainerRef} />
                        {!canSubmitPayment ? <div className="paypal-disabled-overlay">{t("checkout.completeFormFirst")}</div> : null}
                      </div>
                    </div>
                  </div>
                  <label className="checkout-consent">
                    <input checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} type="checkbox" />
                    <span>
                      {t("checkout.consentPrefix")}{" "}
                      <Link to="/terms-of-service">{t("footer.termsOfService")}</Link>{" "}
                      {t("checkout.and")}{" "}
                      <Link to="/refund-policy">{t("footer.refundPolicy")}</Link>
                    </span>
                  </label>
                  <TrustBadges compact />
                  <PaymentIconsRow />
                  <p className="payment-note checkout-payment-footer-note">{t("checkout.cardSupportNote")}</p>
                </div>
              </div>
            )}
          </article>

          <aside className="cart-summary checkout-summary">
            <h2>{t("checkout.orderSummary")}</h2>
            <div className="checkout-summary-list">
              {lines.map((line) => (
                <article className="checkout-summary-item" key={line.id}>
                  <SleepImage alt={line.product.name} className="checkout-summary-image" src={line.product.image} />
                  <div className="checkout-summary-body">
                    <p className="checkout-summary-name">{line.product.name}</p>
                    <p className="checkout-summary-meta">{`${t("cart.quantity")}: ${line.quantity}`}</p>
                    {line.product.selectedColor ? (
                      <p className="checkout-summary-meta">
                        {t("product.selectedColor")}: {line.product.selectedColor}
                      </p>
                    ) : null}
                  </div>
                  <p className="checkout-summary-line-total">
                    {formatPrice(Number(line.product.price || 0) * Number(line.quantity || 0), i18n.language)}
                  </p>
                </article>
              ))}
            </div>
            <div className="checkout-summary-total">
              <p>
                {t("checkout.subtotal")}: <strong>{formatPrice(total, i18n.language)}</strong>
              </p>
              <p>
                {t("cart.shipping")}: <strong>{t("cart.freeShipping")}</strong>
              </p>
              <p className="checkout-total-highlight">
                {t("cart.total")}: <strong>{formatPrice(total + shipping, i18n.language)}</strong>
              </p>
            </div>
            <Link className="btn btn-secondary btn-md" to="/cart">
              {t("checkout.backToCart")}
            </Link>
          </aside>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
