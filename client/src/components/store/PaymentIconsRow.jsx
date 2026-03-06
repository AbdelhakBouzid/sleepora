function VisaLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 90 28">
      <text fill="#1434CB" fontFamily="Arial Black, Arial, sans-serif" fontSize="20" fontStyle="italic" fontWeight="900" x="4" y="21">
        VISA
      </text>
    </svg>
  );
}

function MasterCardLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 90 28">
      <circle cx="38" cy="14" fill="#EB001B" r="9.2" />
      <circle cx="52" cy="14" fill="#F79E1B" r="9.2" />
      <path d="M45 7.5a9.2 9.2 0 0 0 0 13 9.2 9.2 0 0 0 0-13Z" fill="#FF5F00" />
    </svg>
  );
}

function PayPalLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 120 28">
      <path
        d="M9.9 3.8h9.1c4.9 0 7.7 2.8 7.1 7.1-.7 5.1-4.4 7.7-9.6 7.7h-3l-1 5.9H7.4L9.9 3.8Z"
        fill="#003087"
      />
      <path
        d="M15 6.1h6.4c3.4 0 5.2 1.9 4.8 4.9-.5 3.6-3 5.4-6.6 5.4h-2.1l-.8 4.8h-4.4L15 6.1Z"
        fill="#009CDE"
      />
      <text fill="#003087" fontFamily="Arial Black, Arial, sans-serif" fontSize="18" fontStyle="italic" fontWeight="900" x="36" y="20">
        PayPal
      </text>
    </svg>
  );
}

const logos = [
  { key: "visa", label: "Visa", Component: VisaLogo },
  { key: "mastercard", label: "MasterCard", Component: MasterCardLogo },
  { key: "paypal", label: "PayPal", Component: PayPalLogo }
];

export default function PaymentIconsRow({ className = "" }) {
  return (
    <div className={`payment-icons-row ${className}`.trim()}>
      <div className="payment-icons-list" role="list">
        {logos.map((logo) => (
          <span aria-label={logo.label} className={`payment-icon-logo ${logo.key}`} key={logo.key} role="img">
            <logo.Component />
          </span>
        ))}
      </div>
    </div>
  );
}
