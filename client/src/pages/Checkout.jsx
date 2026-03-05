import { useEffect, useMemo, useState } from "react";
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
  USER_PROFILE_STORAGE_KEY,
  writeStorageValue
} from "../lib/storage";
import { buildCartLines, calculateCartTotal } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { fetchCatalog } from "../lib/catalog";
import { createPayPalCheckoutOrder } from "../lib/paypal";
import PaymentIconsRow from "../components/store/PaymentIconsRow";

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
  cardNumber: "",
  expiry: "",
  cvv: "",
  nameOnCard: "",
  billingSame: true
};

const stepLabels = ["Shipping", "Payment", "Review"];

function normalizePhone(value) {
  return String(value || "").replace(/[^\d+\s()-]/g, "").slice(0, 24);
}

function normalizeCardNumber(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function normalizeExpiry(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function normalizeCvv(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 4);
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

function shippingErrors(form) {
  const email = String(form.email || "").trim();
  return {
    email: email.includes("@") ? "" : "Email is required.",
    confirmEmail: String(form.confirmEmail || "").trim() === email ? "" : "Confirm email must match.",
    country: String(form.country || "").trim() ? "" : "Country is required.",
    fullName: String(form.fullName || "").trim() ? "" : "Full name is required.",
    address: String(form.address || "").trim() ? "" : "Street address is required.",
    city: String(form.city || "").trim() ? "" : "City is required.",
    phone: ""
  };
}

function cardErrors(cardForm) {
  const cardDigits = String(cardForm.cardNumber || "").replace(/\D/g, "");
  const expiry = String(cardForm.expiry || "");
  const cvv = String(cardForm.cvv || "");
  return {
    cardNumber: cardDigits.length >= 13 ? "" : "Card number is incomplete.",
    expiry: /^\d{2}\/\d{2}$/.test(expiry) ? "" : "Expiry must be MM/YY.",
    cvv: cvv.length >= 3 ? "" : "Security code is required.",
    nameOnCard: String(cardForm.nameOnCard || "").trim() ? "" : "Name on card is required."
  };
}

function isValid(errors) {
  return Object.values(errors).every((value) => !value);
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart } = useCart(CART_STORAGE_KEY);
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

  const shippingValidation = useMemo(() => shippingErrors(form), [form]);
  const cardValidation = useMemo(() => cardErrors(cardForm), [cardForm]);

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

  function toCustomerPayload() {
    const fullName = String(form.fullName || "").trim();
    const parts = fullName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] || "Customer";
    const lastName = parts.slice(1).join(" ") || "Customer";
    return {
      name: fullName || `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: form.email,
      phone: form.phone,
      address: [form.address, form.address2].filter(Boolean).join(", "),
      city: form.city,
      state: form.city,
      zip: form.zip,
      country: form.country
    };
  }

  async function redirectToPayPal() {
    if (!lines.length) return;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createPayPalCheckoutOrder({
        customer: toCustomerPayload(),
        items: lines.map((line) => ({
          id: line.productId || line.id,
          quantity: line.quantity
        }))
      });

      const approveUrl = String(response?.approveUrl || "");
      if (!approveUrl) {
        throw new Error("Missing PayPal approval URL.");
      }

      window.location.assign(approveUrl);
    } catch (error) {
      const message = String(error?.message || "Unable to start secure payment.");
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

    setTouchedCard({
      cardNumber: true,
      expiry: true,
      cvv: true,
      nameOnCard: true
    });

    if (!isValid(cardValidation)) {
      showToast("Please complete card details.");
      return;
    }

    setActiveStep(2);
  }

  async function handlePaySecurely() {
    await redirectToPayPal();
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
                {stepLabels.map((label, index) => (
                  <div className={index <= activeStep ? "checkout-step active" : "checkout-step"} key={label}>
                    <span className="checkout-step-dot" />
                    <span>{label}</span>
                  </div>
                ))}
              </header>

              {activeStep === 0 ? (
                <section className="checkout-section">
                  <h1>Enter an address</h1>
                  <div className="checkout-form-grid">
                    <label>
                      <span>Email*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, email: true }))} onChange={(e) => setField("email", e.target.value)} value={form.email} />
                      {showShippingError("email")}
                    </label>
                    <label>
                      <span>Confirm Email*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, confirmEmail: true }))} onChange={(e) => setField("confirmEmail", e.target.value)} value={form.confirmEmail} />
                      {showShippingError("confirmEmail")}
                    </label>
                    <label>
                      <span>Country*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, country: true }))} onChange={(e) => setField("country", e.target.value)} value={form.country} />
                      {showShippingError("country")}
                    </label>
                    <label>
                      <span>Full name*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, fullName: true }))} onChange={(e) => setField("fullName", e.target.value)} value={form.fullName} />
                      {showShippingError("fullName")}
                    </label>
                    <label>
                      <span>Street address*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, address: true }))} onChange={(e) => setField("address", e.target.value)} value={form.address} />
                      {showShippingError("address")}
                    </label>
                    <label>
                      <span>Apt / Suite / Other (optional)</span>
                      <input onChange={(e) => setField("address2", e.target.value)} value={form.address2} />
                    </label>
                    <label>
                      <span>Postal code (optional)</span>
                      <input onChange={(e) => setField("zip", e.target.value)} value={form.zip} />
                    </label>
                    <label>
                      <span>City*</span>
                      <input onBlur={() => setTouchedShipping((s) => ({ ...s, city: true }))} onChange={(e) => setField("city", e.target.value)} value={form.city} />
                      {showShippingError("city")}
                    </label>
                    <label>
                      <span>Phone number (optional)</span>
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
                          showToast("Please complete your address.");
                          return;
                        }
                        setActiveStep(1);
                      }}
                      type="button"
                    >
                      Continue to payment
                    </button>
                  </div>
                </section>
              ) : null}

              {activeStep === 1 ? (
                <section className="checkout-section">
                  <h1>Choose a payment method</h1>
                  <div className="checkout-payment-methods">
                    <button className={selectedMethod === "card" ? "checkout-payment-choice active" : "checkout-payment-choice"} onClick={() => setSelectedMethod("card")} type="button">
                      <span>Pay with a card</span>
                      <PaymentIconsRow className="checkout-inline-logos" />
                    </button>
                    <button className={selectedMethod === "paypal" ? "checkout-payment-choice active" : "checkout-payment-choice"} onClick={() => setSelectedMethod("paypal")} type="button">
                      <span>PayPal</span>
                    </button>
                  </div>

                  {selectedMethod === "card" ? (
                    <div className="checkout-card-fields">
                      <label>
                        <span>Card number*</span>
                        <input onBlur={() => setTouchedCard((s) => ({ ...s, cardNumber: true }))} onChange={(e) => setCardField("cardNumber", normalizeCardNumber(e.target.value))} value={cardForm.cardNumber} />
                        {showCardError("cardNumber")}
                      </label>
                      <div className="checkout-card-row">
                        <label>
                          <span>Expiration date (MM/YY)*</span>
                          <input onBlur={() => setTouchedCard((s) => ({ ...s, expiry: true }))} onChange={(e) => setCardField("expiry", normalizeExpiry(e.target.value))} value={cardForm.expiry} />
                          {showCardError("expiry")}
                        </label>
                        <label>
                          <span>Security code*</span>
                          <input onBlur={() => setTouchedCard((s) => ({ ...s, cvv: true }))} onChange={(e) => setCardField("cvv", normalizeCvv(e.target.value))} value={cardForm.cvv} />
                          {showCardError("cvv")}
                        </label>
                      </div>
                      <label>
                        <span>Name on card*</span>
                        <input onBlur={() => setTouchedCard((s) => ({ ...s, nameOnCard: true }))} onChange={(e) => setCardField("nameOnCard", e.target.value)} value={cardForm.nameOnCard} />
                        {showCardError("nameOnCard")}
                      </label>
                      <label className="checkout-consent">
                        <input checked={cardForm.billingSame} onChange={(e) => setCardField("billingSame", e.target.checked)} type="checkbox" />
                        <span>My billing address is the same as my shipping address.</span>
                      </label>
                    </div>
                  ) : null}

                  <div className="checkout-step-actions">
                    <button className="btn btn-secondary btn-md" onClick={() => setActiveStep(0)} type="button">
                      Back
                    </button>
                    <button className="btn btn-primary btn-md" onClick={handleContinueFromPayment} type="button">
                      {selectedMethod === "paypal" ? "Continue to payment" : "Review your order"}
                    </button>
                  </div>
                </section>
              ) : null}

              {activeStep === 2 ? (
                <section className="checkout-section">
                  <h1>Review your order</h1>
                  <div className="checkout-review-box">
                    <p><strong>Name:</strong> {form.fullName}</p>
                    <p><strong>Address:</strong> {[form.address, form.address2, form.city, form.country].filter(Boolean).join(", ")}</p>
                    <p><strong>Email:</strong> {form.email}</p>
                    <p><strong>Card:</strong> {`**** **** **** ${String(cardForm.cardNumber || "").replace(/\D/g, "").slice(-4) || "----"}`}</p>
                  </div>
                  <div className="checkout-step-actions">
                    <button className="btn btn-secondary btn-md" onClick={() => setActiveStep(1)} type="button">
                      Back
                    </button>
                    <button className="btn btn-primary btn-lg" disabled={isSubmitting} onClick={handlePaySecurely} type="button">
                      Pay securely
                    </button>
                  </div>
                </section>
              ) : null}

              {errorMessage ? <p className="payment-note payment-error">{errorMessage}</p> : null}
            </article>

            <aside className="checkout-summary-panel">
              <div className="cart-summary-lines">
                <p>Item(s) total <strong>{formatPrice(subtotal, i18n.language)}</strong></p>
                <p>Shop discount <strong>{`-${formatPrice(discount, i18n.language)}`}</strong></p>
                <p>Shipping <strong>{shipping ? formatPrice(shipping, i18n.language) : "FREE"}</strong></p>
                <p className="cart-summary-total-line">{`Total (${lines.length} ${lines.length > 1 ? "items" : "item"})`} <strong>{formatPrice(total, i18n.language)}</strong></p>
              </div>
              <label className="cart-gift-toggle">
                <span>Mark order as a gift</span>
                <input type="checkbox" />
              </label>
              <button className="btn btn-primary btn-lg cart-main-checkout" disabled={isSubmitting} onClick={() => (activeStep === 2 ? handlePaySecurely() : setActiveStep(0))} type="button">
                {activeStep === 2 ? "Pay securely" : "Continue to payment"}
              </button>
              <Link className="btn btn-ghost btn-md" to="/cart">
                Back to cart
              </Link>
            </aside>
          </div>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
