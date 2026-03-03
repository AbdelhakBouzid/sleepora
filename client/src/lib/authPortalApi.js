import { readStorageValue, USER_TOKEN_STORAGE_KEY } from "./storage";

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
