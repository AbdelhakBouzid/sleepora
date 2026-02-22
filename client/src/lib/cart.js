export function buildCartLines(cart, products) {
  const productMap = new Map((products || []).map((product) => [String(product.id), product]));

  return Object.entries(cart || {})
    .map(([productId, quantity]) => {
      const product = productMap.get(String(productId));
      if (!product) return null;
      return {
        id: String(productId),
        quantity: Math.max(1, Number(quantity || 1)),
        product
      };
    })
    .filter(Boolean);
}

export function calculateCartTotal(lines) {
  return (lines || []).reduce((sum, line) => sum + Number(line.product.price || 0) * Number(line.quantity || 0), 0);
}
