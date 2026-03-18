export const CART_MAX_ITEM_QUANTITY = 20;

export function clampCartQuantity(value, minimum = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return minimum;
  return Math.max(minimum, Math.min(CART_MAX_ITEM_QUANTITY, Math.trunc(parsed)));
}

export function normalizeCartEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      quantity: clampCartQuantity(entry.quantity ?? entry.qty ?? 1, 1),
      product: entry.product && typeof entry.product === "object" ? entry.product : null
    };
  }

  return {
    quantity: clampCartQuantity(entry ?? 1, 1),
    product: null
  };
}

function extractProductId(cartKey, snapshot) {
  const snapshotId = String(snapshot?.id || "").trim();
  if (snapshotId) return snapshotId;
  return String(cartKey || "").split("::")[0].trim();
}

export function buildCartLines(cart, products) {
  const productMap = new Map((products || []).map((product) => [String(product.id), product]));

  const lines = Object.entries(cart || {})
    .map(([cartKey, entry]) => {
      const normalized = normalizeCartEntry(entry);
      const snapshot = normalized.product;
      const productId = extractProductId(cartKey, snapshot);
      const liveProduct = productMap.get(String(productId));
      const product = liveProduct
        ? {
            ...liveProduct,
            image: snapshot?.image || liveProduct.image,
            selectedColor: snapshot?.selectedColor || "",
            selectedSize: snapshot?.selectedSize || ""
          }
        : snapshot;
      if (!product) return null;
      return {
        id: String(cartKey),
        productId: String(product.id || productId),
        quantity: normalized.quantity,
        product
      };
    })
    .filter(Boolean);

  const merged = new Map();

  for (const line of lines) {
    const colorKey = String(line.product?.selectedColor || "").trim().toLowerCase();
    const sizeKey = String(line.product?.selectedSize || "").trim().toLowerCase();
    const mergeKey = [String(line.productId || ""), sizeKey || "_", colorKey || "_"].join("::");
    const existing = merged.get(mergeKey);

    if (existing) {
      existing.quantity += Number(line.quantity || 0);
      continue;
    }

    merged.set(mergeKey, {
      ...line,
      quantity: Number(line.quantity || 0)
    });
  }

  return Array.from(merged.values());
}

export function calculateCartTotal(lines) {
  return (lines || []).reduce((sum, line) => sum + Number(line.product.price || 0) * Number(line.quantity || 0), 0);
}
