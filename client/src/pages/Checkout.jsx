import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import useCart from "../hooks/useCart";
import useToast from "../hooks/useToast";
import useLocalStorage from "../hooks/useLocalStorage";
import Toast from "../components/Toast";
import {
  CART_STORAGE_KEY,
  CHECKOUT_FORM_STORAGE_KEY,
  LAST_SUCCESS_ORDER_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
  writeStorageValue
} from "../lib/storage";
import { buildCartLines, calculateCartTotal } from "../lib/cart";
import { fetchCatalog } from "../lib/catalog";
import {
  capturePayPalCheckoutOrder,
  createPayPalCheckoutOrder,
  fetchPayPalClientConfig,
  loadPayPalSdk
} from "../lib/paypal";
import PaymentIconsRow from "../components/store/PaymentIconsRow";
import { useLanguage } from "../context/LanguageContext";

const initialForm = {
  email: "",
  confirmEmail: "",
  country: "Morocco",
  fullName: "",
  address: "",
  address2: "",
  zip: "",
  city: "",
  phone: ""
};

const initialCardForm = {
  nameOnCard: "",
  billingSame: true,
  hostedFieldsValid: false
};

function normalizePhone(value) {
  return String(value || "").replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

function toCountryCode(country) {
  const normalized = String(country || "").trim().toUpperCase();
  if (normalized.length === 2) return normalized;
  if (normalized === "MOROCCO" || normalized === "MAROC") return "MA";
  if (normalized === "UNITED STATES" || normalized === "USA") return "US";
  return "US";
}

function buildInitialCheckoutForm(savedForm, user) {
  const email = String(savedForm?.email || user?.email || "");
  const fullName = String(savedForm?.fullName || `${user?.first_name || ""} ${user?.last_name || ""}`.trim());

  return {
    email,
    confirmEmail: String(savedForm?.confirmEmail || email),
    country: String(savedForm?.country || "Morocco"),
    fullName,
    address: String(savedForm?.address || ""),
    address2: String(savedForm?.address2 || ""),
    zip: String(savedForm?.zip || ""),
    city: String(savedForm?.city || ""),
    phone: String(savedForm?.phone || user?.phone_e164 || "")
  };
}

function shippingErrors(form, t) {
  const email = String(form.email || "").trim();
  return {
    email: email.includes("@") ? "" : t("checkout.validation.emailRequired", { defaultValue: "Email is required." }),
    confirmEmail: String(form.confirmEmail || "").trim() === email ? "" : t("checkout.validation.confirmEmail", { defaultValue: "Confirm email must match." }),
    country: String(form.country || "").trim() ? "" : t("checkout.validation.countryRequired", { defaultValue: "Country is required." }),
    fullName: String(form.fullName || "").trim() ? "" : t("checkout.validation.fullNameRequired", { defaultValue: "Full name is required." }),
    address: String(form.address || "").trim() ? "" : t("checkout.validation.addressRequired", { defaultValue: "Street address is required." }),
    city: String(form.city || "").trim() ? "" : t("checkout.validation.cityRequired", { defaultValue: "City is required." }),
    phone: ""
  };
}

function cardErrors(cardForm, t) {
  return {
    cardFields: cardForm.hostedFieldsValid ? "" : t("checkout.validation.cardFields", { defaultValue: "Card details are incomplete." }),
    nameOnCard: String(cardForm.nameOnCard || "").trim() ? "" : t("checkout.validation.nameOnCard", { defaultValue: "Name on card is required." })
  };
}

function isValid(errors) {
  return Object.values(errors).every((value) => !value);
}

function getStepState(index, activeStep) {
  if (index < activeStep) return "completed";
  if (index === activeStep) return "current";
  return "upcoming";
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { effectiveCurrency, formatMoney } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, clearCart } = useCart(CART_STORAGE_KEY);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const [savedForm] = useLocalStorage(CHECKOUT_FORM_STORAGE_KEY, initialForm);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(() => buildInitialCheckoutForm(savedForm, user));
  const [cardForm, setCardForm] = useState(initialCardForm);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [touchedShipping, setTouchedShipping] = useState({});
  const [touchedCard, setTouchedCard] = useState({});
  const [toastMessage, showToast] = useToast(2600);
  const [paypalConfig, setPayPalConfig] = useState({
    clientId: "",
    currency: "USD",
    clientToken: "",
    cardFieldsEligible: false,
    cardFieldsError: ""
  });
  const [isPayPalSdkLoading, setIsPayPalSdkLoading] = useState(false);
  const [cardFieldsReady, setCardFieldsReady] = useState(false);
  const [cardBrandLabel, setCardBrandLabel] = useState("");
  const [cardEligibilityError, setCardEligibilityError] = useState("");
  const cardFieldsRef = useRef(null);
  const cardFieldInstancesRef = useRef([]);
  const checkoutSnapshotRef = useRef({
    form,
    lines: [],
    currency: effectiveCurrency
  });

  useEffect(() => {
    document.title = t("meta.checkout");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  useEffect(() => {
    const method = String(searchParams.get("method") || "").toLowerCase();
    const step = String(searchParams.get("step") || "").toLowerCase();
    if (method === "paypal" || method === "card") setSelectedMethod(method);
    if (step === "payment") setActiveStep(1);
    if (step === "review") setActiveStep(2);
  }, [searchParams]);

  useEffect(() => {
    writeStorageValue(CHECKOUT_FORM_STORAGE_KEY, form);
  }, [form]);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const subtotal = useMemo(() => calculateCartTotal(lines), [lines]);
  const discount = subtotal > 0 ? Number((subtotal * 0.18).toFixed(2)) : 0;
  const shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const shippingValidation = useMemo(() => shippingErrors(form, t), [form, t]);
  const cardValidation = useMemo(() => cardErrors(cardForm, t), [cardForm, t]);
  const stepLabels = useMemo(
    () => [
      t("checkout.stepShipping", { defaultValue: "Shipping" }),
      t("checkout.stepPayment", { defaultValue: "Payment" }),
      t("checkout.stepReview", { defaultValue: "Review" })
    ],
    [t]
  );
  const itemLabel = lines.length > 1 ? t("cart.itemsLabel", { defaultValue: "items" }) : t("cart.itemLabel", { defaultValue: "item" });
  const totalWithCountLabel = t("cart.totalWithCount", {
    count: lines.length,
    countLabel: itemLabel,
    defaultValue: "Total ({{count}} {{countLabel}})"
  });
  const cardMethodDisabled = Boolean(cardEligibilityError || (paypalConfig.clientId && !paypalConfig.cardFieldsEligible));
  const cardMethodHelpText = cardMethodDisabled
    ? cardEligibilityError ||
      t("checkout.cardFieldsUnavailable", {
        defaultValue: "Direct card payments are not enabled for this PayPal app/account in the current mode."
      })
    : t("checkout.cardDirectFlow", { defaultValue: "Enter Visa or MasterCard details securely without leaving Sleepora." });

  useEffect(() => {
    checkoutSnapshotRef.current = {
      form,
      lines,
      currency: effectiveCurrency
    };
  }, [effectiveCurrency, form, lines]);

  useEffect(() => () => resetCardFieldRuntime(), []);

  useEffect(() => {
    if (selectedMethod !== "card") {
      resetCardFieldRuntime();
    }
  }, [selectedMethod]);

  useEffect(() => {
    if (!cardMethodDisabled) return;
    if (selectedMethod === "card") {
      setSelectedMethod("paypal");
    }
  }, [cardMethodDisabled, selectedMethod]);

  function markCardFieldsTouched() {
    setTouchedCard({
      cardFields: true,
      nameOnCard: true
    });
  }

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function setCardField(field, value) {
    setCardForm((current) => ({ ...current, [field]: value }));
  }

  function showShippingError(field) {
    return touchedShipping[field] && shippingValidation[field] ? <small className="field-error">{shippingValidation[field]}</small> : null;
  }

  function showCardError(field) {
    return touchedCard[field] && cardValidation[field] ? <small className="field-error">{cardValidation[field]}</small> : null;
  }

  function hasCardError(field) {
    return Boolean(touchedCard[field] && cardValidation[field]);
  }

  function toCustomerPayload(currentForm = form) {
    const fullName = String(currentForm.fullName || "").trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || "Customer";
    const lastName = parts.slice(1).join(" ") || "Customer";
    return {
      name: fullName || `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: currentForm.email,
      phone: currentForm.phone,
      address: [currentForm.address, currentForm.address2].filter(Boolean).join(", "),
      city: currentForm.city,
      state: currentForm.city,
      zip: currentForm.zip,
      country: currentForm.country
    };
  }

  function toCheckoutItems(currentLines = lines) {
    return currentLines.map((line) => ({
      id: line.productId || line.id,
      quantity: line.quantity
    }));
  }

  function resetCardFieldRuntime() {
    cardFieldsRef.current = null;
    cardFieldInstancesRef.current.forEach((field) => {
      if (typeof field?.close === "function") {
        field.close();
        return;
      }
      if (typeof field?.destroy === "function") {
        field.destroy();
      }
    });
    cardFieldInstancesRef.current = [];
    setCardFieldsReady(false);
    setCardBrandLabel("");
    setCardForm((current) => ({ ...current, hostedFieldsValid: false }));
  }

  function focusHostedField(containerId) {
    window.requestAnimationFrame(() => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const fieldInstance = cardFieldInstancesRef.current.find((item) => item?.containerId === containerId)?.instance;
      if (typeof fieldInstance?.focus === "function") {
        fieldInstance.focus();
        return;
      }

      const iframe = container.querySelector("iframe");
      if (typeof iframe?.focus === "function") {
        iframe.focus();
      }
    });
  }

  function attachHostedFieldInteractions(containerId) {
    const container = document.getElementById(containerId);
    if (!container || container.dataset.bindReady === "true") return;

    const forwardFocus = (event) => {
      if (event.type === "pointerdown" || event.type === "touchstart" || event.type === "mousedown") {
        event.preventDefault();
      }
      focusHostedField(containerId);
    };

    container.dataset.bindReady = "true";
    container.addEventListener("pointerdown", forwardFocus);
    container.addEventListener("touchstart", forwardFocus, { passive: false });
    container.addEventListener("mousedown", forwardFocus);
  }

  async function createDirectCardOrder() {
    const current = checkoutSnapshotRef.current;
    const response = await createPayPalCheckoutOrder({
      customer: toCustomerPayload(current.form),
      items: toCheckoutItems(current.lines),
      currency: current.currency,
      payment_source: {
        card: {
          attributes: {
            verification: {
              method: "SCA_WHEN_REQUIRED"
            }
          }
        }
      }
    });

    const orderId = String(response?.orderId || "").trim();
    if (!orderId) {
      throw new Error(t("checkout.paymentStartError", { defaultValue: "Unable to start secure payment." }));
    }

    return orderId;
  }

  async function finalizeApprovedOrder(orderId) {
    const result = await capturePayPalCheckoutOrder(orderId);
    writeStorageValue(LAST_SUCCESS_ORDER_STORAGE_KEY, result);
    clearCart();
    navigate("/checkout/success", { replace: true, state: { order: result } });
  }

  useEffect(() => {
    let active = true;

    async function loadClientConfig() {
      if (selectedMethod !== "card" || paypalConfig.clientId) return;

      try {
        const config = await fetchPayPalClientConfig();
        if (!active) return;
        setPayPalConfig({
          clientId: String(config?.clientId || "").trim(),
          currency: String(config?.currency || "USD").trim().toUpperCase(),
          clientToken: String(config?.clientToken || "").trim(),
          cardFieldsEligible: Boolean(config?.cardFieldsEligible),
          cardFieldsError: String(config?.cardFieldsError || "").trim()
        });
        if (config?.cardFieldsError) {
          setCardEligibilityError(String(config.cardFieldsError));
        }
      } catch (error) {
        if (!active) return;
        setCardEligibilityError(String(error?.message || t("checkout.cardFieldsUnavailable", { defaultValue: "Card payments are unavailable right now." })));
      }
    }

    loadClientConfig();
    return () => {
      active = false;
    };
  }, [selectedMethod, paypalConfig.clientId, t]);

  useEffect(() => {
    let active = true;

    async function mountHostedFields() {
      if (selectedMethod !== "card" || cardMethodDisabled || activeStep < 1) return;
      if (activeStep !== 1 && cardFieldsRef.current) return;
      if (!paypalConfig.clientId || !paypalConfig.clientToken) return;

      const numberSelector = "#paypal-card-number-field";
      const expirySelector = "#paypal-card-expiry-field";
      const cvvSelector = "#paypal-card-cvv-field";
      const numberContainer = document.querySelector(numberSelector);
      const expiryContainer = document.querySelector(expirySelector);
      const cvvContainer = document.querySelector(cvvSelector);
      if (!numberContainer || !expiryContainer || !cvvContainer) return;

      setIsPayPalSdkLoading(true);
      setCardEligibilityError("");

      try {
        if (!cardFieldsRef.current || activeStep === 1) {
          resetCardFieldRuntime();
        }
        const paypal = await loadPayPalSdk(paypalConfig.clientId, effectiveCurrency, paypalConfig.clientToken);
        if (!active) return;
        if (!paypal?.CardFields) {
          throw new Error(t("checkout.cardFieldsUnavailable", { defaultValue: "Card payments are unavailable right now." }));
        }

        const cardFields = paypal.CardFields({
          style: {
            input: {
              "font-size": "16px",
              color: "#111827",
              "font-family": "Sora, system-ui, sans-serif"
            },
            ".invalid": {
              color: "#b42318"
            },
            "::placeholder": {
              color: "#6b7280"
            }
          },
          createOrder: createDirectCardOrder,
          onApprove: async (data) => {
            try {
              await finalizeApprovedOrder(data?.orderID);
            } catch (error) {
              const message = String(error?.message || t("checkout.captureFailed", { defaultValue: "Card payment capture failed." }));
              setErrorMessage(message);
              showToast(message);
              setIsSubmitting(false);
            }
          },
          onError: (error) => {
            const message = String(error?.message || t("checkout.cardSubmitFailed", { defaultValue: "Card payment failed." }));
            setErrorMessage(message);
            showToast(message);
            setIsSubmitting(false);
          },
          inputEvents: {
            onChange: (event) => {
              const brand = String(event?.cards?.[0]?.niceType || event?.cards?.[0]?.type || "").trim();
              setCardBrandLabel(brand);
              setCardForm((current) => ({
                ...current,
                hostedFieldsValid: Boolean(event?.isFormValid)
              }));
            }
          }
        });

        if (!cardFields?.isEligible?.()) {
          throw new Error(
            paypalConfig.cardFieldsError ||
              t("checkout.cardFieldsUnavailable", {
                defaultValue: "Direct card payments are not enabled for this PayPal account."
              })
          );
        }

        const numberField = cardFields.NumberField({
          placeholder: "4111 1111 1111 1111"
        });
        const expiryField = cardFields.ExpiryField({
          placeholder: "MM/YY"
        });
        const cvvField = cardFields.CVVField({
          placeholder: "123"
        });

        await Promise.all([
          numberField.render(numberSelector),
          expiryField.render(expirySelector),
          cvvField.render(cvvSelector)
        ]);

        if (!active) return;
        cardFieldsRef.current = cardFields;
        cardFieldInstancesRef.current = [
          { containerId: "paypal-card-number-field", instance: numberField },
          { containerId: "paypal-card-expiry-field", instance: expiryField },
          { containerId: "paypal-card-cvv-field", instance: cvvField }
        ];
        attachHostedFieldInteractions("paypal-card-number-field");
        attachHostedFieldInteractions("paypal-card-expiry-field");
        attachHostedFieldInteractions("paypal-card-cvv-field");
        setCardFieldsReady(true);
      } catch (error) {
        if (!active) return;
        const message = String(error?.message || t("checkout.cardFieldsUnavailable", { defaultValue: "Card payments are unavailable right now." }));
        setCardEligibilityError(message);
        setErrorMessage(message);
      } finally {
        if (active) setIsPayPalSdkLoading(false);
      }
    }

    mountHostedFields();
    return () => {
      active = false;
    };
  }, [
    activeStep,
    effectiveCurrency,
    paypalConfig.cardFieldsError,
    paypalConfig.clientId,
    paypalConfig.clientToken,
    cardMethodDisabled,
    selectedMethod,
    showToast,
    t
  ]);

  useEffect(() => {
    if (selectedMethod !== "card" || activeStep !== 1 || !cardFieldsReady) return;

    const containerIds = ["paypal-card-number-field", "paypal-card-expiry-field", "paypal-card-cvv-field"];

    function patchHostedFieldFrames() {
      containerIds.forEach((containerId) => {
        const container = document.getElementById(containerId);
        const iframe = container?.querySelector("iframe");
        if (!container || !iframe) return;

        container.dataset.ready = "true";
        iframe.setAttribute("tabindex", "0");
        iframe.style.pointerEvents = "auto";
        iframe.style.display = "block";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.minHeight = "26px";
        attachHostedFieldInteractions(containerId);
      });
    }

    patchHostedFieldFrames();
    const timer = window.setTimeout(patchHostedFieldFrames, 240);
    return () => window.clearTimeout(timer);
  }, [activeStep, cardFieldsReady, selectedMethod]);

  async function redirectToPayPal() {
    if (!lines.length) return;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createPayPalCheckoutOrder({
        customer: toCustomerPayload(),
        items: toCheckoutItems(),
        currency: effectiveCurrency
      });

      const approveUrl = String(response?.approveUrl || "");
      if (!approveUrl) {
        throw new Error(t("checkout.paymentStartError", { defaultValue: "Missing PayPal approval URL." }));
      }

      window.location.assign(approveUrl);
    } catch (error) {
      const message = String(error?.message || t("checkout.paymentStartError", { defaultValue: "Unable to start secure payment." }));
      setErrorMessage(message);
      showToast(message);
      setIsSubmitting(false);
    }
  }

  async function submitHostedCardPayment() {
    markCardFieldsTouched();

    if (!cardFieldsRef.current || !cardFieldsReady) {
      const message = cardEligibilityError || t("checkout.cardFieldsUnavailable", { defaultValue: "Card payments are unavailable right now." });
      setErrorMessage(message);
      showToast(message);
      return;
    }

    if (!isValid(cardValidation)) {
      const message = t("checkout.completeBeforePay", { defaultValue: "Please complete card details before paying." });
      setErrorMessage(message);
      showToast(message);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await cardFieldsRef.current.submit({
        cardholderName: String(cardForm.nameOnCard || "").trim(),
        billingAddress: {
          addressLine1: String(form.address || "").trim(),
          addressLine2: String(form.address2 || "").trim(),
          adminArea1: String(form.city || "").trim(),
          adminArea2: String(form.city || "").trim(),
          postalCode: String(form.zip || "").trim(),
          countryCode: toCountryCode(form.country)
        }
      });
    } catch (error) {
      const message = String(error?.message || t("checkout.cardSubmitFailed", { defaultValue: "Card payment failed." }));
      setErrorMessage(message);
      showToast(message);
      setIsSubmitting(false);
    }
  }

  async function handleContinueFromPayment() {
    if (selectedMethod === "paypal") {
      await redirectToPayPal();
      return;
    }

    if (cardMethodDisabled) {
      const message = cardMethodHelpText;
      setErrorMessage(message);
      showToast(message);
      return;
    }

    markCardFieldsTouched();

    if (!isValid(cardValidation)) {
      showToast(t("checkout.completeCardDetails", { defaultValue: "Please complete card details." }));
      return;
    }

    setActiveStep(2);
  }

  async function handlePaySecurely() {
    if (selectedMethod !== "card") {
      const message = t("checkout.chooseCardFirst", { defaultValue: "Please choose card payment to continue from review." });
      setErrorMessage(message);
      showToast(message);
      setActiveStep(1);
      return;
    }

    markCardFieldsTouched();
    if (!isValid(cardValidation)) {
      const message = t("checkout.completeBeforePay", { defaultValue: "Please complete card details before paying." });
      setErrorMessage(message);
      showToast(message);
      setActiveStep(1);
      return;
    }
    await submitHostedCardPayment();
  }

  if (!lines.length) {
    return (
      <SiteLayout>
        <section className="checkout-page">
          <Container>
            <div className="empty-state">
              <h1>{t("checkout.title", { defaultValue: "Checkout" })}</h1>
              <p>{t("cart.empty")}</p>
              <Link className="btn btn-secondary btn-md" to="/products">
                {t("cart.continue")}
              </Link>
            </div>
          </Container>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="checkout-page">
        <Container>
          <div className="checkout-layout">
            <article className="checkout-main-panel">
              <header className="checkout-stepper">
                {stepLabels.map((label, index) => {
                  const state = getStepState(index, activeStep);
                  return (
                    <div aria-current={state === "current" ? "step" : undefined} className={`checkout-step ${state}`} key={label}>
                      <span aria-hidden="true" className={`checkout-step-dot ${state}`} />
                      <span className="checkout-step-label">{label}</span>
                    </div>
                  );
                })}
              </header>

              {activeStep === 0 ? (
                <section className="checkout-section">
                  <h1>{t("checkout.addressTitle", { defaultValue: "Enter an address" })}</h1>
                  <div className="checkout-form-grid">
                    <label>
                      <span>{t("auth.email")}*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, email: true }))} onChange={(e) => setField("email", e.target.value)} value={form.email} />
                      {showShippingError("email")}
                    </label>
                    <label>
                      <span>{t("checkout.confirmEmail", { defaultValue: "Confirm Email" })}*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, confirmEmail: true }))} onChange={(e) => setField("confirmEmail", e.target.value)} value={form.confirmEmail} />
                      {showShippingError("confirmEmail")}
                    </label>
                    <label>
                      <span>{t("checkout.country", { defaultValue: "Country" })}*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, country: true }))} onChange={(e) => setField("country", e.target.value)} value={form.country} />
                      {showShippingError("country")}
                    </label>
                    <label>
                      <span>{t("checkout.fullName", { defaultValue: "Full name" })}*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, fullName: true }))} onChange={(e) => setField("fullName", e.target.value)} value={form.fullName} />
                      {showShippingError("fullName")}
                    </label>
                    <label>
                      <span>{t("checkout.streetAddress", { defaultValue: "Street address" })}*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, address: true }))} onChange={(e) => setField("address", e.target.value)} value={form.address} />
                      {showShippingError("address")}
                    </label>
                    <label>
                      <span>{t("checkout.address2", { defaultValue: "Apt / Suite / Other (optional)" })}</span>
                      <input onChange={(e) => setField("address2", e.target.value)} value={form.address2} />
                    </label>
                    <label>
                      <span>{t("checkout.postalCode", { defaultValue: "Postal code (optional)" })}</span>
                      <input onChange={(e) => setField("zip", e.target.value)} value={form.zip} />
                    </label>
                    <label>
                      <span>{t("checkout.city", { defaultValue: "City" })}*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, city: true }))} onChange={(e) => setField("city", e.target.value)} value={form.city} />
                      {showShippingError("city")}
                    </label>
                    <label>
                      <span>{t("checkout.phoneOptional", { defaultValue: "Phone number (optional)" })}</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, phone: true }))} onChange={(e) => setField("phone", normalizePhone(e.target.value))} value={form.phone} />
                      {showShippingError("phone")}
                    </label>
                  </div>
                  <div className="checkout-step-actions">
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => {
                        setTouchedShipping({
                          email: true,
                          confirmEmail: true,
                          country: true,
                          fullName: true,
                          address: true,
                          city: true,
                          phone: false
                        });
                        if (!isValid(shippingValidation)) {
                          showToast(t("checkout.completeAddress", { defaultValue: "Please complete your address." }));
                          return;
                        }
                        setActiveStep(1);
                      }}
                      type="button"
                    >
                      {t("common.continueToPayment", { defaultValue: "Continue to payment" })}
                    </button>
                  </div>
                </section>
              ) : null}

              {activeStep >= 1 ? (
                <section className="checkout-section">
                  {activeStep === 1 ? <h1>{t("checkout.choosePaymentMethod", { defaultValue: "Choose a payment method" })}</h1> : null}
                  <div className={activeStep === 1 ? "checkout-payment-methods" : "checkout-payment-methods checkout-payment-methods-hidden"}>
                    <button
                      className={selectedMethod === "card" ? "checkout-payment-choice active" : "checkout-payment-choice"}
                      disabled={cardMethodDisabled}
                      onClick={() => setSelectedMethod("card")}
                      type="button"
                    >
                      <span className="checkout-payment-choice-title">{t("checkout.cardOption", { defaultValue: "Pay with a card" })}</span>
                      <div className="checkout-payment-choice-visual">
                        <PaymentIconsRow className="checkout-inline-logos checkout-inline-logos-large" logos={["visa", "mastercard"]} />
                      </div>
                      <small>{cardMethodHelpText}</small>
                    </button>
                    <button className={selectedMethod === "paypal" ? "checkout-payment-choice active" : "checkout-payment-choice"} onClick={() => setSelectedMethod("paypal")} type="button">
                      <span className="checkout-payment-choice-title">PayPal</span>
                      <div className="checkout-payment-choice-visual">
                        <PaymentIconsRow className="checkout-inline-logos checkout-inline-logos-large checkout-inline-logos-paypal" logos={["paypal"]} />
                      </div>
                      <small>{t("checkout.paypalRedirect", { defaultValue: "Redirect to PayPal secure page" })}</small>
                    </button>
                  </div>

                  {selectedMethod === "card" && !cardMethodDisabled ? (
                    <div className={activeStep === 1 ? "checkout-card-fields" : "checkout-card-fields checkout-card-fields-preserved"} aria-hidden={activeStep !== 1}>
                      <label>
                        <span>{t("checkout.cardNumber", { defaultValue: "Card number" })}*</span>
                        <div
                          className={hasCardError("cardFields") ? "paypal-card-hosted-field is-invalid" : "paypal-card-hosted-field"}
                          id="paypal-card-number-field"
                          onClick={() => focusHostedField("paypal-card-number-field")}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            focusHostedField("paypal-card-number-field");
                          }}
                          onPointerDown={(event) => {
                            event.preventDefault();
                            focusHostedField("paypal-card-number-field");
                          }}
                          onTouchStart={() => focusHostedField("paypal-card-number-field")}
                          role="button"
                          tabIndex={0}
                        />
                      </label>
                      <div className="checkout-card-row">
                        <label>
                          <span>{t("checkout.expiry", { defaultValue: "Expiration date (MM/YY)" })}*</span>
                          <div
                            className={hasCardError("cardFields") ? "paypal-card-hosted-field is-invalid" : "paypal-card-hosted-field"}
                            id="paypal-card-expiry-field"
                            onClick={() => focusHostedField("paypal-card-expiry-field")}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              focusHostedField("paypal-card-expiry-field");
                            }}
                            onPointerDown={(event) => {
                              event.preventDefault();
                              focusHostedField("paypal-card-expiry-field");
                            }}
                            onTouchStart={() => focusHostedField("paypal-card-expiry-field")}
                            role="button"
                            tabIndex={0}
                          />
                        </label>
                        <label>
                          <span>{t("checkout.securityCode", { defaultValue: "Security code" })}*</span>
                          <div
                            className={hasCardError("cardFields") ? "paypal-card-hosted-field is-invalid" : "paypal-card-hosted-field"}
                            id="paypal-card-cvv-field"
                            onClick={() => focusHostedField("paypal-card-cvv-field")}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              focusHostedField("paypal-card-cvv-field");
                            }}
                            onPointerDown={(event) => {
                              event.preventDefault();
                              focusHostedField("paypal-card-cvv-field");
                            }}
                            onTouchStart={() => focusHostedField("paypal-card-cvv-field")}
                            role="button"
                            tabIndex={0}
                          />
                        </label>
                      </div>
                      {showCardError("cardFields")}
                      {isPayPalSdkLoading ? <p className="payment-note">{t("checkout.loadingCardFields", { defaultValue: "Loading secure card fields..." })}</p> : null}
                      {cardEligibilityError ? <p className="payment-note payment-error">{cardEligibilityError}</p> : null}
                      <label>
                        <span>{t("checkout.nameOnCard", { defaultValue: "Name on card" })}*</span>
                        <input
                          autoComplete="cc-name"
                          className="checkout-card-text-input"
                          inputMode="text"
                          onBlur={() => setTouchedCard((s) => ({ ...s, nameOnCard: true }))}
                          onChange={(e) => setCardField("nameOnCard", e.target.value)}
                          value={cardForm.nameOnCard}
                        />
                        {showCardError("nameOnCard")}
                      </label>
                      <label className="checkout-consent">
                        <input checked={cardForm.billingSame} onChange={(e) => setCardField("billingSame", e.target.checked)} type="checkbox" />
                        <span>{t("checkout.billingSame", { defaultValue: "My billing address is the same as my shipping address." })}</span>
                      </label>
                    </div>
                  ) : null}

                  {activeStep === 1 ? (
                    <div className="checkout-step-actions">
                      <button className="btn btn-secondary btn-md" onClick={() => setActiveStep(0)} type="button">
                        {t("common.back", { defaultValue: "Back" })}
                      </button>
                      <button className="btn btn-primary btn-md" disabled={isSubmitting} onClick={handleContinueFromPayment} type="button">
                        {selectedMethod === "paypal" ? t("common.continueToPayment", { defaultValue: "Continue to payment" }) : t("common.reviewOrder", { defaultValue: "Review your order" })}
                      </button>
                    </div>
                  ) : null}
                </section>
              ) : null}

              {activeStep === 2 ? (
                <section className="checkout-section">
                  <h1>{t("checkout.reviewTitle", { defaultValue: "Review your order" })}</h1>
                  <div className="checkout-review-box">
                    <p><strong>{t("checkout.reviewName", { defaultValue: "Name" })}:</strong> {form.fullName}</p>
                    <p><strong>{t("checkout.reviewAddress", { defaultValue: "Address" })}:</strong> {[form.address, form.address2, form.city, form.country].filter(Boolean).join(", ")}</p>
                    <p><strong>{t("checkout.reviewEmail", { defaultValue: "Email" })}:</strong> {form.email}</p>
                    <p><strong>{t("checkout.reviewMethod", { defaultValue: "Method" })}:</strong> {cardBrandLabel || t("checkout.cardBrands", { defaultValue: "Visa / MasterCard" })}</p>
                    <p><strong>{t("checkout.reviewCard", { defaultValue: "Card" })}:</strong> {t("checkout.reviewCardSecure", { brand: cardBrandLabel || t("checkout.cardBrands", { defaultValue: "Visa / MasterCard" }), defaultValue: "{{brand}} details entered securely" })}</p>
                  </div>
                  <div className="checkout-step-actions">
                    <button className="btn btn-secondary btn-md" onClick={() => setActiveStep(1)} type="button">
                      {t("common.back", { defaultValue: "Back" })}
                    </button>
                    <button className="btn btn-primary btn-lg" disabled={isSubmitting} onClick={handlePaySecurely} type="button">
                      {isSubmitting ? t("common.processingPayment", { defaultValue: "Processing payment..." }) : t("common.paySecurely", { defaultValue: "Pay securely" })}
                    </button>
                  </div>
                </section>
              ) : null}

              {errorMessage ? <p className="payment-note payment-error">{errorMessage}</p> : null}
            </article>

            <aside className="checkout-summary-panel">
              <div className="cart-summary-lines">
                <p>{t("cart.itemTotal", { defaultValue: "Item(s) total" })} <strong>{formatMoney(subtotal)}</strong></p>
                <p>{t("cart.shopDiscount", { defaultValue: "Shop discount" })} <strong>{`-${formatMoney(discount)}`}</strong></p>
                <p>{t("cart.shipping", { defaultValue: "Shipping" })} <strong>{shipping ? formatMoney(shipping) : t("common.free", { defaultValue: "FREE" })}</strong></p>
                <p className="cart-summary-total-line">{totalWithCountLabel} <strong>{formatMoney(total)}</strong></p>
              </div>
              <Link className="btn btn-ghost btn-md" to="/cart">
                {t("checkout.backToCart", { defaultValue: "Back to cart" })}
              </Link>
            </aside>
          </div>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
