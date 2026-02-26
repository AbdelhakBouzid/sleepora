import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import useCart from "../hooks/useCart";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import { CART_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog } from "../lib/catalog";
import { buildCartLines, calculateCartTotal } from "../lib/cart";
import { formatPrice } from "../lib/format";
import {
  capturePayPalCheckoutOrder,
  createPayPalCheckoutOrder,
  fetchPayPalClientConfig,
  loadPayPalSdk
} from "../lib/paypal";

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

function mapCartLinesForCheckout(lines) {
  return (lines || []).map((line) => ({
    id: String(line.id),
    quantity: Math.max(1, Number(line.quantity || 1))
  }));
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart(CART_STORAGE_KEY);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [toastMessage, showToast] = useToast();
  const [payPalClientId, setPayPalClientId] = useState("");
  const [payPalCurrency, setPayPalCurrency] = useState("USD");
  const [payPalError, setPayPalError] = useState("");
  const [isPayPalLoading, setIsPayPalLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRedirectingToPayPal, setIsRedirectingToPayPal] = useState(false);
  const [isCardFundingVisible, setIsCardFundingVisible] = useState(false);
  const [reloadPayPalConfigKey, setReloadPayPalConfigKey] = useState(0);

  const payPalContainerRef = useRef(null);
  const payPalCardContainerRef = useRef(null);
  const payPalButtonsRef = useRef({ wallet: null, card: null });
  const formRef = useRef(form);
  const showToastRef = useRef(showToast);
  const clearCartRef = useRef(clearCart);
  const navigateRef = useRef(navigate);
  const tRef = useRef(t);

  useEffect(() => {
    formRef.current = form;
  }, [form]);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);
  useEffect(() => {
    clearCartRef.current = clearCart;
  }, [clearCart]);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    document.title = t("meta.checkout");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadClientConfig() {
      try {
        const config = await fetchPayPalClientConfig();
        if (!active) return;
        setPayPalClientId(String(config?.clientId || ""));
        setPayPalCurrency(String(config?.currency || "USD").toUpperCase());
        setPayPalError("");
      } catch (error) {
        if (!active) return;
        const envClientId = String(import.meta.env.VITE_PAYPAL_CLIENT_ID || "").trim();
        if (envClientId) {
          setPayPalClientId(envClientId);
          setPayPalCurrency(String(import.meta.env.VITE_PAYPAL_CURRENCY || "USD").toUpperCase());
          setPayPalError("");
          return;
        }
        setPayPalError(String(error?.message || t("checkout.paypalUnavailable")));
      } finally {
        if (active) setIsPayPalLoading(false);
      }
    }
    loadClientConfig();
    return () => {
      active = false;
    };
  }, [t, reloadPayPalConfigKey]);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const total = useMemo(() => calculateCartTotal(lines), [lines]);
  const linesSignature = useMemo(
    () =>
      lines
        .map((line) => `${line.id}:${line.quantity}`)
        .sort()
        .join("|"),
    [lines]
  );

  function buildCheckoutPayload() {
    return {
      customer: {
        name: formRef.current.fullName,
        email: formRef.current.email,
        phone: formRef.current.phone,
        address: formRef.current.address,
        city: formRef.current.city,
        state: formRef.current.state,
        zip: formRef.current.zip,
        country: formRef.current.country
      },
      items: mapCartLinesForCheckout(lines),
      currency: payPalCurrency
    };
  }

  useEffect(() => {
    let canceled = false;
    const canRenderButtons = Boolean(payPalClientId && payPalContainerRef.current && lines.length);

    async function renderPayPalButtons() {
      if (!canRenderButtons) return;
      setPayPalError("");
      setIsPayPalLoading(true);
      setIsCardFundingVisible(false);

      try {
        const paypal = await loadPayPalSdk(payPalClientId, payPalCurrency);
        if (canceled) return;
        if (!paypal?.Buttons) {
          throw new Error("PayPal SDK unavailable");
        }

        if (payPalButtonsRef.current?.wallet?.close) {
          await payPalButtonsRef.current.wallet.close();
        }
        if (payPalButtonsRef.current?.card?.close) {
          await payPalButtonsRef.current.card.close();
        }
        if (!payPalContainerRef.current) return;
        payPalContainerRef.current.innerHTML = "";
        if (payPalCardContainerRef.current) {
          payPalCardContainerRef.current.innerHTML = "";
        }

        const buttonHandlers = {
          createOrder: async () => {
            const latestForm = formRef.current;
            if (!isCheckoutFormValid(latestForm)) {
              showToastRef.current(tRef.current("checkout.validationError"));
              throw new Error("Invalid checkout form");
            }

            const response = await createPayPalCheckoutOrder(buildCheckoutPayload());

            return String(response?.orderId || "");
          },
          onApprove: async (data) => {
            setIsCapturing(true);
            try {
              const result = await capturePayPalCheckoutOrder(data.orderID);
              clearCartRef.current();
              setForm(initialForm);
              navigateRef.current("/checkout/success", {
                replace: true,
                state: { orderId: result?.orderId || "" }
              });
            } catch (_error) {
              showToastRef.current(tRef.current("checkout.paymentFailed"));
            } finally {
              setIsCapturing(false);
            }
          },
          onCancel: () => {
            navigateRef.current("/checkout/cancel");
          },
          onError: () => {
            showToastRef.current(tRef.current("checkout.paymentFailed"));
          }
        };

        const walletButtonInstance = paypal.Buttons({
          ...buttonHandlers,
          fundingSource: paypal.FUNDING.PAYPAL,
          style: {
            shape: "pill",
            label: "paypal",
            layout: "vertical",
            height: 48,
            tagline: false
          }
        });

        const cardButtonInstance = paypal.Buttons({
          ...buttonHandlers,
          fundingSource: paypal.FUNDING.CARD,
          style: {
            shape: "pill",
            label: "pay",
            layout: "vertical",
            height: 48
          }
        });

        let renderedAny = false;
        if (walletButtonInstance?.isEligible()) {
          await walletButtonInstance.render(payPalContainerRef.current);
          payPalButtonsRef.current.wallet = walletButtonInstance;
          renderedAny = true;
        }

        if (payPalCardContainerRef.current && cardButtonInstance?.isEligible()) {
          await cardButtonInstance.render(payPalCardContainerRef.current);
          payPalButtonsRef.current.card = cardButtonInstance;
          setIsCardFundingVisible(true);
          renderedAny = true;
        }

        if (!renderedAny) {
          throw new Error("PayPal payment methods are unavailable");
        }
      } catch (error) {
        if (!canceled) {
          setPayPalError(error.message || tRef.current("checkout.paypalUnavailable"));
        }
      } finally {
        if (!canceled) {
          setIsPayPalLoading(false);
        }
      }
    }

    renderPayPalButtons();

    return () => {
      canceled = true;
    };
  }, [payPalClientId, payPalCurrency, linesSignature]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleRedirectCheckout() {
    if (!lines.length) return;
    if (!isCheckoutFormValid(formRef.current)) {
      showToast(t("checkout.validationError"));
      return;
    }

    setIsRedirectingToPayPal(true);
    try {
      const response = await createPayPalCheckoutOrder(buildCheckoutPayload());
      const approveUrl = String(response?.approveUrl || "").trim();
      if (!approveUrl) {
        throw new Error(t("checkout.paypalUnavailable"));
      }
      window.location.assign(approveUrl);
    } catch (error) {
      setPayPalError(String(error?.message || t("checkout.paypalUnavailable")));
      showToast(t("checkout.paymentFailed"));
      setIsRedirectingToPayPal(false);
    }
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
                  <button
                    className="btn btn-primary btn-md checkout-pay-btn"
                    disabled={isRedirectingToPayPal || isCapturing || !lines.length}
                    onClick={handleRedirectCheckout}
                    type="button"
                  >
                    {isRedirectingToPayPal ? t("common.loading") : t("checkout.checkoutWithPaypal")}
                  </button>
                  <p className="payment-note">{t("checkout.redirectHint")}</p>
                  {isPayPalLoading ? <p className="payment-note">{t("checkout.loadingGateway")}</p> : null}
                  {payPalError ? <p className="payment-note payment-error">{payPalError}</p> : null}
                  {payPalError ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setReloadPayPalConfigKey((value) => value + 1)}
                      type="button"
                    >
                      {t("checkout.retryPaypal")}
                    </button>
                  ) : null}
                  {isCapturing ? <p className="payment-note">{t("common.loading")}</p> : null}
                  <div className="paypal-buttons-stack">
                    <div className="paypal-buttons" ref={payPalContainerRef} />
                    <div className={isCardFundingVisible ? "paypal-buttons" : "paypal-buttons is-hidden"} ref={payPalCardContainerRef} />
                  </div>
                  {isCardFundingVisible ? <p className="payment-note">{t("checkout.cardSupportNote")}</p> : null}
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
