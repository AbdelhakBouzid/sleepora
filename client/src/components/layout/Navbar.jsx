import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useCart from "../../hooks/useCart";
import { CART_STORAGE_KEY } from "../../lib/storage";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitch from "../ui/LanguageSwitch";

function NavItem({ to, children }) {
  return (
    <NavLink className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} to={to}>
      {children}
    </NavLink>
  );
}

export default function Navbar({ onOpenContact }) {
  const { t } = useTranslation();
  const { count } = useCart(CART_STORAGE_KEY);

  return (
    <header className="navbar-shell">
      <div className="container navbar">
        <Link className="brand-mark" to="/">
          <span className="brand-title">{t("brand.name")}</span>
        </Link>

        <nav className="nav-links">
          <NavItem to="/products">{t("nav.products")}</NavItem>
          <NavItem to="/cart">
            🛒 <span className="cart-count">{count}</span>
          </NavItem>
          <NavItem to="/login">{t("nav.login")}</NavItem>
          <NavItem to="/register">{t("nav.register")}</NavItem>
          <button className="nav-item nav-button" onClick={onOpenContact} type="button">
            {t("nav.contact")}
          </button>
        </nav>

        <div className="navbar-tools">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
