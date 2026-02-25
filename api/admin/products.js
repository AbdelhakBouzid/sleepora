const { methodNotAllowed, parseJsonBody, setNoStore } = require("../../api_helpers/http");
const { requireAdminSession } = require("../../api_helpers/adminAuth");
const { listProducts, saveProducts } = require("../../api_helpers/productsStore");

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method === "GET") {
    const session = requireAdminSession(req, res);
    if (!session) return;

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
    const session = requireAdminSession(req, res);
    if (!session) return;

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
};

