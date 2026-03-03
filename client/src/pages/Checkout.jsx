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
import { CART_STORAGE_KEY, CHECKOUT_FORM_STORAGE_KEY, USER_PROFILE_STORAGE_KEY, writeStorageValue } from "../lib/storage";
import { buildCartLines, calculateCartTotal } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { fetchCatalog } from "../lib/catalog";
import { capturePayPalCheckoutOrder, createPayPalCheckoutOrder, fetchPayPalClientConfig, loadPayPalSdk } from "../lib/paypal";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "US"
};

function buildInitialCheckoutForm(savedForm, user) {
  const userFullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  return {
    fullName: String(savedForm?.fullName || userFullName || ""),
    email: String(savedForm?.email || user?.email || ""),
    phone: String(savedForm?.phone || user?.phone_e164 || ""),
    address: String(savedForm?.address || ""),
    city: String(savedForm?.city || ""),
    state: String(savedForm?.state || ""),
    zip: String(savedForm?.zip || ""),
    country: String(savedForm?.country || "US")
  };
}

function isCheckoutFormValid(form) {
  return (
    String(form?.fullName || "").trim() &&
    String(form?.email || "").trim().includes("@") &&
    String(form?.phone || "").trim() &&
    String(form?.address || "").trim() &&
    String(form?.city || "").trim() &&
    String(form?.state || "").trim() &&
    String(form?.zip || "").trim() &&
    String(form?.country || "").trim()
  );
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cart } = useCart(CART_STORAGE_KEY);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const [savedForm] = useLocalStorage(CHECKOUT_FORM_STORAGE_KEY, initialForm);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(() => buildInitialCheckoutForm(savedForm, user));
  const [toastMessage, showToast] = useToast();
  const [payPalClientId, setPayPalClientId] = useState("");
  const [payPalCurrency, setPayPalCurrency] = useState("USD");
  const [payPalError, setPayPalError] = useState("");
  const [isPayPalLoading, setIsPayPalLoading] = useState(true);

  const payPalContainerRef = useRef(null);

  useEffect(() => {
    document.title = t("meta.checkout");
  }, [t, i18n.language]);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      fullName: current.fullName || [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim(),
      email: current.email || String(user?.email || ""),
      phone: current.phone || String(user?.phone_e164 || "")
    }));
  }, [user]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const total = useMemo(() => calculateCartTotal(lines), [lines]);
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
      if (!payPalClientId || !payPalContainerRef.current || !lines.length) return;
      setPayPalError("");

      try {
        const paypal = await loadPayPalSdk(payPalClientId, payPalCurrency);
        if (canceled || !paypal?.Buttons || !payPalContainerRef.current) return;
        payPalContainerRef.current.innerHTML = "";

        const walletButton = paypal.Buttons({
          createOrder: async () => {
            if (!isCheckoutFormValid(form)) {
              showToast(t("checkout.validationError"));
              throw new Error("Invalid checkout form");
            }

            const response = await createPayPalCheckoutOrder({
              customer: form,
              items: lines.map((line) => ({
                id: line.productId || line.id,
                quantity: line.quantity
              })),
              currency: payPalCurrency
            });
            return String(response?.orderId || "");
          },
          onApprove: async (data) => {
            const result = await capturePayPalCheckoutOrder(data.orderID);
            navigate("/checkout/success", {
              replace: true,
              state: { orderId: result?.orderId || "" }
            });
          },
          onCancel: () => navigate("/checkout/cancel"),
          onError: (error) => {
            setPayPalError(String(error?.message || t("checkout.paymentFailed")));
            showToast(t("checkout.paymentFailed"));
          },
          fundingSource: paypal.FUNDING.PAYPAL,
          style: {
            shape: "pill",
            label: "paypal",
            layout: "vertical",
            height: 48,
            tagline: false
          }
        });

        if (!walletButton?.isEligible()) {
          setPayPalError(t("checkout.paypalUnavailable"));
          return;
        }

        await walletButton.render(payPalContainerRef.current);
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
  }, [form, lines, linesSignature, navigate, payPalClientId, payPalCurrency, showToast, t]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleCardCheckout() {
    if (!isCheckoutFormValid(form)) {
      showToast(t("checkout.validationError"));
      return;
    }
    writeStorageValue(CHECKOUT_FORM_STORAGE_KEY, form);
    navigate("/checkout/card");
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
                  <span>{t("checkout.fullName")}</span>
                  <input value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} />
                </label>
                <label>
                  <span>{t("checkout.email")}</span>
                  <input type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} />
                </label>
                <label>
                  <span>{t("checkout.phone")}</span>
                  <input value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
                </label>
                <label>
                  <span>{t("checkout.address")}</span>
                  <input value={form.address} onChange={(event) => setField("address", event.target.value)} />
                </label>
                <div className="payment-grid">
                  <label>
                    <span>{t("checkout.city")}</span>
                    <input value={form.city} onChange={(event) => setField("city", event.target.value)} />
                  </label>
                  <label>
                    <span>{t("checkout.state")}</span>
                    <input value={form.state} onChange={(event) => setField("state", event.target.value)} />
                  </label>
                  <label>
                    <span>{t("checkout.zip")}</span>
                    <input value={form.zip} onChange={(event) => setField("zip", event.target.value)} />
                  </label>
                  <label>
                    <span>{t("checkout.country")}</span>
                    <input value={form.country} onChange={(event) => setField("country", event.target.value)} />
                  </label>
                </div>

                <div className="payment-card">
                  <p className="payment-method-label">{t("checkout.payWithPaypal")}</p>
                  <p className="payment-note payment-note-strong">{t("checkout.chooseMethod")}</p>
                  <p className="payment-note">{t("checkout.cardRedirectNote")}</p>
                  {isPayPalLoading ? <p className="payment-note">{t("checkout.loadingGateway")}</p> : null}
                  {payPalError ? <p className="payment-note payment-error">{payPalError}</p> : null}
                  <div className="paypal-buttons-stack">
                    <div className="paypal-buttons" ref={payPalContainerRef} />
                  </div>
                  <button className="btn btn-primary btn-md checkout-card-route-btn" onClick={handleCardCheckout} type="button">
                    {t("checkout.cardPageButton")}
                  </button>
                  <p className="payment-note">{t("checkout.cardSupportNote")}</p>
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
                {t("cart.total")}: <strong>{formatPrice(total, i18n.language)}</strong>
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
