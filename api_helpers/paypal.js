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

async function generatePayPalClientToken() {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();

  const response = await fetch(`${baseUrl}/v1/identity/generate-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  const payload = await response.json();
  const clientToken = String(payload?.client_token || "").trim();

  if (!response.ok || !clientToken) {
    throw new Error(buildPayPalError(payload, "Unable to generate PayPal client token"));
  }

  return clientToken;
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

function getStorefrontBaseCurrency() {
  return normalizeCurrency(process.env.STOREFRONT_BASE_CURRENCY || "USD");
}

function getExchangeRateApiBase() {
  return String(process.env.EXCHANGE_RATE_API_BASE || "https://api.frankfurter.dev").trim().replace(/\/+$/, "");
}

function getExchangeRateCacheTtlMs() {
  const numeric = Number(process.env.EXCHANGE_RATE_CACHE_TTL_MS || 12 * 60 * 60 * 1000);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 12 * 60 * 60 * 1000;
}

function roundCurrencyAmount(value) {
  return Number(Number(value || 0).toFixed(2));
}

function getExchangeRateCache() {
  const globalCache = globalThis.__sleeporaExchangeRateCache;
  if (globalCache instanceof Map) return globalCache;
  globalThis.__sleeporaExchangeRateCache = new Map();
  return globalThis.__sleeporaExchangeRateCache;
}

async function fetchExchangeRate(baseCurrency, targetCurrency) {
  const normalizedBaseCurrency = normalizeCurrency(baseCurrency);
  const normalizedTargetCurrency = normalizeCurrency(targetCurrency);

  if (normalizedBaseCurrency === normalizedTargetCurrency) {
    return 1;
  }

  const cache = getExchangeRateCache();
  const cacheKey = `${normalizedBaseCurrency}:${normalizedTargetCurrency}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < getExchangeRateCacheTtlMs()) {
    return cached.rate;
  }

  const params = new URLSearchParams({
    base: normalizedBaseCurrency,
    symbols: normalizedTargetCurrency
  });

  const response = await fetch(`${getExchangeRateApiBase()}/latest?${params.toString()}`);
  const payload = await response.json().catch(() => null);
  const rate = Number(payload?.rates?.[normalizedTargetCurrency]);

  if (!response.ok || !Number.isFinite(rate) || rate <= 0) {
    throw new Error(payload?.message || payload?.error || "Unable to load exchange rate");
  }

  cache.set(cacheKey, {
    rate,
    fetchedAt: Date.now()
  });

  return rate;
}

async function convertCheckoutPricing({ items = [], total = 0, targetCurrency = "", baseCurrency = "" } = {}) {
  const normalizedBaseCurrency = normalizeCurrency(baseCurrency || getStorefrontBaseCurrency());
  const requestedCurrency = normalizeCurrency(targetCurrency || normalizedBaseCurrency);
  const baseItems = (items || []).map((item) => ({
    ...item,
    unit_price: roundCurrencyAmount(item?.unit_price || 0)
  }));
  const baseTotal = roundCurrencyAmount(total);

  if (requestedCurrency === normalizedBaseCurrency) {
    return {
      currency: normalizedBaseCurrency,
      items: baseItems,
      total: baseTotal,
      exchangeRate: 1
    };
  }

  try {
    const exchangeRate = await fetchExchangeRate(normalizedBaseCurrency, requestedCurrency);
    const convertedItems = baseItems.map((item) => ({
      ...item,
      unit_price: roundCurrencyAmount(Number(item.unit_price || 0) * exchangeRate)
    }));
    const convertedTotal = roundCurrencyAmount(
      convertedItems.reduce((sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0), 0)
    );

    return {
      currency: requestedCurrency,
      items: convertedItems,
      total: convertedTotal,
      exchangeRate
    };
  } catch (_error) {
    return {
      currency: normalizedBaseCurrency,
      items: baseItems,
      total: baseTotal,
      exchangeRate: 1
    };
  }
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

function splitFullName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { givenName: "Customer", surname: "Customer" };
  if (parts.length === 1) return { givenName: parts[0], surname: "Customer" };
  return {
    givenName: parts[0],
    surname: parts.slice(1).join(" ")
  };
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

function buildPayPalExperienceContext({ returnUrl, cancelUrl }) {
  return {
    brand_name: "Sleepora",
    user_action: "PAY_NOW",
    shipping_preference: "SET_PROVIDED_ADDRESS",
    return_url: returnUrl,
    cancel_url: cancelUrl
  };
}

function buildCardPaymentSource({ returnUrl, cancelUrl, paymentSource = {} }) {
  const verificationMethod =
    String(paymentSource?.card?.attributes?.verification?.method || "").trim() || "SCA_WHEN_REQUIRED";

  return {
    card: {
      attributes: {
        verification: {
          method: verificationMethod
        }
      },
      experience_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl
      }
    }
  };
}

async function createPayPalOrder({ items, totalAmount, currency, customer, returnUrl, cancelUrl, paymentSource = null }) {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();
  const currencyCode = normalizeCurrency(currency);
  const cleanTotal = Number(totalAmount || 0).toFixed(2);
  const itemTotal = (items || [])
    .reduce((sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0), 0)
    .toFixed(2);

  const payerName = splitFullName(customer?.name || "");
  const shippingAddress = {
    address_line_1: String(customer?.address || "Address").slice(0, 300),
    admin_area_2: String(customer?.city || "").slice(0, 120),
    admin_area_1: String(customer?.state || customer?.city || "").slice(0, 120),
    postal_code: String(customer?.zip || "00000").slice(0, 20),
    country_code: toCountryCode(customer?.country)
  };

  const isCardFlow = Boolean(paymentSource?.card);
  const requestBody = {
    intent: "CAPTURE",
    payer: {
      email_address: String(customer?.email || "").slice(0, 127),
      name: {
        given_name: payerName.givenName.slice(0, 140),
        surname: payerName.surname.slice(0, 140)
      },
      address: shippingAddress
    },
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
        items: toPayPalItems(items, currencyCode),
        shipping: {
          name: { full_name: String(customer?.name || "Customer").slice(0, 300) },
          address: shippingAddress
        }
      }
    ]
  };

  if (isCardFlow) {
    requestBody.payment_source = buildCardPaymentSource({ returnUrl, cancelUrl, paymentSource });
  } else {
    requestBody.application_context = buildPayPalExperienceContext({ returnUrl, cancelUrl });
  }

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
  generatePayPalClientToken,
  normalizeCurrency,
  getStorefrontBaseCurrency,
  convertCheckoutPricing
};
