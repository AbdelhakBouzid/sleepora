const fs = require("fs/promises");
const path = require("path");

const defaultStore = {
  orders: []
};

function resolveStorePath() {
  if (process.env.ORDER_STORE_PATH) {
    return process.env.ORDER_STORE_PATH;
  }

  if (process.env.VERCEL) {
    return "/tmp/ba2i3-orders-store.json";
  }

  return path.join(process.cwd(), ".data", "ba2i3-orders-store.json");
}

async function ensureStoreDir(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

function hasKvConfig() {
  return Boolean(String(process.env.KV_REST_API_URL || "").trim() && String(process.env.KV_REST_API_TOKEN || "").trim());
}

async function kvCommand(commandArgs) {
  const url = String(process.env.KV_REST_API_URL || "").trim();
  const token = String(process.env.KV_REST_API_TOKEN || "").trim();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commandArgs)
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "KV request failed");
  }
  return payload?.result;
}

const kvStoreKey = "ba2i3:orders_store:v1";

function normalizeOrder(order) {
  if (!order || typeof order !== "object") return null;
  return {
    id: String(order.id || order.order_number || `BA2I3-${Date.now()}`),
    order_number: String(order.order_number || order.id || ""),
    name: String(order.name || "").trim(),
    email: String(order.email || "").trim(),
    phone: String(order.phone || "").trim(),
    address: String(order.address || "").trim(),
    city: String(order.city || "").trim(),
    state: String(order.state || "").trim(),
    zip: String(order.zip || "").trim(),
    country: String(order.country || "").trim(),
    items: Array.isArray(order.items) ? order.items : [],
    subtotal_amount: Number(order.subtotal_amount || 0),
    discount_amount: Number(order.discount_amount || 0),
    shipping_amount: Number(order.shipping_amount || 0),
    total_amount: Number(order.total_amount || 0),
    currency: String(order.currency || "USD").trim().toUpperCase(),
    payment_method: String(order.payment_method || "cod").trim().toLowerCase(),
    payment_status: String(order.payment_status || "pending").trim().toLowerCase(),
    order_status: String(order.order_status || "new").trim().toLowerCase(),
    created_at: String(order.created_at || new Date().toISOString()),
    delivery_estimate: String(order.delivery_estimate || "5-10 business days")
  };
}

function normalizeStore(raw) {
  const orders = Array.isArray(raw?.orders) ? raw.orders.map(normalizeOrder).filter(Boolean) : [];
  return { orders };
}

async function readStore() {
  if (hasKvConfig()) {
    try {
      const raw = await kvCommand(["GET", kvStoreKey]);
      if (!raw) return { ...defaultStore };
      return normalizeStore(JSON.parse(raw));
    } catch (_error) {
      return { ...defaultStore };
    }
  }

  const filePath = resolveStorePath();

  try {
    const content = await fs.readFile(filePath, "utf8");
    return normalizeStore(JSON.parse(content));
  } catch (_error) {
    return { ...defaultStore };
  }
}

async function writeStore(nextStore) {
  const normalized = normalizeStore(nextStore);

  if (hasKvConfig()) {
    await kvCommand(["SET", kvStoreKey, JSON.stringify(normalized)]);
    return;
  }

  const filePath = resolveStorePath();
  await ensureStoreDir(filePath);
  await fs.writeFile(filePath, JSON.stringify(normalized, null, 2), "utf8");
}

async function insertOrder(order) {
  const normalizedOrder = normalizeOrder(order);
  const store = await readStore();
  const existingIndex = store.orders.findIndex((item) => String(item?.id || "") === String(normalizedOrder.id || ""));

  if (existingIndex >= 0) {
    store.orders[existingIndex] = normalizedOrder;
  } else {
    store.orders.unshift(normalizedOrder);
  }

  await writeStore(store);
  return normalizedOrder;
}

async function listOrders() {
  const store = await readStore();
  return [...store.orders].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

module.exports = {
  insertOrder,
  listOrders
};
