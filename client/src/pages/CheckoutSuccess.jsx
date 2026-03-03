import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import useCart from "../hooks/useCart";
import { CART_STORAGE_KEY, CHECKOUT_FORM_STORAGE_KEY, removeStorageValue } from "../lib/storage";

export default function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const orderId = String(location.state?.orderId || "");
  const { clearCart } = useCart(CART_STORAGE_KEY);

  useEffect(() => {
    clearCart();
    removeStorageValue(CHECKOUT_FORM_STORAGE_KEY);
  }, [clearCart]);

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <article className="policy-card">
            <h1>{t("checkout.successTitle")}</h1>
            <p>{t("checkout.success")}</p>
            {orderId ? <p>{`${t("checkout.orderRef")}: ${orderId}`}</p> : null}
            <Link className="btn btn-primary btn-md" to="/products">
              {t("cart.continue")}
            </Link>
          </article>
        </Container>
      </section>
    </SiteLayout>
  );
}
