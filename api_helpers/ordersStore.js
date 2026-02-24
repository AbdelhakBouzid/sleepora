const fs = require("fs/promises");
const path = require("path");

const defaultStore = {
  orders: [],
  pendingByPayPalOrderId: {}
};

function resolveStorePath() {
  if (process.env.ORDER_STORE_PATH) {
    return process.env.ORDER_STORE_PATH;
  }

  if (process.env.VERCEL) {
    return "/tmp/sleepora-orders-store.json";
  }

  return path.join(process.cwd(), ".data", "sleepora-orders-store.json");
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

const kvStoreKey = "sleepora:orders_store:v1";

function normalizeStore(raw) {
  const orders = Array.isArray(raw?.orders) ? raw.orders : [];
  const pendingByPayPalOrderId =
    raw?.pendingByPayPalOrderId && typeof raw.pendingByPayPalOrderId === "object"
      ? raw.pendingByPayPalOrderId
      : {};
  return {
    orders,
    pendingByPayPalOrderId
  };
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
  if (hasKvConfig()) {
    await kvCommand(["SET", kvStoreKey, JSON.stringify(normalizeStore(nextStore))]);
    return;
  }

  const filePath = resolveStorePath();
  await ensureStoreDir(filePath);
  await fs.writeFile(filePath, JSON.stringify(normalizeStore(nextStore), null, 2), "utf8");
}

async function setPendingOrder(payPalOrderId, payload) {
  const store = await readStore();
  store.pendingByPayPalOrderId[String(payPalOrderId)] = payload;
  await writeStore(store);
}

async function getPendingOrder(payPalOrderId) {
  const store = await readStore();
  return store.pendingByPayPalOrderId[String(payPalOrderId)] || null;
}

async function deletePendingOrder(payPalOrderId) {
  const store = await readStore();
  delete store.pendingByPayPalOrderId[String(payPalOrderId)];
  await writeStore(store);
}

async function findOrderByPayPalOrderId(payPalOrderId) {
  const store = await readStore();
  return (
    store.orders.find((order) => String(order?.paypal_order_id || "") === String(payPalOrderId || "")) || null
  );
}

async function insertPaidOrder(order) {
  const store = await readStore();
  const exists = store.orders.find(
    (item) => String(item?.paypal_order_id || "") === String(order?.paypal_order_id || "")
  );

  if (exists) return exists;

  store.orders.unshift(order);
  await writeStore(store);
  return order;
}

async function listPaidOrders() {
  const store = await readStore();
  return store.orders
    .filter((order) => String(order?.payment_status || "").toLowerCase() === "paid")
    .sort((a, b) => Date.parse(b?.created_at || 0) - Date.parse(a?.created_at || 0));
}

module.exports = {
  getPendingOrder,
  setPendingOrder,
  deletePendingOrder,
  findOrderByPayPalOrderId,
  insertPaidOrder,
  listPaidOrders
};
