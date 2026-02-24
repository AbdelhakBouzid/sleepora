const { parseJsonBody, methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const {
  createSessionToken,
  setSessionCookie,
  envAuthConfigured,
  validateCredentials
} = require("../../api_helpers/adminAuth");

module.exports = async function handler(req, res) {
  setNoStore(res);

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
};

