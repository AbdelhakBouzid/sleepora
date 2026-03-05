import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SleepImage from "../ui/SleepImage";
import { formatPrice } from "../../lib/format";

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
  const rating = scoreFromProduct(product);
  const offer = getOffer(product);

  return (
    <article className="listing-card">
      <Link aria-label={product.name} className="listing-card-media" to={`/product/${product.id}`}>
        <SleepImage alt={product.name || t("products.cardFallback")} className="listing-card-image" src={product.image} />
        <span className="listing-card-favorite" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 20 4.5 12.7A5.5 5.5 0 0 1 12 4.9a5.5 5.5 0 0 1 7.5 7.8Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </span>
      </Link>

      <div className="listing-card-body">
        <p className="listing-card-seller">{t("product.sellerName", { defaultValue: "Ad by sleeepora" })}</p>
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="listing-card-rating">
          <span>{"*****"}</span>
          <strong>{rating.rating.toFixed(1)}</strong>
          <small>{`(${rating.reviews})`}</small>
        </p>
        <div className="listing-card-price-row">
          <p className="listing-card-price">{formatPrice(product.price, i18n.language)}</p>
          <p className="listing-card-compare">{formatPrice(offer.compareAt, i18n.language)}</p>
        </div>
        <p className="listing-card-offer">{`${offer.discount}% off`}</p>

        <div className="listing-card-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onAddToCart(product.id, product)} type="button">
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
