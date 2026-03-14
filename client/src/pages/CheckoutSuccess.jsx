import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import useLocalStorage from "../hooks/useLocalStorage";
import { formatPrice } from "../lib/format";
import {
  CHECKOUT_FORM_STORAGE_KEY,
  LAST_SUCCESS_ORDER_STORAGE_KEY,
  removeStorageValue
} from "../lib/storage";

export default function CheckoutSuccessPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [savedOrder] = useLocalStorage(LAST_SUCCESS_ORDER_STORAGE_KEY, null);
  const order = useMemo(() => location.state?.order || savedOrder || null, [location.state, savedOrder]);
  const codLabel = t("checkout.codLabel", { defaultValue: "Cash on Delivery" });
  const localizedDeliveryEstimate = t("checkout.deliveryEstimateValue", { defaultValue: "12 to 48 hours" });
  const rawDeliveryEstimate = String(order?.delivery_estimate || "").trim();
  const deliveryEstimate =
    rawDeliveryEstimate && !/(business days|5-10|5 to 10|\u0645\u0646 5 \u0625\u0644\u0649 10)/i.test(rawDeliveryEstimate)
      ? rawDeliveryEstimate
      : localizedDeliveryEstimate;

  useEffect(() => {
    removeStorageValue(CHECKOUT_FORM_STORAGE_KEY);
  }, []);

  useEffect(() => {
    document.title = t("checkout.successTitle", { defaultValue: "Order confirmed" });
  }, [i18n.language, t]);

  const orderItems = Array.isArray(order?.items) ? order.items : [];

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <article className="policy-card checkout-status-card checkout-success-card">
            <p className="caps-label">{t("brand.name")}</p>
            <h1>{t("checkout.successTitle", { defaultValue: "Order confirmed" })}</h1>
            <p>{t("checkout.successThankYou", { defaultValue: "Your order has been placed successfully. You will pay in cash when it is delivered." })}</p>
            <div className="checkout-success-details">
              <p className="checkout-success-detail-row">
                <strong>{t("checkout.orderRef", { defaultValue: "Order reference" })}:</strong>
                <span dir="ltr">{order?.order_number || order?.id || "--"}</span>
              </p>
              <p className="checkout-success-detail-row">
                <strong>{t("checkout.reviewEmail", { defaultValue: "Email" })}:</strong>
                <span dir="ltr">{order?.email || "--"}</span>
              </p>
              <p className="checkout-success-detail-row">
                <strong>{t("checkout.reviewMethod", { defaultValue: "Method" })}:</strong>
                <span>{codLabel}</span>
              </p>
              <p className="checkout-success-detail-row">
                <strong>{t("checkout.deliveryEstimateLabel", { defaultValue: "Delivery estimate" })}:</strong>
                <span>{deliveryEstimate}</span>
              </p>
            </div>
            {orderItems.length ? (
              <div className="checkout-success-items">
                <strong>{t("checkout.orderItems", { defaultValue: "Order items" })}</strong>
                <ul>
                  {orderItems.map((item, index) => {
                    const itemName = String(item?.name || "").trim() || t("common.unavailable", { defaultValue: "Unavailable" });
                    const quantity = Math.max(1, Number(item?.quantity || item?.qty || 1));
                    const size = String(item?.size || "").trim();
                    const color = String(item?.color || "").trim();
                    const meta = [size ? `${t("product.size", { defaultValue: "Size" })}: ${size}` : "", color ? `${t("product.colorsTitle", { defaultValue: "Color" })}: ${color}` : ""]
                      .filter(Boolean)
                      .join(" • ");
                    const lineTotal = Number(item?.line_total || item?.lineTotal || 0);

                    return (
                      <li key={`${order?.order_number || order?.id || "order"}-${index}`}>
                        <div className="checkout-success-item-main">
                          <span className="checkout-success-item-name">{itemName}</span>
                          <span className="checkout-success-item-price">{formatPrice(lineTotal, i18n.language, String(order?.currency || "MAD"))}</span>
                        </div>
                        <div className="checkout-success-item-meta">
                          <span>{`${t("cart.quantity", { defaultValue: "Quantity" })}: ${quantity}`}</span>
                          {meta ? <span>{meta}</span> : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
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
