import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: ""
};

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const { cart, clearCart } = useCart(CART_STORAGE_KEY);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [toastMessage, showToast] = useToast();
  const stripeConfigured = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    document.title = t("meta.checkout");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const total = useMemo(() => calculateCartTotal(lines), [lines]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.cardName.trim() ||
      !form.cardNumber.trim() ||
      !form.expiry.trim() ||
      !form.cvc.trim()
    ) {
      return;
    }
    clearCart();
    setForm(initialForm);
    showToast(t("checkout.success"));
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
              <form className="form-grid" onSubmit={handleSubmit}>
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
                  <textarea
                    rows={4}
                    value={form.address}
                    onChange={(event) => setField("address", event.target.value)}
                  />
                </label>

                <div className="payment-card">
                  <label>
                    <span>{t("checkout.cardName")}</span>
                    <input value={form.cardName} onChange={(event) => setField("cardName", event.target.value)} />
                  </label>
                  <label>
                    <span>{t("checkout.cardNumber")}</span>
                    <input
                      inputMode="numeric"
                      maxLength={19}
                      placeholder="4242 4242 4242 4242"
                      value={form.cardNumber}
                      onChange={(event) => setField("cardNumber", event.target.value)}
                    />
                  </label>
                  <div className="payment-grid">
                    <label>
                      <span>{t("checkout.expiry")}</span>
                      <input placeholder="MM/YY" value={form.expiry} onChange={(event) => setField("expiry", event.target.value)} />
                    </label>
                    <label>
                      <span>{t("checkout.cvc")}</span>
                      <input
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="123"
                        value={form.cvc}
                        onChange={(event) => setField("cvc", event.target.value)}
                      />
                    </label>
                  </div>
                  <button className="btn btn-primary btn-md" type="submit">
                    {t("checkout.paySecurely")}
                  </button>
                  {!stripeConfigured ? <p className="payment-note">{t("checkout.secureSoon")}</p> : null}
                </div>
              </form>
            )}
          </article>

          <aside className="cart-summary">
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
