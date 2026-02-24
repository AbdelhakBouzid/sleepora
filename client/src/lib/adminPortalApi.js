async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: "include"
  });
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
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
