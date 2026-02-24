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
          <article className="policy-card">
            <h1>{t("checkout.cancelTitle")}</h1>
            <p>{t("checkout.cancelled")}</p>
            <Link className="btn btn-secondary btn-md" to="/checkout">
              {t("checkout.title")}
            </Link>
          </article>
        </Container>
      </section>
    </SiteLayout>
  );
}

