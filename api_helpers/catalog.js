const fs = require("fs");
const path = require("path");
const { listProducts } = require("./productsStore");

const fallbackCatalog = [];

function readCatalog() {
  const catalogPath = path.join(process.cwd(), "client", "public", "data", "products.json");
  try {
    const raw = fs.readFileSync(catalogPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallbackCatalog;
  } catch (_error) {
    return fallbackCatalog;
  }
}

function buildProductMapFromList(products) {
  const map = new Map();
  for (const product of products || []) {
    const id = String(product?.id || "");
    if (!id) continue;
    map.set(id, {
      id,
      name: String(product?.name || "Product"),
      price: Number(product?.price || 0)
    });
  }
  return map;
}

async function buildProductMap() {
  try {
    const liveProducts = await listProducts();
    if (Array.isArray(liveProducts) && liveProducts.length) {
      return buildProductMapFromList(liveProducts);
    }
  } catch (_error) {
    // Fallback to static catalog.
  }
  return buildProductMapFromList(readCatalog());
}

function normalizeRequestedItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .map((item) => ({
      id: String(item?.id || item?.productId || "").trim(),
      quantity: Math.max(1, Math.trunc(Number(item?.quantity || item?.qty || 1)))
    }))
    .filter((item) => item.id && Number.isFinite(item.quantity));
}

async function resolveCheckoutItems(rawItems) {
  const requestedItems = normalizeRequestedItems(rawItems);
  const productMap = await buildProductMap();
  const items = [];

  for (const requestItem of requestedItems) {
    const product = productMap.get(requestItem.id);
    if (!product) {
      return {
        ok: false,
        error: `Unknown product: ${requestItem.id}`
      };
    }
    items.push({
      id: product.id,
      name: product.name,
      quantity: requestItem.quantity,
      unit_price: Number(product.price || 0)
    });
  }

  if (!items.length) {
    return {
      ok: false,
      error: "Cart is empty"
    };
  }

  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  return {
    ok: true,
    items,
    total
  };
}

module.exports = {
  resolveCheckoutItems
};
