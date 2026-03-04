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
import TrustBadges from "../components/store/TrustBadges";
import PaymentIconsRow from "../components/store/PaymentIconsRow";

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cart, changeQty, removeItem } = useCart(CART_STORAGE_KEY);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = t("meta.cart");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const lines = useMemo(() => buildCartLines(cart, products), [cart, products]);
  const total = useMemo(() => calculateCartTotal(lines), [lines]);
  const shipping = 0;

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <div className="section-head">
            <h1>{t("cart.title")}</h1>
          </div>

          {!lines.length ? (
            <div className="empty-state">
              <p>{t("cart.empty")}</p>
              <Link className="btn btn-secondary btn-md" to="/products">
                {t("cart.continue")}
              </Link>
            </div>
          ) : (
            <div className="cart-grid">
              <div className="cart-list">
                {lines.map((line) => (
                  <article className="cart-item" key={line.id}>
                    <SleepImage alt={line.product.name} className="cart-image" src={line.product.image} />
                    <div className="cart-item-body">
                      <h3>{line.product.name}</h3>
                      <p>{formatPrice(line.product.price, i18n.language)}</p>
                      <div className="qty-row">
                        <span>{t("cart.quantity")}</span>
                        <div className="qty-controls">
                          <button onClick={() => changeQty(line.id, -1)} type="button">
                            -
                          </button>
                          <strong>{line.quantity}</strong>
                          <button onClick={() => changeQty(line.id, 1)} type="button">
                            +
                          </button>
                        </div>
                      </div>
                      <button className="text-link" onClick={() => removeItem(line.id)} type="button">
                        {t("cart.remove")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="cart-summary">
                <div className="cart-summary-lines">
                  <p>
                    {t("checkout.subtotal")}: <strong>{formatPrice(total, i18n.language)}</strong>
                  </p>
                  <p>
                    {t("cart.shipping")}: <strong>{t("cart.freeShipping")}</strong>
                  </p>
                  <p className="cart-summary-grand-total">
                    {t("cart.total")}: <strong>{formatPrice(total + shipping, i18n.language)}</strong>
                  </p>
                </div>
                <button className="btn btn-primary btn-md" onClick={() => navigate("/checkout")} type="button">
                  {t("cart.proceedSecure")}
                </button>
                <p className="cart-summary-microcopy">{t("cart.checkoutMicrocopy")}</p>
                <PaymentIconsRow />
                <TrustBadges compact />
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
                <strong>{formatPrice(total + shipping, i18n.language)}</strong>
              </div>
              <button className="btn btn-primary btn-md" onClick={() => navigate("/checkout")} type="button">
                {t("cart.proceedSecure")}
              </button>
            </div>
          </>
        ) : null}
      </section>
    </SiteLayout>
  );
}
