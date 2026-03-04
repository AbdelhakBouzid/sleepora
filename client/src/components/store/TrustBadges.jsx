import { useTranslation } from "react-i18next";

const defaultItems = [
  { icon: "lock", key: "securePaypal" },
  { icon: "shield", key: "sslEncrypted" },
  { icon: "globe", key: "freeShipping" },
  { icon: "truck", key: "deliveryEstimate" },
  { icon: "refresh", key: "moneyBack" }
];

function Icon({ name }) {
  const paths = {
    lock: "M12 2a4 4 0 0 0-4 4v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4zm-2 6V6a2 2 0 1 1 4 0v2h-4z",
    shield: "M12 2l7 3v5c0 5-3.4 9.7-7 11-3.6-1.3-7-6-7-11V5l7-3z",
    globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 9h-3.1a15.2 15.2 0 0 0-1.7-6A8.1 8.1 0 0 1 18.9 11zM12 4c.9 1.1 1.8 3 2.1 5H9.9c.3-2 1.2-3.9 2.1-5zM4.9 13H8a17 17 0 0 0 .7 4.1A8 8 0 0 1 4.9 13zm0-2A8.1 8.1 0 0 1 9.9 5a15.2 15.2 0 0 0-1.7 6H4.9zm7.1 9c-.9-1.1-1.8-3-2.1-5h4.2c-.3 2-1.2 3.9-2.1 5zm2.6-7H9.4a15 15 0 0 1 0-2h5.2a15 15 0 0 1 0 2zm.7 4.1A17 17 0 0 0 16 13h3.1a8 8 0 0 1-3.8 4.1z",
    truck: "M3 6h11v8H3V6zm11 2h3l3 3v3h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3",
    refresh: "M17.6 6.4A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.8-4.2L14 10h6V4l-2.4 2.4z"
  };

  return (
    <svg aria-hidden="true" className="trust-badge-icon" viewBox="0 0 24 24">
      <path d={paths[name] || paths.shield} />
    </svg>
  );
}

export default function TrustBadges({ className = "", items = defaultItems, compact = false, titleKey = "" }) {
  const { t } = useTranslation();

  return (
    <div className={`trust-badges ${compact ? "compact" : ""} ${className}`.trim()}>
      {titleKey ? <p className="trust-badges-title">{t(titleKey)}</p> : null}
      <div className="trust-badges-list">
        {items.map((item) => (
          <div className="trust-badge-item" key={item.key}>
            <Icon name={item.icon} />
            <span>{t(`trust.${item.key}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
