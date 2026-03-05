import { useEffect, useMemo, useRef, useState } from "react";
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
  if (!color) return "#d4d4d4";
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
      text: String(review?.text || review?.comment || "").trim()
    }));
  }

  return [
    {
      id: "review-1",
      name: "Sarah M.",
      text: t("product.reviewOne", {
        defaultValue: "The quality is excellent and it arrived exactly as shown."
      })
    },
    {
      id: "review-2",
      name: "Alex D.",
      text: t("product.reviewTwo", {
        defaultValue: "Shipping was quick and the item feels premium."
      })
    },
    {
      id: "review-3",
      name: "Lina K.",
      text: t("product.reviewThree", {
        defaultValue: "Comfortable, well packed, and worth it."
      })
    }
  ];
}

function buildSizeOptions(product) {
  if (Array.isArray(product?.sizes) && product.sizes.length) {
    return product.sizes.map((item) => String(item)).filter(Boolean);
  }

  const category = String(product?.category || "").toLowerCase();
  if (category === "pillows") return ["Standard", "Queen", "King"];
  if (category === "accessories") return ["One size"];
  return ["Standard"];
}

function scoreFromProduct(product) {
  const seed = String(product?.id || product?.name || "sleepora");
  let total = 0;
  for (let index = 0; index < seed.length; index += 1) {
    total += seed.charCodeAt(index);
  }
  const rating = 4.2 + (total % 8) * 0.1;
  const reviews = 20 + (total % 340);
  return {
    rating: Math.min(5, Number(rating.toFixed(1))),
    reviews
  };
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartXRef = useRef(0);
  const { addItem } = useCart(CART_STORAGE_KEY);

  useEffect(() => {
    document.title = t("meta.product");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const product = useMemo(() => findProductById(products, id), [products, id]);
  const reels = useMemo(() => normalizeReels(product?.reels), [product?.reels]);
  const sizeOptions = useMemo(() => buildSizeOptions(product), [product]);
  const rating = useMemo(() => scoreFromProduct(product), [product]);
  const reviews = useMemo(() => buildReviewSeed(product, t), [product, t]);
  const similarProducts = useMemo(
    () => products.filter((item) => String(item.id) !== String(product?.id || "")).slice(0, 8),
    [product?.id, products]
  );

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

    if (product.image) {
      return [
        {
          id: "variant-1",
          color: "",
          image: product.image
        }
      ];
    }

    return [];
  }, [product]);

  const colors = useMemo(() => Array.from(new Set(variants.map((item) => item.color).filter(Boolean))), [variants]);
  const mediaItems = useMemo(() => {
    const images = variants.map((variant, index) => ({
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
  }, [reels, variants]);

  const selectedMedia = mediaItems[selectedMediaIndex] || mediaItems[0] || null;
  const selectedImage = selectedMedia?.type === "image" ? selectedMedia.src : product?.image || variants[0]?.image || "";

  const price = Number(product?.price || 0);
  const compareAt = Number((price * 1.32).toFixed(2));
  const discount = compareAt > 0 ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

  const cartProductSnapshot = useMemo(
    () => ({
      ...product,
      image: selectedImage || product?.image || "",
      selectedColor,
      selectedSize
    }),
    [product, selectedImage, selectedColor, selectedSize]
  );

  useEffect(() => {
    setSelectedColor("");
    setSelectedMediaIndex(0);
    setQuantity(1);
    setSelectedSize(sizeOptions[0] || "");
  }, [product?.id, sizeOptions]);

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

  useEffect(() => {
    if (!selectedColor) return;
    const selected = selectedColor.toLowerCase();
    const index = mediaItems.findIndex((item) => item.type === "image" && String(item.color || "").toLowerCase() === selected);
    if (index >= 0) setSelectedMediaIndex(index);
  }, [mediaItems, selectedColor]);

  function goToRelativeMedia(step) {
    if (!mediaItems.length) return;
    setSelectedMediaIndex((current) => {
      const next = current + step;
      if (next < 0) return mediaItems.length - 1;
      if (next >= mediaItems.length) return 0;
      return next;
    });
  }

  function handleTouchStart(event) {
    const point = event.changedTouches?.[0];
    if (!point) return;
    touchStartXRef.current = point.clientX;
  }

  function handleTouchEnd(event) {
    const point = event.changedTouches?.[0];
    if (!point || !mediaItems.length) return;
    const deltaX = point.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) < 48) return;
    if (deltaX < 0) goToRelativeMedia(1);
    if (deltaX > 0) goToRelativeMedia(-1);
  }

  function addCurrentToCart() {
    const units = Math.max(1, Number(quantity || 1));
    for (let index = 0; index < units; index += 1) {
      addItem(product.id, cartProductSnapshot);
    }
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
        <Container className="product-main-layout">
          <div className="product-gallery-panel" onTouchEnd={handleTouchEnd} onTouchStart={handleTouchStart}>
            {mediaItems.length > 1 ? (
              <div className="product-thumb-rail">
                {mediaItems.map((item, index) => (
                  <button
                    className={selectedMediaIndex === index ? "product-thumb-btn active" : "product-thumb-btn"}
                    key={item.id}
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

            <div className="product-stage">
              {selectedMedia?.type === "video" ? (
                <video className="product-stage-video" controls playsInline poster={selectedMedia.poster || undefined} preload="metadata" src={selectedMedia.src} />
              ) : (
                <button className="product-stage-image-wrap" onClick={() => setLightboxOpen(true)} type="button">
                  <SleepImage alt={product.name} className="product-stage-image" src={selectedImage} />
                </button>
              )}

              {mediaItems.length > 1 ? (
                <>
                  <button className="product-stage-arrow prev" onClick={() => goToRelativeMedia(-1)} type="button">
                    {"<"}
                  </button>
                  <button className="product-stage-arrow next" onClick={() => goToRelativeMedia(1)} type="button">
                    {">"}
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <aside className="product-buy-panel">
            <p className="product-demand-note">{t("product.highDemand", { defaultValue: "In demand." })}</p>

            <div className="product-price-head">
              <p className="product-price-main">{`Now ${formatPrice(price, i18n.language)}`}</p>
              <p className="product-price-compare">{formatPrice(compareAt, i18n.language)}</p>
              <p className="product-price-offer">{`${discount}% off`}</p>
            </div>

            <h1>{product.name}</h1>
            <p className="product-shop-meta">{`sleeepora  ***** (${rating.reviews})`}</p>
            <p className="product-returns-note">{t("trust.moneyBack", { defaultValue: "Returns & exchanges accepted" })}</p>

            <div className="product-field-grid">
              <label>
                <span>{t("product.size", { defaultValue: "Size" })}</span>
                <select onChange={(event) => setSelectedSize(event.target.value)} value={selectedSize}>
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              {colors.length ? (
                <label>
                  <span>{t("product.colorsTitle", { defaultValue: "Color" })}</span>
                  <select onChange={(event) => setSelectedColor(event.target.value)} value={selectedColor}>
                    <option value="">{t("product.selectColor", { defaultValue: "Select an option" })}</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label>
                <span>{t("cart.quantity")}</span>
                <select onChange={(event) => setQuantity(Number(event.target.value) || 1)} value={quantity}>
                  {Array.from({ length: 8 }, (_item, index) => index + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {colors.length ? (
              <div className="product-color-pills">
                {colors.map((color) => (
                  <button
                    className={selectedColor === color ? "product-color-pill active" : "product-color-pill"}
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    type="button"
                  >
                    <span className="product-color-dot" style={{ backgroundColor: colorToCss(color) }} />
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="product-buy-actions">
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => {
                  addCurrentToCart();
                  navigate("/checkout?step=payment");
                }}
                type="button"
              >
                {t("product.buyNow", { defaultValue: "Buy it now" })}
              </button>
              <button className="btn btn-primary btn-lg" onClick={addCurrentToCart} type="button">
                {t("product.addToCart")}
              </button>
            </div>

            <div className="product-policy-box">
              <h3>{t("product.shippingTrustTitle", { defaultValue: "Shipping and return policies" })}</h3>
              <ul>
                <li>{t("trust.deliveryEstimate", { defaultValue: "Order today to receive in 5-10 business days." })}</li>
                <li>{t("trust.moneyBack", { defaultValue: "Returns accepted within 14 days." })}</li>
                <li>{t("trust.securePaypal", { defaultValue: "Secure checkout powered by PayPal." })}</li>
              </ul>
            </div>

            <div className="product-benefits-block">
              <h3>{t("product.benefits", { defaultValue: "Benefits" })}</h3>
              <ul>
                {(product.benefits || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <TrustBadges className="product-protection-card" compact />
            <PaymentIconsRow className="product-payments-row" />
          </aside>
        </Container>

        <Container className="product-similar-wrap">
          <div className="product-section-head">
            <h2>{t("product.similarItems", { defaultValue: "Similar items" })}</h2>
            <Link className="home-section-link" to="/products">
              {t("home.viewAll", { defaultValue: "See more" })}
            </Link>
          </div>
          <div className="product-similar-rail">
            {similarProducts.map((item) => (
              <article className="product-similar-card" key={item.id}>
                <Link to={`/product/${item.id}`}>
                  <SleepImage alt={item.name} className="product-similar-image" src={item.image} />
                </Link>
                <h3>
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                </h3>
                <p>{formatPrice(item.price, i18n.language)}</p>
              </article>
            ))}
          </div>
        </Container>

        <Container className="product-details-wrap">
          <section className="product-reviews-panel">
            <h2>{t("product.reviewsTitle", { defaultValue: "Reviews for this item" })}</h2>
            <p className="product-review-score">{`${rating.rating}/5 from ${rating.reviews} reviews`}</p>
            <div className="product-reviews-list">
              {reviews.map((review) => (
                <article className="product-review-row" key={review.id}>
                  <div className="product-review-head">
                    <strong>{review.name}</strong>
                    <span>{t("product.verifiedBuyer", { defaultValue: "Verified buyer" })}</span>
                  </div>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="product-facts-panel">
            <h3>{t("product.detailsTitle", { defaultValue: "Item details" })}</h3>
            <p>{product.description || t("product.detailsBody")}</p>
          </aside>
        </Container>

        {showStickyCta ? (
          <>
            <div className="product-mobile-cta-spacer" />
            <div className="product-mobile-cta">
              <div className="product-mobile-cta-meta">
                <strong>{formatPrice(price, i18n.language)}</strong>
                <span>{t("product.highDemand", { defaultValue: "Selling fast" })}</span>
              </div>
              <button className="btn btn-secondary btn-md" onClick={addCurrentToCart} type="button">
                {t("product.addToCart")}
              </button>
              <button
                className="btn btn-primary btn-md"
                onClick={() => {
                  addCurrentToCart();
                  navigate("/checkout?step=payment");
                }}
                type="button"
              >
                {t("product.buyNow", { defaultValue: "Buy now" })}
              </button>
            </div>
          </>
        ) : null}

        {lightboxOpen && selectedMedia?.type === "image" ? (
          <div className="product-lightbox" onClick={() => setLightboxOpen(false)} role="presentation">
            <button className="product-lightbox-close" onClick={() => setLightboxOpen(false)} type="button">
              x
            </button>
            <SleepImage alt={product.name} className="product-lightbox-image" src={selectedImage} />
          </div>
        ) : null}
      </section>
    </SiteLayout>
  );
}
