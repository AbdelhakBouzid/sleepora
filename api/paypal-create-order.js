const { parseJsonBody, methodNotAllowed, setNoStore } = require("../api_helpers/http");
const { resolveCheckoutItems } = require("../api_helpers/catalog");
const { convertCheckoutPricing, createPayPalOrder, getStorefrontBaseCurrency, normalizeCurrency } = require("../api_helpers/paypal");
const { setPendingOrder } = require("../api_helpers/ordersStore");

function validateCustomer(rawCustomer) {
  const customer = {
    name: String(rawCustomer?.name || rawCustomer?.fullName || `${rawCustomer?.firstName || ""} ${rawCustomer?.lastName || ""}`).trim(),
    email: String(rawCustomer?.email || "").trim(),
    phone: String(rawCustomer?.phone || "").trim(),
    address: String(rawCustomer?.address || "").trim(),
    city: String(rawCustomer?.city || "").trim(),
    state: String(rawCustomer?.state || rawCustomer?.city || "").trim(),
    zip: String(rawCustomer?.zip || rawCustomer?.postalCode || "").trim(),
    country: String(rawCustomer?.country || "US").trim()
  };

  if (
    !customer.name ||
    !customer.email ||
    !customer.address ||
    !customer.city ||
    !customer.country
  ) {
    return { ok: false, error: "Missing customer fields" };
  }

  if (!customer.email.includes("@")) {
    return { ok: false, error: "Invalid email" };
  }

  return { ok: true, customer };
}

function getSiteOrigin(req) {
  const explicit = String(process.env.SITE_URL || "").trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const host = String(req.headers?.host || "").trim();
  if (!host) return "http://localhost:5173";
  const proto = String(req.headers?.["x-forwarded-proto"] || "").trim() || "https";
  return `${proto}://${host}`;
}

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "POST") {
    return methodNotAllowed(res, "POST");
  }

  try {
    const payload = parseJsonBody(req);
    const validation = validateCustomer(payload?.customer || {});
    if (!validation.ok) {
      return res.status(400).json({ error: validation.error });
    }

    const checkout = await resolveCheckoutItems(payload?.items);
    if (!checkout.ok) {
      return res.status(400).json({ error: checkout.error });
    }

    const requestedCurrency = normalizeCurrency(
      payload?.currency || process.env.PAYPAL_CURRENCY || getStorefrontBaseCurrency()
    );
    const pricing = await convertCheckoutPricing({
      items: checkout.items,
      total: checkout.total,
      targetCurrency: requestedCurrency,
      baseCurrency: getStorefrontBaseCurrency()
    });
    const currency = pricing.currency;
    const origin = getSiteOrigin(req);
    const returnUrl = `${origin}/checkout/success`;
    const cancelUrl = `${origin}/checkout/cancel`;

    const paypalOrder = await createPayPalOrder({
      items: pricing.items,
      totalAmount: pricing.total,
      currency,
      customer: validation.customer,
      returnUrl,
      cancelUrl,
      paymentSource: payload?.payment_source || null
    });

    const approveUrl = Array.isArray(paypalOrder?.links)
      ? String(paypalOrder.links.find((item) => item?.rel === "approve")?.href || "")
      : "";

    await setPendingOrder(paypalOrder.id, {
      customer: validation.customer,
      items: pricing.items,
      total_amount: Number(pricing.total.toFixed(2)),
      currency,
      created_at: new Date().toISOString()
    });

    return res.status(200).json({
      ok: true,
      orderId: paypalOrder.id,
      approveUrl
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to create PayPal order" });
  }
};
