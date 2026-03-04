import { useTranslation } from "react-i18next";

const brands = [
  { key: "paypal", label: "PayPal" },
  { key: "visa", label: "Visa" },
  { key: "mastercard", label: "Mastercard" }
];

export default function PaymentIconsRow({ className = "" }) {
  const { t } = useTranslation();

  return (
    <div className={`payment-icons-row ${className}`.trim()}>
      <p className="payment-icons-label">{t("trust.acceptedPayments")}</p>
      <div className="payment-icons-list" aria-label={t("trust.acceptedPayments")}>
        {brands.map((brand) => (
          <span className={`payment-icon-pill ${brand.key}`} key={brand.key}>
            {brand.label}
          </span>
        ))}
      </div>
    </div>
  );
}
