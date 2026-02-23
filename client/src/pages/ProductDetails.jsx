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

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
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
  const colors = product?.colors?.length ? product.colors : [];

  useEffect(() => {
    setSelectedColor(colors[0] || "");
  }, [product?.id]);

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
          <div
            className={zoomActive ? "product-image-zoom is-active" : "product-image-zoom"}
            onMouseEnter={() => setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
            onMouseMove={handleImageMove}
          >
            <SleepImage
              alt={product.name}
              className="product-hero-image"
              src={product.image}
              style={{ transformOrigin: zoomOrigin }}
            />
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
              <p>{t("product.detailsBody")}</p>
            </div>
          </div>
        </Container>
      </section>
    </SiteLayout>
  );
}
