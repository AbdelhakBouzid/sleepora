import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import useCart from "../hooks/useCart";
import { CART_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog, findProductById } from "../lib/catalog";
import { formatPrice } from "../lib/format";

const defaultBenefits = [
  "Relieves neck pain",
  "Improves sleep posture",
  "Premium comfort",
  "Designed for deep sleep"
];

function colorToCss(value) {
  const color = String(value || "").trim();
  if (!color) return "#d9c7a8";
  const normalized = color.toLowerCase();
  const map = {
    charcoal: "#424242",
    pearl: "#f7f4ec",
    ivory: "#f1e8d8",
    beige: "#d8c1a1",
    cream: "#f2e4cf",
    silver: "#c3c6c8",
    gray: "#777777",
    black: "#111111",
    white: "#ffffff",
    "warm white": "#f6ebd4"
  };
  if (map[normalized]) return map[normalized];
  return color;
}

function normalizeReels(reels) {
  if (!Array.isArray(reels)) return [];
  return reels
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
    .filter(Boolean);
}

function dedupeMedia(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = `${item.type}:${item.src}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [zoomActive, setZoomActive] = useState(false);
  const { addItem } = useCart(CART_STORAGE_KEY);

  useEffect(() => {
    document.title = t("meta.product");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const product = useMemo(() => findProductById(products, id), [products, id]);
  const benefits = product?.benefits?.length ? product.benefits : defaultBenefits;
  const reels = useMemo(() => normalizeReels(product?.reels), [product?.reels]);
  const variants = useMemo(() => {
    if (!product) return [];

    if (Array.isArray(product.variants) && product.variants.length) {
      return product.variants
        .map((item, index) => ({
          id: String(item?.id || `variant-${index + 1}`),
          color: String(item?.color || "").trim(),
          image: String(item?.image || "").trim()
        }))
        .filter((item) => item.image);
    }

    const fallbackColors = Array.isArray(product.colors) ? product.colors : [];
    if (fallbackColors.length && product.image) {
      return fallbackColors.map((color, index) => ({
        id: `variant-${index + 1}`,
        color: String(color || "").trim(),
        image: String(product.image || "").trim()
      }));
    }

    return product.image ? [{ id: "variant-1", color: "", image: product.image }] : [];
  }, [product]);

  const colors = useMemo(
    () => Array.from(new Set(variants.map((item) => item.color).filter(Boolean))),
    [variants]
  );
  const colorSignature = colors.join("|");
  const visibleVariants = useMemo(() => {
    if (!selectedColor) return variants;
    const selected = selectedColor.toLowerCase();
    return variants.filter((item) => item.color.toLowerCase() === selected);
  }, [selectedColor, variants]);

  const mediaItems = useMemo(() => {
    const images = visibleVariants.map((variant, index) => ({
      id: `${variant.id}-${index}`,
      type: "image",
      src: variant.image,
      poster: "",
      color: variant.color
    }));
    const videos = reels.map((reel, index) => ({
      id: `${reel.id}-${index}`,
      type: "video",
      src: reel.url,
      poster: reel.poster || "",
      color: ""
    }));
    return dedupeMedia([...images, ...videos]);
  }, [visibleVariants, reels]);

  const selectedMedia = mediaItems[selectedMediaIndex] || mediaItems[0] || null;
  const selectedImage =
    selectedMedia?.type === "image"
      ? selectedMedia.src
      : visibleVariants[0]?.image || (selectedColor ? "" : product?.image || "");

  useEffect(() => {
    setSelectedColor("");
    setSelectedMediaIndex(0);
  }, [product?.id, colorSignature]);

  useEffect(() => {
    setSelectedMediaIndex(0);
  }, [selectedColor]);

  function handleImageMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomOrigin(`${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`);
  }

  if (!product) {
    return (
      <SiteLayout>
        <section className="page-section">
          <Container>
            <div className="empty-state">
              <h1>{t("product.notFound")}</h1>
              <Link className="btn btn-primary btn-md" to="/products">
                {t("cart.continue")}
              </Link>
            </div>
          </Container>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="product-page">
        <Container className="product-layout">
          <div className="product-media">
            {selectedMedia?.type === "video" ? (
              <video
                className="product-hero-video"
                controls
                playsInline
                poster={selectedMedia.poster || undefined}
                preload="metadata"
                src={selectedMedia.src}
              />
            ) : (
              <div
                className={zoomActive ? "product-image-zoom is-active" : "product-image-zoom"}
                onMouseEnter={() => setZoomActive(true)}
                onMouseLeave={() => setZoomActive(false)}
                onMouseMove={handleImageMove}
              >
                <SleepImage
                  alt={product.name}
                  className="product-hero-image"
                  src={selectedImage}
                  style={{ transformOrigin: zoomOrigin }}
                />
              </div>
            )}

            {mediaItems.length > 1 ? (
              <div className="product-thumb-strip">
                {mediaItems.map((item, index) => (
                  <button
                    className={selectedMediaIndex === index ? "product-thumb-btn active" : "product-thumb-btn"}
                    key={`${item.id}-${index}`}
                    onClick={() => setSelectedMediaIndex(index)}
                    type="button"
                  >
                    {item.type === "video" ? (
                      item.poster ? (
                        <SleepImage alt={product.name} className="product-thumb-image" src={item.poster} />
                      ) : (
                        <video className="product-thumb-video" muted playsInline preload="metadata" src={item.src} />
                      )
                    ) : (
                      <SleepImage alt={product.name} className="product-thumb-image" src={item.src} />
                    )}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price-tag">{formatPrice(product.price, i18n.language)}</p>

            {colors.length ? (
              <div className="color-block">
                <h2>{t("product.colorsTitle")}</h2>
                <div className="color-list">
                  {colors.map((color) => {
                    const active = selectedColor === color;
                    return (
                      <button
                        className={active ? "color-chip active" : "color-chip"}
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        type="button"
                      >
                        <span className="color-dot" style={{ backgroundColor: colorToCss(color) }} />
                        <span>{color}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedColor ? (
                  <p className="selected-color">
                    {t("product.selectedColor")}: <strong>{selectedColor}</strong>
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="benefits-list">
              <h2>{t("product.benefits")}</h2>
              <ul>
                {benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card-actions">
              <button className="btn btn-primary btn-md" onClick={() => addItem(product.id)} type="button">
                {t("product.addToCart")}
              </button>
              <button
                className="btn btn-secondary btn-md"
                onClick={() => {
                  addItem(product.id);
                  navigate("/checkout");
                }}
                type="button"
              >
                {t("product.buyNow")}
              </button>
            </div>

            <div className="description-block">
              <h3>{t("product.detailsTitle")}</h3>
              <p>{product.description || t("product.detailsBody")}</p>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
