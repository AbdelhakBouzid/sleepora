import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";

export default function PolicyPage({ policyKey }) {
  const { t, i18n } = useTranslation();
  const body = t(`policy.${policyKey}.body`);
  const paragraphs = String(body || "")
    .split("\n\n")
    .map((item) => item.trim())
    .filter(Boolean);

  useEffect(() => {
    document.title = t("meta.policy");
  }, [t, i18n.language]);

  return (
    <SiteLayout>
      <section className="page-section">
        <Container>
          <article className="policy-card">
            <h1>{t(`policy.${policyKey}.title`)}</h1>
            <div className="policy-body">
              {(paragraphs.length ? paragraphs : [body]).map((paragraph, index) => (
                <p key={`${policyKey}-${index}`}>{paragraph}</p>
              ))}
            </div>
            <Link className="btn btn-secondary btn-md" to="/">
              {t("policy.back")}
            </Link>
          </article>
        </Container>
      </section>
    </SiteLayout>
  );
}
