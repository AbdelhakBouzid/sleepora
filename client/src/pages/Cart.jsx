import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import useCart from "../hooks/useCart";
import { CART_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog, localizeColorName, localizeProduct, subscribeToCatalogUpdates } from "../lib/catalog";
import { buildCartLines, calculateCartTotal, CART_MAX_ITEM_QUANTITY } from "../lib/cart";
import { useLanguage } from "../context/LanguageContext";

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { formatMoney, effectiveCurrency } = useLanguage();
  const navigate = useNavigate();
  const { cart, changeQty, removeItem } = useCart(CART_STORAGE_KEY);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = t("meta.cart");
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

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const total = useMemo(() => calculateCartTotal(lines), [lines]);
  const discount = total > 0 ? Number((total * 0.18).toFixed(2)) : 0;
  const shipping = 0;
  const grandTotal = Math.max(0, total - discount + shipping);
  const recommendations = useMemo(
    () => products.filter((product) => !lines.some((line) => line.productId === product.id)).slice(0, 6),
    [lines, products]
  );
  const itemLabel = lines.length > 1 ? t("cart.itemsLabel", { defaultValue: "items" }) : t("cart.itemLabel", { defaultValue: "item" });
  const itemsInCartTitle = t("cart.itemsInCartTitle", {
    count: lines.length,
    countLabel: itemLabel,
    defaultValue: "{{count}} {{countLabel}} in your cart"
  });
  const totalWithCountLabel = t("cart.totalWithCount", {
    count: lines.length,
    countLabel: itemLabel,
    defaultValue: "Total ({{count}} {{countLabel}})"
  });
  const codLabel = t("checkout.codLabel", { defaultValue: "Cash on Delivery" });

  function goToCheckout(step = "") {
    const stepParam = step ? `?step=${encodeURIComponent(step)}` : "";
    navigate(`/checkout${stepParam}`);
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
                  <h2>{itemsInCartTitle}</h2>
                  <button className="btn btn-primary btn-lg cart-main-checkout" onClick={() => goToCheckout("shipping")} type="button">
                    {t("cart.secureCheckout", { defaultValue: "Proceed to checkout" })}
                  </button>
                  <p className="cart-checkout-subline">{t("cart.codOnlyNote", { defaultValue: "Cash on delivery only. No online payment required." })}</p>
                </article>

                <div className="cart-line-list">
                  {lines.map((line) => {
                    const localizedLineProduct = localizeProduct(line.product, i18n.language);
                    const linePrice = Number(localizedLineProduct.price || 0) * Number(line.quantity || 0);
                    return (
                      <article className="cart-line-card" key={line.id}>
                        <div className="cart-line-seller">
                          <strong>{t("brand.name")}</strong>
                        </div>
                        <div className="cart-line-content">
                          <Link className="cart-line-media" to={`/product/${line.productId}`}>
                            <SleepImage alt={localizedLineProduct.name} className="cart-line-image" src={line.product.image} />
                          </Link>
                          <div className="cart-line-info">
                            <h3>
                              <Link to={`/product/${line.productId}`}>{localizedLineProduct.name}</Link>
                            </h3>
                            <p>{`${t("product.size", { defaultValue: "Size" })}: ${line.product.selectedSize || t("product.defaultOption", { defaultValue: "Default" })}`}</p>
                            <p>{`${t("product.colorsTitle", { defaultValue: "Color" })}: ${line.product.selectedColor ? localizeColorName(line.product.selectedColor, i18n.language) : t("product.defaultOption", { defaultValue: "Default" })}`}</p>
                            <div className="cart-line-controls">
                              <div className="quantity-stepper cart-qty-stepper" role="group" aria-label="Quantity">
                                <button aria-label="Decrease quantity" className="quantity-stepper-btn" onClick={() => changeQty(line.id, -1)} type="button">
                                  -
                                </button>
                                <output aria-live="polite" className="quantity-stepper-value">
                                  {line.quantity}
                                </output>
                                <button
                                  aria-label="Increase quantity"
                                  className="quantity-stepper-btn"
                                  disabled={Number(line.quantity || 0) >= CART_MAX_ITEM_QUANTITY}
                                  onClick={() => changeQty(line.id, 1)}
                                  type="button"
                                >
                                  +
                                </button>
                              </div>
                              <button className="cart-remove-btn" onClick={() => removeItem(line.id)} type="button">
                                {t("cart.remove")}
                              </button>
                            </div>
                          </div>
                          <div className="cart-line-pricing">
                            <strong>{formatMoney(linePrice, effectiveCurrency)}</strong>
                            <span>{formatMoney(Number(linePrice * 1.18), effectiveCurrency)}</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {recommendations.length ? (
                  <article className="cart-recommendations">
                    <h3>{t("cart.recommendationsTitle", { defaultValue: "Add affordable items with free shipping" })}</h3>
                    <div className="cart-recommendation-grid">
                      {recommendations.map((product) => {
                        const localizedProduct = localizeProduct(product, i18n.language);
                        return (
                        <article className="cart-recommendation-card" key={product.id}>
                          <Link to={`/product/${product.id}`}>
                            <SleepImage alt={localizedProduct.name} className="cart-recommendation-image" src={product.image} />
                          </Link>
                          <h4>
                            <Link to={`/product/${product.id}`}>{localizedProduct.name}</Link>
                          </h4>
                          <p>{formatMoney(product.price, effectiveCurrency)}</p>
                          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/product/${product.id}`)} type="button">
                            {t("product.addToCart")}
                          </button>
                        </article>
                        );
                      })}
                    </div>
                  </article>
                ) : null}
              </div>

              <aside className="cart-summary-panel">
                <h2>{t("cart.howPay", { defaultValue: "How you'll pay" })}</h2>
                <div className="cart-payment-options">
                  <div className="cart-payment-option active cart-payment-option-static">
                    <strong>{codLabel}</strong>
                    <small>{t("checkout.codDescription", { defaultValue: "Pay in cash when your order is delivered." })}</small>
                  </div>
                </div>

                <div className="cart-summary-lines">
                  <p>
                    {t("cart.itemTotal", { defaultValue: "Item(s) total" })} <strong>{formatMoney(total, effectiveCurrency)}</strong>
                  </p>
                  <p>
                    {t("cart.shopDiscount", { defaultValue: "Shop discount" })} <strong>{`-${formatMoney(discount, effectiveCurrency)}`}</strong>
                  </p>
                  <p>
                    {t("cart.shipping", { defaultValue: "Shipping" })} <strong>{shipping ? formatMoney(shipping, effectiveCurrency) : t("common.free", { defaultValue: "FREE" })}</strong>
                  </p>
                  <p className="cart-summary-total-line">
                    {totalWithCountLabel} <strong>{formatMoney(grandTotal, effectiveCurrency)}</strong>
                  </p>
                </div>

                <button className="btn btn-primary btn-lg cart-main-checkout" onClick={() => goToCheckout("shipping")} type="button">
                  {t("cart.secureCheckout", { defaultValue: "Proceed to checkout" })}
                </button>
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
                <strong>{formatMoney(grandTotal, effectiveCurrency)}</strong>
              </div>
              <button className="btn btn-primary btn-md" onClick={() => goToCheckout("shipping")} type="button">
                {t("cart.secureCheckout", { defaultValue: "Proceed to checkout" })}
              </button>
            </div>
          </>
        ) : null}
      </section>
    </SiteLayout>
  );
}
