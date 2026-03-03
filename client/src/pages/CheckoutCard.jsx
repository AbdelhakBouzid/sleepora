import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import useCart from "../hooks/useCart";
import useLocalStorage from "../hooks/useLocalStorage";
import { buildCartLines, calculateCartTotal } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { fetchCatalog } from "../lib/catalog";
import {
  CART_STORAGE_KEY,
  CHECKOUT_FORM_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
  writeStorageValue
} from "../lib/storage";
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

export default function CheckoutCardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cart } = useCart(CART_STORAGE_KEY);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const [savedForm] = useLocalStorage(CHECKOUT_FORM_STORAGE_KEY, initialForm);
  const [products, setProducts] = useState([]);
  const [toastMessage, showToast] = useToast();
  const [payPalClientId, setPayPalClientId] = useState("");
  const [payPalCurrency, setPayPalCurrency] = useState("USD");
  const [payPalError, setPayPalError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);

  const payPalCardContainerRef = useRef(null);
  const form = useMemo(() => buildInitialCheckoutForm(savedForm, user), [savedForm, user]);
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
    document.title = t("meta.checkout");
  }, [t, i18n.language]);

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
      } catch (error) {
        if (!active) return;
        setPayPalError(String(error?.message || t("checkout.paypalUnavailable")));
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadClientConfig();
    return () => {
      active = false;
    };
  }, [t]);

  useEffect(() => {
    let canceled = false;

    async function renderCardButton() {
      if (!payPalClientId || !payPalCardContainerRef.current || !lines.length) return;

      try {
        const paypal = await loadPayPalSdk(payPalClientId, payPalCurrency);
        if (canceled || !paypal?.Buttons || !payPalCardContainerRef.current) return;
        payPalCardContainerRef.current.innerHTML = "";

        const cardButton = paypal.Buttons({
          fundingSource: paypal.FUNDING.CARD,
          style: {
            shape: "pill",
            label: "pay",
            layout: "vertical",
            height: 50
          },
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

            const orderId = String(response?.orderId || "");
            if (!orderId) {
              throw new Error("Missing PayPal order id");
            }
            return orderId;
          },
          onApprove: async (data) => {
            setIsCapturing(true);
            try {
              const result = await capturePayPalCheckoutOrder(data.orderID);
              navigate("/checkout/success", {
                replace: true,
                state: { orderId: result?.orderId || "" }
              });
            } catch (error) {
              const message = String(error?.message || t("checkout.paymentFailed"));
              setPayPalError(message);
              showToast(message);
            } finally {
              setIsCapturing(false);
            }
          },
          onCancel: () => navigate("/checkout/cancel"),
          onError: (error) => {
            const message = String(error?.message || t("checkout.paymentFailed"));
            setPayPalError(message);
            showToast(message);
          }
        });

        if (!cardButton?.isEligible()) {
          setPayPalError(t("checkout.cardUnavailable"));
          return;
        }

        await cardButton.render(payPalCardContainerRef.current);
      } catch (error) {
        if (!canceled) {
          setPayPalError(String(error?.message || t("checkout.paymentFailed")));
        }
      }
    }

    renderCardButton();
    return () => {
      canceled = true;
    };
  }, [form, lines, linesSignature, navigate, payPalClientId, payPalCurrency, showToast, t]);

  if (!lines.length || !isCheckoutFormValid(form)) {
    return <Navigate replace to="/checkout" />;
  }

  return (
    <SiteLayout>
      <section className="page-section">
        <Container className="checkout-grid checkout-card-grid">
          <article className="checkout-panel checkout-card-panel">
            <div className="checkout-card-header">
              <div>
                <h1>{t("checkout.cardPageTitle")}</h1>
                <p>{t("checkout.cardPageSubtitle")}</p>
              </div>
              <Link className="btn btn-secondary btn-sm" to="/checkout">
                {t("checkout.backToCheckout")}
              </Link>
            </div>

            <div className="checkout-card-customer">
              <div className="account-detail">
                <span>{t("checkout.fullName")}</span>
                <strong>{form.fullName}</strong>
              </div>
              <div className="account-detail">
                <span>{t("checkout.email")}</span>
                <strong>{form.email}</strong>
              </div>
              <div className="account-detail">
                <span>{t("checkout.phone")}</span>
                <strong>{form.phone}</strong>
              </div>
              <div className="account-detail">
                <span>{t("checkout.address")}</span>
                <strong>{[form.address, form.city, form.state, form.zip, form.country].filter(Boolean).join(", ")}</strong>
              </div>
            </div>

            <div className="payment-card payment-card-standalone">
              <p className="payment-method-label">{t("checkout.cardPageTitle")}</p>
              <p className="payment-note payment-note-strong">{t("checkout.cardPageLead")}</p>
              {isLoading ? <p className="payment-note">{t("checkout.loadingGateway")}</p> : null}
              {payPalError ? <p className="payment-note payment-error">{payPalError}</p> : null}
              {isCapturing ? <p className="payment-note">{t("common.loading")}</p> : null}
              <div className="paypal-buttons-stack standalone">
                <div className="paypal-buttons" ref={payPalCardContainerRef} />
              </div>
            </div>
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
          </aside>
        </Container>
      </section>
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
