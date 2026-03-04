const { parseJsonBody, methodNotAllowed, setNoStore } = require("../api_helpers/http");
const { capturePayPalOrder, normalizeCurrency } = require("../api_helpers/paypal");
const {
  getPendingOrder,
  deletePendingOrder,
  findOrderByPayPalOrderId,
  insertPaidOrder
} = require("../api_helpers/ordersStore");
const { sendOrderNotificationEmail } = require("../api_helpers/mailer");

function getCaptureStatus(capturePayload) {
  const captureStatus = String(
    capturePayload?.purchase_units?.[0]?.payments?.captures?.[0]?.status || capturePayload?.status || ""
  ).toUpperCase();
  return captureStatus;
}

function getCaptureId(capturePayload) {
  return String(capturePayload?.purchase_units?.[0]?.payments?.captures?.[0]?.id || "").trim();
}

function getCapturedAmount(capturePayload) {
  const purchaseUnit = capturePayload?.purchase_units?.[0] || {};
  const capture = purchaseUnit?.payments?.captures?.[0] || {};
  const value = Number(capture?.amount?.value || purchaseUnit?.amount?.value || 0);
  return Number.isFinite(value) ? value : 0;
}

function getCapturedCurrency(capturePayload, fallback) {
  const purchaseUnit = capturePayload?.purchase_units?.[0] || {};
  const capture = purchaseUnit?.payments?.captures?.[0] || {};
  return normalizeCurrency(capture?.amount?.currency_code || purchaseUnit?.amount?.currency_code || fallback || "USD");
}

function detectPaymentMethod(capturePayload) {
  const source = capturePayload?.payment_source || {};
  if (source?.card) return "card";
  if (source?.paypal) return "paypal";

  const payerId = String(capturePayload?.payer?.payer_id || "").trim();
  if (payerId) return "paypal";
  return "unknown";
}

function fallbackCustomerFromPayPal(capturePayload) {
  const payer = capturePayload?.payer || {};
  const fullName = `${payer?.name?.given_name || ""} ${payer?.name?.surname || ""}`.trim();
  const shippingAddress = capturePayload?.purchase_units?.[0]?.shipping?.address || {};
  return {
    name: fullName || "PayPal Customer",
    email: String(payer?.email_address || "").trim(),
    phone: "",
    address: String(shippingAddress?.address_line_1 || "").trim(),
    city: String(shippingAddress?.admin_area_2 || "").trim(),
    state: String(shippingAddress?.admin_area_1 || "").trim(),
    zip: String(shippingAddress?.postal_code || "").trim(),
    country: String(shippingAddress?.country_code || "US").trim()
  };
}

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "POST") {
    return methodNotAllowed(res, "POST");
  }

  try {
    const payload = parseJsonBody(req);
    const orderId = String(payload?.orderId || payload?.paypalOrderId || "").trim();
    if (!orderId) {
      return res.status(400).json({ error: "Missing PayPal order id" });
    }

    const existing = await findOrderByPayPalOrderId(orderId);
    if (existing) {
      return res.status(200).json({
        ok: true,
        status: "COMPLETED",
        orderId: existing.id,
        paypalOrderId: existing.paypal_order_id,
        paypalCaptureId: existing.paypal_capture_id,
        customerEmail: existing.email,
        paymentMethod: existing.payment_method,
        deliveryEstimate: "5-10 business days",
        paymentStatus: existing.payment_status,
        existing: true
      });
    }

    const capturePayload = await capturePayPalOrder(orderId);
    const status = getCaptureStatus(capturePayload);

    if (status !== "COMPLETED") {
      return res.status(400).json({
        error: "PayPal payment not completed",
        status
      });
    }

    const pending = await getPendingOrder(orderId);
    const customer = pending?.customer || fallbackCustomerFromPayPal(capturePayload);
    const items = Array.isArray(pending?.items) ? pending.items : [];
    const totalAmount = pending?.total_amount || getCapturedAmount(capturePayload);
    const currency = getCapturedCurrency(capturePayload, pending?.currency);

    const paidOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(customer?.name || "").trim(),
      email: String(customer?.email || "").trim(),
      phone: String(customer?.phone || "").trim(),
      address: String(customer?.address || "").trim(),
      city: String(customer?.city || "").trim(),
      state: String(customer?.state || "").trim(),
      zip: String(customer?.zip || "").trim(),
      country: String(customer?.country || "").trim(),
      items,
      total_amount: Number(Number(totalAmount || 0).toFixed(2)),
      currency,
      paypal_order_id: orderId,
      paypal_capture_id: getCaptureId(capturePayload),
      payment_method: detectPaymentMethod(capturePayload),
      payment_status: "paid",
      created_at: new Date().toISOString()
    };

    const saved = await insertPaidOrder(paidOrder);
    await deletePendingOrder(orderId);

    let emailSent = false;
    try {
      await sendOrderNotificationEmail(saved);
      emailSent = true;
    } catch (emailError) {
      console.error("[paypal-capture-order] email send failed:", emailError?.message || emailError);
    }

    return res.status(200).json({
      ok: true,
      status: "COMPLETED",
      orderId: saved.id,
      paypalOrderId: saved.paypal_order_id,
      paypalCaptureId: saved.paypal_capture_id,
      customerEmail: saved.email,
      paymentMethod: saved.payment_method,
      deliveryEstimate: "5-10 business days",
      paymentStatus: saved.payment_status,
      emailSent
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to capture PayPal payment" });
  }
};
