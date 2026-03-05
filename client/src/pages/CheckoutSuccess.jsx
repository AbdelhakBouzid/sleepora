import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import useLocalStorage from "../hooks/useLocalStorage";
import useCart from "../hooks/useCart";
import { capturePayPalCheckoutOrder } from "../lib/paypal";
import {
  CART_STORAGE_KEY,
  CHECKOUT_FORM_STORAGE_KEY,
  LAST_SUCCESS_ORDER_STORAGE_KEY,
  removeStorageValue,
  writeStorageValue
} from "../lib/storage";

export default function CheckoutSuccessPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart(CART_STORAGE_KEY);
  const [savedOrder] = useLocalStorage(LAST_SUCCESS_ORDER_STORAGE_KEY, null);
  const [capturedOrder, setCapturedOrder] = useState(null);
  const [captureError, setCaptureError] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const paypalToken = String(searchParams.get("token") || "").trim();
  const order = useMemo(() => capturedOrder || location.state?.order || savedOrder || null, [capturedOrder, location.state, savedOrder]);

  useEffect(() => {
    removeStorageValue(CHECKOUT_FORM_STORAGE_KEY);
  }, []);

  useEffect(() => {
    let active = true;

    async function captureFromReturn() {
      if (!paypalToken || capturedOrder || location.state?.order) return;
      setIsCapturing(true);
      try {
        const result = await capturePayPalCheckoutOrder(paypalToken);
        if (!active) return;
        setCapturedOrder(result);
        writeStorageValue(LAST_SUCCESS_ORDER_STORAGE_KEY, result);
        clearCart();
      } catch (error) {
        if (!active) return;
        setCaptureError(String(error?.message || "Payment capture failed."));
      } finally {
        if (active) setIsCapturing(false);
      }
    }

    captureFromReturn();
    return () => {
      active = false;
    };
  }, [paypalToken, capturedOrder, location.state, clearCart]);

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <article className="policy-card checkout-status-card checkout-success-card">
            <p className="caps-label">{t("brand.name")}</p>
            <h1>{t("checkout.successTitle")}</h1>
            <p>{t("checkout.successThankYou")}</p>
            {isCapturing ? <p>Finalizing payment...</p> : null}
            {captureError ? <p className="payment-error">{captureError}</p> : null}
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
