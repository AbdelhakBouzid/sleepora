const CATALOG_API_PATH = "/api/catalog";
const CATALOG_STATIC_PATH = "/data/products.json";

const defaultCatalog = [
  {
    id: "neck-pillow-contour",
    name: "Contour Memory Foam Neck Pillow",
    price: 59.99,
    description: "Ergonomic cervical support that helps keep your spine aligned and pressure-free all night.",
    category: "pillows",
    featured: true,
    image: "/images/products/neck-pillow-contour.webp",
    colors: ["White", "Gray", "Black"],
    variants: [
      { color: "White", image: "/images/products/neck-pillow-contour.webp" },
      { color: "Gray", image: "/images/products/neck-pillow-contour.webp" },
      { color: "Black", image: "/images/products/neck-pillow-contour.webp" }
    ],
    benefits: [
      "Contours to neck and shoulder shape",
      "Supports side and back sleepers",
      "Breathable cover for cooler sleep",
      "Designed for long-term comfort"
    ]
  },
  {
    id: "white-noise-dreamglow",
    name: "DreamGlow White Noise Machine",
    price: 44.99,
    description: "Soft ambient sound machine with warm base glow and timer presets for easier sleep onset.",
    category: "machines",
    featured: false,
    image: "/images/products/white-noise-dreamglow.jpg",
    colors: ["White", "Ivory"],
    variants: [
      { color: "White", image: "/images/products/white-noise-dreamglow.jpg" },
      { color: "Ivory", image: "/images/products/white-noise-dreamglow.jpg" }
    ],
    benefits: [
      "Multiple calming sound profiles",
      "Warm sleep-friendly night glow",
      "Simple one-touch controls",
      "Compact bedside footprint"
    ]
  },
  {
    id: "white-noise-renpho",
    name: "RENPHO Smart Sleep Sound Machine",
    price: 64.99,
    description: "Premium white-noise unit with light ring, adjustable volume dial, and sleep timer options.",
    category: "machines",
    featured: false,
    image: "/images/products/white-noise-renpho.jpg",
    colors: ["White", "Warm White"],
    variants: [
      { color: "White", image: "/images/products/white-noise-renpho.jpg" },
      { color: "Warm White", image: "/images/products/white-noise-renpho.jpg" }
    ],
    benefits: [
      "Rich sound masking for noisy rooms",
      "Integrated soft light halo",
      "Sleep timer up to all-night mode",
      "Elegant cylinder design"
    ]
  },
  {
    id: "sound-machine-bedside",
    name: "Bedside Sound Therapy Speaker",
    price: 52.99,
    description: "Minimal angled sound therapy speaker with tactile buttons and smooth volume wheel control.",
    category: "machines",
    featured: false,
    image: "/images/products/sound-machine-bedside.jpg",
    colors: ["White", "Silver"],
    variants: [
      { color: "White", image: "/images/products/sound-machine-bedside.jpg" },
      { color: "Silver", image: "/images/products/sound-machine-bedside.jpg" }
    ],
    benefits: [
      "Clear front-facing audio projection",
      "Fast-access preset sounds",
      "Convenient bedside tilt stand",
      "Low-light friendly controls"
    ]
  },
  {
    id: "sleep-mask-charcoal",
    name: "3D Charcoal Sleep Mask",
    price: 24.99,
    description: "Deep-contour eye mask with pressure-free eye cups and soft foam interior for total blackout.",
    category: "accessories",
    featured: false,
    image: "/images/products/sleep-mask-charcoal.jpg",
    colors: ["Charcoal", "Black"],
    variants: [
      { color: "Charcoal", image: "/images/products/sleep-mask-charcoal.jpg" },
      { color: "Black", image: "/images/products/sleep-mask-charcoal.jpg" }
    ],
    benefits: [
      "Blocks ambient light effectively",
      "No pressure on eyelashes",
      "Soft breathable interior",
      "Comfortable for travel and home"
    ]
  },
  {
    id: "sleep-mask-black",
    name: "Contour Blackout Eye Mask",
    price: 21.99,
    description: "Memory-foam blackout mask with ergonomic nose bridge and adjustable strap for secure fit.",
    category: "accessories",
    featured: false,
    image: "/images/products/sleep-mask-black.jpg",
    colors: ["Black"],
    variants: [{ color: "Black", image: "/images/products/sleep-mask-black.jpg" }],
    benefits: [
      "Ergonomic full light seal",
      "Memory-foam cushioning",
      "Adjustable wrap strap",
      "Lightweight all-night wear"
    ]
  },
  {
    id: "sleep-mask-silk-white",
    name: "Pure Silk Sleep Mask",
    price: 29.99,
    description: "Smooth silk eye mask designed for sensitive skin with gentle elastic band and luxe finish.",
    category: "accessories",
    featured: false,
    image: "/images/products/sleep-mask-silk-white.webp",
    colors: ["White", "Pearl"],
    variants: [
      { color: "White", image: "/images/products/sleep-mask-silk-white.webp" },
      { color: "Pearl", image: "/images/products/sleep-mask-silk-white.webp" }
    ],
    benefits: [
      "Soft silk contact on skin",
      "Reduces friction while sleeping",
      "Breathable and lightweight",
      "Elegant minimalist style"
    ]
  },
  {
    id: "lumbar-half-roll",
    name: "Memory Foam Half Roll Pillow",
    price: 34.99,
    description: "Half-cylinder foam pillow for lumbar and knee support to reduce lower-back pressure in bed.",
    category: "pillows",
    featured: false,
    image: "/images/products/lumbar-half-roll.jpg",
    colors: ["Beige", "Cream"],
    variants: [
      { color: "Beige", image: "/images/products/lumbar-half-roll.jpg" },
      { color: "Cream", image: "/images/products/lumbar-half-roll.jpg" }
    ],
    benefits: [
      "Supports lower back alignment",
      "Useful under knees or ankles",
      "Dense supportive memory foam",
      "Portable compact shape"
    ]
  }
];

function normalizeColorList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 30);
}

function normalizeVariants(rawVariants, fallbackImage, fallbackColors) {
  const variants = Array.isArray(rawVariants)
    ? rawVariants
        .map((item, index) => {
          const color = String(item?.color || "").trim();
          const image = String(item?.image || "").trim();
          if (!image) return null;
          return {
            id: String(item?.id || `${color || "variant"}-${index + 1}`),
            color,
            image
          };
        })
        .filter((item) => item && item.image)
    : [];

  if (variants.length) return variants;

  if (fallbackColors.length && fallbackImage) {
    return fallbackColors.map((color, index) => ({
      id: `${color || "variant"}-${index + 1}`,
      color,
      image: fallbackImage
    }));
  }

  if (fallbackImage) {
    return [{ id: "default-1", color: "", image: fallbackImage }];
  }

  return [];
}

function normalizeReels(rawReels) {
  if (!Array.isArray(rawReels)) return [];
  return rawReels
    .map((item, index) => {
      if (typeof item === "string") {
        const url = item.trim();
        if (!url) return null;
        return {
          id: `reel-${index + 1}`,
          url,
          poster: ""
        };
      }
      const url = String(item?.url || item?.src || "").trim();
      const poster = String(item?.poster || "").trim();
      if (!url) return null;
      return {
        id: String(item?.id || `reel-${index + 1}`),
        url,
        poster
      };
    })
    .filter(Boolean)
    .slice(0, 30);
}

function normalizeProduct(product, index) {
  const id = String(product?.id || `product-${index + 1}`);
  const name = String(product?.name || "").trim();
  const image = String(product?.image || "").trim();
  const listedColors = normalizeColorList(product?.colors);
  const variants = normalizeVariants(product?.variants, image, listedColors);
  const colors = Array.from(
    new Set([...listedColors, ...variants.map((item) => item.color)].filter(Boolean))
  );
  const primaryImage = variants.find((item) => item.image)?.image || image;
  const reels = normalizeReels(product?.reels);
  return {
    id,
    name,
    price: Number(product?.price || 0),
    description: String(product?.description || ""),
    category: String(product?.category || "accessories").toLowerCase(),
    featured: Boolean(product?.featured),
    image: primaryImage,
    colors,
    variants,
    reels,
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
    const apiResponse = await fetch(CATALOG_API_PATH, { cache: "no-store" });
    if (apiResponse.ok) {
      const payload = await apiResponse.json();
      const raw = Array.isArray(payload) ? payload : payload?.products;
      const normalized = normalizeCatalog(raw);
      if (normalized.length) return normalized;
    }
  } catch (_error) {
    // Fall back to static catalog.
  }

  try {
    const response = await fetch(CATALOG_STATIC_PATH, { cache: "no-store" });
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
