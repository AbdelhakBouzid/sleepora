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
        <p className="footer-brand">Sleepora</p>
        <div className="footer-links">
          {policies.map((item) => (
            <Link key={item.to} to={item.to}>
              {t(`footer.${item.key}`)}
            </Link>
          ))}
        </div>

        <div className="footer-social">
          <a href="https://www.facebook.com/share/17qjZ7UTwD/" rel="noreferrer" target="_blank" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.5 21v-8h2.7l.4-3h-3.1V8c0-.9.3-1.6 1.7-1.6H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V10H7.5v3h2.8v8h3.2z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/ba2i3.store?igsh=OTV0dXV4cnBndGp1"
            rel="noreferrer"
            target="_blank"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11.2 1.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@sleepora.official?is_from_webapp=1&sender_device=pc"
            rel="noreferrer"
            target="_blank"
            aria-label="TikTok"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.5 3c.6 2 1.8 3.2 3.8 3.9v2.7c-1.3 0-2.5-.4-3.6-1v6.1c0 3-2.2 5.3-5.3 5.3S4 17.7 4 14.7s2.2-5.3 5.3-5.3c.4 0 .8 0 1.2.1V12a2.8 2.8 0 0 0-1.2-.3c-1.6 0-2.8 1.3-2.8 2.9s1.2 2.9 2.8 2.9 2.8-1.3 2.8-2.9V3h2.4z" />
            </svg>
          </a>
        </div>

        <p className="footer-copy">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
