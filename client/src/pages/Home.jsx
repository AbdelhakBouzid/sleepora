import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import Toast from "../components/Toast";
import ProductCard from "../components/store/ProductCard";
import TrustBadges from "../components/store/TrustBadges";
import useCart from "../hooks/useCart";
import useToast from "../hooks/useToast";
import { CART_STORAGE_KEY, persistUserSession } from "../lib/storage";
import { fetchCatalog } from "../lib/catalog";
import { completeSocialAuthFromCallback } from "../lib/authPortalApi";

const heroBannerImage = "/images/lifestyle/mask-lifestyle.jpg";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem } = useCart(CART_STORAGE_KEY);
  const [products, setProducts] = useState([]);
  const [toastMessage, showToast] = useToast(2800);
  const [isOAuthProcessing, setIsOAuthProcessing] = useState(false);

  useEffect(() => {
    document.title = t("meta.home");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  useEffect(() => {
    const authCode = String(searchParams.get("code") || "").trim();
    const authState = String(searchParams.get("state") || "").trim();
    const authError = String(searchParams.get("error") || "").trim();

    if (!authCode && !authError) return;
    if (isOAuthProcessing) return;

    if (authError) {
      showToast("Social login was cancelled or denied.");
      navigate("/", { replace: true });
      return;
    }

    setIsOAuthProcessing(true);
    completeSocialAuthFromCallback({
      code: authCode,
      state: authState
    })
      .then((response) => {
        persistUserSession(response);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        showToast(String(error?.message || "Unable to complete social login."));
        navigate("/", { replace: true });
      })
      .finally(() => setIsOAuthProcessing(false));
  }, [isOAuthProcessing, navigate, searchParams, showToast]);

  const spotlight = useMemo(() => products.slice(0, 8), [products]);
  const isArabic = i18n.dir(i18n.language) === "rtl";

  return (
    <SiteLayout>
      <section className="home-hero-section">
        <article className="home-hero-card" style={{ "--hero-banner-image": `url(${heroBannerImage})` }}>
          <Container className="home-hero-inner">
            <div className="home-hero-copy">
              <p className="caps-label">{t("brand.name")}</p>
              <h1>
                {isArabic ? (
                  <>
                    {t("home.heroTitlePrefix", { defaultValue: "مرحبا بكم في متجر" })} <bdi>Ba2i3</bdi>
                  </>
                ) : (
                  t("home.heroTitle", { defaultValue: "Welcome to Ba2i3 Store" })
                )}
              </h1>
              <div className="home-hero-actions">
                <Link className="btn btn-primary btn-md" to="/products">
                  {t("home.shopNow", { defaultValue: "Shop now" })}
                </Link>
              </div>
            </div>
          </Container>
        </article>
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
      <Toast message={toastMessage} />
    </SiteLayout>
  );
}
