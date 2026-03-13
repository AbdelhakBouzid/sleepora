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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export async function loadAdminProducts() {
  const data = await request("/api/admin?endpoint=products");
  return Array.isArray(data?.products) ? data.products : [];
}

export async function saveAdminProducts(products) {
  return request("/api/admin?endpoint=products", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products })
  });
}

export async function uploadAdminImage(file, { fieldName = "image" } = {}) {
  const form = new FormData();
  form.append(fieldName, file);

  try {
    return await request(
      "/api/admin?endpoint=upload",
      {
        method: "POST",
        body: form
      },
      { requireOk: false }
    );
  } catch (error) {
    const message = String(error?.message || "");
    const shouldInlineFallback =
      message.includes("Direct file upload is not configured") ||
      message.includes("hosted image/video URLs") ||
      message.includes("Admin API unavailable");

    if (!shouldInlineFallback) {
      throw error;
    }

    return {
      ok: true,
      path: await readFileAsDataUrl(file),
      inline: true
    };
  }
}
