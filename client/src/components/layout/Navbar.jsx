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
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <span>Free shipping on orders over $95</span>
        </div>
      </div>

      <div className="container navbar">
        <nav className="nav-cluster nav-left" aria-label="Store categories">
          <Link className="menu-link" to="/products">
            {t("nav.products")}
          </Link>
          <Link className="menu-link hide-mobile" to="/products">
            Machines
          </Link>
          <Link className="menu-link hide-mobile" to="/products">
            Accessories
          </Link>
          <Link className="menu-link hide-mobile" to="/products">
            Pillows
          </Link>
        </nav>

        <Link className="brand-mark" to="/">
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
          <div className="navbar-tools">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
