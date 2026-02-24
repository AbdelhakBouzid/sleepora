import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
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

  const payPalContainerRef = useRef(null);
  const payPalButtonsRef = useRef(null);
  const formRef = useRef(form);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

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
      } catch (_error) {
        if (!active) return;
        setPayPalError(t("checkout.paypalUnavailable"));
      } finally {
        if (active) setIsPayPalLoading(false);
      }
    }
    loadClientConfig();
    return () => {
      active = false;
    };
  }, [t]);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const total = useMemo(() => calculateCartTotal(lines), [lines]);

  useEffect(() => {
    let canceled = false;
    const canRenderButtons = Boolean(payPalClientId && payPalContainerRef.current && lines.length);

    async function renderPayPalButtons() {
      if (!canRenderButtons) return;
      setPayPalError("");
      setIsPayPalLoading(true);

      try {
        const paypal = await loadPayPalSdk(payPalClientId, payPalCurrency);
        if (canceled) return;
        if (!paypal?.Buttons) {
          throw new Error("PayPal SDK unavailable");
        }

        if (payPalButtonsRef.current?.close) {
          await payPalButtonsRef.current.close();
        }
        if (!payPalContainerRef.current) return;
        payPalContainerRef.current.innerHTML = "";

        const buttonInstance = paypal.Buttons({
          style: {
            shape: "pill",
            label: "paypal",
            layout: "vertical"
          },
          createOrder: async () => {
            const latestForm = formRef.current;
            if (!isCheckoutFormValid(latestForm)) {
              showToast(t("checkout.validationError"));
              throw new Error("Invalid checkout form");
            }

            const response = await createPayPalCheckoutOrder({
              customer: {
                name: latestForm.fullName,
                email: latestForm.email,
                phone: latestForm.phone,
                address: latestForm.address,
                city: latestForm.city,
                state: latestForm.state,
                zip: latestForm.zip,
                country: latestForm.country
              },
              items: mapCartLinesForCheckout(lines),
              currency: payPalCurrency
            });

            return String(response?.orderId || "");
          },
          onApprove: async (data) => {
            setIsCapturing(true);
            try {
              const result = await capturePayPalCheckoutOrder(data.orderID);
              clearCart();
              setForm(initialForm);
              navigate("/checkout/success", {
                replace: true,
                state: { orderId: result?.orderId || "" }
              });
            } catch (_error) {
              showToast(t("checkout.paymentFailed"));
            } finally {
              setIsCapturing(false);
            }
          },
          onCancel: () => {
            navigate("/checkout/cancel");
          },
          onError: () => {
            showToast(t("checkout.paymentFailed"));
          }
        });

        payPalButtonsRef.current = buttonInstance;
        await buttonInstance.render(payPalContainerRef.current);
      } catch (error) {
        if (!canceled) {
          setPayPalError(error.message || t("checkout.paypalUnavailable"));
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
  }, [payPalClientId, payPalCurrency, lines, clearCart, navigate, showToast, t]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
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
                  {isPayPalLoading ? <p className="payment-note">{t("checkout.loadingGateway")}</p> : null}
                  {payPalError ? <p className="payment-note payment-error">{payPalError}</p> : null}
                  {isCapturing ? <p className="payment-note">{t("common.loading")}</p> : null}
                  <div className="paypal-buttons" ref={payPalContainerRef} />
                </div>
              </div>
            )}
          </article>

          <aside className="cart-summary">
            {lines.map((line) => (
              <p key={line.id}>
                {line.product.name} x {line.quantity}
              </p>
            ))}
            <p>
              {t("cart.total")}: <strong>{formatPrice(total, i18n.language)}</strong>
            </p>
          </aside>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}

