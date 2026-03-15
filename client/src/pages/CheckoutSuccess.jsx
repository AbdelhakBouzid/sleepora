import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import useLocalStorage from "../hooks/useLocalStorage";
import { formatPrice } from "../lib/format";
import { localizeColorName } from "../lib/catalog";
import {
  CHECKOUT_FORM_STORAGE_KEY,
  LAST_SUCCESS_ORDER_STORAGE_KEY,
  removeStorageValue
} from "../lib/storage";

function colorToCss(value) {
  const color = String(value || "").trim();
  if (!color) return "#d4d4d4";
  const normalized = color.toLowerCase();
  const map = {
    charcoal: "#424242",
    pearl: "#f7f4ec",
    ivory: "#f1e8d8",
    beige: "#d8c1a1",
    cream: "#f2e4cf",
    silver: "#c3c6c8",
    gray: "#777777",
    grey: "#777777",
    black: "#111111",
    white: "#ffffff",
    red: "#cf2e2e",
    blue: "#2d5fa8",
    green: "#2f8b57",
    "warm white": "#f6ebd4"
  };
  return map[normalized] || color;
}

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
              <p className="checkout-success-detail-row checkout-success-detail-row-inline">
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
                    const localizedColor = color ? localizeColorName(color, i18n.language) : "";
                    const lineTotal = Number(item?.line_total || item?.lineTotal || 0);

                    return (
                      <li key={`${order?.order_number || order?.id || "order"}-${index}`}>
                        <div className="checkout-success-item-main checkout-success-item-main-stacked">
                          <span className="checkout-success-item-name">{itemName}</span>
                          <span className="checkout-success-item-price">{formatPrice(lineTotal, i18n.language, String(order?.currency || "MAD"))}</span>
                        </div>
                        {size ? (
                          <div className="checkout-success-item-meta checkout-success-item-row">
                            <span>{`${t("product.size", { defaultValue: "Size" })}: ${size}`}</span>
                          </div>
                        ) : null}
                        {localizedColor ? (
                          <div className="checkout-success-item-meta checkout-success-item-row">
                            <span>{`${t("product.colorsTitle", { defaultValue: "Color" })}:`}</span>
                            <span className="checkout-success-color-value">
                              <span>{localizedColor}</span>
                              <span aria-hidden="true" className="checkout-success-color-dot" style={{ backgroundColor: colorToCss(color) }} />
                            </span>
                          </div>
                        ) : null}
                        <div className="checkout-success-item-meta checkout-success-item-row">
                          <span>{`${t("cart.quantity", { defaultValue: "Quantity" })}: ${quantity}`}</span>
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
