function parseJsonSafe(response) {
  return response.json().catch(() => null);
}

function isJsonResponse(response) {
  const contentType = String(response.headers?.get?.("content-type") || "").toLowerCase();
  return contentType.includes("application/json");
}

async function request(path, options = {}) {
  const response = await fetch(path, options);
  const isJson = isJsonResponse(response);
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    if (response.status === 405) {
      throw new Error("Checkout API unavailable (405). Set Vercel Root Directory to repository root.");
    }
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  if (!isJson || !data) {
    throw new Error("Checkout API unavailable. Verify Vercel deployment includes /api functions.");
  }

  return data;
}

export async function fetchPayPalClientConfig() {
  return request("/api/paypal-client-id");
}

export async function createPayPalCheckoutOrder(payload) {
  return request("/api/paypal-create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function capturePayPalCheckoutOrder(orderId) {
  return request("/api/paypal-capture-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId })
  });
}

function buildPayPalSdkUrl(clientId, currency) {
  const params = new URLSearchParams({
    "client-id": clientId,
    currency: String(currency || "USD").toUpperCase(),
    intent: "capture",
    components: "buttons",
    "enable-funding": "card"
  });
  return `https://www.paypal.com/sdk/js?${params.toString()}`;
}

export function loadPayPalSdk(clientId, currency) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Browser environment is required"));
      return;
    }

    if (window.paypal?.Buttons) {
      resolve(window.paypal);
      return;
    }

    const scriptId = "paypal-smart-sdk";
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.paypal));
      existing.addEventListener("error", () => reject(new Error("Failed to load PayPal SDK")));
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = buildPayPalSdkUrl(clientId, currency);
    script.async = true;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.head.appendChild(script);
  });
}
