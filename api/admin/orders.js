const { methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const { requireAdminSession } = require("../../api_helpers/adminAuth");
const { listPaidOrders } = require("../../api_helpers/ordersStore");

module.exports = async function handler(req, res) {
  setNoStore(res);

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
};

