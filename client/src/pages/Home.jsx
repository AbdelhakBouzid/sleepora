import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import ProductCard from "../components/store/ProductCard";
import TrustBadges from "../components/store/TrustBadges";
import useCart from "../hooks/useCart";
import { CART_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog, findFeaturedProduct } from "../lib/catalog";

const heroDesktopImage = "/images/lifestyle/hero-sleepora.webp";
const heroMobileImage = "/images/lifestyle/mask-lifestyle.jpg";

function buildCategoryItems(t) {
  return [
    { key: "all", label: t("nav.products", { defaultValue: "All" }), to: "/products" },
    { key: "machines", label: t("nav.machines", { defaultValue: "Sound machines" }), to: "/products?category=machines" },
    {
      key: "accessories",
      label: t("nav.accessories", { defaultValue: "Accessories" }),
      to: "/products?category=accessories"
    },
    { key: "pillows", label: t("nav.pillows", { defaultValue: "Pillows" }), to: "/products?category=pillows" }
  ];
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart(CART_STORAGE_KEY);
  const [products, setProducts] = useState([]);
  const categoryItems = useMemo(() => buildCategoryItems(t), [t]);

  useEffect(() => {
    document.title = t("meta.home");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const featured = useMemo(() => findFeaturedProduct(products), [products]);
  const spotlight = useMemo(() => products.slice(0, 8), [products]);

  function handleBuyFeatured() {
    if (!featured) return;
    addItem(featured.id, featured);
    navigate("/checkout");
  }

  return (
    <SiteLayout>
      <section className="home-hero-section">
        <Container>
          <article className="home-hero-card">
            <div className="home-hero-copy">
              <p className="caps-label">{t("brand.name")}</p>
              <h1>{t("home.heroTitle", { defaultValue: "Your one-stop shop for the best finds" })}</h1>
              <p>{t("home.heroSubtitle", { defaultValue: "Discover handcrafted comfort picks and sleep essentials." })}</p>
              <div className="home-hero-actions">
                <Link className="btn btn-secondary btn-md" to="/products">
                  {t("home.shopNow", { defaultValue: "Shop now" })}
                </Link>
                <button className="btn btn-primary btn-md" onClick={handleBuyFeatured} type="button">
                  {t("home.buyNow", { defaultValue: "Shop our favorites" })}
                </button>
              </div>
            </div>

            <picture className="home-hero-media">
              <source media="(max-width: 767px)" srcSet={heroMobileImage} />
              <source media="(min-width: 768px)" srcSet={heroDesktopImage} />
              <img alt={t("home.heroTitle")} fetchPriority="high" loading="eager" src={heroDesktopImage} />
            </picture>
          </article>
        </Container>
      </section>

      <section className="home-category-section">
        <Container>
          <div className="home-category-strip" role="list">
            {categoryItems.map((item) => (
              <Link className="home-category-chip" key={item.key} role="listitem" to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="home-collection-section">
        <Container>
          <div className="home-section-head">
            <h2>{t("home.collectionTitle", { defaultValue: "Similar items you may like" })}</h2>
            <Link className="home-section-link" to="/products">
              {t("home.viewAll", { defaultValue: "See more" })}
            </Link>
          </div>
          {spotlight.length ? (
            <div className="market-grid">
              {spotlight.map((product) => (
                <ProductCard key={product.id} onAddToCart={addItem} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>{t("products.noResults", { defaultValue: "No products yet." })}</h2>
              <p>{t("products.tryAdjusting", { defaultValue: "Please add products from admin to start selling." })}</p>
            </div>
          )}
        </Container>
      </section>

      <section className="home-trust-section">
        <Container>
          <TrustBadges
            items={[
              { icon: "shield", key: "purchaseProtection" },
              { icon: "lock", key: "secureOptions" },
              { icon: "star", key: "verifiedReviews" }
            ]}
            titleKey="product.shippingTrustTitle"
          />
        </Container>
      </section>
    </SiteLayout>
  );
}
