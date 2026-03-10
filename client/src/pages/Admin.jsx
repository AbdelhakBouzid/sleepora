import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import LanguageSwitch from "../components/ui/LanguageSwitch";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { useTheme } from "../context/ThemeContext";
import { fetchCatalog, normalizeCatalog } from "../lib/catalog";
import { loadAdminProducts, saveAdminProducts, uploadAdminImage } from "../lib/adminApi";
import { formatPrice } from "../lib/format";
import {
  adminLogin,
  adminLogout,
  adminSession,
  deleteAdminUser,
  loadAdminUsers,
  loadPaidOrders
} from "../lib/adminPortalApi";

const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const videoMimeTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];
const videoExtensions = [".mp4", ".webm", ".mov", ".m4v"];
const maxImageFileSize = 5 * 1024 * 1024;
const maxVideoFileSize = 30 * 1024 * 1024;
const defaultBenefits = ["Relieves neck pain", "Improves sleep posture", "Premium comfort", "Designed for deep sleep"];
const knownCategories = ["machines", "accessories", "pillows"];
const presetColorOptions = [
  "White",
  "Black",
  "Gray",
  "Beige",
  "Cream",
  "Ivory",
  "Pearl",
  "Silver",
  "Warm White",
  "Charcoal",
  "Red",
  "Blue",
  "Green",
  "Brown",
  "Pink",
  "Navy"
];
const initialLogin = {
  username: "",
  password: ""
};
const colorPreviewMap = {
  white: "#ffffff",
  black: "#121826",
  gray: "#97a3b6",
  beige: "#d7c3a5",
  cream: "#f0e4cb",
  ivory: "#fffaf0",
  pearl: "#f5f1ea",
  silver: "#b9c1cd",
  "warm white": "#f7ead0",
  charcoal: "#46505d",
  red: "#d14d42",
  blue: "#6c8fe8",
  green: "#6f8f62",
  brown: "#8c6545",
  pink: "#d59ab2",
  navy: "#2c4375"
};

function createEmptyVariant() {
  return { color: "", image: "" };
}

function createEmptyReel() {
  return { url: "", poster: "" };
}

function createInitialProduct() {
  return {
    name: "",
    price: "",
    description: "",
    featured: false,
    category: "accessories",
    image: "",
    benefitsText: defaultBenefits.join("\n"),
    variants: [createEmptyVariant()],
    reels: [createEmptyReel()]
  };
}

function hasAllowedExtension(fileName = "", allowedExtensions = []) {
  const lower = fileName.toLowerCase();
  return allowedExtensions.some((ext) => lower.endsWith(ext));
}

function validateMedia(file, { mimeTypes, extensions, maxSize }) {
  if (!file) return "Missing file.";
  if (!mimeTypes.includes(file.type) || !hasAllowedExtension(file.name, extensions)) {
    return "Invalid file type.";
  }
  if (file.size > maxSize) {
    return "File is too large.";
  }
  return "";
}

function validateImage(file) {
  return validateMedia(file, {
    mimeTypes: imageMimeTypes,
    extensions: imageExtensions,
    maxSize: maxImageFileSize
  });
}

function validateVideo(file) {
  return validateMedia(file, {
    mimeTypes: videoMimeTypes,
    extensions: videoExtensions,
    maxSize: maxVideoFileSize
  });
}

function buildProductId(name) {
  const slug = String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return `${slug || "product"}-${Date.now()}`;
}

function toEditableVariants(product) {
  const rawVariants = Array.isArray(product?.variants) ? product.variants : [];
  const fromVariants = rawVariants
    .map((item) => ({
      color: String(item?.color || "").trim(),
      image: String(item?.image || "").trim()
    }))
    .filter((item) => item.color || item.image);

  if (fromVariants.length) {
    return fromVariants;
  }

  const fallbackImage = String(product?.image || "").trim();
  if (fallbackImage) {
    return [{ color: "", image: fallbackImage }];
  }

  return [createEmptyVariant()];
}

function toEditableReels(product) {
  const reels = Array.isArray(product?.reels)
    ? product.reels
        .map((item) => ({
          url: typeof item === "string" ? item.trim() : String(item?.url || item?.src || "").trim(),
          poster: typeof item === "string" ? "" : String(item?.poster || "").trim()
        }))
        .filter((item) => item.url)
    : [];

  return reels.length ? reels : [createEmptyReel()];
}

function toEditableBenefits(product) {
  const benefits = Array.isArray(product?.benefits)
    ? product.benefits.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  return (benefits.length ? benefits : defaultBenefits).join("\n");
}

function parseTextList(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveColorPreview(colorName = "") {
  const normalized = String(colorName || "").trim();
  if (!normalized) return "#d9e1f4";
  const lower = normalized.toLowerCase();
  if (colorPreviewMap[lower]) {
    return colorPreviewMap[lower];
  }
  if (lower.startsWith("#") || lower.startsWith("rgb") || lower.startsWith("hsl")) {
    return normalized;
  }
  return "#d9e1f4";
}

function truncateDescription(value, maxLength = 118) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function ColorPreview({ color, className = "admin-color-preview" }) {
  const normalized = String(color || "").trim();
  return (
    <span
      aria-hidden="true"
      className={className}
      style={normalized ? { background: resolveColorPreview(normalized) } : undefined}
    />
  );
}

function ModeSwitchIcon({ theme }) {
  if (theme === "dark") {
    return (
      <svg aria-hidden="true" className="admin-mode-svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2.5v2.5" />
        <path d="M12 19v2.5" />
        <path d="M4.93 4.93l1.77 1.77" />
        <path d="M17.3 17.3l1.77 1.77" />
        <path d="M2.5 12H5" />
        <path d="M19 12h2.5" />
        <path d="M4.93 19.07l1.77-1.77" />
        <path d="M17.3 6.7l1.77-1.77" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="admin-mode-svg" viewBox="0 0 24 24">
      <path d="M21 14.2A8.8 8.8 0 0 1 9.8 3a9 9 0 1 0 11.2 11.2Z" />
    </svg>
  );
}

function AdminColorSelect({ placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedLabel = String(value || "").trim() || placeholder;

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className={`admin-color-select ${open ? "open" : ""}`} ref={rootRef}>
      <button
        aria-expanded={open}
        className="admin-color-select-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="admin-color-select-value">
          <ColorPreview className={`admin-color-preview ${value ? "" : "admin-color-preview-empty"}`.trim()} color={value} />
          <span>{selectedLabel}</span>
        </span>
        <span className={`admin-color-select-chevron ${open ? "open" : ""}`} aria-hidden="true">
          v
        </span>
      </button>

      {open ? (
        <div className="admin-color-select-menu" role="listbox">
          <button
            className={`admin-color-option ${!value ? "active" : ""}`}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            type="button"
          >
            <ColorPreview className="admin-color-preview admin-color-preview-empty" color="" />
            <span>{placeholder}</span>
          </button>

          {options.map((colorName) => {
            const isActive = colorName === value;
            return (
              <button
                className={`admin-color-option ${isActive ? "active" : ""}`}
                key={colorName}
                onClick={() => {
                  onChange(colorName);
                  setOpen(false);
                }}
                type="button"
              >
                <ColorPreview color={colorName} />
                <span>{colorName}</span>
                {isActive ? <span className="admin-color-check">âœ“</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [toastMessage, showToast] = useToast();

  const [mode, setMode] = useState("loading");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("products");
  const [loadedSections, setLoadedSections] = useState({
    products: false,
    orders: false,
    users: false
  });

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [productForm, setProductForm] = useState(() => createInitialProduct());

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState("");

  const isRtl = i18n.dir(i18n.language) === "rtl";

  useEffect(() => {
    document.title = t("meta.admin");
  }, [i18n.language, t]);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const data = await adminSession();
        if (!active) return;
        setAdminUsername(String(data?.username || "").trim());
        setMode("dashboard");
      } catch (_error) {
        if (!active) return;
        setMode("login");
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (mode !== "dashboard") return;

    const needsProducts = activeSection === "products" || activeSection === "add-product";
    if (needsProducts && !loadedSections.products && !isLoadingProducts) {
      loadProducts();
    }
    if (activeSection === "orders" && !loadedSections.orders && !isLoadingOrders) {
      loadOrders();
    }
    if (activeSection === "users" && !loadedSections.users && !isLoadingUsers) {
      loadUsers();
    }
  }, [
    activeSection,
    isLoadingOrders,
    isLoadingProducts,
    isLoadingUsers,
    loadedSections.orders,
    loadedSections.products,
    loadedSections.users,
    mode
  ]);

  const sortedProducts = useMemo(
    () => [...products].sort((left, right) => Number(Boolean(right?.featured)) - Number(Boolean(left?.featured))),
    [products]
  );

  const summaryItems = useMemo(
    () => [
      {
        id: "products",
        label: t("admin.totalProducts", { defaultValue: "Products" }),
        value: products.length
      },
      {
        id: "featured",
        label: t("admin.featuredProducts", { defaultValue: "Featured" }),
        value: products.filter((item) => Boolean(item?.featured)).length
      },
      {
        id: "users",
        label: t("admin.totalCustomers", { defaultValue: "Customers" }),
        value: users.length
      },
      {
        id: "orders",
        label: t("admin.totalOrders", { defaultValue: "Paid orders" }),
        value: orders.length
      }
    ],
    [orders.length, products, t, users.length]
  );

  const menuGroups = useMemo(
    () => [
      {
        id: "catalog",
        title: t("admin.catalogSection", { defaultValue: "Catalog" }),
        items: [
          {
            id: "products",
            label: t("admin.products"),
            badge: sortedProducts.length || ""
          },
          {
            id: "add-product",
            label: t("admin.addProduct")
          }
        ]
      },
      {
        id: "customers",
        title: t("admin.customersSection", { defaultValue: "Customers" }),
        items: [
          {
            id: "users",
            label: t("admin.usersTitle"),
            badge: users.length || ""
          },
          {
            id: "orders",
            label: t("admin.ordersTitle"),
            badge: orders.length || ""
          }
        ]
      },
      {
        id: "workspace",
        title: t("admin.workspaceSection", { defaultValue: "Workspace" }),
        items: [
          {
            id: "settings",
            label: t("admin.settingsSection", { defaultValue: "Settings" })
          }
        ]
      }
    ],
    [orders.length, sortedProducts.length, t, users.length]
  );

  async function loadProducts() {
    setIsLoadingProducts(true);
    try {
      const localProducts = await loadAdminProducts();
      setProducts(normalizeCatalog(localProducts));
      setLoadedSections((current) => ({ ...current, products: true }));
    } catch (_error) {
      const fallback = await fetchCatalog();
      setProducts(fallback);
      setLoadedSections((current) => ({ ...current, products: true }));
      showToast(t("admin.localApiError"));
    } finally {
      setIsLoadingProducts(false);
    }
  }

  async function loadOrders() {
    setIsLoadingOrders(true);
    try {
      const data = await loadPaidOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
      setLoadedSections((current) => ({ ...current, orders: true }));
    } catch (_error) {
      showToast(t("admin.ordersLoadError"));
    } finally {
      setIsLoadingOrders(false);
    }
  }

  async function loadUsers() {
    setIsLoadingUsers(true);
    try {
      const data = await loadAdminUsers();
      setUsers(Array.isArray(data?.users) ? data.users : []);
      setLoadedSections((current) => ({ ...current, users: true }));
    } catch (_error) {
      showToast(t("admin.usersLoadError"));
    } finally {
      setIsLoadingUsers(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setIsAuthSubmitting(true);
    try {
      const username = loginForm.username.trim();
      await adminLogin(username, loginForm.password);
      setAdminUsername(username);
      setMode("dashboard");
      setActiveSection("products");
      setLoginForm(initialLogin);
      setLoadedSections({
        products: false,
        orders: false,
        users: false
      });
    } catch (error) {
      const message = String(error?.message || "").toLowerCase();
      if (message.includes("404")) {
        showToast(t("admin.apiUnavailable"));
      } else {
        showToast(t("admin.invalidLogin"));
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await adminLogout();
    } catch (_error) {
      // Ignore logout API errors.
    }

    setMode("login");
    setAdminUsername("");
    setMenuOpen(false);
    setActiveSection("products");
    setLoadedSections({
      products: false,
      orders: false,
      users: false
    });
    setProducts([]);
    setOrders([]);
    setUsers([]);
    setExpandedUserId("");
    setEditingId("");
    setProductForm(createInitialProduct());
    showToast(t("admin.logoutSuccess"));
  }

  async function copyValue(value, successKey = "admin.copied") {
    const text = String(value || "").trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      showToast(t(successKey));
    } catch (_error) {
      showToast(t("admin.copyFailed"));
    }
  }

  function setProductField(field, value) {
    setProductForm((current) => ({ ...current, [field]: value }));
  }

  function setVariantField(index, field, value) {
    setProductForm((current) => {
      const nextVariants = [...(current.variants || [])];
      if (!nextVariants[index]) nextVariants[index] = createEmptyVariant();
      nextVariants[index] = { ...nextVariants[index], [field]: value };
      const nextImage = index === 0 && field === "image" ? String(value || "") : current.image;
      return {
        ...current,
        image: nextImage,
        variants: nextVariants
      };
    });
  }

  function addVariantRow() {
    setProductForm((current) => ({
      ...current,
      variants: [...(current.variants || []), createEmptyVariant()]
    }));
  }

  function removeVariantRow(index) {
    setProductForm((current) => {
      const nextVariants = (current.variants || []).filter((_, itemIndex) => itemIndex !== index);
      const safeVariants = nextVariants.length ? nextVariants : [createEmptyVariant()];
      return {
        ...current,
        image: safeVariants[0]?.image || current.image || "",
        variants: safeVariants
      };
    });
  }

  function setReelField(index, field, value) {
    setProductForm((current) => {
      const nextReels = [...(current.reels || [])];
      if (!nextReels[index]) nextReels[index] = createEmptyReel();
      nextReels[index] = { ...nextReels[index], [field]: value };
      return {
        ...current,
        reels: nextReels
      };
    });
  }

  function addReelRow() {
    setProductForm((current) => ({
      ...current,
      reels: [...(current.reels || []), createEmptyReel()]
    }));
  }

  function removeReelRow(index) {
    setProductForm((current) => {
      const nextReels = (current.reels || []).filter((_, itemIndex) => itemIndex !== index);
      return {
        ...current,
        reels: nextReels.length ? nextReels : [createEmptyReel()]
      };
    });
  }

  async function handleVariantUpload(index, file) {
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      showToast(t("admin.uploadError"));
      return;
    }

    try {
      const uploadResult = await uploadAdminImage(file);
      const imagePath = String(uploadResult?.path || "");
      if (!imagePath) {
        showToast(t("admin.uploadError"));
        return;
      }

      setVariantField(index, "image", imagePath);
      showToast(t("admin.imageUploaded"));
    } catch (error) {
      showToast(String(error?.message || t("admin.uploadError")));
    }
  }

  async function handleReelUpload(index, file) {
    if (!file) return;

    const error = validateVideo(file);
    if (error) {
      showToast(t("admin.uploadError"));
      return;
    }

    try {
      const uploadResult = await uploadAdminImage(file);
      const videoPath = String(uploadResult?.path || "");
      if (!videoPath) {
        showToast(t("admin.uploadError"));
        return;
      }

      setReelField(index, "url", videoPath);
      showToast(t("admin.mediaUploaded"));
    } catch (error) {
      showToast(String(error?.message || t("admin.uploadError")));
    }
  }

  function openSection(sectionId) {
    setMenuOpen(false);

    if (sectionId === "add-product" && activeSection !== "add-product") {
      setEditingId("");
      setProductForm(createInitialProduct());
    }

    setActiveSection(sectionId);
  }

  function openCreateProduct() {
    setEditingId("");
    setProductForm(createInitialProduct());
    setActiveSection("add-product");
    setMenuOpen(false);
  }

  function startEdit(product) {
    const editableVariants = toEditableVariants(product);
    const editableReels = toEditableReels(product);
    setEditingId(String(product.id || ""));
    setProductForm({
      name: String(product?.name || ""),
      price: String(product?.price || ""),
      description: String(product?.description || ""),
      featured: Boolean(product?.featured),
      category: knownCategories.includes(String(product?.category || "").toLowerCase())
        ? String(product.category).toLowerCase()
        : "accessories",
      image: editableVariants[0]?.image || String(product?.image || ""),
      benefitsText: toEditableBenefits(product),
      variants: editableVariants,
      reels: editableReels
    });
    setActiveSection("add-product");
    setMenuOpen(false);
  }

  function resetEditor() {
    setEditingId("");
    setProductForm(createInitialProduct());
    setActiveSection("products");
  }

  async function persistProducts(nextProducts, successKey = "admin.saved") {
    setProducts(nextProducts);
    try {
      await saveAdminProducts(nextProducts);
      showToast(t(successKey));
    } catch (_error) {
      showToast(t("admin.localApiError"));
    }
  }

  async function handleSaveProduct(event) {
    event.preventDefault();

    const name = String(productForm.name || "").trim();
    const description = String(productForm.description || "").trim();
    const price = Number(productForm.price || 0);
    const category = knownCategories.includes(String(productForm.category || "").toLowerCase())
      ? String(productForm.category || "").toLowerCase()
      : "accessories";
    const fallbackImage = String(productForm.image || "").trim();
    const rawVariants = Array.isArray(productForm.variants) ? productForm.variants : [];
    const rawReels = Array.isArray(productForm.reels) ? productForm.reels : [];
    const benefits = parseTextList(productForm.benefitsText).slice(0, 8);

    if (!name || !description || price <= 0 || !benefits.length) {
      showToast(t("admin.validationError"));
      return;
    }

    const parsedVariants = rawVariants.map((item) => ({
      color: String(item?.color || "").trim(),
      image: String(item?.image || "").trim()
    }));

    const hasColorWithoutImage = parsedVariants.some((item) => item.color && !item.image);
    if (hasColorWithoutImage) {
      showToast(t("admin.validationError"));
      return;
    }

    const normalizedVariants = parsedVariants
      .filter((item) => item.color || item.image)
      .map((item) => ({
        color: item.color,
        image: item.image
      }))
      .filter((item) => item.image);

    if (!normalizedVariants.length && fallbackImage) {
      normalizedVariants.push({ color: parsedVariants[0]?.color || "", image: fallbackImage });
    }

    if (!normalizedVariants.length) {
      showToast(t("admin.validationError"));
      return;
    }

    const normalizedReels = rawReels
      .map((item) => ({
        url: String(item?.url || "").trim(),
        poster: String(item?.poster || "").trim()
      }))
      .filter((item) => item.url)
      .slice(0, 20);

    const payload = {
      id: editingId || buildProductId(name),
      name,
      price: Number(price.toFixed(2)),
      description,
      category,
      featured: Boolean(productForm.featured),
      image: normalizedVariants[0]?.image || fallbackImage,
      colors: Array.from(new Set(normalizedVariants.map((item) => item.color).filter(Boolean))),
      variants: normalizedVariants,
      reels: normalizedReels,
      benefits
    };

    const nextProducts = editingId
      ? products.map((item) => (String(item?.id) === editingId ? payload : item))
      : [payload, ...products];

    await persistProducts(normalizeCatalog(nextProducts));
    setLoadedSections((current) => ({ ...current, products: true }));
    setEditingId("");
    setProductForm(createInitialProduct());
    setActiveSection("products");
  }

  async function handleDeleteProduct(productId) {
    if (!window.confirm(t("admin.confirmDeleteProduct"))) return;

    const nextProducts = products.filter((item) => String(item?.id) !== String(productId || ""));
    await persistProducts(nextProducts, "admin.deleted");

    if (String(editingId) === String(productId || "")) {
      setEditingId("");
      setProductForm(createInitialProduct());
    }

  }

  async function handleDeleteUser(userId) {
    if (!window.confirm(t("admin.confirmDeleteUser"))) return;

    try {
      await deleteAdminUser(userId);
      setUsers((current) => current.filter((item) => String(item?.id) !== String(userId || "")));
      if (expandedUserId === String(userId || "")) {
        setExpandedUserId("");
      }
      showToast(t("admin.userDeleted"));
    } catch (_error) {
      showToast(t("admin.usersLoadError"));
    }
  }

  function renderLoadingState() {
    return (
      <section className="admin-page">
        <Container className="admin-auth-wrap">
          <article className="admin-auth-card">
            <h1>{t("admin.dashboardTitle")}</h1>
            <p>{t("common.loading")}</p>
          </article>
        </Container>
        <Toast message={toastMessage} />
      </section>
    );
  }

  function renderLoginState() {
    return (
      <section className="admin-page">
        <Container className="admin-auth-wrap">
          <article className="admin-auth-card">
            <h1>{t("admin.loginTitle")}</h1>
            <p>{t("admin.loginSubtitle")}</p>
            <form className="form-grid" onSubmit={handleLogin}>
              <label>
                <span>{t("admin.username")}</span>
                <input
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((state) => ({ ...state, username: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>{t("admin.password")}</span>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((state) => ({ ...state, password: event.target.value }))}
                  required
                />
              </label>
              <button className="btn btn-primary btn-md" disabled={isAuthSubmitting} type="submit">
                {isAuthSubmitting ? t("common.loading") : t("admin.loginButton")}
              </button>
            </form>
          </article>
        </Container>
        <Toast message={toastMessage} />
      </section>
    );
  }

  function renderProductsSection() {
    return (
      <article className="admin-products admin-section-card">
        <div className="admin-section-head">
          <div className="admin-section-copy">
            <h2>{t("admin.products")}</h2>
            <p>{t("admin.productsSubtitle", { defaultValue: "View, edit, and remove existing products only." })}</p>
          </div>
          <div className="orders-header-actions">
            <button className="btn btn-secondary btn-sm" onClick={loadProducts} type="button">
              {t("admin.refreshProducts", { defaultValue: "Refresh Products" })}
            </button>
            <button className="btn btn-primary btn-sm" onClick={openCreateProduct} type="button">
              {t("admin.addProduct")}
            </button>
          </div>
        </div>

        {isLoadingProducts ? <p>{t("common.loading")}</p> : null}
        {!isLoadingProducts && !sortedProducts.length ? <p>{t("admin.noProducts")}</p> : null}

        <div className="admin-product-list">
          {sortedProducts.map((product) => (
            <article className="admin-product-row" key={product.id}>
              <SleepImage
                alt={product.name}
                className="admin-row-image"
                fallbackClassName="admin-row-image admin-row-image-fallback"
                src={product.image}
              />

              <div className="admin-row-body">
                <div className="admin-row-topline">
                  <h3>{product.name}</h3>
                  {product.featured ? <span className="order-badge">{t("admin.featured")}</span> : null}
                </div>
                <p className="admin-row-description" title={product.description}>
                  {truncateDescription(product.description)}
                </p>
                <div className="admin-row-meta">
                  <span>{formatPrice(product.price, i18n.language)}</span>
                  <span>{t(`nav.${product.category}`, { defaultValue: product.category })}</span>
                  <span>{`${product.variants?.length || 0} ${t("admin.variants").toLowerCase()}`}</span>
                  <span>{`${product.reels?.length || 0} ${t("admin.reels").toLowerCase()}`}</span>
                </div>
              </div>

              <div className="admin-row-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => startEdit(product)} type="button">
                  {t("admin.editProduct")}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteProduct(product.id)} type="button">
                  {t("admin.deleteProduct")}
                </button>
              </div>
            </article>
          ))}
        </div>
      </article>
    );
  }

  function renderProductEditorSection() {
    const isBusy = isLoadingProducts && !loadedSections.products;

    return (
      <article className="admin-editor admin-section-card">
        <div className="admin-section-head">
          <div className="admin-section-copy">
            <h2>{editingId ? t("admin.editProduct") : t("admin.addProduct")}</h2>
            <p>
              {t("admin.addProductSubtitle", {
                defaultValue: "Create a new product or update an existing product record."
              })}
            </p>
          </div>
          {editingId ? (
            <button className="btn btn-ghost btn-sm" onClick={resetEditor} type="button">
              {t("admin.cancelEdit")}
            </button>
          ) : null}
        </div>

        {isBusy ? <p>{t("common.loading")}</p> : null}

        <form className="form-grid" onSubmit={handleSaveProduct}>
          <label>
            <span>{t("admin.name")}</span>
            <input value={productForm.name} onChange={(event) => setProductField("name", event.target.value)} required />
          </label>

          <label>
            <span>{t("admin.price")}</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={(event) => setProductField("price", event.target.value)}
              required
            />
          </label>

          <label>
            <span>{t("admin.description")}</span>
            <textarea
              rows={5}
              value={productForm.description}
              onChange={(event) => setProductField("description", event.target.value)}
              required
            />
          </label>

          <label>
            <span>{t("admin.category")}</span>
            <select value={productForm.category} onChange={(event) => setProductField("category", event.target.value)}>
              <option value="machines">{t("nav.machines")}</option>
              <option value="accessories">{t("nav.accessories")}</option>
              <option value="pillows">{t("nav.pillows")}</option>
            </select>
          </label>

          <label className="check-field">
            <input
              checked={productForm.featured}
              onChange={(event) => setProductField("featured", event.target.checked)}
              type="checkbox"
            />
            <span>{t("admin.featured")}</span>
          </label>

          <label>
            <span>{t("admin.imagePath")}</span>
            <input
              value={productForm.image}
              onChange={(event) => setProductField("image", event.target.value)}
              placeholder="/images/products/example.jpg"
            />
          </label>

          <label className="variant-file">
            <span>{t("admin.chooseFile")}</span>
            <input accept={imageExtensions.join(",")} onChange={(event) => handleVariantUpload(0, event.target.files?.[0])} type="file" />
          </label>
          <p className="field-note">{t("admin.imageHelp")}</p>

          <label className="admin-text-list">
            <span>{t("admin.benefits", { defaultValue: "Benefits" })}</span>
            <textarea
              rows={5}
              value={productForm.benefitsText}
              onChange={(event) => setProductField("benefitsText", event.target.value)}
            />
            <small className="field-note">
              {t("admin.benefitsHelp", { defaultValue: "One benefit per line. These lines appear on the product page." })}
            </small>
          </label>

          <div className="variant-list">
            <div className="variant-actions">
              <strong>{t("admin.variants")}</strong>
              <button className="btn btn-secondary btn-sm" onClick={addVariantRow} type="button">
                {t("admin.addVariant")}
              </button>
            </div>

            {(productForm.variants || []).map((variant, index) => {
              const selectedColor = String(variant?.color || "").trim();
              const colorOptions = selectedColor && !presetColorOptions.includes(selectedColor)
                ? [selectedColor, ...presetColorOptions]
                : presetColorOptions;

              return (
                <div className="variant-panel" key={`variant-${index}`}>
                  <div className="variant-row-head">
                    <span>{`${t("admin.variant")} ${index + 1}`}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      disabled={(productForm.variants || []).length <= 1}
                      onClick={() => removeVariantRow(index)}
                      type="button"
                    >
                      {t("admin.removeVariant")}
                    </button>
                  </div>

                  <div className="variant-row-grid">
                    <label>
                      <span>{t("admin.variantColor")}</span>
                      <AdminColorSelect
                        options={colorOptions}
                        placeholder={t("admin.selectColor")}
                        value={variant.color}
                        onChange={(nextColor) => setVariantField(index, "color", nextColor)}
                      />
                    </label>

                    <label>
                      <span>{t("admin.variantImage")}</span>
                      <input
                        value={variant.image}
                        onChange={(event) => setVariantField(index, "image", event.target.value)}
                        placeholder="/images/products/variant.jpg"
                      />
                    </label>

                    <label className="variant-file">
                      <span>{t("admin.chooseFile")}</span>
                      <input
                        accept={imageExtensions.join(",")}
                        onChange={(event) => handleVariantUpload(index, event.target.files?.[0])}
                        type="file"
                      />
                    </label>
                  </div>

                  {variant.image ? (
                    <div className="image-preview">
                      <SleepImage
                        alt={`${productForm.name || t("admin.image")} ${index + 1}`}
                        className="variant-preview"
                        fallbackClassName="variant-preview"
                        src={variant.image}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
            <p className="field-note">{t("admin.variantHelp")}</p>
          </div>

          <div className="reel-list">
            <div className="reel-actions">
              <strong>{t("admin.reels")}</strong>
              <button className="btn btn-secondary btn-sm" onClick={addReelRow} type="button">
                {t("admin.addReel")}
              </button>
            </div>

            {(productForm.reels || []).map((reel, index) => (
              <div className="reel-panel" key={`reel-${index}`}>
                <div className="reel-row-head">
                  <span>{`${t("admin.reel")} ${index + 1}`}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={(productForm.reels || []).length <= 1}
                    onClick={() => removeReelRow(index)}
                    type="button"
                  >
                    {t("admin.removeReel")}
                  </button>
                </div>

                <div className="reel-row-grid">
                  <label>
                    <span>{t("admin.reelUrl")}</span>
                    <input
                      value={reel.url}
                      onChange={(event) => setReelField(index, "url", event.target.value)}
                      placeholder="/videos/product-reel.mp4"
                    />
                  </label>

                  <label>
                    <span>{t("admin.reelPoster")}</span>
                    <input
                      value={reel.poster}
                      onChange={(event) => setReelField(index, "poster", event.target.value)}
                      placeholder="/images/products/reel-poster.jpg"
                    />
                  </label>

                  <label className="reel-file">
                    <span>{t("admin.videoUpload")}</span>
                    <input
                      accept={videoExtensions.join(",")}
                      onChange={(event) => handleReelUpload(index, event.target.files?.[0])}
                      type="file"
                    />
                  </label>
                </div>

                {reel.url ? (
                  <video className="reel-preview" controls playsInline poster={reel.poster || undefined} src={reel.url} />
                ) : null}
              </div>
            ))}
            <p className="field-note">{t("admin.reelHelp")}</p>
            <p className="field-note">{t("admin.videoHelp")}</p>
          </div>

          <div className="admin-form-actions">
            <button className="btn btn-primary btn-md" disabled={isBusy} type="submit">
              {editingId ? t("admin.updateProduct") : t("admin.saveProduct")}
            </button>
            <button className="btn btn-secondary btn-md" onClick={resetEditor} type="button">
              {editingId ? t("admin.cancelEdit") : t("admin.products")}
            </button>
          </div>
        </form>
      </article>
    );
  }

  function renderUsersSection() {
    return (
      <article className="admin-products admin-section-card">
        <div className="admin-section-head">
          <div className="admin-section-copy">
            <h2>{t("admin.usersTitle")}</h2>
            <p>{t("admin.usersSubtitle", { defaultValue: "Open an account to view its details." })}</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadUsers} type="button">
            {t("admin.refreshUsers")}
          </button>
        </div>

        {isLoadingUsers ? <p>{t("common.loading")}</p> : null}
        {!isLoadingUsers && !users.length ? <p>{t("admin.noUsers")}</p> : null}

        <div className="admin-user-list">
          {users.map((user) => {
            const userId = String(user?.id || "");
            const isOpen = expandedUserId === userId;
            const displayName =
              String(user?.full_name || "").trim() ||
              `${String(user?.first_name || "").trim()} ${String(user?.last_name || "").trim()}`.trim() ||
              String(user?.email || "").trim() ||
              t("admin.accountBadge");

            return (
              <article className="admin-user-item" key={userId}>
                <button
                  className="admin-user-toggle"
                  onClick={() => setExpandedUserId((current) => (current === userId ? "" : userId))}
                  type="button"
                >
                  <div>
                    <strong>{displayName}</strong>
                    <span>{t("admin.accountBadge")}</span>
                  </div>
                  <span className={`admin-chevron ${isOpen ? "open" : ""}`} aria-hidden="true">
                    ?
                  </span>
                </button>

                {isOpen ? (
                  <div className="admin-user-details">
                    <p>
                      <strong>{t("admin.customerEmail")}:</strong> {user.email || t("common.unavailable")}
                    </p>
                    <p>
                      <strong>{t("admin.customerPhone")}:</strong> {user.phone_e164 || t("common.unavailable")}
                    </p>
                    <p>
                      <strong>{t("auth.gender")}:</strong> {user.gender || t("common.unavailable")}
                    </p>
                    <p>
                      <strong>{t("auth.age")}:</strong> {user.age || t("common.unavailable")}
                    </p>
                    <p>
                      <strong>{t("admin.createdAt", { defaultValue: "Created" })}:</strong>{" "}
                      {user.created_at ? new Date(user.created_at).toLocaleString() : t("common.unavailable")}
                    </p>

                    <div className="order-copy-buttons">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => copyValue(user.email, "admin.copyEmailSuccess")}
                        type="button"
                      >
                        {t("admin.copyEmail")}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => copyValue(user.phone_e164, "admin.copyPhoneSuccess")}
                        type="button"
                      >
                        {t("admin.copyPhone")}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteUser(userId)} type="button">
                        {t("admin.deleteUser")}
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </article>
    );
  }

  function renderOrdersSection() {
    return (
      <article className="admin-products admin-section-card">
        <div className="orders-header">
          <div className="admin-section-copy">
            <h2>{t("admin.ordersTitle")}</h2>
            <p>{t("admin.ordersSubtitle", { defaultValue: "Review paid orders only." })}</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadOrders} type="button">
            {t("admin.refreshOrders")}
          </button>
        </div>

        {isLoadingOrders ? <p>{t("common.loading")}</p> : null}
        {!isLoadingOrders && !orders.length ? <p>{t("admin.noOrders")}</p> : null}

        <div className="orders-list">
          {orders.map((order) => {
            const address = [order?.address, order?.city, order?.state, order?.zip, order?.country]
              .filter(Boolean)
              .join(", ");

            return (
              <article className="order-card" key={order.id || order.paypal_order_id}>
                <div className="order-card-head">
                  <div>
                    <strong>{order.name || t("common.unavailable")}</strong>
                    <p>{new Date(order.created_at || Date.now()).toLocaleString()}</p>
                  </div>
                  <span className="order-badge">{t("admin.paidBadge")}</span>
                </div>

                <p>
                  <strong>{t("admin.customerEmail")}:</strong> {order.email || t("common.unavailable")}
                </p>
                <p>
                  <strong>{t("admin.customerPhone")}:</strong> {order.phone || t("common.unavailable")}
                </p>
                <p>
                  <strong>{t("admin.customerAddress")}:</strong> {address || t("common.unavailable")}
                </p>

                <div className="order-copy-buttons">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyValue(order.email, "admin.copyEmailSuccess")}
                    type="button"
                  >
                    {t("admin.copyEmail")}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyValue(order.phone, "admin.copyPhoneSuccess")}
                    type="button"
                  >
                    {t("admin.copyPhone")}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => copyValue(address, "admin.copyAddressSuccess")}
                    type="button"
                  >
                    {t("admin.copyAddress")}
                  </button>
                </div>

                <div className="order-items">
                  <strong>{t("admin.orderItems")}</strong>
                  {Array.isArray(order?.items) && order.items.length ? (
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={`${order.id || order.paypal_order_id}-${index}`}>
                          {item?.name || t("common.unavailable")} x {Number(item?.qty || item?.quantity || 1)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{t("admin.noOrderItems")}</p>
                  )}
                </div>

                <p className="order-total">
                  <strong>{t("admin.orderTotal")}:</strong>{" "}
                  {formatPrice(order?.total_amount || 0, i18n.language, order?.currency || "")}
                </p>
                <p className="order-meta">
                  <strong>PayPal:</strong> {order?.paypal_order_id || t("common.unavailable")}
                </p>
              </article>
            );
          })}
        </div>
      </article>
    );
  }

  function renderSettingsSection() {
    return (
      <article className="admin-products admin-section-card">
        <div className="admin-section-head">
          <div className="admin-section-copy">
            <h2>{t("admin.settingsSection", { defaultValue: "Settings" })}</h2>
            <p>{t("admin.settingsSubtitle", { defaultValue: "Admin appearance and quick tools." })}</p>
          </div>
        </div>

        <div className="admin-settings-grid">
          <div className="variant-panel">
            <strong>{t("admin.interfaceSection", { defaultValue: "Interface" })}</strong>
            <div className="admin-interface-stack">
              <div className="admin-control-card">
                <span className="drawer-setting-label">{t("theme.modeLabel", { defaultValue: "Mode" })}</span>
                <button className="admin-mode-toggle" onClick={toggleTheme} type="button">
                  <span className="admin-mode-icon" aria-hidden="true">
                    <ModeSwitchIcon theme={theme} />
                  </span>
                  <span>{theme === "dark" ? t("theme.light") : t("theme.dark")}</span>
                </button>
              </div>

              <div className="admin-control-card">
                <LanguageSwitch withLabel />
              </div>
            </div>
          </div>

          <div className="variant-panel">
            <strong>{t("admin.quickActions", { defaultValue: "Quick actions" })}</strong>
            <div className="admin-form-actions">
              <button className="btn btn-secondary btn-sm" onClick={loadProducts} type="button">
                {t("admin.refreshProducts", { defaultValue: "Refresh Products" })}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={loadUsers} type="button">
                {t("admin.refreshUsers")}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={loadOrders} type="button">
                {t("admin.refreshOrders")}
              </button>
            </div>
          </div>

          <div className="variant-panel admin-settings-summary">
            <strong>{t("admin.storeSummary", { defaultValue: "Store summary" })}</strong>
            <div className="admin-summary-grid">
              {summaryItems.map((item) => (
                <article className="admin-summary-card" key={item.id}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  function renderActiveSection() {
    if (activeSection === "products") return renderProductsSection();
    if (activeSection === "add-product") return renderProductEditorSection();
    if (activeSection === "users") return renderUsersSection();
    if (activeSection === "orders") return renderOrdersSection();
    return renderSettingsSection();
  }

  if (mode === "loading") {
    return renderLoadingState();
  }

  if (mode === "login") {
    return renderLoginState();
  }

  return (
    <section className="admin-page">
      {menuOpen ? <button aria-label="Close menu" className="admin-menu-backdrop" onClick={() => setMenuOpen(false)} type="button" /> : null}

      <aside className={`admin-menu-drawer ${menuOpen ? "open" : ""}`} dir={isRtl ? "rtl" : "ltr"}>
        <div className="admin-menu-panel">
          <div className="admin-menu-panel-head">
            <div>
              <strong className="admin-brand-mark">Sleepora</strong>
              <span>{adminUsername || t("admin.dashboardTitle")}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)} type="button">
              ×
            </button>
          </div>

          {menuGroups.map((group) => (
            <div className="admin-menu-group" key={group.id}>
              <p className="admin-menu-group-title">{group.title}</p>
              <nav className="admin-menu-nav">
                {group.items.map((item) => (
                  <button
                    className={`admin-menu-link ${activeSection === item.id ? "active" : ""}`}
                    key={item.id}
                    onClick={() => openSection(item.id)}
                    type="button"
                  >
                    <span>{item.label}</span>
                    {item.badge ? <span className="admin-menu-badge">{item.badge}</span> : null}
                  </button>
                ))}
              </nav>
            </div>
          ))}

          <div className="admin-menu-group">
            <p className="admin-menu-group-title">{t("admin.logout")}</p>
            <button className="admin-menu-link" onClick={handleLogout} type="button">
              <span>{t("admin.logout")}</span>
            </button>
          </div>
        </div>
      </aside>

      <Container className="admin-dashboard admin-shell">
        <div className="admin-head">
          <div className="admin-head-left">
            <button
              aria-expanded={menuOpen}
              aria-label="Open admin menu"
              className="admin-menu-btn"
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              <svg aria-hidden="true" className="admin-menu-svg" viewBox="0 0 24 24">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>

            <div>
              <h1 className="admin-brand-title">{t("admin.dashboardTitle")}</h1>
              <p>{t("admin.dashboardSubtitle")}</p>
            </div>
          </div>

          <div className="admin-head-tools">
            <span className="admin-user-chip">{adminUsername || "Admin"}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout} type="button">
              {t("admin.logout")}
            </button>
          </div>
        </div>

        <div className="admin-content">{renderActiveSection()}</div>
      </Container>

      <Toast message={toastMessage} />
    </section>
  );
}


