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
import TrustBadges from "../components/store/TrustBadges";
import PaymentIconsRow from "../components/store/PaymentIconsRow";

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

function buildReviewSeed(product, t) {
  if (Array.isArray(product?.reviews) && product.reviews.length) {
    return product.reviews.slice(0, 6).map((review, index) => ({
      id: String(review?.id || `review-${index + 1}`),
      name: String(review?.name || "Customer"),
      title: String(review?.label || t("product.verifiedBuyer")),
      text: String(review?.text || review?.comment || "").trim()
    }));
  }

  const fallbackName = product?.name || t("brand.name");
  return [
    {
      id: "review-1",
      name: "Sarah M.",
      title: t("product.verifiedBuyer"),
      text: t("product.reviewOne", {
        defaultValue: `The ${fallbackName} feels premium and made a difference from the first night.`
      })
    },
    {
      id: "review-2",
      name: "Youssef A.",
      title: t("product.verifiedBuyer"),
      text: t("product.reviewTwo", {
        defaultValue: "Fast shipping, easy checkout, and the quality matches the photos."
      })
    },
    {
      id: "review-3",
      name: "Emma R.",
      title: t("product.verifiedBuyer"),
      text: t("product.reviewThree", {
        defaultValue: "Comfortable, well packed, and exactly what I wanted for a calmer sleep routine."
      })
    }
  ];
}

const faqKeys = ["shipping", "returns", "security", "tracking", "support"];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [zoomActive, setZoomActive] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState("shipping");
  const [showStickyCta, setShowStickyCta] = useState(false);
  const { addItem } = useCart(CART_STORAGE_KEY);

  useEffect(() => {
    document.title = t("meta.product");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const product = useMemo(() => findProductById(products, id), [products, id]);
  const defaultBenefits = useMemo(
    () => [
      t("product.defaultBenefit1", { defaultValue: "Relieves neck pain" }),
      t("product.defaultBenefit2", { defaultValue: "Improves sleep posture" }),
      t("product.defaultBenefit3", { defaultValue: "Premium comfort" }),
      t("product.defaultBenefit4", { defaultValue: "Designed for deep sleep" })
    ],
    [t]
  );
  const benefits = product?.benefits?.length ? product.benefits : defaultBenefits;
  const reviewSummary = product?.reviewSummary || { rating: 4.8, count: 1284 };
  const reviews = useMemo(() => buildReviewSeed(product, t), [product, t]);
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
    const matched = variants.filter((item) => item.color.toLowerCase() === selected);
    const rest = variants.filter((item) => item.color.toLowerCase() !== selected);
    return [...matched, ...rest];
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
  const cartProductSnapshot = useMemo(
    () => ({
      ...product,
      image: selectedImage || product?.image || "",
      selectedColor
    }),
    [product, selectedImage, selectedColor]
  );

  useEffect(() => {
    setSelectedColor("");
    setSelectedMediaIndex(0);
  }, [product?.id, colorSignature]);

  useEffect(() => {
    if (!selectedColor) {
      setSelectedMediaIndex(0);
      return;
    }
    const selected = selectedColor.toLowerCase();
    const matchedIndex = mediaItems.findIndex(
      (item) => item.type === "image" && String(item.color || "").toLowerCase() === selected
    );
    setSelectedMediaIndex(matchedIndex >= 0 ? matchedIndex : 0);
  }, [selectedColor, mediaItems]);

  useEffect(() => {
    function onScroll() {
      if (typeof window === "undefined") return;
      const isMobile = window.innerWidth <= 900;
      setShowStickyCta(isMobile && window.scrollY > 420);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
      <section className={`product-page ${showStickyCta ? "has-mobile-cta" : ""}`}>
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
                onClick={() => setLightboxOpen(true)}
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
                <button className="product-lightbox-trigger" type="button">
                  {t("product.enlarge")}
                </button>
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
            <div className="product-rating-summary" aria-label={t("product.ratingLabel")}>
              <span className="product-stars">{"\u2605\u2605\u2605\u2605\u2605"}</span>
              <span>{`${reviewSummary.rating}/5`}</span>
              <span>{`(${new Intl.NumberFormat("en-US").format(reviewSummary.count)} ${t("product.reviewsCount")})`}</span>
            </div>
            <p className="price-tag">{formatPrice(product.price, i18n.language)}</p>
            <p className="product-demand-note">{t("product.highDemand")}</p>

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
              <button className="btn btn-primary btn-md" onClick={() => addItem(product.id, cartProductSnapshot)} type="button">
                {t("product.addToCart")}
              </button>
              <button
                className="btn btn-secondary btn-md"
                onClick={() => {
                  addItem(product.id, cartProductSnapshot);
                  navigate("/checkout");
                }}
                type="button"
              >
                {t("product.buyNow")}
              </button>
            </div>

            <TrustBadges className="product-trust-block" compact titleKey="product.shippingTrustTitle" />
            <PaymentIconsRow className="product-payment-icons" />

            <div className="description-block">
              <h3>{t("product.detailsTitle")}</h3>
              <p>{product.description || t("product.detailsBody")}</p>
            </div>
          </div>
        </Container>

        <Container className="product-detail-sections">
          <section className="product-secondary-card">
            <h2>{t("product.reviewsTitle")}</h2>
            <div className="product-reviews-grid">
              {reviews.map((review) => (
                <article className="product-review-card" key={review.id}>
                  <div className="product-review-head">
                    <strong>{review.name}</strong>
                    <span className="product-review-badge">{review.title}</span>
                  </div>
                  <p className="product-stars">{"\u2605\u2605\u2605\u2605\u2605"}</p>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="product-secondary-card">
            <h2>{t("product.faqTitle")}</h2>
            <div className="faq-list">
              {faqKeys.map((key) => (
                <article className={openFaq === key ? "faq-item open" : "faq-item"} key={key}>
                  <button className="faq-trigger" onClick={() => setOpenFaq((current) => (current === key ? "" : key))} type="button">
                    <span>{t(`product.faq.${key}.q`)}</span>
                    <span>{openFaq === key ? "-" : "+"}</span>
                  </button>
                  {openFaq === key ? <p className="faq-answer">{t(`product.faq.${key}.a`)}</p> : null}
                </article>
              ))}
            </div>
          </section>
        </Container>

        {showStickyCta ? (
          <>
            <div className="product-mobile-cta-spacer" />
            <div className="product-mobile-cta">
              <div className="product-mobile-cta-meta">
                <strong>{formatPrice(product.price, i18n.language)}</strong>
                <span>{t("product.highDemand")}</span>
              </div>
              <button className="btn btn-secondary btn-md" onClick={() => addItem(product.id, cartProductSnapshot)} type="button">
                {t("product.addToCart")}
              </button>
              <button
                className="btn btn-primary btn-md"
                onClick={() => {
                  addItem(product.id, cartProductSnapshot);
                  navigate("/checkout");
                }}
                type="button"
              >
                {t("product.buyNow")}
              </button>
            </div>
          </>
        ) : null}

        {lightboxOpen && selectedMedia?.type === "image" ? (
          <div className="product-lightbox" onClick={() => setLightboxOpen(false)} role="presentation">
            <button className="product-lightbox-close" onClick={() => setLightboxOpen(false)} type="button">
              {"\u00D7"}
            </button>
            <SleepImage alt={product.name} className="product-lightbox-image" src={selectedImage} />
          </div>
        ) : null}
      </section>
    </SiteLayout>
  );
}

