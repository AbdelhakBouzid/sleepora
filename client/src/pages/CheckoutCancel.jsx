import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";

export default function CheckoutCancelPage() {
  const { t } = useTranslation();

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <article className="policy-card checkout-status-card">
            <h1>{t("checkout.cancelTitle", { defaultValue: "Checkout paused" })}</h1>
            <p>{t("checkout.cancelled", { defaultValue: "Your order was not placed yet. You can return to your cart or continue checkout anytime." })}</p>
            <div className="card-actions">
              <Link className="btn btn-secondary btn-md" to="/cart">
                {t("checkout.backToCart", { defaultValue: "Back to cart" })}
              </Link>
              <Link className="btn btn-primary btn-md" to="/checkout">
                {t("checkout.title", { defaultValue: "Return to checkout" })}
              </Link>
            </div>
          </article>
        </Container>
      </section>
    </SiteLayout>
  );
}
