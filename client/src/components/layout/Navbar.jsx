import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useCart from "../../hooks/useCart";
import useLocalStorage from "../../hooks/useLocalStorage";
import { CART_STORAGE_KEY, USER_PROFILE_STORAGE_KEY, clearUserSession } from "../../lib/storage";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitch from "../ui/LanguageSwitch";

function NavItem({ to, children, onClick, className = "nav-item" }) {
  return (
    <NavLink className={({ isActive }) => (isActive ? `${className} active` : className)} onClick={onClick} to={to}>
      {children}
    </NavLink>
  );
}

function UserAvatar({ user }) {
  const initials = String(user?.full_name || user?.first_name || user?.email || "S")
    .split(" ")
    .map((part) => part.trim().charAt(0).toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return <span className="profile-avatar">{initials || "S"}</span>;
}

export default function Navbar({ onOpenContact }) {
  const { t } = useTranslation();
  const { count } = useCart(CART_STORAGE_KEY);
  const [user] = useLocalStorage(USER_PROFILE_STORAGE_KEY, null);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const categoryLinks = useMemo(
    () => [
      { label: t("nav.products"), to: "/products" },
      { label: t("nav.machines"), to: "/products?category=machines" },
      { label: t("nav.accessories"), to: "/products?category=accessories" },
      { label: t("nav.pillows"), to: "/products?category=pillows" }
    ],
    [t]
  );

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.search]);

  function openContactFromMenu() {
    setMobileOpen(false);
    onOpenContact();
  }

  function handleLogout() {
    clearUserSession();
    setMobileOpen(false);
    setProfileOpen(false);
  }

  return (
    <header className="navbar-shell">
      <div className="container navbar">
        <div className="mobile-head">
          <button
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen((state) => !state)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>

          <Link className="brand-mark" to="/">
            <img alt={t("brand.name")} className="brand-logo" loading="eager" src="/images/brand/sleepora-logo.png" />
            <span className="sr-only">{t("brand.name")}</span>
          </Link>

          <NavItem className="nav-item mobile-cart-link" to="/cart">
            {t("nav.cart")} <span className="cart-count">{count}</span>
          </NavItem>
        </div>

        <nav className="nav-cluster nav-left" aria-label="Store categories">
          {categoryLinks.map((item) =>
            item.to === "/products" ? (
              <NavItem className="menu-link" key={item.label} to={item.to}>
                {item.label}
              </NavItem>
            ) : (
              <Link className="menu-link" key={item.label} to={item.to}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <Link className="brand-mark desktop-brand" to="/">
          <img alt={t("brand.name")} className="brand-logo" loading="eager" src="/images/brand/sleepora-logo.png" />
          <span className="sr-only">{t("brand.name")}</span>
        </Link>

        <div className="nav-cluster nav-right">
          <button className="nav-item nav-button" onClick={onOpenContact} type="button">
            {t("nav.contact")}
          </button>
          <NavItem to="/cart">
            {t("nav.cart")} <span className="cart-count">{count}</span>
          </NavItem>
          <LanguageSwitch />
          <ThemeToggle />
          {user ? (
            <div className="profile-menu">
              <button
                aria-expanded={profileOpen}
                className="profile-trigger"
                onClick={() => setProfileOpen((state) => !state)}
                type="button"
              >
                <UserAvatar user={user} />
                <span className="profile-trigger-name">{user?.first_name || t("profile.title")}</span>
              </button>
              <div className={profileOpen ? "profile-dropdown open" : "profile-dropdown"}>
                <div className="profile-dropdown-head">
                  <strong>{user?.full_name || user?.email || t("profile.title")}</strong>
                  <span>{user?.email || ""}</span>
                </div>
                <Link className="profile-dropdown-link" to="/profile">
                  {t("profile.menuProfile")}
                </Link>
                <Link className="profile-dropdown-link" to="/settings">
                  {t("profile.menuSettings")}
                </Link>
                <Link className="profile-dropdown-link" to="/cart">
                  {t("profile.menuCart")}
                </Link>
                <button className="profile-dropdown-link danger" onClick={handleLogout} type="button">
                  {t("profile.logout")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <NavItem to="/login">{t("nav.login")}</NavItem>
              <NavItem to="/register">{t("nav.register")}</NavItem>
            </>
          )}
        </div>
      </div>

      <div className={mobileOpen ? "mobile-menu open" : "mobile-menu"}>
        <div className="container mobile-menu-inner">
          {categoryLinks.map((item) =>
            item.to === "/products" ? (
              <NavItem className="mobile-link" key={item.label} onClick={() => setMobileOpen(false)} to={item.to}>
                {item.label}
              </NavItem>
            ) : (
              <Link className="mobile-link" key={item.label} onClick={() => setMobileOpen(false)} to={item.to}>
                {item.label}
              </Link>
            )
          )}
          {user ? (
            <>
              <NavItem className="mobile-link" onClick={() => setMobileOpen(false)} to="/profile">
                {t("profile.menuProfile")}
              </NavItem>
              <NavItem className="mobile-link" onClick={() => setMobileOpen(false)} to="/settings">
                {t("profile.menuSettings")}
              </NavItem>
              <NavItem className="mobile-link" onClick={() => setMobileOpen(false)} to="/cart">
                {t("profile.menuCart")}
              </NavItem>
              <button className="mobile-link mobile-link-button danger" onClick={handleLogout} type="button">
                {t("profile.logout")}
              </button>
            </>
          ) : (
            <>
              <NavItem className="mobile-link" onClick={() => setMobileOpen(false)} to="/login">
                {t("nav.login")}
              </NavItem>
              <NavItem className="mobile-link" onClick={() => setMobileOpen(false)} to="/register">
                {t("nav.register")}
              </NavItem>
            </>
          )}
          <button className="mobile-link mobile-link-button" onClick={openContactFromMenu} type="button">
            {t("nav.contact")}
          </button>

          <div className="mobile-tools">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
