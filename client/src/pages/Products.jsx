import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SiteLayout from "../components/layout/SiteLayout";
import Container from "../components/layout/Container";
import ProductCard from "../components/store/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import useCart from "../hooks/useCart";
import { CART_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog } from "../lib/catalog";

const baseCategories = ["machines", "accessories", "pillows"];

function scoreFromProduct(product) {
  const seed = String(product?.id || product?.name || "sleepora");
  let total = 0;
  for (let index = 0; index < seed.length; index += 1) {
    total += seed.charCodeAt(index);
  }
  return 4.2 + (total % 8) * 0.1;
}

function getCategoryLabel(category, t) {
  if (category === "all") return t("nav.products", { defaultValue: "All" });
  return t(`nav.${category}`, {
    defaultValue: category.charAt(0).toUpperCase() + category.slice(1)
  });
}

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const { addItem } = useCart(CART_STORAGE_KEY);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(String(searchParams.get("category") || "all").toLowerCase());
  const [searchTerm, setSearchTerm] = useState(String(searchParams.get("search") || ""));
  const [sortBy, setSortBy] = useState("featured");
  const [priceCeiling, setPriceCeiling] = useState(0);

  const searchPlaceholderByLanguage = {
    en: "Search for anything",
    fr: "Rechercher n'importe quoi",
    ar: "\u0627\u0628\u062d\u062b \u0639\u0646 \u0623\u064a \u0634\u064a\u0621",
    es: "Buscar cualquier producto",
    de: "Suche nach Produkten",
    it: "Cerca qualsiasi prodotto"
  };

  const normalizedLanguage = String(language || "").toLowerCase();
  const localizedSearchPlaceholder =
    searchPlaceholderByLanguage[normalizedLanguage] || t("products.searchPlaceholder", { defaultValue: "Search for anything" });

  useEffect(() => {
    document.title = t("meta.products");
  }, [t, i18n.language]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  useEffect(() => {
    const nextCategory = String(searchParams.get("category") || "all").toLowerCase();
    const nextSearch = String(searchParams.get("search") || "");
    setSelectedCategory(nextCategory);
    setSearchTerm(nextSearch);
  }, [searchParams]);

  const categoryOptions = useMemo(() => {
    const dynamic = Array.from(new Set(products.map((item) => String(item.category || "").toLowerCase()).filter(Boolean)));
    const normalized = Array.from(new Set([...baseCategories, ...dynamic]));
    return ["all", ...normalized];
  }, [products]);

  const priceBounds = useMemo(() => {
    const prices = products.map((item) => Number(item.price || 0)).filter((value) => Number.isFinite(value));
    if (!prices.length) return { min: 0, max: 200 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  useEffect(() => {
    setPriceCeiling((current) => {
      if (current <= 0) return priceBounds.max;
      return Math.min(current, priceBounds.max);
    });
  }, [priceBounds.max]);

  function updateQuery(nextCategory, nextSearch) {
    const params = new URLSearchParams(searchParams);
    if (nextCategory && nextCategory !== "all") params.set("category", nextCategory);
    else params.delete("category");
    if (String(nextSearch || "").trim()) params.set("search", String(nextSearch).trim());
    else params.delete("search");
    setSearchParams(params, { replace: true });
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    updateQuery(selectedCategory, searchTerm);
  }

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const inCategory = products.filter((product) => {
      if (selectedCategory === "all") return true;
      return String(product.category || "").toLowerCase() === selectedCategory;
    });

    const withSearch = inCategory.filter((product) => {
      if (!query) return true;
      const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      return haystack.includes(query);
    });

    const withPrice = withSearch.filter((product) => Number(product.price || 0) <= priceCeiling);
    const sorted = [...withPrice];

    if (sortBy === "price-asc") sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sortBy === "price-desc") sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sortBy === "top-rated") sorted.sort((a, b) => scoreFromProduct(b) - scoreFromProduct(a));
    if (sortBy === "name-asc") sorted.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    if (sortBy === "featured") {
      sorted.sort((a, b) => {
        if (Boolean(a.featured) === Boolean(b.featured)) {
          return scoreFromProduct(b) - scoreFromProduct(a);
        }
        return a.featured ? -1 : 1;
      });
    }

    return sorted;
  }, [priceCeiling, products, searchTerm, selectedCategory, sortBy]);

  return (
    <SiteLayout>
      <section className="products-page">
        <Container>
          <header className="products-header">
            <h1>{t("products.title", { defaultValue: "Sleep essentials" })}</h1>
            <p>{t("products.subtitle", { defaultValue: "Browse handmade-style picks curated for better rest." })}</p>
          </header>

          <form className="products-search-form" onSubmit={handleSearchSubmit}>
            <input
              aria-label={localizedSearchPlaceholder}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={localizedSearchPlaceholder}
              value={searchTerm}
            />
            <button className="btn btn-primary btn-md" type="submit">
              {t("home.searchCta", { defaultValue: "Search" })}
            </button>
            <button className="btn btn-secondary btn-md products-filter-btn" onClick={() => setMobileFiltersOpen(true)} type="button">
              {t("products.filters", { defaultValue: "Filters" })}
            </button>
          </form>

          <div className="products-toolbar">
            <p className="products-results-count">
              {t("products.resultsCount", {
                defaultValue: "{{count}} items",
                count: filteredProducts.length
              })}
            </p>
            <label className="products-sort-wrap">
              <span>{t("products.sortBy", { defaultValue: "Sort by" })}</span>
              <select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
                <option value="featured">{t("products.sortFeatured", { defaultValue: "Featured" })}</option>
                <option value="top-rated">{t("products.sortTopRated", { defaultValue: "Top rated" })}</option>
                <option value="price-asc">{t("products.sortPriceLow", { defaultValue: "Price: low to high" })}</option>
                <option value="price-desc">{t("products.sortPriceHigh", { defaultValue: "Price: high to low" })}</option>
                <option value="name-asc">{t("products.sortName", { defaultValue: "Name: A to Z" })}</option>
              </select>
            </label>
          </div>

          <div className="products-layout">
            <aside className="products-sidebar">
              <h2>{t("products.filters", { defaultValue: "Filters" })}</h2>
              <div className="products-filter-block">
                <p>{t("products.category", { defaultValue: "Category" })}</p>
                <div className="products-chip-grid">
                  {categoryOptions.map((category) => {
                    const active = selectedCategory === category;
                    return (
                      <button
                        className={active ? "products-filter-chip active" : "products-filter-chip"}
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          updateQuery(category, searchTerm);
                        }}
                        type="button"
                      >
                        {getCategoryLabel(category, t)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="products-filter-block">
                <p>{t("products.maxPrice", { defaultValue: "Max price" })}</p>
                <div className="products-range-head">
                  <strong>{`$${priceBounds.min}`}</strong>
                  <strong>{`$${priceCeiling}`}</strong>
                </div>
                <input
                  className="products-range-input"
                  max={priceBounds.max}
                  min={priceBounds.min}
                  onChange={(event) => setPriceCeiling(Number(event.target.value))}
                  type="range"
                  value={priceCeiling}
                />
              </div>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                  setPriceCeiling(priceBounds.max);
                  setSortBy("featured");
                  updateQuery("all", "");
                }}
                type="button"
              >
                {t("products.clearFilters", { defaultValue: "Clear filters" })}
              </button>
            </aside>

            <div className="products-results">
              {!filteredProducts.length ? (
                <div className="empty-state">
                  <h2>{t("products.noResults", { defaultValue: "No products match your filters yet." })}</h2>
                  <p>{t("products.tryAdjusting", { defaultValue: "Try changing category, search, or max price." })}</p>
                </div>
              ) : (
                <div className="market-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} onAddToCart={addItem} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <div aria-modal="true" className={mobileFiltersOpen ? "products-mobile-sheet open" : "products-mobile-sheet"} role="dialog">
        <button
          aria-label="Close filters"
          className="products-mobile-backdrop"
          onClick={() => setMobileFiltersOpen(false)}
          type="button"
        />
        <div className="products-mobile-panel">
          <div className="products-mobile-head">
            <h2>{t("products.filters", { defaultValue: "Filters" })}</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setMobileFiltersOpen(false)} type="button">
              {t("common.close", { defaultValue: "Close" })}
            </button>
          </div>

          <div className="products-filter-block">
            <p>{t("products.category", { defaultValue: "Category" })}</p>
            <div className="products-chip-grid">
              {categoryOptions.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    className={active ? "products-filter-chip active" : "products-filter-chip"}
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                  >
                    {getCategoryLabel(category, t)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="products-filter-block">
            <p>{t("products.maxPrice", { defaultValue: "Max price" })}</p>
            <div className="products-range-head">
              <strong>{`$${priceBounds.min}`}</strong>
              <strong>{`$${priceCeiling}`}</strong>
            </div>
            <input
              className="products-range-input"
              max={priceBounds.max}
              min={priceBounds.min}
              onChange={(event) => setPriceCeiling(Number(event.target.value))}
              type="range"
              value={priceCeiling}
            />
          </div>

          <label className="products-sort-wrap">
            <span>{t("products.sortBy", { defaultValue: "Sort by" })}</span>
            <select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
              <option value="featured">{t("products.sortFeatured", { defaultValue: "Featured" })}</option>
              <option value="top-rated">{t("products.sortTopRated", { defaultValue: "Top rated" })}</option>
              <option value="price-asc">{t("products.sortPriceLow", { defaultValue: "Price: low to high" })}</option>
              <option value="price-desc">{t("products.sortPriceHigh", { defaultValue: "Price: high to low" })}</option>
              <option value="name-asc">{t("products.sortName", { defaultValue: "Name: A to Z" })}</option>
            </select>
          </label>

          <div className="products-mobile-actions">
            <button
              className="btn btn-secondary btn-md"
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
                setPriceCeiling(priceBounds.max);
                setSortBy("featured");
                updateQuery("all", "");
              }}
              type="button"
            >
              {t("products.clearFilters", { defaultValue: "Clear filters" })}
            </button>
            <button
              className="btn btn-primary btn-md"
              onClick={() => {
                updateQuery(selectedCategory, searchTerm);
                setMobileFiltersOpen(false);
              }}
              type="button"
            >
              {t("products.applyFilters", { defaultValue: "Apply filters" })}
            </button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
