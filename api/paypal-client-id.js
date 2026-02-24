const { methodNotAllowed, setNoStore } = require("../api_helpers/http");

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "GET") {
    return methodNotAllowed(res, "GET");
  }

  const clientId = String(process.env.PAYPAL_CLIENT_ID || "").trim();
  if (!clientId) {
    return res.status(500).json({ error: "Missing PAYPAL_CLIENT_ID" });
  }

  const currency = String(process.env.PAYPAL_CURRENCY || "USD").trim().toUpperCase();
  return res.status(200).json({
    clientId,
    currency: currency || "USD"
  });
};

