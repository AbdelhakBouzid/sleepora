import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import useLocalStorage from "../hooks/useLocalStorage";
import { CHECKOUT_FORM_STORAGE_KEY, LAST_SUCCESS_ORDER_STORAGE_KEY, removeStorageValue } from "../lib/storage";

export default function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [savedOrder] = useLocalStorage(LAST_SUCCESS_ORDER_STORAGE_KEY, null);
  const order = useMemo(() => location.state?.order || savedOrder || null, [location.state, savedOrder]);

  useEffect(() => {
    removeStorageValue(CHECKOUT_FORM_STORAGE_KEY);
  }, []);

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <article className="policy-card checkout-success-card">
            <p className="caps-label">{t("brand.name")}</p>
            <h1>{t("checkout.successTitle")}</h1>
            <p>{t("checkout.successThankYou")}</p>
            <div className="checkout-success-details">
              <p>
                <strong>{t("checkout.orderRef")}:</strong> {order?.paypalCaptureId || order?.orderId || "--"}
              </p>
              <p>
                <strong>{t("checkout.email")}:</strong> {order?.customerEmail || "--"}
              </p>
              <p>
                <strong>{t("trust.deliveryEstimate")}:</strong> {order?.deliveryEstimate || "5-10 business days"}
              </p>
            </div>
            <div className="card-actions">
              <Link className="btn btn-primary btn-md" to="/products">
                {t("checkout.continueShopping")}
              </Link>
              <Link className="btn btn-secondary btn-md" to="/">
                {t("checkout.backHome")}
              </Link>
            </div>
          </article>
        </Container>
      </section>
    </SiteLayout>
  );
}
