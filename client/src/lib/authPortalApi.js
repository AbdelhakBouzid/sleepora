async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
}

async function request(path, options = {}) {
  const response = await fetch(path, options);
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
