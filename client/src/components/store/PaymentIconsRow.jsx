function VisaLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 78 24">
      <path
        d="M21.2 16.8h-2.6L20.7 7h2.6l-2.1 9.8Zm10.9-6.4 1.4-3.7.8 3.7h-2.2Zm3.1 6.4h2.6L35.4 7h-2.3c-.5 0-.9.2-1.1.7L28 16.8h2.9l.5-1.5h3.6Zm-7.1-3.1c0-2.6-3.5-2.6-3.5-3.9 0-.3.3-.8 1-.8.4 0 1.2 0 2.2.4l.4-2a6.7 6.7 0 0 0-2.1-.3c-2.2 0-3.8 1.2-3.8 2.8 0 1.2 1.1 1.9 1.9 2.3.8.4 1.1.7 1.1 1.1 0 .5-.7.8-1.4.8-.8 0-1.7-.2-2.5-.6l-.4 2c.7.3 1.8.6 2.9.6 2.4 0 4-1.2 4-3.1Zm-10.8-6.7-4.6 9.8h-2.9L8.3 7h2.9l1.2 6.4L15.1 7h2.8Z"
        fill="#1A1F71"
      />
    </svg>
  );
}

function MasterCardLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 78 24">
      <circle cx="34" cy="12" fill="#EB001B" r="6.6" />
      <circle cx="45" cy="12" fill="#F79E1B" r="6.6" />
      <path d="M39.5 7.3a6.6 6.6 0 0 0 0 9.4 6.6 6.6 0 0 0 0-9.4Z" fill="#FF5F00" />
    </svg>
  );
}

function PayPalLogo() {
  return (
    <svg aria-hidden="true" className="payment-logo-svg" viewBox="0 0 78 24">
      <path
        d="M26.7 6.4h-4.4c-.3 0-.5.2-.6.4l-1.8 10.4c0 .2.1.4.3.4h2.1c.3 0 .5-.2.6-.5l.5-2.9c.1-.3.3-.4.6-.4h1.4c2.8 0 4.4-1.4 4.8-4.2.2-1.2 0-2.1-.5-2.7-.6-.6-1.6-.9-3-.9Zm.5 3.8c-.2 1.4-1.3 1.4-2.4 1.4h-.6l.4-2.5c0-.1.1-.2.2-.2h.3c.8 0 1.6 0 2 .4.3.2.3.5.1.9Z"
        fill="#003087"
      />
      <path
        d="m38.8 10.1-.3 2h-1.9c-.2 0-.3.1-.4.3l-.1.8-.3 2.3-.1.6c0 .1.1.2.2.2h3.5c.2 0 .4-.1.4-.3v-.1l.7-4.3v-.2c0-.2-.1-.3-.3-.3h-1.1Z"
        fill="#009CDE"
      />
      <path
        d="M41.9 7.4a4.7 4.7 0 0 0-2.3-.5h-4.3c-.3 0-.5.2-.6.4l-1.4 8.2c0 .2.1.4.3.4h2.1l.5-3.1v.1c.1-.2.2-.3.4-.3h.9c1.8 0 3.2-.7 3.6-2.9v-.1c0-.1 0-.2.1-.3.1-.8 0-1.4-.3-1.9Z"
        fill="#012169"
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
