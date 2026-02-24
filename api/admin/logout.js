const { methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const { clearSessionCookie } = require("../../api_helpers/adminAuth");

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "POST") {
    return methodNotAllowed(res, "POST");
  }

  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
};

