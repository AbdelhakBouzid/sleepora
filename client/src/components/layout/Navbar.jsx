import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useCart from "../../hooks/useCart";
import useLocalStorage from "../../hooks/useLocalStorage";
import { CART_STORAGE_KEY, FAVORITES_STORAGE_KEY, USER_PROFILE_STORAGE_KEY, clearUserSession } from "../../lib/storage";
import LanguageSwitch from "../ui/LanguageSwitch";
import { useLanguage } from "../../context/LanguageContext";
import ba2i3Logo from "../../assets/ba2i3-logo.svg";

function UserAvatar({ user }) {
  const initials = String(user?.full_name || user?.first_name || user?.email || "S")
    .split(" ")
    .map((part) => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return <span className="profile-avatar">{initials || "S"}</span>;
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="etsy-icon" viewBox="0 0 24 24">
      <path d="M4 6.5h16v1.8H4zm0 4.8h16v1.8H4zm0 4.8h16v1.8H4z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="etsy-icon" viewBox="0 0 24 24">
      <path d="m15.8 14.5 4.7 4.7-1.3 1.3-4.7-4.7a7 7 0 1 1 1.3-1.3ZM10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="etsy-icon" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" className="etsy-icon" viewBox="0 0 24 24">
      <path d="M12 20.1 4.5 12.7A5.5 5.5 0 0 1 12 4.9a5.5 5.5 0 0 1 7.5 7.8Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="etsy-icon" viewBox="0 0 24 24">
      <path d="M3 4h2l1.6 9.2a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6L21 7H7.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </svg>
  );
}

export default function Navbar({ onOpenContact }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, language, setCurrency } = useLanguage();
  const { count } = useCart(CART_STORAGE_KEY);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const [favoriteIds] = useLocalStorage(FAVORITES_STORAGE_KEY, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const scrollStateRef = useRef({ compact: false, frameId: 0, lastY: 0, direction: 0, travel: 0, lockUntil: 0 });
  const overlayOpenRef = useRef(false);
  const profileMenuRef = useRef(null);
  const favoritesCount = Array.isArray(favoriteIds) ? favoriteIds.length : 0;

  const categoryLinks = useMemo(
    () => [
      { label: t("nav.products"), to: "/products" },
      { label: t("nav.machines", { defaultValue: "Machines" }), to: "/products?category=machines" },
      { label: t("nav.accessories", { defaultValue: "Accessories" }), to: "/products?category=accessories" },
      { label: t("nav.pillows", { defaultValue: "Pillows" }), to: "/products?category=pillows" }
    ],
    [t]
  );

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (location.pathname !== "/products") return;
    const params = new URLSearchParams(location.search);
    setSearchTerm(String(params.get("search") || ""));
  }, [location.pathname, location.search]);

  useEffect(() => {
    overlayOpenRef.current = mobileOpen || searchOpen;
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;
    scrollStateRef.current.compact = false;
    scrollStateRef.current.direction = 0;
    scrollStateRef.current.travel = 0;
    setCompactHeader(false);
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const scrollState = scrollStateRef.current;
    const MOBILE_BREAKPOINT = 980;
    const HIDE_START_Y = 72;
    const SHOW_AT_TOP_Y = 18;
    const MIN_DELTA = 3;
    const HIDE_DISTANCE = 26;
    const REVEAL_DISTANCE = 14;
    const TOGGLE_LOCK_MS = 140;

    scrollState.lastY = Math.max(window.scrollY, 0);
    scrollState.direction = 0;
    scrollState.travel = 0;

    function commitCompact(nextCompact, currentY) {
      if (scrollState.compact === nextCompact) return;
      scrollState.compact = nextCompact;
      scrollState.direction = 0;
      scrollState.travel = 0;
      scrollState.lockUntil = Date.now() + TOGGLE_LOCK_MS;
      scrollState.lastY = currentY;
      setCompactHeader(nextCompact);
    }

    function measureScroll() {
      scrollState.frameId = 0;

      const y = Math.max(window.scrollY, 0);
      const delta = y - scrollState.lastY;
      const isMobileViewport = window.innerWidth < MOBILE_BREAKPOINT;
      scrollState.lastY = y;

      if (Date.now() < scrollState.lockUntil) {
        return;
      }

      if (!isMobileViewport) {
        commitCompact(false, y);
        return;
      }

      if (overlayOpenRef.current) {
        commitCompact(false, y);
        return;
      }

      if (y <= SHOW_AT_TOP_Y) {
        commitCompact(false, y);
        return;
      }

      if (Math.abs(delta) < MIN_DELTA) {
        return;
      }

      const nextDirection = delta > 0 ? 1 : -1;
      if (scrollState.direction !== nextDirection) {
        scrollState.direction = nextDirection;
        scrollState.travel = 0;
      }
      scrollState.travel += Math.abs(delta);

      if (nextDirection > 0 && !scrollState.compact && y > HIDE_START_Y && scrollState.travel >= HIDE_DISTANCE) {
        commitCompact(true, y);
        return;
      }

      if (nextDirection < 0 && scrollState.compact && scrollState.travel >= REVEAL_DISTANCE) {
        commitCompact(false, y);
      }
    }

    function onScroll() {
      if (scrollState.frameId) return;
      scrollState.frameId = window.requestAnimationFrame(measureScroll);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (scrollState.frameId) {
        window.cancelAnimationFrame(scrollState.frameId);
        scrollState.frameId = 0;
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!profileOpen) return undefined;

    function handlePointerDown(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (!mobileOpen || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    const query = searchTerm.trim();
    if (query) params.set("search", query);
    navigate(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleLogout() {
    clearUserSession();
    setMobileOpen(false);
    setProfileOpen(false);
  }

  function openContactFromDrawer() {
    setMobileOpen(false);
    setProfileOpen(false);
    onOpenContact?.();
  }

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
    searchPlaceholderByLanguage[normalizedLanguage] || t("home.searchPlaceholder", { defaultValue: "Search for anything" });

  function handleCurrencyChange(event) {
    const nextCurrency = String(event.target.value || "").toUpperCase();
    setCurrency(nextCurrency);
  }

  function handleToggleMobileMenu() {
    setProfileOpen(false);
    setSearchOpen(false);
    setMobileOpen((state) => !state);
  }

  function handleToggleSearch() {
    setProfileOpen(false);
    setMobileOpen(false);
    setSearchOpen((state) => !state);
  }

  function openSearchFromMenu() {
    setMobileOpen(false);
    setSearchOpen(true);
  }

  const headerClassName = [
    "etsy-header",
    compactHeader ? "is-compact" : "",
    location.pathname === "/" && !compactHeader && !mobileOpen && !searchOpen ? "is-home-hero" : "",
    searchOpen ? "has-search-open" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClassName}>
        <div className="container etsy-top-row">
          <Link className="etsy-brand" to="/">
            <img alt={t("brand.name")} className="etsy-brand-logo" src={ba2i3Logo} />
          </Link>

          <div className="etsy-top-actions">
            {user ? (
              <div className="profile-menu" ref={profileMenuRef}>
                <button
                  aria-expanded={profileOpen}
                  className="profile-trigger"
                  onClick={() => setProfileOpen((state) => !state)}
                  type="button"
                >
                  <UserAvatar user={user} />
                  <span className="profile-trigger-name">{user?.first_name || "Account"}</span>
                </button>
                <div className={profileOpen ? "profile-dropdown open" : "profile-dropdown"}>
                  <div className="profile-dropdown-head">
                    <strong>{user?.full_name || user?.email || "Account"}</strong>
                    <span>{user?.email || ""}</span>
                  </div>
                  <Link className="profile-dropdown-link" to="/profile">
                    {t("profile.menuProfile", { defaultValue: "My account" })}
                  </Link>
                  <Link className="profile-dropdown-link" to="/settings">
                    {t("profile.menuSettings", { defaultValue: "Settings" })}
                  </Link>
                  <button className="profile-dropdown-link danger" onClick={handleLogout} type="button">
                    {t("profile.logout", { defaultValue: "Logout" })}
                  </button>
                </div>
              </div>
            ) : (
              <NavLink className="etsy-signin-link" to="/login">
                {t("nav.login", { defaultValue: "Sign in" })}
              </NavLink>
            )}

            <Link aria-label="Favorites" className="etsy-icon-btn" to="/favorites">
              <HeartIcon />
              {favoritesCount ? <span className="etsy-cart-badge etsy-favorites-badge">{favoritesCount}</span> : null}
            </Link>
            <NavLink aria-label={t("nav.cart")} className="etsy-icon-btn etsy-cart-btn" to="/cart">
              <CartIcon />
              <span className="etsy-cart-badge">{count}</span>
            </NavLink>
          </div>
        </div>

        <div className={searchOpen ? "etsy-mobile-search-panel open" : "etsy-mobile-search-panel"}>
          <div className="container etsy-mobile-search-shell">
            <button
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t("common.close", { defaultValue: "Close" }) : t("drawer.openMenu", { defaultValue: "Open menu" })}
              className="etsy-mobile-menu-btn"
              onClick={handleToggleMobileMenu}
              type="button"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <form className="etsy-mobile-search-form" onSubmit={handleSearchSubmit}>
              <input
                aria-label={localizedSearchPlaceholder}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={localizedSearchPlaceholder}
                value={searchTerm}
              />
              <button aria-label={t("home.searchCta", { defaultValue: "Search" })} className="etsy-mobile-search-submit" type="submit">
                <SearchIcon />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className={mobileOpen ? "etsy-drawer open" : "etsy-drawer"}>
        <button
          aria-label="Close mobile menu"
          className="etsy-drawer-backdrop"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
        <div className="etsy-drawer-panel">
          <div className="etsy-drawer-head">
            <strong>{t("brand.name")}</strong>
            <div className="etsy-drawer-head-actions">
              <button
                aria-label={t("home.searchCta", { defaultValue: "Search" })}
                className="etsy-mobile-search-btn"
                onClick={openSearchFromMenu}
                type="button"
              >
                <SearchIcon />
              </button>
              <button className="etsy-drawer-close" onClick={() => setMobileOpen(false)} type="button">
                <CloseIcon />
              </button>
            </div>
          </div>

          <p className="etsy-drawer-section-title">{t("drawer.categories", { defaultValue: "Categories" })}</p>

          {categoryLinks.map((item) =>
            item.to === "/products" ? (
              <NavLink className="etsy-drawer-link" key={item.to} onClick={() => setMobileOpen(false)} to={item.to}>
                {item.label}
              </NavLink>
            ) : (
              <Link className="etsy-drawer-link" key={item.to} onClick={() => setMobileOpen(false)} to={item.to}>
                {item.label}
              </Link>
            )
          )}

          <p className="etsy-drawer-section-title">{t("drawer.account", { defaultValue: "Account" })}</p>
          <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to="/favorites">
            {t("drawer.favorites", { defaultValue: "Favorites" })} {favoritesCount ? `(${favoritesCount})` : ""}
          </NavLink>
          <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to="/cart">
            {t("nav.cart")} {count ? `(${count})` : ""}
          </NavLink>
          <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to={user ? "/profile" : "/login"}>
            {t("drawer.myAccount", { defaultValue: "My Account" })}
          </NavLink>
          <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to="/settings">
            {t("drawer.settings", { defaultValue: "Settings" })}
          </NavLink>

          {user ? (
            <button className="etsy-drawer-link danger" onClick={handleLogout} type="button">
              {t("profile.logout", { defaultValue: "Logout" })}
            </button>
          ) : (
            <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to="/register">
              {t("nav.register", { defaultValue: "Register" })}
            </NavLink>
          )}

          <div className="etsy-drawer-tools">
            <LanguageSwitch withLabel />
            <label className="drawer-setting-control">
              <span className="drawer-setting-label">{t("drawer.currency", { defaultValue: "Currency" })}</span>
              <select aria-label={t("drawer.currency", { defaultValue: "Currency" })} className="lang-select etsy-currency-select" onChange={handleCurrencyChange} value={currency}>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="MAD">MAD - Moroccan Dirham</option>
              </select>
            </label>
          </div>

          <button className="etsy-drawer-link" onClick={openContactFromDrawer} type="button">
            {t("nav.contact", { defaultValue: "Contact" })}
          </button>
        </div>
      </div>
    </>
  );
}
