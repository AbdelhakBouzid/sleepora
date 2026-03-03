const { methodNotAllowed, parseJsonBody, setNoStore } = require("../api_helpers/http");
const {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  envAuthConfigured,
  validateCredentials,
  requireAdminSession
} = require("../api_helpers/adminAuth");
const { listPaidOrders } = require("../api_helpers/ordersStore");
const { listProducts, saveProducts } = require("../api_helpers/productsStore");
const { listUsers, deleteUser } = require("../api_helpers/usersStore");

function readEndpoint(req) {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    return String(url.searchParams.get("endpoint") || "").trim().toLowerCase();
  } catch (_error) {
    return "";
  }
}

module.exports = async function handler(req, res) {
  setNoStore(res);

  const endpoint = readEndpoint(req);

  if (endpoint === "login") {
    if (req.method !== "POST") {
      return methodNotAllowed(res, "POST");
    }

    if (!envAuthConfigured()) {
      return res.status(500).json({ error: "Missing ADMIN_USER or ADMIN_PASS" });
    }

    const payload = parseJsonBody(req);
    const username = String(payload?.username || "").trim();
    const password = String(payload?.password || "");

    if (!validateCredentials(username, password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createSessionToken(username);
    setSessionCookie(res, token);
    return res.status(200).json({ ok: true });
  }

  if (endpoint === "logout") {
    if (req.method !== "POST") {
      return methodNotAllowed(res, "POST");
    }

    clearSessionCookie(res);
    return res.status(200).json({ ok: true });
  }

  if (endpoint === "session") {
    if (req.method !== "GET") {
      return methodNotAllowed(res, "GET");
    }

    const session = requireAdminSession(req, res);
    if (!session) return;

    return res.status(200).json({
      ok: true,
      username: session.username
    });
  }

  if (endpoint === "orders") {
    if (req.method !== "GET") {
      return methodNotAllowed(res, "GET");
    }

    const session = requireAdminSession(req, res);
    if (!session) return;

    try {
      const orders = await listPaidOrders();
      return res.status(200).json({
        ok: true,
        orders
      });
    } catch (_error) {
      return res.status(500).json({ error: "Unable to load orders" });
    }
  }

  if (endpoint === "products") {
    const session = requireAdminSession(req, res);
    if (!session) return;

    if (req.method === "GET") {
      try {
        const products = await listProducts();
        return res.status(200).json({
          ok: true,
          products: Array.isArray(products) ? products : []
        });
      } catch (_error) {
        return res.status(500).json({ error: "Unable to load products" });
      }
    }

    if (req.method === "PUT") {
      const payload = parseJsonBody(req);
      if (!Array.isArray(payload?.products)) {
        return res.status(400).json({ error: "Invalid products payload" });
      }

      try {
        const products = await saveProducts(payload.products);
        return res.status(200).json({
          ok: true,
          products
        });
      } catch (_error) {
        return res.status(500).json({ error: "Unable to save products" });
      }
    }

    return methodNotAllowed(res, "GET, PUT");
  }

  if (endpoint === "users") {
    const session = requireAdminSession(req, res);
    if (!session) return;

    if (req.method === "GET") {
      try {
        const users = await listUsers();
        return res.status(200).json({
          ok: true,
          users
        });
      } catch (_error) {
        return res.status(500).json({ error: "Unable to load users" });
      }
    }

    if (req.method === "DELETE") {
      const payload = parseJsonBody(req);
      const userId = String(payload?.userId || "").trim();
      if (!userId) {
        return res.status(400).json({ error: "Missing user id" });
      }

      try {
        const deleted = await deleteUser(userId);
        if (!deleted) {
          return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ ok: true });
      } catch (_error) {
        return res.status(500).json({ error: "Unable to delete user" });
      }
    }

    return methodNotAllowed(res, "GET, DELETE");
  }

  if (endpoint === "upload") {
    if (req.method !== "POST") {
      return methodNotAllowed(res, "POST");
    }

    const session = requireAdminSession(req, res);
    if (!session) return;

    return res.status(501).json({
      error: "Direct file upload is not configured on this deployment. Please use hosted image/video URLs."
    });
  }

  return res.status(404).json({ error: "Unknown admin endpoint" });
};
