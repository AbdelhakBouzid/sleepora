import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/layout/Container";
import SleepImage from "../components/ui/SleepImage";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { ADMIN_CREDENTIALS_STORAGE_KEY, ADMIN_SESSION_STORAGE_KEY } from "../lib/storage";
import { fetchCatalog, normalizeCatalog } from "../lib/catalog";
import { hashPassword, verifyPassword } from "../lib/security";
import { loadAdminProducts, saveAdminProducts, uploadAdminImage } from "../lib/adminApi";
import { formatPrice } from "../lib/format";

const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const videoMimeTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-m4v"];
const videoExtensions = [".mp4", ".webm", ".mov", ".m4v"];
const maxImageFileSize = 5 * 1024 * 1024;
const maxVideoFileSize = 30 * 1024 * 1024;
const defaultBenefits = ["Relieves neck pain", "Improves sleep posture", "Premium comfort", "Designed for deep sleep"];
const knownCategories = ["machines", "accessories", "pillows"];

const initialSetup = {
  username: "",
  password: "",
  confirmPassword: ""
};

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

function readCredentials() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_CREDENTIALS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function readSession() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) || "";
}

function saveSession(username) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, username);
}

function clearSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
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
  const [toastMessage, showToast] = useToast();
  const [credentials, setCredentials] = useState(() => readCredentials());
  const [mode, setMode] = useState("login");

  const [setupForm, setSetupForm] = useState(initialSetup);
  const [loginForm, setLoginForm] = useState(initialLogin);

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [productForm, setProductForm] = useState(() => createInitialProduct());

  useEffect(() => {
    document.title = t("meta.admin");
  }, [t, i18n.language]);

  useEffect(() => {
    if (!credentials) {
      setMode("setup");
      return;
    }
    const usernameInSession = readSession();
    setMode(usernameInSession && usernameInSession === credentials.username ? "dashboard" : "login");
  }, [credentials]);

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

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.featured) - Number(a.featured)),
    [products]
  );

  async function handleSetup(event) {
    event.preventDefault();
    if (!setupForm.username.trim() || !setupForm.password) return;
    if (setupForm.password !== setupForm.confirmPassword) {
      showToast(t("admin.passwordsMismatch"));
      return;
    }

    const secured = await hashPassword(setupForm.password);
    const nextCredentials = {
      username: setupForm.username.trim(),
      salt: secured.salt,
      hash: secured.hash
    };

    window.localStorage.setItem(ADMIN_CREDENTIALS_STORAGE_KEY, JSON.stringify(nextCredentials));
    clearSession();
    setCredentials(nextCredentials);
    setSetupForm(initialSetup);
    setMode("login");
    showToast(t("admin.setupSaved"));
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!credentials) return;
    const matchesUser = loginForm.username.trim() === credentials.username;
    const matchesPassword = await verifyPassword(loginForm.password, credentials.salt, credentials.hash);
    if (!matchesUser || !matchesPassword) {
      showToast(t("admin.invalidLogin"));
      return;
    }

    saveSession(credentials.username);
    setMode("dashboard");
    setLoginForm(initialLogin);
  }

  function logout() {
    clearSession();
    setMode("login");
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
    } catch (_error) {
      showToast(t("admin.uploadError"));
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
    } catch (_error) {
      showToast(t("admin.uploadError"));
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

    const normalizedVariants = rawVariants
      .map((item) => ({
        color: String(item?.color || "").trim(),
        image: String(item?.image || "").trim()
      }))
      .filter((item) => item.color || item.image)
      .map((item) => ({ ...item, image: item.image || fallbackImage }))
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
    const nextProducts = products.filter((item) => String(item.id) !== String(productId));
    await persistProducts(nextProducts);
    showToast(t("admin.deleted"));
  }

  if (mode === "setup") {
    return (
      <section className="admin-page">
        <Container className="admin-auth-wrap">
          <article className="admin-auth-card">
            <h1>{t("admin.setupTitle")}</h1>
            <p>{t("admin.setupSubtitle")}</p>
            <form className="form-grid" onSubmit={handleSetup}>
              <label>
                <span>{t("admin.username")}</span>
                <input
                  value={setupForm.username}
                  onChange={(event) => setSetupForm((state) => ({ ...state, username: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>{t("admin.password")}</span>
                <input
                  type="password"
                  value={setupForm.password}
                  onChange={(event) => setSetupForm((state) => ({ ...state, password: event.target.value }))}
                  required
                />
              </label>
              <label>
                <span>{t("admin.confirmPassword")}</span>
                <input
                  type="password"
                  value={setupForm.confirmPassword}
                  onChange={(event) => setSetupForm((state) => ({ ...state, confirmPassword: event.target.value }))}
                  required
                />
              </label>
              <button className="btn btn-primary btn-md" type="submit">
                {t("admin.saveSetup")}
              </button>
            </form>
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
              <button className="btn btn-primary btn-md" type="submit">
                {t("admin.loginButton")}
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
          <button className="btn btn-ghost btn-sm" onClick={logout} type="button">
            {t("admin.logout")}
          </button>
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
                        <input
                          value={variant.color}
                          onChange={(event) => setVariantField(index, "color", event.target.value)}
                          placeholder="White"
                        />
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
        </div>
      </Container>
      <Toast message={toastMessage} />
    </section>
  );
}
