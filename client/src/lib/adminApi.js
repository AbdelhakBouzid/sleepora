async function parseJson(response) {
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

async function request(path, options = {}, { requireOk = true } = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: "include"
  });

  const isJson = isJsonResponse(response);
  const data = await parseJson(response);

  if (!response.ok) {
    throw new Error(data?.error || "Admin request failed");
  }

  if (!isJson || !data) {
    throw new Error("Admin API unavailable");
  }

  if (requireOk && data?.ok !== true) {
    throw new Error(data?.error || "Admin API unavailable");
  }

  return data;
}

export async function loadAdminProducts() {
  const data = await request("/api/admin/products");
  return Array.isArray(data?.products) ? data.products : [];
}

export async function saveAdminProducts(products) {
  return request("/api/admin/products", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products })
  });
}

export async function uploadAdminImage(file) {
  const form = new FormData();
  form.append("image", file);
  return request("/api/admin/upload", {
    method: "POST",
    body: form
  }, { requireOk: false });
}
