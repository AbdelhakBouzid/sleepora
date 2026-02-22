import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import useCart from "../hooks/useCart";
import { CART_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog } from "../lib/catalog";
import { formatPrice } from "../lib/format";

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const { addItem } = useCart(CART_STORAGE_KEY);

  useEffect(() => {
    document.title = t("meta.products");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <div className="section-head">
            <h1>{t("products.title")}</h1>
            <p>{t("products.subtitle")}</p>
          </div>

          <div className="collection-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <SleepImage alt={product.name} className="product-card-image" src={product.image} />
                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p>{formatPrice(product.price, i18n.language)}</p>
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
    </SiteLayout>
  );
}
