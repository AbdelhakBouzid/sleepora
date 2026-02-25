async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
}

function isJsonResponse(response) {
  const contentType = String(response.headers?.get?.("content-type") || "").toLowerCase();
  return contentType.includes("application/json");
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: "include"
  });
  const isJson = isJsonResponse(response);
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  if (!isJson || !data || data?.ok !== true) {
    throw new Error("Admin API unavailable");
  }

  return data;
}

export function adminLogin(username, password) {
  return request("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
}

export function adminLogout() {
  return request("/api/admin/logout", { method: "POST" });
}

export function adminSession() {
  return request("/api/admin/session");
}

export function loadPaidOrders() {
  return request("/api/admin/orders");
}
