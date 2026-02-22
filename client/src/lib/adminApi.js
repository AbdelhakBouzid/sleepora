const LOCAL_ADMIN_BASE = String(import.meta.env.VITE_LOCAL_ADMIN_API_URL || "http://localhost:5000/api/local-admin").replace(
  /\/+$/,
  ""
);

async function parseJson(response) {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${LOCAL_ADMIN_BASE}${path}`, options);
  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.error || "Local admin request failed");
  }
  return data;
}

export async function loadAdminProducts() {
  const data = await request("/products");
  return Array.isArray(data?.products) ? data.products : [];
}

export async function saveAdminProducts(products) {
  return request("/products", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products })
  });
}

export async function uploadAdminImage(file) {
  const form = new FormData();
  form.append("image", file);
  return request("/upload", {
    method: "POST",
    body: form
  });
}

export function getLocalAdminBase() {
  return LOCAL_ADMIN_BASE;
}
