const CATALOG_PATH = "/data/products.json";

const defaultCatalog = [
  {
    id: "neck-pillow",
    name: "Ergonomic Memory Foam Neck Pillow",
    price: 49.99,
    description: "Engineered contour support that helps align your neck for deeper and more restorative sleep.",
    featured: true,
    image: "/images/products/neck-pillow-main.jpg",
    benefits: ["Relieves neck pain", "Improves sleep posture", "Premium comfort", "Designed for deep sleep"]
  },
  {
    id: "sleep-mask",
    name: "Premium Sleep Mask",
    price: 19.99,
    description: "Soft light-blocking mask designed for uninterrupted rest at home or while traveling.",
    featured: false,
    image: "/images/products/sleep-mask-main.jpg",
    benefits: ["Blocks ambient light", "Skin-friendly fabric", "Breathable fit", "Travel-ready comfort"]
  },
  {
    id: "white-noise-machine",
    name: "White Noise Machine",
    price: 39.99,
    description: "A minimalist white noise companion with calming sound profiles for faster sleep onset.",
    featured: false,
    image: "/images/products/white-noise-main.jpg",
    benefits: ["Masks background noise", "Calm sleep ambience", "Simple bedside controls", "Compact premium design"]
  }
];

function normalizeProduct(product, index) {
  const id = String(product?.id || `product-${index + 1}`);
  const name = String(product?.name || "").trim();
  return {
    id,
    name,
    price: Number(product?.price || 0),
    description: String(product?.description || ""),
    featured: Boolean(product?.featured),
    image: String(product?.image || ""),
    benefits: Array.isArray(product?.benefits)
      ? product.benefits.map((item) => String(item)).filter(Boolean)
      : []
  };
}

export function normalizeCatalog(items) {
  const list = Array.isArray(items) ? items : [];
  return list.map((item, index) => normalizeProduct(item, index)).filter((item) => item.name);
}

export async function fetchCatalog() {
  try {
    const response = await fetch(CATALOG_PATH, { cache: "no-store" });
    if (!response.ok) throw new Error("Catalog load failed");
    const payload = await response.json();
    const normalized = normalizeCatalog(payload);
    return normalized.length ? normalized : defaultCatalog;
  } catch (_error) {
    return defaultCatalog;
  }
}

export function findFeaturedProduct(products) {
  const list = Array.isArray(products) ? products : [];
  return list.find((item) => item.featured) || list[0] || null;
}

export function findProductById(products, id) {
  const target = String(id || "");
  return (products || []).find((item) => String(item.id) === target) || null;
}
