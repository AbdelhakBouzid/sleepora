function normalizeCartEntry(entry) {
  if (entry && typeof entry === "object") {
    return {
      quantity: Math.max(1, Number(entry.quantity || entry.qty || 1)),
      product: entry.product && typeof entry.product === "object" ? entry.product : null
    };
  }

  return {
    quantity: Math.max(1, Number(entry || 1)),
    product: null
  };
}

export function buildCartLines(cart, products) {
  const productMap = new Map((products || []).map((product) => [String(product.id), product]));

  return Object.entries(cart || {})
    .map(([productId, entry]) => {
      const normalized = normalizeCartEntry(entry);
      const liveProduct = productMap.get(String(productId));
      const snapshot = normalized.product;
      const product = liveProduct
        ? {
            ...liveProduct,
            image: snapshot?.image || liveProduct.image,
            selectedColor: snapshot?.selectedColor || ""
          }
        : snapshot;
      if (!product) return null;
      return {
        id: String(productId),
        productId: String(product.id || productId),
        quantity: normalized.quantity,
        product
      };
    })
    .filter(Boolean);
}

export function calculateCartTotal(lines) {
  return (lines || []).reduce((sum, line) => sum + Number(line.product.price || 0) * Number(line.quantity || 0), 0);
}
