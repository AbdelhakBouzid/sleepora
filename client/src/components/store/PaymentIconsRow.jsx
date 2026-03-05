function VisaLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 104 28">
      <path d="M28.7 19.8h-3.3L28 8h3.3l-2.6 11.8Zm13.7-7.7 1.7-4.5 1 4.5h-2.7Zm3.8 7.7h3.1L46.6 8h-2.8c-.6 0-1.1.3-1.3.9l-4.8 10.9h3.5l.6-1.8H46.2Zm-8.9-3.7c0-3.1-4.3-3.2-4.3-4.7 0-.4.4-.9 1.3-1 .5-.1 1.5-.1 2.8.5l.5-2.4a7.9 7.9 0 0 0-2.6-.4c-2.7 0-4.6 1.4-4.6 3.4 0 1.5 1.3 2.3 2.3 2.8 1 .5 1.4.8 1.4 1.3 0 .7-.9 1-1.7 1-.9 0-2-.2-3-.7l-.5 2.5c.8.4 2.2.7 3.5.7 2.9 0 4.9-1.4 4.9-3.7Zm-13.4-8.1-5.5 11.8h-3.5L16.7 8h3.5l1.5 7.6L25 8h3.4Z" fill="#1a1f71" />
    </svg>
  );
}

function MasterCardLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 104 28">
      <circle cx="42" cy="14" fill="#eb001b" r="8.4" />
      <circle cx="56" cy="14" fill="#f79e1b" r="8.4" />
      <path d="M49 8.1a8.4 8.4 0 0 0 0 11.8 8.4 8.4 0 0 0 0-11.8Z" fill="#ff5f00" />
      <text fill="#252525" fontFamily="Manrope, Arial, sans-serif" fontSize="5.8" fontWeight="700" x="24" y="25">
        mastercard
      </text>
    </svg>
  );
}

function PayPalLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 104 28">
      <path
        d="M24.2 6.2c-2.4 0-4.2 1.7-4.7 4.1l-1.9 10h3.4l.5-2.9h2.2c3.4 0 5.6-1.9 5.6-5 0-3.5-2.2-6.2-5.1-6.2Zm-.3 8h-1.7l.6-3.4h1.8c1.2 0 1.8.6 1.8 1.6 0 1.1-.8 1.8-2.5 1.8Z"
        fill="#003087"
      />
      <path
        d="M37.7 6.2c-2.3 0-4 1.4-4.4 3.7L31.9 20.3h3l.2-1.3c.8 1 1.9 1.5 3.4 1.5 3.1 0 5.4-2.5 5.4-5.9 0-2.8-1.9-5-4.7-5Zm.2 10.7c-1.4 0-2.4-.9-2.4-2.3 0-1.6 1.1-2.8 2.8-2.8 1.4 0 2.4.9 2.4 2.3 0 1.6-1.1 2.8-2.8 2.8Z"
        fill="#009cde"
      />
      <path
        d="M53.4 6.4 49.1 20.3h-3.2l-2.7-13.9h3.3l1.5 8.2 3.4-8.2h3.3Zm3.4 0-2.5 13.9h3.1l2.5-13.9h-3.1Zm9-.2c-3.4 0-6 3-6 6.9 0 4.6 3 7.4 7.6 7.4 1.4 0 2.8-.3 3.8-.8l.6-3.1c-1.2.7-2.5 1-3.9 1-2.6 0-4.2-1.5-4.2-4 0-2.4 1.5-4.5 3.9-4.5 1.1 0 2.1.3 2.9.9l.6-3.1a7.4 7.4 0 0 0-3.7-.7Z"
        fill="#003087"
      />
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
