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

  const categoryLinks = [
    { label: t("nav.products"), to: "/products" },
    { label: t("nav.machines"), to: "/products?category=machines" },
    { label: t("nav.accessories"), to: "/products?category=accessories" },
    { label: t("nav.pillows"), to: "/products?category=pillows" }
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function openContactFromMenu() {
    setMobileOpen(false);
    onOpenContact();
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
            <span className="brand-title">{t("brand.name")}</span>
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
          <span className="brand-title">{t("brand.name")}</span>
        </Link>

        <div className="nav-cluster nav-right">
          <NavItem to="/login">{t("nav.login")}</NavItem>
          <NavItem to="/register">{t("nav.register")}</NavItem>
          <button className="nav-item nav-button" onClick={onOpenContact} type="button">
            {t("nav.contact")}
          </button>
          <NavItem to="/cart">
            {t("nav.cart")} <span className="cart-count">{count}</span>
          </NavItem>
          <LanguageSwitch />
          <ThemeToggle />
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
