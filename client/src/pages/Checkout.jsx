import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import PaymentIconsRow from "../components/store/PaymentIconsRow";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  confirmEmail: "",
  phone: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "US"
};

const checkoutSteps = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Review" }
];

const paymentMethods = [
  { key: "card", label: "Visa / MasterCard", hint: "Pay with your debit or credit card through PayPal." },
  { key: "paypal", label: "PayPal", hint: "Pay quickly with your PayPal account." },
  {
    key: "googlepay",
    label: "Google Pay",
    hint: "Requires PayPal Google Pay activation on your merchant account.",
    unavailable: true
  },
  { key: "klarna", label: "Klarna", hint: "Available through PayPal Pay Later where eligible." }
];

function buildInitialCheckoutForm(savedForm, user) {
  const legacyFullName = String(savedForm?.fullName || "").trim();
  const [legacyFirstName = "", ...legacyLastNameParts] = legacyFullName.split(" ").filter(Boolean);
  const email = String(savedForm?.email || user?.email || "");
  return {
    firstName: String(savedForm?.firstName || legacyFirstName || user?.first_name || ""),
    lastName: String(savedForm?.lastName || legacyLastNameParts.join(" ") || user?.last_name || ""),
    email,
    confirmEmail: String(savedForm?.confirmEmail || email),
    phone: String(savedForm?.phone || user?.phone_e164 || ""),
    address: String(savedForm?.address || ""),
    address2: String(savedForm?.address2 || ""),
    city: String(savedForm?.city || ""),
    state: String(savedForm?.state || ""),
    zip: String(savedForm?.zip || ""),
    country: String(savedForm?.country || "US")
  };
}

function normalizePhoneInput(value) {
  return String(value || "").replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

function normalizeZipInput(value) {
  return String(value || "").replace(/[^\dA-Za-z -]/g, "").slice(0, 12);
}

function buildValidationErrors(form) {
  const email = String(form?.email || "").trim();
  return {
    firstName: String(form?.firstName || "").trim() ? "" : "First name is required.",
    lastName: String(form?.lastName || "").trim() ? "" : "Last name is required.",
    email: email.includes("@") ? "" : "Valid email is required.",
    confirmEmail: String(form?.confirmEmail || "").trim() === email ? "" : "Email confirmation does not match.",
    phone: String(form?.phone || "").trim() ? "" : "Phone is required.",
    address: String(form?.address || "").trim() ? "" : "Street address is required.",
    city: String(form?.city || "").trim() ? "" : "City is required.",
    zip: String(form?.zip || "").trim() ? "" : "Postal code is required.",
    country: String(form?.country || "").trim() ? "" : "Country is required."
  };
}

function isCheckoutFormValid(form) {
  return Object.values(buildValidationErrors(form)).every((value) => !value);
}

function getStepIndex(step) {
  const normalized = String(step || "shipping").toLowerCase();
  const found = checkoutSteps.findIndex((item) => item.key === normalized);
  return found >= 0 ? found : 0;
}

function resolveFundingSource(paypal, method) {
  if (!paypal?.FUNDING) return null;
  if (method === "card") return paypal.FUNDING.CARD;
  if (method === "paypal") return paypal.FUNDING.PAYPAL;
  if (method === "klarna") return paypal.FUNDING.PAYLATER;
  return null;
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [activeStep, setActiveStep] = useState(0);
  const [touched, setTouched] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const payPalButtonContainerRef = useRef(null);

  useEffect(() => {
    document.title = t("meta.checkout");
  }, [t, i18n.language]);

  useEffect(() => {
    if (!user) return;
    setForm((current) => {
      const email = current.email || String(user?.email || "");
      return {
        ...current,
        firstName: current.firstName || String(user?.first_name || ""),
        lastName: current.lastName || String(user?.last_name || ""),
        email,
        confirmEmail: current.confirmEmail || email,
        phone: current.phone || String(user?.phone_e164 || "")
      };
    });
  }, [user]);

  useEffect(() => {
    const method = String(searchParams.get("method") || "").toLowerCase();
    const step = String(searchParams.get("step") || "").toLowerCase();
    const availableMethod = paymentMethods.find((item) => item.key === method && !item.unavailable);
    if (availableMethod) {
      setSelectedMethod(availableMethod.key);
    }
    if (step) {
      setActiveStep(getStepIndex(step));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const subtotal = useMemo(() => calculateCartTotal(lines), [lines]);
  const shipping = 0;
  const total = subtotal + shipping;
  const validationErrors = useMemo(() => buildValidationErrors(form), [form]);
  const isShippingValid = useMemo(() => isCheckoutFormValid(form), [form]);
  const canPay = useMemo(() => lines.length > 0 && isShippingValid && termsAccepted, [isShippingValid, lines.length, termsAccepted]);
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
        setPayPalError(String(error?.message || "PayPal is currently unavailable."));
      } finally {
        if (active) setIsPayPalLoading(false);
      }
    }

    loadClientConfig();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let canceled = false;

    async function renderPayPalButtons() {
      if (activeStep !== 2 || !payPalClientId || !payPalButtonContainerRef.current || !lines.length) return;
      setPayPalError("");

      if (selectedMethod === "googlepay") {
        payPalButtonContainerRef.current.innerHTML = "";
        setPayPalError("Google Pay requires PayPal merchant activation. Use PayPal or card for now.");
        return;
      }

      try {
        const paypal = await loadPayPalSdk(payPalClientId, payPalCurrency);
        if (canceled || !paypal?.Buttons || !payPalButtonContainerRef.current) return;
        const buttonContainer = payPalButtonContainerRef.current;
        buttonContainer.innerHTML = "";

        const fundingSource = resolveFundingSource(paypal, selectedMethod);
        if (!fundingSource) {
          setPayPalError("This payment method is not available in the current checkout configuration.");
          return;
        }

        const paymentButton = paypal.Buttons({
          fundingSource,
          style: {
            shape: "pill",
            label: selectedMethod === "card" ? "pay" : "paypal",
            layout: "vertical",
            height: 52,
            tagline: false
          },
          onClick: (_data, actions) => {
            if (!canPay) {
              setTouched({
                firstName: true,
                lastName: true,
                email: true,
                confirmEmail: true,
                phone: true,
                address: true,
                city: true,
                zip: true,
                country: true
              });
              if (!termsAccepted) {
                showToast("Please accept terms before paying.");
              } else {
                showToast("Please complete all shipping fields before paying.");
              }
              return actions.reject();
            }
            return actions.resolve();
          },
          createOrder: async () => {
            const response = await createPayPalCheckoutOrder({
              customer: {
                name: `${String(form.firstName || "").trim()} ${String(form.lastName || "").trim()}`.trim(),
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                address: [form.address, form.address2].filter(Boolean).join(", "),
                city: form.city,
                state: form.state || form.city,
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
              const safeMessage = /fetch|network/i.test(message) ? "Network issue during payment." : "Payment failed. Please try again.";
              setPayPalError(safeMessage);
              showToast(safeMessage);
            } finally {
              setIsCapturing(false);
            }
          },
          onCancel: () => navigate("/checkout/cancel"),
          onError: (error) => {
            const message = String(error?.message || "");
            const safeMessage = /fetch|network/i.test(message) ? "Network issue during payment." : "Payment failed. Please try again.";
            setPayPalError(safeMessage);
            showToast(safeMessage);
          }
        });

        if (!paymentButton?.isEligible?.()) {
          const unavailableLabel = paymentMethods.find((item) => item.key === selectedMethod)?.label || "Selected method";
          setPayPalError(`${unavailableLabel} is not eligible for this PayPal account or buyer country.`);
          return;
        }

        await paymentButton.render(buttonContainer);
      } catch (error) {
        if (!canceled) {
          setPayPalError(String(error?.message || "Unable to load payment buttons."));
        }
      }
    }

    renderPayPalButtons();
    return () => {
      canceled = true;
    };
  }, [
    activeStep,
    canPay,
    clearCart,
    form,
    lines,
    linesSignature,
    navigate,
    payPalClientId,
    payPalCurrency,
    selectedMethod,
    showToast,
    termsAccepted
  ]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function setTouchedField(field) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function renderFieldError(field) {
    const message = validationErrors[field];
    if (!touched[field] || !message) return null;
    return <small className="field-error">{message}</small>;
  }

  function goToPaymentStep() {
    if (!isShippingValid) {
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        confirmEmail: true,
        phone: true,
        address: true,
        city: true,
        zip: true,
        country: true
      });
      showToast("Please complete all shipping fields.");
      return;
    }
    setActiveStep(1);
  }

  function goToReviewStep() {
    if (!isShippingValid) {
      showToast("Complete shipping details first.");
      setActiveStep(0);
      return;
    }
    setActiveStep(2);
  }

  return (
    <SiteLayout>
      <section className="checkout-page">
        <Container>
          {!lines.length ? (
            <div className="empty-state">
              <h1>{t("checkout.title", { defaultValue: "Checkout" })}</h1>
              <p>{t("cart.empty")}</p>
              <Link className="btn btn-secondary btn-md" to="/products">
                {t("cart.continue")}
              </Link>
            </div>
          ) : (
            <div className="checkout-layout">
              <article className="checkout-main-panel">
                <header className="checkout-stepper">
                  {checkoutSteps.map((step, index) => (
                    <div className={index <= activeStep ? "checkout-step active" : "checkout-step"} key={step.key}>
                      <span className="checkout-step-dot">{index + 1}</span>
                      <span>{step.label}</span>
                    </div>
                  ))}
                </header>

                {activeStep === 0 ? (
                  <section className="checkout-section">
                    <h1>{t("checkout.title", { defaultValue: "Checkout" })}</h1>
                    <p>{t("checkout.subtitle", { defaultValue: "Enter your shipping details." })}</p>

                    <div className="checkout-form-grid">
                      <label>
                        <span>{t("checkout.email", { defaultValue: "Email" })}</span>
                        <input
                          onBlur={() => setTouchedField("email")}
                          onChange={(event) => setField("email", event.target.value)}
                          type="email"
                          value={form.email}
                        />
                        {renderFieldError("email")}
                      </label>

                      <label>
                        <span>Confirm email</span>
                        <input
                          onBlur={() => setTouchedField("confirmEmail")}
                          onChange={(event) => setField("confirmEmail", event.target.value)}
                          type="email"
                          value={form.confirmEmail}
                        />
                        {renderFieldError("confirmEmail")}
                      </label>

                      <label>
                        <span>{t("auth.firstName", { defaultValue: "First name" })}</span>
                        <input
                          onBlur={() => setTouchedField("firstName")}
                          onChange={(event) => setField("firstName", event.target.value)}
                          value={form.firstName}
                        />
                        {renderFieldError("firstName")}
                      </label>

                      <label>
                        <span>{t("auth.lastName", { defaultValue: "Last name" })}</span>
                        <input
                          onBlur={() => setTouchedField("lastName")}
                          onChange={(event) => setField("lastName", event.target.value)}
                          value={form.lastName}
                        />
                        {renderFieldError("lastName")}
                      </label>

                      <label>
                        <span>{t("checkout.country", { defaultValue: "Country" })}</span>
                        <input
                          onBlur={() => setTouchedField("country")}
                          onChange={(event) => setField("country", event.target.value)}
                          value={form.country}
                        />
                        {renderFieldError("country")}
                      </label>

                      <label>
                        <span>{t("checkout.phone", { defaultValue: "Phone number" })}</span>
                        <input
                          inputMode="tel"
                          onBlur={() => setTouchedField("phone")}
                          onChange={(event) => setField("phone", normalizePhoneInput(event.target.value))}
                          value={form.phone}
                        />
                        {renderFieldError("phone")}
                      </label>

                      <label>
                        <span>{t("checkout.address", { defaultValue: "Street address" })}</span>
                        <input
                          onBlur={() => setTouchedField("address")}
                          onChange={(event) => setField("address", event.target.value)}
                          value={form.address}
                        />
                        {renderFieldError("address")}
                      </label>

                      <label>
                        <span>Apt / Suite / Other (optional)</span>
                        <input onChange={(event) => setField("address2", event.target.value)} value={form.address2} />
                      </label>

                      <label>
                        <span>{t("checkout.city", { defaultValue: "City" })}</span>
                        <input
                          onBlur={() => setTouchedField("city")}
                          onChange={(event) => setField("city", event.target.value)}
                          value={form.city}
                        />
                        {renderFieldError("city")}
                      </label>

                      <label>
                        <span>{t("checkout.zip", { defaultValue: "Postal code" })}</span>
                        <input
                          onBlur={() => setTouchedField("zip")}
                          onChange={(event) => setField("zip", normalizeZipInput(event.target.value))}
                          value={form.zip}
                        />
                        {renderFieldError("zip")}
                      </label>
                    </div>

                    <div className="checkout-step-actions">
                      <button className="btn btn-primary btn-lg" onClick={goToPaymentStep} type="button">
                        Continue to payment
                      </button>
                    </div>
                  </section>
                ) : null}

                {activeStep === 1 ? (
                  <section className="checkout-section">
                    <h1>Choose a payment method</h1>
                    <div className="checkout-payment-methods">
                      {paymentMethods.map((method) => (
                        <button
                          className={selectedMethod === method.key ? "checkout-payment-choice active" : "checkout-payment-choice"}
                          key={method.key}
                          onClick={() => setSelectedMethod(method.key)}
                          type="button"
                        >
                          <span>{method.label}</span>
                          <small>{method.hint}</small>
                        </button>
                      ))}
                    </div>

                    <PaymentIconsRow />

                    {selectedMethod === "googlepay" ? (
                      <p className="payment-note payment-error">
                        Google Pay requires activation from PayPal merchant settings before it can process live payments.
                      </p>
                    ) : null}

                    <div className="checkout-step-actions">
                      <button className="btn btn-secondary btn-md" onClick={() => setActiveStep(0)} type="button">
                        Back
                      </button>
                      <button className="btn btn-primary btn-md" onClick={goToReviewStep} type="button">
                        Review your order
                      </button>
                    </div>
                  </section>
                ) : null}

                {activeStep === 2 ? (
                  <section className="checkout-section">
                    <h1>Review and pay</h1>
                    <p>
                      Selected method: <strong>{paymentMethods.find((item) => item.key === selectedMethod)?.label || "PayPal"}</strong>
                    </p>

                    <div className="checkout-review-box">
                      <p>
                        <strong>Ship to:</strong>{" "}
                        {`${form.firstName} ${form.lastName}, ${form.address}${form.address2 ? `, ${form.address2}` : ""}, ${form.city}, ${form.country}`}
                      </p>
                      <p>
                        <strong>Email:</strong> {form.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {form.phone}
                      </p>
                    </div>

                    <label className="checkout-consent">
                      <input checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} type="checkbox" />
                      <span>
                        I agree to <Link to="/terms-of-service">Terms of Service</Link> and <Link to="/refund-policy">Refund Policy</Link>.
                      </span>
                    </label>

                    {isPayPalLoading ? <p className="payment-note">Loading secure payment gateway...</p> : null}
                    {isCapturing ? <p className="payment-note">Processing payment...</p> : null}
                    {payPalError ? <p className="payment-note payment-error">{payPalError}</p> : null}

                    <div className={canPay ? "paypal-buttons-stack" : "paypal-buttons-stack is-disabled"}>
                      <div className="paypal-buttons" ref={payPalButtonContainerRef} />
                      {!canPay ? <div className="paypal-disabled-overlay">Complete shipping fields and accept terms first.</div> : null}
                    </div>

                    <div className="checkout-step-actions">
                      <button className="btn btn-secondary btn-md" onClick={() => setActiveStep(1)} type="button">
                        Back
                      </button>
                    </div>
                  </section>
                ) : null}
              </article>

              <aside className="checkout-summary-panel">
                <h2>{t("checkout.orderSummary", { defaultValue: "Order summary" })}</h2>
                <div className="checkout-summary-list">
                  {lines.map((line) => (
                    <article className="checkout-summary-item" key={line.id}>
                      <SleepImage alt={line.product.name} className="checkout-summary-image" src={line.product.image} />
                      <div className="checkout-summary-body">
                        <p className="checkout-summary-name">{line.product.name}</p>
                        <p className="checkout-summary-meta">{`Qty: ${line.quantity}`}</p>
                        {line.product.selectedColor ? <p className="checkout-summary-meta">{`Color: ${line.product.selectedColor}`}</p> : null}
                      </div>
                      <p className="checkout-summary-line-total">
                        {formatPrice(Number(line.product.price || 0) * Number(line.quantity || 0), i18n.language)}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="checkout-summary-total">
                  <p>
                    Subtotal: <strong>{formatPrice(subtotal, i18n.language)}</strong>
                  </p>
                  <p>
                    Shipping: <strong>{shipping ? formatPrice(shipping, i18n.language) : "FREE"}</strong>
                  </p>
                  <p className="checkout-total-highlight">
                    Total: <strong>{formatPrice(total, i18n.language)}</strong>
                  </p>
                </div>

                <Link className="btn btn-ghost btn-md" to="/cart">
                  {t("checkout.backToCart", { defaultValue: "Back to cart" })}
                </Link>
              </aside>
            </div>
          )}
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
