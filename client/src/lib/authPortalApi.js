import { readStorageValue, USER_TOKEN_STORAGE_KEY, writeStorageValue } from "./storage";

const SOCIAL_OAUTH_STATE_KEY = "sleepora_social_oauth_state_v1";

const socialProviders = {
  google: {
    clientIdEnv: "VITE_GOOGLE_CLIENT_ID",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth"
  },
  facebook: {
    clientIdEnv: "VITE_FACEBOOK_APP_ID",
    authorizeUrl: "https://www.facebook.com/v19.0/dialog/oauth"
  },
  apple: {
    clientIdEnv: "VITE_APPLE_CLIENT_ID",
    authorizeUrl: "https://appleid.apple.com/auth/authorize"
  }
};

function readClientId(providerKey) {
  const provider = socialProviders[providerKey];
  if (!provider) return "";
  return String(import.meta.env?.[provider.clientIdEnv] || "").trim();
}

function buildAuthUrl(baseUrl, params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  return `${baseUrl}?${search.toString()}`;
}

function createOAuthState(providerKey) {
  const token = `${providerKey}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  writeStorageValue(SOCIAL_OAUTH_STATE_KEY, {
    provider: providerKey,
    state: token,
    createdAt: Date.now()
  });
  return token;
}

function resolveRedirectUri() {
  if (typeof window === "undefined") return "";
  return String(import.meta.env.VITE_OAUTH_REDIRECT_URI || `${window.location.origin}/`).trim();
}

function providerFromState(stateToken) {
  const state = String(stateToken || "").trim().toLowerCase();
  if (!state) return "";
  const provider = state.split("-")[0];
  return socialProviders[provider] ? provider : "";
}

export function isSocialAuthConfigured(providerKey) {
  return Boolean(readClientId(providerKey));
}

export function getSocialAuthUrl(providerKey) {
  if (typeof window === "undefined") return "";

  const provider = socialProviders[providerKey];
  const clientId = readClientId(providerKey);
  if (!provider || !clientId) return "";

  const redirectUri = resolveRedirectUri();
  const state = createOAuthState(providerKey);

  if (providerKey === "google") {
    return buildAuthUrl(provider.authorizeUrl, {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      include_granted_scopes: "true",
      prompt: "select_account",
      state
    });
  }

  if (providerKey === "facebook") {
    return buildAuthUrl(provider.authorizeUrl, {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "public_profile,email",
      state
    });
  }

  if (providerKey === "apple") {
    return buildAuthUrl(provider.authorizeUrl, {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      response_mode: "query",
      scope: "name email",
      state
    });
  }

  return "";
}

export async function completeSocialAuthFromCallback(payload = {}) {
  const code = String(payload?.code || "").trim();
  const state = String(payload?.state || "").trim();
  const provider = String(payload?.provider || providerFromState(state)).toLowerCase();

  if (!code || !provider) {
    throw new Error("Missing OAuth callback data.");
  }

  return request("/api/auth?endpoint=social-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider,
      code,
      state,
      redirectUri: String(payload?.redirectUri || resolveRedirectUri()),
      callbackPath: String(payload?.callbackPath || "/")
    })
  });
}

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
}

async function request(path, options = {}) {
  const token = readStorageValue(USER_TOKEN_STORAGE_KEY, "");
  const headers = {
    ...(options.headers || {})
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers
  });
  const data = await parseJsonSafe(response);
  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data;
}

export function registerUser(payload) {
  return request("/api/auth?endpoint=register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload) {
  return request("/api/auth?endpoint=login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function requestPasswordResetOtp(payload) {
  return request("/api/auth?endpoint=request-reset-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function resetPasswordWithOtp(payload) {
  return request("/api/auth?endpoint=reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function getCurrentUserSession() {
  return request("/api/auth?endpoint=session");
}

export function updateCurrentUserProfile(payload) {
  return request("/api/auth?endpoint=profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function changeCurrentUserPassword(payload) {
  return request("/api/auth?endpoint=change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
