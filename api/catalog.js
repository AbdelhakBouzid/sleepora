const { methodNotAllowed, setNoStore } = require("../api_helpers/http");
const { listProducts } = require("../api_helpers/productsStore");

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "GET") {
    return methodNotAllowed(res, "GET");
  }

  try {
    const products = await listProducts();
    return res.status(200).json({
      ok: true,
      products: Array.isArray(products) ? products : []
    });
  } catch (_error) {
    return res.status(500).json({ error: "Unable to load catalog" });
  }
};

