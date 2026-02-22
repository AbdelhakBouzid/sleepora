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

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const { addItem } = useCart(CART_STORAGE_KEY);

  useEffect(() => {
    document.title = t("meta.product");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  const product = useMemo(() => findProductById(products, id), [products, id]);
  const benefits = product?.benefits?.length ? product.benefits : defaultBenefits;

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
          <SleepImage alt={product.name} className="product-hero-image" src={product.image} />

          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price-tag">{formatPrice(product.price, i18n.language)}</p>

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
              <p>{t("product.detailsBody")}</p>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
