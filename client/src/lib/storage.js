export const CART_STORAGE_KEY = "sleepora_cart_v1";
export const LANGUAGE_STORAGE_KEY = "sleepora_language_v1";
export const THEME_STORAGE_KEY = "sleepora_theme_v1";
export const ADMIN_CREDENTIALS_STORAGE_KEY = "sleepora_admin_credentials_v1";
export const ADMIN_SESSION_STORAGE_KEY = "sleepora_admin_session_v1";
export const USER_TOKEN_STORAGE_KEY = "sleepora_user_token_v1";
export const USER_PROFILE_STORAGE_KEY = "sleepora_user_profile_v1";
export const CHECKOUT_FORM_STORAGE_KEY = "sleepora_checkout_form_v1";
export const CATALOG_CACHE_STORAGE_KEY = "sleepora_catalog_cache_v1";
export const STORAGE_SYNC_EVENT = "sleepora:local-storage-sync";

export function readStorageValue(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
}

export function writeStorageValue(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT, { detail: { key } }));
  } catch (_error) {
    // Ignore storage failures.
  }
}

export function removeStorageValue(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT, { detail: { key } }));
  } catch (_error) {
    // Ignore storage failures.
  }
}

export function persistUserSession(payload = {}) {
  writeStorageValue(USER_TOKEN_STORAGE_KEY, String(payload?.token || ""));
  writeStorageValue(USER_PROFILE_STORAGE_KEY, payload?.user || null);
}

export function clearUserSession() {
  removeStorageValue(USER_TOKEN_STORAGE_KEY);
  removeStorageValue(USER_PROFILE_STORAGE_KEY);
}
