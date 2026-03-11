import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  CHECKOUT_FORM_STORAGE_KEY,
  LAST_SUCCESS_ORDER_STORAGE_KEY,
  removeStorageValue
} from "../lib/storage";

export default function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [savedOrder] = useLocalStorage(LAST_SUCCESS_ORDER_STORAGE_KEY, null);
  const order = useMemo(() => location.state?.order || savedOrder || null, [location.state, savedOrder]);
  const codLabel = t("checkout.codLabel", { defaultValue: "Cash on Delivery" });

  useEffect(() => {
    removeStorageValue(CHECKOUT_FORM_STORAGE_KEY);
  }, []);

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <article className="policy-card checkout-status-card checkout-success-card">
            <p className="caps-label">{t("brand.name")}</p>
            <h1>{t("checkout.successTitle", { defaultValue: "Order confirmed" })}</h1>
            <p>{t("checkout.successThankYou", { defaultValue: "Your order has been placed successfully. You will pay in cash when it is delivered." })}</p>
            <div className="checkout-success-details">
              <p>
                <strong>{t("checkout.orderRef", { defaultValue: "Order reference" })}:</strong> {order?.order_number || order?.id || "--"}
              </p>
              <p>
                <strong>{t("checkout.email", { defaultValue: "Email" })}:</strong> {order?.email || "--"}
              </p>
              <p>
                <strong>{t("checkout.reviewMethod", { defaultValue: "Method" })}:</strong> {codLabel}
              </p>
              <p>
                <strong>{t("trust.deliveryEstimate", { defaultValue: "Delivery: 5-10 business days" })}:</strong> {order?.delivery_estimate || "5-10 business days"}
              </p>
            </div>
            <div className="card-actions">
              <Link className="btn btn-primary btn-md" to="/products">
                {t("checkout.continueShopping", { defaultValue: "Continue shopping" })}
              </Link>
              <Link className="btn btn-secondary btn-md" to="/">
                {t("checkout.backHome", { defaultValue: "Back home" })}
              </Link>
            </div>
          </article>
        </Container>
      </section>
    </SiteLayout>
  );
}
