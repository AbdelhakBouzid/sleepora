import { useTranslation } from "react-i18next";

const brands = [
  { key: "visa", label: "Visa", className: "visa" },
  { key: "mastercard", label: "MasterCard", className: "mastercard" },
  { key: "paypal", label: "PayPal", className: "paypal" },
  { key: "gpay", label: "G Pay", className: "gpay" },
  { key: "klarna", label: "Klarna", className: "klarna" }
];

export default function PaymentIconsRow({ className = "" }) {
  const { t } = useTranslation();

  return (
    <div className={`payment-icons-row ${className}`.trim()}>
      <p className="payment-icons-label">{t("trust.acceptedPayments", { defaultValue: "How you'll pay" })}</p>
      <div aria-label={t("trust.acceptedPayments", { defaultValue: "How you'll pay" })} className="payment-icons-list">
        {brands.map((brand) => (
          <span className={`payment-icon-logo ${brand.className}`} key={brand.key}>
            {brand.label}
          </span>
        ))}
      </div>
    </div>
  );
}
