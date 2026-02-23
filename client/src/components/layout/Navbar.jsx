import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useCart from "../../hooks/useCart";
import { CART_STORAGE_KEY } from "../../lib/storage";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitch from "../ui/LanguageSwitch";

function NavItem({ to, children, onClick, className = "nav-item" }) {
  return (
    <NavLink className={({ isActive }) => (isActive ? `${className} active` : className)} onClick={onClick} to={to}>
      {children}
    </NavLink>
  );
}

export default function Navbar({ onOpenContact }) {
  const { t } = useTranslation();
  const { count } = useCart(CART_STORAGE_KEY);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function openContactFromMenu() {
    setMobileOpen(false);
    onOpenContact();
  }

  return (
    <header className="navbar-shell">
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <span>Free shipping on orders over $95</span>
        </div>
      </div>

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
            <span className="brand-title">{t("brand.name")}</span>
          </Link>

          <NavItem className="nav-item mobile-cart-link" to="/cart">
            Cart <span className="cart-count">{count}</span>
          </NavItem>
        </div>

        <nav className="nav-cluster nav-left" aria-label="Store categories">
          <NavItem className="menu-link" to="/products">
            {t("nav.products")}
          </NavItem>
          <Link className="menu-link" to="/products">
            Machines
          </Link>
          <Link className="menu-link" to="/products">
            Accessories
          </Link>
          <Link className="menu-link" to="/products">
            Pillows
          </Link>
        </nav>

        <Link className="brand-mark desktop-brand" to="/">
          <span className="brand-title">{t("brand.name")}</span>
        </Link>

        <div className="nav-cluster nav-right">
          <NavItem to="/login">{t("nav.login")}</NavItem>
          <NavItem to="/register">{t("nav.register")}</NavItem>
          <button className="nav-item nav-button" onClick={onOpenContact} type="button">
            {t("nav.contact")}
          </button>
          <NavItem to="/cart">
            Cart <span className="cart-count">{count}</span>
          </NavItem>
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>

      <div className={mobileOpen ? "mobile-menu open" : "mobile-menu"}>
        <div className="container mobile-menu-inner">
          <NavItem className="mobile-link" onClick={() => setMobileOpen(false)} to="/products">
            {t("nav.products")}
          </NavItem>
          <Link className="mobile-link" onClick={() => setMobileOpen(false)} to="/products">
            Machines
          </Link>
          <Link className="mobile-link" onClick={() => setMobileOpen(false)} to="/products">
            Accessories
          </Link>
          <Link className="mobile-link" onClick={() => setMobileOpen(false)} to="/products">
            Pillows
          </Link>
          <NavItem className="mobile-link" onClick={() => setMobileOpen(false)} to="/login">
            {t("nav.login")}
          </NavItem>
          <NavItem className="mobile-link" onClick={() => setMobileOpen(false)} to="/register">
            {t("nav.register")}
          </NavItem>
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
