import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import useCart from "../hooks/useCart";
import { CART_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog } from "../lib/catalog";
import { buildCartLines, calculateCartTotal } from "../lib/cart";
import { formatPrice } from "../lib/format";
import PaymentIconsRow from "../components/store/PaymentIconsRow";

const paymentChoices = [
  { key: "card", label: "Visa / MasterCard", active: true },
  { key: "paypal", label: "PayPal", active: true }
];

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cart, changeQty, removeItem } = useCart(CART_STORAGE_KEY);
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [giftEnabled, setGiftEnabled] = useState(false);

  useEffect(() => {
    document.title = t("meta.cart");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const total = useMemo(() => calculateCartTotal(lines), [lines]);
  const discount = total > 0 ? Number((total * 0.18).toFixed(2)) : 0;
  const shipping = 0;
  const grandTotal = Math.max(0, total - discount + shipping);
  const recommendations = useMemo(() => products.filter((product) => !lines.some((line) => line.id === product.id)).slice(0, 6), [lines, products]);

  function goToCheckout(step = "") {
    const stepParam = step ? `&step=${encodeURIComponent(step)}` : "";
    navigate(`/checkout?method=${paymentMethod}${stepParam}`);
  }

  return (
    <SiteLayout>
      <section className="cart-page">
        <Container>
          <div className="cart-page-head">
            <h1>{t("cart.title", { defaultValue: "Your cart" })}</h1>
          </div>

          {!lines.length ? (
            <div className="empty-state">
              <p>{t("cart.empty")}</p>
              <Link className="btn btn-secondary btn-md" to="/products">
                {t("cart.continue")}
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items-column">
                <article className="cart-mobile-checkout-card">
                  <h2>{`${lines.length} ${lines.length > 1 ? "items" : "item"} in your cart`}</h2>
                  <button className="btn btn-primary btn-lg cart-main-checkout" onClick={() => goToCheckout("shipping")} type="button">
                    Proceed to secure checkout
                  </button>
                  <p className="cart-checkout-subline">Or continue for more options</p>
                </article>

                <div className="cart-line-list">
                  {lines.map((line) => {
                    const linePrice = Number(line.product.price || 0) * Number(line.quantity || 0);
                    return (
                      <article className="cart-line-card" key={line.id}>
                        <div className="cart-line-seller">
                          <strong>sleeepora</strong>
                        </div>
                        <div className="cart-line-content">
                          <Link className="cart-line-media" to={`/product/${line.productId}`}>
                            <SleepImage alt={line.product.name} className="cart-line-image" src={line.product.image} />
                          </Link>
                          <div className="cart-line-info">
                            <h3>
                              <Link to={`/product/${line.productId}`}>{line.product.name}</Link>
                            </h3>
                            <p>{`${t("product.size", { defaultValue: "Size" })}: ${line.product.selectedSize || "Standard"}`}</p>
                            <p>{`${t("product.colorsTitle", { defaultValue: "Color" })}: ${line.product.selectedColor || "Default"}`}</p>
                            <div className="cart-line-controls">
                              <div className="quantity-stepper cart-qty-stepper" role="group" aria-label="Quantity">
                                <button aria-label="Decrease quantity" className="quantity-stepper-btn" onClick={() => changeQty(line.id, -1)} type="button">
                                  -
                                </button>
                                <output aria-live="polite" className="quantity-stepper-value">
                                  {line.quantity}
                                </output>
                                <button aria-label="Increase quantity" className="quantity-stepper-btn" onClick={() => changeQty(line.id, 1)} type="button">
                                  +
                                </button>
                              </div>
                              <button className="cart-remove-btn" onClick={() => removeItem(line.id)} type="button">
                                {t("cart.remove")}
                              </button>
                            </div>
                          </div>
                          <div className="cart-line-pricing">
                            <strong>{formatPrice(linePrice, i18n.language)}</strong>
                            <span>{formatPrice(Number(linePrice * 1.18), i18n.language)}</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {recommendations.length ? (
                  <article className="cart-recommendations">
                    <h3>Add affordable items with free shipping</h3>
                    <div className="cart-recommendation-grid">
                      {recommendations.map((product) => (
                        <article className="cart-recommendation-card" key={product.id}>
                          <Link to={`/product/${product.id}`}>
                            <SleepImage alt={product.name} className="cart-recommendation-image" src={product.image} />
                          </Link>
                          <h4>
                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                          </h4>
                          <p>{formatPrice(product.price, i18n.language)}</p>
                          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/product/${product.id}`)} type="button">
                            Add to cart
                          </button>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}
              </div>

              <aside className="cart-summary-panel">
                <h2>How you'll pay</h2>
                <div className="cart-payment-options">
                  {paymentChoices.map((option) => (
                    <label className={option.active ? "cart-payment-option" : "cart-payment-option disabled"} key={option.key}>
                      <input
                        checked={paymentMethod === option.key}
                        disabled={!option.active}
                        name="paymentOption"
                        onChange={() => setPaymentMethod(option.key)}
                        type="radio"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                <PaymentIconsRow />

                <div className="cart-summary-lines">
                  <p>
                    Item(s) total <strong>{formatPrice(total, i18n.language)}</strong>
                  </p>
                  <p>
                    Shop discount <strong>{`-${formatPrice(discount, i18n.language)}`}</strong>
                  </p>
                  <p>
                    Shipping <strong>{shipping ? formatPrice(shipping, i18n.language) : "FREE"}</strong>
                  </p>
                  <p className="cart-summary-total-line">
                    {`Total (${lines.length} ${lines.length > 1 ? "items" : "item"})`} <strong>{formatPrice(grandTotal, i18n.language)}</strong>
                  </p>
                </div>

                <label className="cart-gift-toggle">
                  <span>Mark order as a gift</span>
                  <input checked={giftEnabled} onChange={(event) => setGiftEnabled(event.target.checked)} type="checkbox" />
                </label>

                <button className="btn btn-primary btn-lg cart-main-checkout" onClick={() => goToCheckout("shipping")} type="button">
                  Proceed to secure checkout
                </button>

                <p className="cart-coupon-line">Apply coupon code</p>
              </aside>
            </div>
          )}
        </Container>

        {lines.length ? (
          <>
            <div className="cart-mobile-checkout-spacer" />
            <div className="cart-mobile-checkout-bar">
              <div className="cart-mobile-total">
                <span>{t("cart.total")}</span>
                <strong>{formatPrice(grandTotal, i18n.language)}</strong>
              </div>
              <button className="btn btn-primary btn-md" onClick={() => goToCheckout("shipping")} type="button">
                Proceed to secure checkout
              </button>
            </div>
          </>
        ) : null}
      </section>
    </SiteLayout>
  );
}
