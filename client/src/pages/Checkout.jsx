import { useEffect, useMemo, useState } from "react";
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
import { fetchCatalog, localizeColorName, subscribeToCatalogUpdates } from "../lib/catalog";
import { requestJson } from "../lib/api";
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

function normalizePhone(value) {
  return String(value || "").replace(/[^\d+\s()-]/g, "").slice(0, 24);
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

function isValid(errors) {
  return Object.values(errors).every((value) => !value);
}

function getStepState(index, activeStep) {
  if (index < activeStep) return "completed";
  if (index === activeStep) return "current";
  return "upcoming";
}

function roundMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { effectiveCurrency, convertPrice, formatMoney } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, clearCart } = useCart(CART_STORAGE_KEY);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const [savedForm] = useLocalStorage(CHECKOUT_FORM_STORAGE_KEY, initialForm);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(() => buildInitialCheckoutForm(savedForm, user));
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [touchedShipping, setTouchedShipping] = useState({});
  const [toastMessage, showToast] = useToast(2600);

  useEffect(() => {
    document.title = t("meta.checkout");
  }, [t, i18n.language]);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      const nextProducts = await fetchCatalog();
      if (active) {
        setProducts(nextProducts);
      }
    }

    loadCatalog();
    const unsubscribe = subscribeToCatalogUpdates(loadCatalog);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const step = String(searchParams.get("step") || "").toLowerCase();
    if (step === "review" || step === "payment") setActiveStep(1);
    else setActiveStep(0);
  }, [searchParams]);

  useEffect(() => {
    writeStorageValue(CHECKOUT_FORM_STORAGE_KEY, form);
  }, [form]);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const checkoutCurrency = effectiveCurrency;
  const baseSubtotal = useMemo(() => calculateCartTotal(lines), [lines]);
  const baseDiscount = baseSubtotal > 0 ? roundMoney(baseSubtotal * 0.18) : 0;
  const baseShipping = 0;
  const baseTotal = Math.max(0, roundMoney(baseSubtotal - baseDiscount + baseShipping));
  const subtotal = roundMoney(convertPrice(baseSubtotal, checkoutCurrency));
  const discount = roundMoney(convertPrice(baseDiscount, checkoutCurrency));
  const shipping = roundMoney(convertPrice(baseShipping, checkoutCurrency));
  const total = Math.max(0, roundMoney(subtotal - discount + shipping));
  const shippingValidation = useMemo(() => shippingErrors(form, t), [form, t]);
  const stepLabels = useMemo(
    () => [
      t("checkout.stepShipping", { defaultValue: "Shipping" }),
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
  const codLabel = t("checkout.codLabel", { defaultValue: "Cash on Delivery" });

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function showShippingError(key) {
    if (!touchedShipping[key] || !shippingValidation[key]) return null;
    return <small className="payment-error">{shippingValidation[key]}</small>;
  }

  function markShippingTouched() {
    setTouchedShipping({
      email: true,
      confirmEmail: true,
      country: true,
      fullName: true,
      address: true,
      city: true,
      phone: false
    });
  }

  function buildOrderItems() {
    return lines.map((line) => {
      const unitPrice = roundMoney(convertPrice(Number(line.product.price || 0), checkoutCurrency));
      return {
        id: line.productId || line.id,
        name: line.product.name,
        quantity: Number(line.quantity || 1),
        unit_price: unitPrice,
        line_total: roundMoney(unitPrice * Number(line.quantity || 1)),
        image: line.product.image,
        color: String(line.product.selectedColor || "").trim(),
        size: String(line.product.selectedSize || "").trim()
      };
    });
  }

  function buildOrderPayload() {
    const fullName = String(form.fullName || "").trim();
    return {
      customer: {
        name: fullName,
        email: String(form.email || "").trim(),
        phone: String(form.phone || "").trim(),
        address: [form.address, form.address2].filter(Boolean).join(", "),
        city: String(form.city || "").trim(),
        state: String(form.city || "").trim(),
        zip: String(form.zip || "").trim(),
        country: String(form.country || "").trim()
      },
      items: buildOrderItems(),
      summary: {
        subtotal,
        discount,
        shipping,
        total,
        currency: checkoutCurrency
      },
      payment_method: "cod"
    };
  }

  function goToReviewStep() {
    markShippingTouched();
    if (!isValid(shippingValidation)) {
      showToast(t("checkout.completeAddress", { defaultValue: "Please complete your address." }));
      return;
    }
    setActiveStep(1);
  }

  async function placeOrder() {
    markShippingTouched();
    if (!isValid(shippingValidation)) {
      setActiveStep(0);
      const message = t("checkout.completeAddress", { defaultValue: "Please complete your address." });
      setErrorMessage(message);
      showToast(message);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await requestJson("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildOrderPayload())
      });
      const order = response?.order || null;
      if (!order) {
        throw new Error(t("checkout.orderCreateError", { defaultValue: "Unable to place your order right now." }));
      }

      writeStorageValue(LAST_SUCCESS_ORDER_STORAGE_KEY, order);
      clearCart();
      navigate("/checkout/success", { replace: true, state: { order } });
    } catch (error) {
      const message = String(error?.message || t("checkout.orderCreateError", { defaultValue: "Unable to place your order right now." }));
      setErrorMessage(message);
      showToast(message);
      setIsSubmitting(false);
    }
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
                    <button className="btn btn-primary btn-lg" onClick={goToReviewStep} type="button">
                      {t("common.continue", { defaultValue: "Continue" })}
                    </button>
                  </div>
                </section>
              ) : null}

              {activeStep === 1 ? (
                <section className="checkout-section">
                  <h1>{t("checkout.reviewTitle", { defaultValue: "Review your order" })}</h1>
                  <div className="checkout-review-box">
                    <p><strong>{t("checkout.reviewName", { defaultValue: "Name" })}:</strong> {form.fullName}</p>
                    <p><strong>{t("checkout.reviewAddress", { defaultValue: "Address" })}:</strong> {[form.address, form.address2, form.city, form.country].filter(Boolean).join(", ")}</p>
                    <p><strong>{t("checkout.reviewEmail", { defaultValue: "Email" })}:</strong> {form.email}</p>
                    <p><strong>{t("checkout.reviewMethod", { defaultValue: "Method" })}:</strong> {codLabel}</p>
                    <p><strong>{t("cart.shipping", { defaultValue: "Shipping" })}:</strong> {baseShipping ? formatMoney(baseShipping, checkoutCurrency) : t("common.free", { defaultValue: "FREE" })}</p>
                  </div>

                  {lines.length ? (
                    <div className="checkout-order-lines">
                      {lines.map((line) => (
                        <article className="checkout-order-line" key={line.id}>
                          <div className="checkout-order-line-head">
                            <strong>{line.product.name}</strong>
                            <span>{formatMoney(Number(line.product.price || 0), checkoutCurrency)}</span>
                          </div>
                          <div className="checkout-order-line-meta checkout-order-line-meta-stacked">
                            <span>{`${t("cart.quantity", { defaultValue: "Quantity" })}: ${line.quantity}`}</span>
                            {line.product.selectedSize ? (
                              <span>{`${t("product.size", { defaultValue: "Size" })}: ${line.product.selectedSize}`}</span>
                            ) : null}
                            {line.product.selectedColor ? (
                              <span>{`${t("product.colorsTitle", { defaultValue: "Color" })}: ${localizeColorName(line.product.selectedColor, i18n.language)}`}</span>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : null}

                  <div className="cart-summary-lines">
                    <p>{t("cart.itemTotal", { defaultValue: "Item(s) total" })} <strong>{formatMoney(baseSubtotal, checkoutCurrency)}</strong></p>
                    <p>{t("cart.shopDiscount", { defaultValue: "Shop discount" })} <strong>{`-${formatMoney(baseDiscount, checkoutCurrency)}`}</strong></p>
                    <p>{t("cart.shipping", { defaultValue: "Shipping" })} <strong>{baseShipping ? formatMoney(baseShipping, checkoutCurrency) : t("common.free", { defaultValue: "FREE" })}</strong></p>
                    <p className="cart-summary-total-line">{totalWithCountLabel} <strong>{formatMoney(baseTotal, checkoutCurrency)}</strong></p>
                  </div>

                  <div className="checkout-step-actions checkout-step-actions-stacked">
                    <button className="btn btn-primary btn-lg" disabled={isSubmitting} onClick={placeOrder} type="button">
                      {isSubmitting ? t("checkout.placingOrder", { defaultValue: "Placing your order..." }) : t("checkout.placeOrder", { defaultValue: "Confirm order" })}
                    </button>
                    <button className="btn btn-secondary btn-md" onClick={() => setActiveStep(0)} type="button">
                      {t("common.back", { defaultValue: "Back" })}
                    </button>
                  </div>
                </section>
              ) : null}

              {errorMessage ? <p className="payment-note payment-error">{errorMessage}</p> : null}
            </article>

            <aside className="checkout-summary-panel">
              <div className="cart-summary-lines">
                {lines.length ? (
                  <div className="checkout-order-lines">
                    {lines.map((line) => (
                      <article className="checkout-order-line" key={line.id}>
                        <div className="checkout-order-line-head">
                          <strong>{line.product.name}</strong>
                          <span>{formatMoney(Number(line.product.price || 0), checkoutCurrency)}</span>
                        </div>
                        <div className="checkout-order-line-meta">
                          <span>{`${t("cart.quantity", { defaultValue: "Quantity" })}: ${line.quantity}`}</span>
                          {line.product.selectedColor ? (
                            <span>{`${t("product.colorsTitle", { defaultValue: "Color" })}: ${localizeColorName(line.product.selectedColor, i18n.language)}`}</span>
                          ) : null}
                          {line.product.selectedSize ? (
                            <span>{`${t("product.size", { defaultValue: "Size" })}: ${line.product.selectedSize}`}</span>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
                <p>{t("cart.itemTotal", { defaultValue: "Item(s) total" })} <strong>{formatMoney(baseSubtotal, checkoutCurrency)}</strong></p>
                <p>{t("cart.shopDiscount", { defaultValue: "Shop discount" })} <strong>{`-${formatMoney(baseDiscount, checkoutCurrency)}`}</strong></p>
                <p>{t("cart.shipping", { defaultValue: "Shipping" })} <strong>{baseShipping ? formatMoney(baseShipping, checkoutCurrency) : t("common.free", { defaultValue: "FREE" })}</strong></p>
                <p className="cart-summary-total-line">{totalWithCountLabel} <strong>{formatMoney(baseTotal, checkoutCurrency)}</strong></p>
              </div>
              <div className="checkout-review-box checkout-payment-summary-box">
                <p><strong>{t("checkout.reviewMethod", { defaultValue: "Method" })}:</strong> {codLabel}</p>
                <p>{t("checkout.codDescription", { defaultValue: "Pay in cash when your order is delivered." })}</p>
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
