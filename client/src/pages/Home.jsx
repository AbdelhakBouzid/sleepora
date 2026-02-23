import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import useCart from "../hooks/useCart";
import { CART_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog, findFeaturedProduct } from "../lib/catalog";
import { formatPrice } from "../lib/format";

const heroImage = "/images/lifestyle/hero-sleepora.webp";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart(CART_STORAGE_KEY);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = t("meta.home");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const featured = useMemo(() => findFeaturedProduct(products), [products]);

  function handleBuyFeatured() {
    if (!featured) return;
    addItem(featured.id);
    navigate("/cart");
  }

  return (
    <SiteLayout>
      <section className="hero-section">
        <Container>
          <div className="hero-frame">
            <SleepImage
              alt={t("brand.name")}
              className="hero-image"
              fallback="/images/placeholders/neutral-lifestyle.svg"
              src={heroImage}
            />
            <div className="hero-overlay">
              <p className="caps-label">{t("brand.name")}</p>
              <h1>{t("home.heroTitle")}</h1>
              <p>{t("home.heroSubtitle")}</p>

              <div className="hero-actions">
                <Link className="btn btn-primary btn-lg" to="/products">
                  {t("home.shopNow")}
                </Link>
                <button className="btn btn-ghost btn-lg hero-outline" onClick={handleBuyFeatured} type="button">
                  {t("home.buyNow")}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="collection-section">
        <Container>
          <div className="section-head">
            <div>
              <h2>{t("home.collectionTitle")}</h2>
              <p>Sleep tools selected for calm nights and deep recovery.</p>
            </div>
            <Link className="btn btn-secondary btn-sm" to="/products">
              {t("cart.continue")}
            </Link>
          </div>

          <div className="collection-grid">
            {products.slice(0, 8).map((product) => (
              <article className="product-card" key={product.id}>
                <SleepImage alt={product.name} className="product-card-image" src={product.image} />
                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="price-tag">{formatPrice(product.price, i18n.language)}</p>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => addItem(product.id)} type="button">
                      {t("product.addToCart")}
                    </button>
                    <Link className="btn btn-secondary btn-sm" to={`/product/${product.id}`}>
                      {t("home.buyNow")}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="trust-section">
        <Container>
          <h2>{t("home.trustTitle")}</h2>
          <div className="trust-grid">
            <div className="trust-item">{t("home.trust1")}</div>
            <div className="trust-item">{t("home.trust2")}</div>
            <div className="trust-item">{t("home.trust3")}</div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
