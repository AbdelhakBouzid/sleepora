const { methodNotAllowed, parseJsonBody, setNoStore } = require("../api_helpers/http");
const { sendOrderNotificationEmail } = require("../api_helpers/mailer");
const { insertOrder } = require("../api_helpers/ordersStore");
const { listProducts } = require("../api_helpers/productsStore");

function sanitizeNumber(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? Number(numeric.toFixed(2)) : 0;
}

function buildOrderId() {
  const stamp = Date.now();
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BA2I3-${stamp}-${suffix}`;
}

function normalizeCustomer(payload) {
  const customer = payload?.customer && typeof payload.customer === "object" ? payload.customer : {};
  return {
    name: String(customer.name || "").trim(),
    email: String(customer.email || "").trim(),
    phone: String(customer.phone || "").trim(),
    address: String(customer.address || "").trim(),
    city: String(customer.city || "").trim(),
    state: String(customer.state || customer.city || "").trim(),
    zip: String(customer.zip || "").trim(),
    country: String(customer.country || "").trim()
  };
}

function mapOrderItems(requestItems, products) {
  const catalog = new Map((products || []).map((product) => [String(product.id), product]));

  return (Array.isArray(requestItems) ? requestItems : [])
    .map((item) => {
      const productId = String(item?.id || item?.productId || "").trim();
      const product = catalog.get(productId);
      if (!product) return null;

      const quantity = Math.max(1, Number(item?.quantity || item?.qty || 1));
      const unitPrice = sanitizeNumber(item?.unit_price ?? item?.unitPrice ?? product?.price ?? 0);
      const lineTotal = sanitizeNumber(item?.line_total ?? item?.lineTotal ?? unitPrice * quantity);

      return {
        id: productId,
        name: String(product?.name || item?.name || "Product").trim(),
        quantity,
        qty: quantity,
        unit_price: unitPrice,
        line_total: lineTotal,
        image: String(item?.image || product?.image || "").trim(),
        color: String(item?.color || "").trim(),
        size: String(item?.size || "").trim()
      };
    })
    .filter(Boolean);
}

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method === "GET") {
    try {
      const products = await listProducts();
      return res.status(200).json({
        ok: true,
        products: Array.isArray(products) ? products : []
      });
    } catch (_error) {
      return res.status(500).json({ error: "Unable to load catalog" });
    }
  }

  if (req.method !== "POST") {
    return methodNotAllowed(res, "GET, POST");
  }

  try {
    const payload = parseJsonBody(req);
    const products = await listProducts();
    const customer = normalizeCustomer(payload);
    const items = mapOrderItems(payload?.items, products);
    const summary = payload?.summary && typeof payload.summary === "object" ? payload.summary : {};

    if (!customer.name || !customer.email || !customer.address || !customer.city || !customer.country) {
      return res.status(400).json({ error: "Missing customer details" });
    }

    if (!items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const subtotalAmount = sanitizeNumber(summary.subtotal ?? summary.subtotal_amount ?? items.reduce((sum, item) => sum + sanitizeNumber(item.line_total), 0));
    const discountAmount = sanitizeNumber(summary.discount ?? summary.discount_amount ?? 0);
    const shippingAmount = sanitizeNumber(summary.shipping ?? summary.shipping_amount ?? 0);
    const totalAmount = sanitizeNumber(summary.total ?? summary.total_amount ?? subtotalAmount - discountAmount + shippingAmount);
    const currency = String(summary.currency || payload?.currency || "MAD").trim().toUpperCase() || "MAD";
    const orderId = buildOrderId();

    const order = await insertOrder({
      id: orderId,
      order_number: orderId,
      ...customer,
      items,
      subtotal_amount: subtotalAmount,
      discount_amount: discountAmount,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      currency,
      payment_method: "cod",
      payment_status: "pending",
      order_status: "confirmed",
      created_at: new Date().toISOString(),
      delivery_estimate: "12-48 hours"
    });

    try {
      await sendOrderNotificationEmail(order);
    } catch (emailError) {
      console.error("[catalog] order email failed", emailError);
    }

    return res.status(200).json({ ok: true, order });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Unable to place order" });
  }
};
