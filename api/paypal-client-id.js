const { methodNotAllowed, setNoStore } = require("../api_helpers/http");
const { generatePayPalClientToken, normalizeCurrency } = require("../api_helpers/paypal");

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "GET") {
    return methodNotAllowed(res, "GET");
  }

  const clientId = String(process.env.PAYPAL_CLIENT_ID || "").trim();
  if (!clientId) {
    return res.status(500).json({ error: "Missing PAYPAL_CLIENT_ID" });
  }

  const currency = normalizeCurrency(process.env.PAYPAL_CURRENCY || "USD");
  let clientToken = "";
  let cardFieldsEligible = false;
  let cardFieldsError = "";

  try {
    clientToken = await generatePayPalClientToken();
    cardFieldsEligible = Boolean(clientToken);
  } catch (error) {
    cardFieldsError = String(error?.message || "Unable to generate PayPal client token");
  }

  return res.status(200).json({
    clientId,
    currency: currency || "USD",
    clientToken,
    cardFieldsEligible,
    cardFieldsError
  });
};
