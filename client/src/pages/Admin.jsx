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

const supportedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const maxFileSize = 5 * 1024 * 1024;

const initialSetup = {
  username: "",
  password: "",
  confirmPassword: ""
};

const initialLogin = {
  username: "",
  password: ""
};

const initialProduct = {
  name: "",
  price: "",
  description: "",
  featured: false,
  image: ""
};

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

function hasAllowedExtension(fileName = "") {
  const lower = fileName.toLowerCase();
  return supportedExtensions.some((ext) => lower.endsWith(ext));
}

function validateImage(file) {
  if (!file) return "Missing file.";
  if (!supportedMimeTypes.includes(file.type) || !hasAllowedExtension(file.name)) {
    return "Invalid file type.";
  }
  if (file.size > maxFileSize) {
    return "File is too large.";
  }
  return "";
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
  const [productForm, setProductForm] = useState(initialProduct);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

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

  function startEdit(product) {
    setEditingId(String(product.id));
    setProductForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      featured: Boolean(product.featured),
      image: product.image
    });
    setSelectedFile(null);
  }

  function resetEditor() {
    setEditingId("");
    setProductForm(initialProduct);
    setSelectedFile(null);
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

    let imagePath = productForm.image.trim();
    if (selectedFile) {
      const error = validateImage(selectedFile);
      if (error) {
        showToast(t("admin.uploadError"));
        return;
      }

      try {
        const uploadResult = await uploadAdminImage(selectedFile);
        imagePath = String(uploadResult.path || "");
      } catch (_error) {
        showToast(t("admin.uploadError"));
        return;
      }
    }

    const payload = {
      id: editingId || buildProductId(name),
      name,
      price,
      description,
      featured: Boolean(productForm.featured),
      image: imagePath || "/images/placeholders/neutral-product.svg",
      benefits: ["Relieves neck pain", "Improves sleep posture", "Premium comfort", "Designed for deep sleep"]
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
              <label className="check-field">
                <input
                  checked={productForm.featured}
                  onChange={(event) => setProductField("featured", event.target.checked)}
                  type="checkbox"
                />
                <span>{t("admin.featured")}</span>
              </label>

              <label>
                <span>{t("admin.image")}</span>
                <input
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  type="file"
                />
              </label>
              <p className="field-note">{t("admin.imageHelp")}</p>

              {productForm.image ? <p className="field-note">{`${t("admin.imagePath")}: ${productForm.image}`}</p> : null}

              <div className="image-preview">
                <span>{t("admin.preview")}</span>
                <SleepImage
                  alt={productForm.name || t("brand.name")}
                  className="preview-image"
                  src={previewUrl || productForm.image}
                />
              </div>

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
