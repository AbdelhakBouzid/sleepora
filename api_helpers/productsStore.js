const fs = require("fs/promises");
const path = require("path");

const defaultStore = {
  products: []
};

const kvStoreKey = "sleepora:products_store:v1";

function resolveStorePath() {
  if (process.env.PRODUCT_STORE_PATH) {
    return process.env.PRODUCT_STORE_PATH;
  }

  if (process.env.VERCEL) {
    return "/tmp/sleepora-products-store.json";
  }

  return path.join(process.cwd(), ".data", "sleepora-products-store.json");
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

function normalizeStore(raw) {
  const products = Array.isArray(raw?.products) ? raw.products : [];
  return { products };
}

async function ensureStoreDir(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function readSeedProducts() {
  try {
    const bundled = require("../client/public/data/products.json");
    if (Array.isArray(bundled)) {
      return bundled;
    }
  } catch (_error) {
    // Ignore if bundled file is unavailable in this runtime.
  }

  const candidates = [
    path.join(process.cwd(), "client", "public", "data", "products.json"),
    path.join(process.cwd(), "public", "data", "products.json")
  ];

  for (const filePath of candidates) {
    try {
      const content = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (_error) {
      // Ignore and continue with next candidate.
    }
  }

  return [];
}

async function readStore() {
  if (hasKvConfig()) {
    try {
      const raw = await kvCommand(["GET", kvStoreKey]);
      if (!raw) {
        const seedProducts = await readSeedProducts();
        return { products: seedProducts };
      }
      return normalizeStore(JSON.parse(raw));
    } catch (_error) {
      const seedProducts = await readSeedProducts();
      return { products: seedProducts };
    }
  }

  const filePath = resolveStorePath();

  try {
    const content = await fs.readFile(filePath, "utf8");
    return normalizeStore(JSON.parse(content));
  } catch (_error) {
    const seedProducts = await readSeedProducts();
    return { products: seedProducts };
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

async function listProducts() {
  const store = await readStore();
  return Array.isArray(store.products) ? store.products : [];
}

async function saveProducts(products) {
  const safe = Array.isArray(products) ? products : [];
  const nextStore = { products: safe };
  await writeStore(nextStore);
  return safe;
}

module.exports = {
  listProducts,
  saveProducts
};
