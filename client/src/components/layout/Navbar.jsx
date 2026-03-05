import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useCart from "../../hooks/useCart";
import useLocalStorage from "../../hooks/useLocalStorage";
import { CART_STORAGE_KEY, USER_PROFILE_STORAGE_KEY, clearUserSession } from "../../lib/storage";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitch from "../ui/LanguageSwitch";

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
  const { count } = useCart(CART_STORAGE_KEY);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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
    setProfileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (location.pathname !== "/products") return;
    const params = new URLSearchParams(location.search);
    setSearchTerm(String(params.get("search") || ""));
  }, [location.pathname, location.search]);

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

  return (
    <header className="etsy-header">
      <div className="container etsy-top-row">
        <Link className="etsy-brand" to="/">
          <span className="etsy-brand-word">sleeepora</span>
        </Link>

        <div className="etsy-top-actions">
          {user ? (
            <div className="profile-menu">
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

          <Link aria-label="Favorites" className="etsy-icon-btn" to="/products">
            <HeartIcon />
          </Link>
          <NavLink aria-label={t("nav.cart")} className="etsy-icon-btn etsy-cart-btn" to="/cart">
            <CartIcon />
            <span className="etsy-cart-badge">{count}</span>
          </NavLink>
        </div>
      </div>

      <div className="container etsy-search-wrap">
        <div className="etsy-search-toolbar">
          <button
            aria-expanded={mobileOpen}
            aria-label="Open categories"
            className="etsy-categories-trigger"
            onClick={() => setMobileOpen((state) => !state)}
            type="button"
          >
            <MenuIcon />
            <span>{t("nav.categories", { defaultValue: "Categories" })}</span>
          </button>

          <form className="etsy-search-row" onSubmit={handleSearchSubmit}>
          <input
            aria-label={t("home.searchAria", { defaultValue: "Search for anything" })}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t("home.searchPlaceholder", { defaultValue: "Search for anything" })}
            value={searchTerm}
          />

          <button aria-label={t("home.searchCta", { defaultValue: "Search" })} className="etsy-search-submit" type="submit">
            <SearchIcon />
          </button>
          </form>
        </div>
      </div>

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
            <button className="etsy-drawer-close" onClick={() => setMobileOpen(false)} type="button">
              x
            </button>
          </div>

          <div className="etsy-drawer-tools">
            <LanguageSwitch />
            <ThemeToggle />
          </div>

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

          {user ? (
            <>
              <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to="/profile">
                {t("profile.menuProfile", { defaultValue: "My account" })}
              </NavLink>
              <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to="/settings">
                {t("profile.menuSettings", { defaultValue: "Settings" })}
              </NavLink>
              <button className="etsy-drawer-link danger" onClick={handleLogout} type="button">
                {t("profile.logout", { defaultValue: "Logout" })}
              </button>
            </>
          ) : (
            <>
              <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to="/login">
                {t("nav.login", { defaultValue: "Sign in" })}
              </NavLink>
              <NavLink className="etsy-drawer-link" onClick={() => setMobileOpen(false)} to="/register">
                {t("nav.register", { defaultValue: "Register" })}
              </NavLink>
            </>
          )}

          <button className="etsy-drawer-link" onClick={openContactFromDrawer} type="button">
            {t("nav.contact", { defaultValue: "Contact" })}
          </button>
        </div>
      </div>
    </header>
  );
}
