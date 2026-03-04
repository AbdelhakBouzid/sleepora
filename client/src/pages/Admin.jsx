import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { useTheme } from "../context/ThemeContext";
import { fetchCatalog, normalizeCatalog } from "../lib/catalog";
import { loadAdminProducts, saveAdminProducts, uploadAdminImage } from "../lib/adminApi";
import { formatPrice } from "../lib/format";
import { adminLogin, adminLogout, deleteAdminUser, loadAdminUsers, loadPaidOrders } from "../lib/adminPortalApi";

const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const videoMimeTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];
const videoExtensions = [".mp4", ".webm", ".mov", ".m4v"];
const maxImageFileSize = 5 * 1024 * 1024;
const maxVideoFileSize = 30 * 1024 * 1024;
const defaultBenefits = ["Relieves neck pain", "Improves sleep posture", "Premium comfort", "Designed for deep sleep"];
const knownCategories = ["machines", "accessories", "pillows"];
const presetColorOptions = [
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#111111" },
  { name: "Gray", hex: "#777777" },
  { name: "Beige", hex: "#d8c1a1" },
  { name: "Cream", hex: "#f2e4cf" },
  { name: "Ivory", hex: "#f1e8d8" },
  { name: "Pearl", hex: "#f7f4ec" },
  { name: "Silver", hex: "#c3c6c8" },
  { name: "Warm White", hex: "#f6ebd4" },
  { name: "Charcoal", hex: "#424242" }
];

const initialLogin = {
  username: "",
  password: ""
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
  const fromVariants = Array.isArray(product?.variants)
    ? product.variants
        .map((item) => ({
          color: String(item?.color || "").trim(),
          image: String(item?.image || "").trim()
        }))
        .filter((item) => item.color || item.image)
    : [];

  if (fromVariants.length) return fromVariants;

  const fallbackImage = String(product?.image || "").trim();
  const colors = Array.isArray(product?.colors)
    ? product.colors.map((item) => String(item).trim()).filter(Boolean)
    : [];

  if (colors.length) {
    return colors.map((color) => ({ color, image: fallbackImage }));
  }

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

export default function AdminPage() {
  const { t, i18n } = useTranslation();
  const { toggleTheme } = useTheme();
  const [toastMessage, showToast] = useToast();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [productForm, setProductForm] = useState(() => createInitialProduct());
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    document.title = t("meta.admin");
  }, [t, i18n.language]);

  useEffect(() => {
    if (mode !== "dashboard") return;
    let active = true;

    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const localProducts = await loadAdminProducts();
        if (!active) return;
        setProducts(normalizeCatalog(localProducts));
      } catch (_error) {
        const fallback = await fetchCatalog();
        if (!active) return;
        setProducts(fallback);
        showToast(t("admin.localApiError"));
      } finally {
        if (active) setIsLoadingProducts(false);
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, [mode, t]);

  useEffect(() => {
    if (mode !== "dashboard") return;
    loadOrders();
  }, [mode]);

  useEffect(() => {
    if (mode !== "dashboard") return;
    loadUsers();
  }, [mode]);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.featured) - Number(a.featured)),
    [products]
  );

  async function loadOrders() {
    setIsLoadingOrders(true);
    try {
      const data = await loadPaidOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
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
      await adminLogin(loginForm.username.trim(), loginForm.password);
      setMode("dashboard");
      setLoginForm(initialLogin);
      await loadOrders();
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

  async function logout() {
    try {
      await adminLogout();
    } catch (_error) {
      // Ignore logout API errors.
    }
    setMode("login");
    setOrders([]);
    setUsers([]);
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
      return { ...current, image: nextImage, variants: nextVariants };
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
      return { ...current, reels: nextReels };
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
      const imagePath = String(uploadResult.path || "");
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
      const videoPath = String(uploadResult.path || "");
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

  function startEdit(product) {
    const editableVariants = toEditableVariants(product);
    const editableReels = toEditableReels(product);
    setEditingId(String(product.id));
    setProductForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      featured: Boolean(product.featured),
      category: knownCategories.includes(String(product.category || "").toLowerCase())
        ? String(product.category || "").toLowerCase()
        : "accessories",
      image: editableVariants[0]?.image || String(product.image || ""),
      variants: editableVariants,
      reels: editableReels
    });
  }

  function resetEditor() {
    setEditingId("");
    setProductForm(createInitialProduct());
  }

  async function persistProducts(nextProducts) {
    setProducts(nextProducts);
    try {
      await saveAdminProducts(nextProducts);
      showToast(t("admin.saved"));
    } catch (_error) {
      showToast(t("admin.localApiError"));
    }
  }

  async function handleSaveProduct(event) {
    event.preventDefault();
    const name = productForm.name.trim();
    const description = productForm.description.trim();
    const price = Number(productForm.price);

    if (!name || !description || Number.isNaN(price)) {
      showToast(t("admin.validationError"));
      return;
    }

    const category = knownCategories.includes(String(productForm.category || "").toLowerCase())
      ? String(productForm.category || "").toLowerCase()
      : "accessories";
    const fallbackImage = String(productForm.image || "").trim();
    const rawVariants = Array.isArray(productForm.variants) ? productForm.variants : [];
    const rawReels = Array.isArray(productForm.reels) ? productForm.reels : [];

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
      normalizedVariants.push({ color: "", image: fallbackImage });
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

    const previousProduct = products.find((item) => String(item.id) === editingId);
    const payload = {
      id: editingId || buildProductId(name),
      name,
      price,
      description,
      category,
      featured: Boolean(productForm.featured),
      image: normalizedVariants[0]?.image || "/images/placeholders/neutral-product.svg",
      colors: Array.from(new Set(normalizedVariants.map((item) => item.color).filter(Boolean))),
      variants: normalizedVariants,
      reels: normalizedReels,
      benefits: previousProduct?.benefits?.length ? previousProduct.benefits : defaultBenefits
    };

    const nextProducts = editingId
      ? products.map((item) => (String(item.id) === editingId ? payload : item))
      : [payload, ...products];

    await persistProducts(nextProducts);
    resetEditor();
  }

  async function handleDeleteProduct(productId) {
    if (!window.confirm(t("admin.confirmDeleteProduct"))) {
      return;
    }
    const nextProducts = products.filter((item) => String(item.id) !== String(productId));
    await persistProducts(nextProducts);
    showToast(t("admin.deleted"));
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm(t("admin.confirmDeleteUser"))) {
      return;
    }
    try {
      await deleteAdminUser(userId);
      setUsers((current) => current.filter((user) => String(user?.id || "") !== String(userId)));
      showToast(t("admin.userDeleted"));
    } catch (_error) {
      showToast(t("admin.usersLoadError"));
    }
  }

  if (mode === "loading") {
    return (
      <section className="admin-page">
        <Container className="admin-auth-wrap">
          <article className="admin-auth-card">
            <h1>{t("admin.loginTitle")}</h1>
            <p>{t("common.loading")}</p>
          </article>
        </Container>
        <Toast message={toastMessage} />
      </section>
    );
  }

  if (mode === "login") {
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

  return (
    <section className="admin-page">
      <Container className="admin-dashboard">
        <div className="admin-head">
          <div>
            <h1>{t("admin.dashboardTitle")}</h1>
            <p>{t("admin.dashboardSubtitle")}</p>
          </div>
          <div className="admin-head-tools">
            <button className="btn btn-secondary btn-sm" onClick={toggleTheme} type="button">
              {t("theme.dark")} / {t("theme.light")}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={logout} type="button">
              {t("admin.logout")}
            </button>
          </div>
        </div>

        <div className="admin-grid">
          <article className="admin-editor">
            <h2>{editingId ? t("admin.editProduct") : t("admin.addProduct")}</h2>
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
                  rows={4}
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
              <p className="field-note">{t("admin.imageHelp")}</p>

              <div className="variant-list">
                <div className="variant-actions">
                  <strong>{t("admin.variants")}</strong>
                  <button className="btn btn-secondary btn-sm" onClick={addVariantRow} type="button">
                    {t("admin.addVariant")}
                  </button>
                </div>

                {(productForm.variants || []).map((variant, index) => (
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
                        <select
                          value={variant.color}
                          onChange={(event) => setVariantField(index, "color", event.target.value)}
                        >
                          <option value="">{t("admin.selectColor")}</option>
                          {presetColorOptions.map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                          {variant.color && !presetColorOptions.some((item) => item.name === variant.color) ? (
                            <option value={variant.color}>{variant.color}</option>
                          ) : null}
                        </select>
                      </label>

                      <label>
                        <span>{t("admin.variantImage")}</span>
                        <input
                          value={variant.image}
                          onChange={(event) => setVariantField(index, "image", event.target.value)}
                          placeholder="/images/products/example.jpg"
                        />
                      </label>

                      <label className="variant-file">
                        <span>{t("admin.image")}</span>
                        <input
                          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                          onChange={(event) => handleVariantUpload(index, event.target.files?.[0] || null)}
                          type="file"
                        />
                      </label>
                    </div>

                    <div className="admin-color-swatches">
                      {presetColorOptions.map((item) => (
                        <button
                          key={`${index}-${item.name}`}
                          type="button"
                          className={variant.color === item.name ? "admin-color-swatch active" : "admin-color-swatch"}
                          onClick={() => setVariantField(index, "color", item.name)}
                        >
                          <span className="admin-color-dot" style={{ backgroundColor: item.hex }} />
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>

                    <SleepImage
                      alt={productForm.name || t("brand.name")}
                      className="variant-preview"
                      src={variant.image || productForm.image}
                    />
                  </div>
                ))}
              </div>
              <p className="field-note">{t("admin.variantHelp")}</p>

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
                          placeholder="/videos/products/sample-reel.mp4"
                        />
                      </label>

                      <label>
                        <span>{t("admin.reelPoster")}</span>
                        <input
                          value={reel.poster}
                          onChange={(event) => setReelField(index, "poster", event.target.value)}
                          placeholder="/images/products/sample-poster.jpg"
                        />
                      </label>

                      <label className="reel-file">
                        <span>{t("admin.videoUpload")}</span>
                        <input
                          accept=".mp4,.webm,.mov,.m4v,video/mp4,video/webm,video/quicktime,video/x-m4v"
                          onChange={(event) => handleReelUpload(index, event.target.files?.[0] || null)}
                          type="file"
                        />
                      </label>
                    </div>

                    {reel.url ? (
                      <video className="reel-preview" controls muted playsInline preload="metadata" src={reel.url} />
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="field-note">{t("admin.reelHelp")}</p>
              <p className="field-note">{t("admin.videoHelp")}</p>

              <div className="card-actions">
                <button className="btn btn-primary btn-sm" type="submit">
                  {editingId ? t("admin.updateProduct") : t("admin.saveProduct")}
                </button>
                {editingId ? (
                  <button className="btn btn-secondary btn-sm" onClick={resetEditor} type="button">
                    {t("admin.cancelEdit")}
                  </button>
                ) : null}
              </div>
            </form>
          </article>

          <article className="admin-products">
            <h2>{t("admin.products")}</h2>
            {isLoadingProducts ? (
              <p>{t("common.loading")}</p>
            ) : sortedProducts.length ? (
              <div className="admin-product-list">
                {sortedProducts.map((product) => (
                  <article className="admin-product-row" key={product.id}>
                    <SleepImage alt={product.name} className="admin-row-image" src={product.image} />
                    <div className="admin-row-body">
                      <h3>{product.name}</h3>
                      <p>{formatPrice(product.price, i18n.language)}</p>
                      <p>{product.description}</p>
                    </div>
                    <div className="admin-row-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => startEdit(product)} type="button">
                        {t("admin.editProduct")}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm danger"
                        onClick={() => handleDeleteProduct(product.id)}
                        type="button"
                      >
                        {t("admin.deleteProduct")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>{t("admin.noProducts")}</p>
            )}
          </article>

          <article className="admin-products admin-orders">
            <div className="orders-header">
              <h2>{t("admin.ordersTitle")}</h2>
              <button className="btn btn-secondary btn-sm" onClick={loadOrders} type="button">
                {t("admin.refreshOrders")}
              </button>
            </div>
            {isLoadingOrders ? (
              <p>{t("common.loading")}</p>
            ) : orders.length ? (
              <div className="orders-list">
                {orders.map((order) => {
                  const items = Array.isArray(order?.items) ? order.items : [];
                  const address = [order?.address, order?.city, order?.state, order?.zip, order?.country]
                    .map((item) => String(item || "").trim())
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <article className="order-card" key={String(order?.id || order?.paypal_order_id || Math.random())}>
                      <div className="order-card-head">
                        <strong>{`#${order?.id || "-"}`}</strong>
                        <span className="order-badge">{t("admin.paidBadge")}</span>
                      </div>
                      <p className="order-meta">{order?.created_at || "-"}</p>
                      <p>
                        <strong>{t("admin.customerName")}:</strong> {order?.name || "-"}
                      </p>
                      <p>
                        <strong>{t("admin.customerEmail")}:</strong> {order?.email || "-"}
                      </p>
                      <p>
                        <strong>{t("admin.customerPhone")}:</strong> {order?.phone || "-"}
                      </p>
                      <p>
                        <strong>{t("admin.customerAddress")}:</strong> {address || "-"}
                      </p>
                      <div className="order-copy-buttons">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => copyValue(order?.email, "admin.copyEmailSuccess")}
                          type="button"
                        >
                          {t("admin.copyEmail")}
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => copyValue(order?.phone, "admin.copyPhoneSuccess")}
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
                        {items.length ? (
                          <ul>
                            {items.map((item, index) => (
                              <li key={`${item?.id || item?.name || "item"}-${index}`}>
                                {`${item?.quantity || 1} x ${item?.name || "Product"} - ${formatPrice(
                                  item?.unit_price || 0,
                                  i18n.language
                                )}`}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>{t("admin.noOrderItems")}</p>
                        )}
                      </div>
                      <p className="order-total">
                        <strong>{t("admin.orderTotal")}:</strong> {formatPrice(order?.total_amount || 0, i18n.language)}
                      </p>
                      <p className="order-meta">
                        <strong>PayPal:</strong> {order?.paypal_order_id || "-"}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p>{t("admin.noOrders")}</p>
            )}
          </article>

          <article className="admin-products admin-orders">
            <div className="orders-header">
              <h2>{t("admin.usersTitle")}</h2>
              <button className="btn btn-secondary btn-sm" onClick={loadUsers} type="button">
                {t("admin.refreshUsers")}
              </button>
            </div>
            {isLoadingUsers ? (
              <p>{t("common.loading")}</p>
            ) : users.length ? (
              <div className="orders-list user-admin-list">
                {users.map((user) => (
                  <article className="order-card user-admin-card" key={String(user?.id || Math.random())}>
                    <div className="order-card-head">
                      <strong>{user?.full_name || "-"}</strong>
                      <span className="order-badge">{t("admin.accountBadge")}</span>
                    </div>
                    <p className="order-meta">{user?.created_at || "-"}</p>
                    <p>
                      <strong>{t("admin.customerEmail")}:</strong> {user?.email || "-"}
                    </p>
                    <p>
                      <strong>{t("admin.customerPhone")}:</strong> {user?.phone_e164 || "-"}
                    </p>
                    <p>
                      <strong>{t("auth.gender")}:</strong> {user?.gender || "-"}
                    </p>
                    <p>
                      <strong>{t("auth.age")}:</strong> {user?.age || "-"}
                    </p>
                    <div className="order-copy-buttons">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => copyValue(user?.email, "admin.copyEmailSuccess")}
                        type="button"
                      >
                        {t("admin.copyEmail")}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => copyValue(user?.phone_e164, "admin.copyPhoneSuccess")}
                        type="button"
                      >
                        {t("admin.copyPhone")}
                      </button>
                      <button className="btn btn-ghost btn-sm danger" onClick={() => handleDeleteUser(user?.id)} type="button">
                        {t("admin.deleteUser")}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>{t("admin.noUsers")}</p>
            )}
          </article>
        </div>
      </Container>
      <Toast message={toastMessage} />
    </section>
  );
}
