function getPayPalBaseUrl() {
  const explicit = String(process.env.PAYPAL_API_BASE || "").trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const env = String(process.env.PAYPAL_ENV || "").toLowerCase();
  if (env === "sandbox") return "https://api-m.sandbox.paypal.com";
  return "https://api-m.paypal.com";
}

function getPayPalConfig() {
  const clientId = String(process.env.PAYPAL_CLIENT_ID || "").trim();
  const clientSecret = String(process.env.PAYPAL_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
  }
  return { clientId, clientSecret, baseUrl: getPayPalBaseUrl() };
}

async function getPayPalAccessToken() {
  const { clientId, clientSecret, baseUrl } = getPayPalConfig();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const payload = await response.json();
  if (!response.ok || !payload?.access_token) {
    throw new Error(payload?.error_description || payload?.error || "Unable to authenticate with PayPal");
  }

  return payload.access_token;
}

function toCountryCode(country) {
  const clean = String(country || "US").trim().toUpperCase();
  if (clean.length === 2) return clean;
  if (clean === "MOROCCO" || clean === "MAROC") return "MA";
  if (clean === "UNITED STATES" || clean === "USA") return "US";
  return "US";
}

function normalizeCurrency(currency) {
  const clean = String(currency || "USD").trim().toUpperCase();
  return clean || "USD";
}

function toPayPalItems(items, currencyCode) {
  return (items || []).map((item) => ({
    name: String(item.name || "Product").slice(0, 127),
    unit_amount: {
      currency_code: currencyCode,
      value: Number(item.unit_price || 0).toFixed(2)
    },
    quantity: String(Math.max(1, Number(item.quantity || 1))),
    category: "PHYSICAL_GOODS"
  }));
}

function buildPayPalError(payload, fallbackMessage) {
  const message = String(payload?.message || fallbackMessage || "PayPal request failed").trim();
  const details = Array.isArray(payload?.details) ? payload.details : [];
  if (!details.length) return message;

  const detailText = details
    .map((item) => {
      const issue = String(item?.issue || "").trim();
      const description = String(item?.description || "").trim();
      return [issue, description].filter(Boolean).join(": ");
    })
    .filter(Boolean)
    .join(" | ");

  return detailText ? `${message} - ${detailText}` : message;
}

async function createPayPalOrder({ items, totalAmount, currency, customer, returnUrl, cancelUrl }) {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();
  const currencyCode = normalizeCurrency(currency);
  const cleanTotal = Number(totalAmount || 0).toFixed(2);
  const itemTotal = (items || [])
    .reduce((sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0), 0)
    .toFixed(2);

  const requestBody = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: "sleepora-order",
        description: "Sleepora purchase",
        amount: {
          currency_code: currencyCode,
          value: cleanTotal,
          breakdown: {
            item_total: {
              currency_code: currencyCode,
              value: itemTotal
            }
          }
        },
        items: toPayPalItems(items, currencyCode)
      }
    ],
    application_context: {
      brand_name: "Sleepora",
      user_action: "PAY_NOW",
      shipping_preference: "NO_SHIPPING",
      return_url: returnUrl,
      cancel_url: cancelUrl
    }
  };

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  const payload = await response.json();
  if (!response.ok || !payload?.id) {
    throw new Error(buildPayPalError(payload, "PayPal order creation failed"));
  }

  return payload;
}

async function capturePayPalOrder(orderId) {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();
  const id = String(orderId || "").trim();
  if (!id) throw new Error("Missing PayPal order id");

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(id)}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(buildPayPalError(payload, "PayPal capture failed"));
  }
  return payload;
}

module.exports = {
  createPayPalOrder,
  capturePayPalOrder,
  normalizeCurrency
};
