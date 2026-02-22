import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const policies = [
  { key: "privacyPolicy", to: "/privacy-policy" },
  { key: "termsOfService", to: "/terms-of-service" },
  { key: "refundPolicy", to: "/refund-policy" },
  { key: "shippingPolicy", to: "/shipping-policy" }
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="brand-title">Sleepora</p>
        <div className="footer-links">
          {policies.map((item) => (
            <Link key={item.to} to={item.to}>
              {t(`footer.${item.key}`)}
            </Link>
          ))}
        </div>

        <div className="footer-social">
          <a href="https://www.facebook.com/share/17qjZ7UTwD/" rel="noreferrer" target="_blank" aria-label="Facebook">
            f
          </a>
          <a
            href="https://www.instagram.com/ba2i3.store?igsh=OTV0dXV4cnBndGp1"
            rel="noreferrer"
            target="_blank"
            aria-label="Instagram"
          >
            ◎
          </a>
        </div>

        <p className="footer-copy">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
