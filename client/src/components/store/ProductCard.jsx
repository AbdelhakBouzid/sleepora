import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SleepImage from "../ui/SleepImage";
import { useLanguage } from "../../context/LanguageContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import { FAVORITES_STORAGE_KEY } from "../../lib/storage";
import { localizeProduct } from "../../lib/catalog";

function scoreFromProduct(product) {
  const seed = String(product?.id || product?.name || "sleepora");
  let total = 0;
  for (let index = 0; index < seed.length; index += 1) {
    total += seed.charCodeAt(index);
  }
  const rating = 4.2 + (total % 8) * 0.1;
  const reviews = 28 + (total % 420);
  return {
    rating: Math.min(5, Number(rating.toFixed(1))),
    reviews
  };
}

function getOffer(product) {
  const price = Number(product?.price || 0);
  const compareAt = Number((price * 1.32).toFixed(2));
  const discount = compareAt > 0 ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  return { compareAt, discount };
}

export default function ProductCard({ product, onAddToCart }) {
  const { t, i18n } = useTranslation();
  const { formatMoney } = useLanguage();
  const [favoriteIds, setFavoriteIds] = useLocalStorage(FAVORITES_STORAGE_KEY, []);
  const localizedProduct = localizeProduct(product, i18n.language);
  const rating = scoreFromProduct(localizedProduct);
  const offer = getOffer(localizedProduct);
  const isFavorite = Array.isArray(favoriteIds) && favoriteIds.includes(product.id);

  function toggleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();
    setFavoriteIds((current) => {
      const next = Array.isArray(current) ? [...current] : [];
      if (next.includes(product.id)) {
        return next.filter((item) => item !== product.id);
      }
      return [...next, product.id];
    });
  }

  return (
    <article className="listing-card">
      <div className="listing-card-media">
        <Link aria-label={localizedProduct.name} className="listing-card-media-link" to={`/product/${product.id}`}>
          <SleepImage alt={localizedProduct.name || t("products.cardFallback")} className="listing-card-image" src={product.image} />
        </Link>
        <button
          aria-label={isFavorite ? t("product.removeFavorite", { defaultValue: "Remove from favorites" }) : t("product.addFavorite", { defaultValue: "Add to favorites" })}
          className={isFavorite ? "listing-card-favorite active" : "listing-card-favorite"}
          onClick={toggleFavorite}
          type="button"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 20 4.5 12.7A5.5 5.5 0 0 1 12 4.9a5.5 5.5 0 0 1 7.5 7.8Z" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </div>

      <div className="listing-card-body">
        <p className="listing-card-seller">{t("product.sellerName", { defaultValue: `Ad by ${t("brand.name")}` })}</p>
        <h3>
          <Link to={`/product/${product.id}`}>{localizedProduct.name}</Link>
        </h3>
        <p className="listing-card-rating">
          <span>{"\u2605\u2605\u2605\u2605\u2605"}</span>
          <strong>{rating.rating.toFixed(1)}</strong>
          <small>{`(${rating.reviews})`}</small>
        </p>
        <div className="listing-card-price-row">
          <p className="listing-card-price">{formatMoney(localizedProduct.price)}</p>
          <p className="listing-card-compare">{formatMoney(offer.compareAt)}</p>
        </div>
        <p className="listing-card-offer">{`${offer.discount}% ${t("common.off", { defaultValue: "off" })}`}</p>

        <div className="listing-card-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onAddToCart(product.id, localizedProduct)} type="button">
            {t("product.addToCart")}
          </button>
          <Link className="btn btn-ghost btn-sm" to={`/product/${product.id}`}>
            {t("actions.view", { defaultValue: "View" })}
          </Link>
        </div>
      </div>
    </article>
  );
}
