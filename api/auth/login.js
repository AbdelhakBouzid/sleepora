const { parseJsonBody, methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const { getUserByEmail, sanitizeUserView } = require("../../api_helpers/usersStore");
const { verifyPassword, createAuthToken } = require("../../api_helpers/authSecurity");

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "POST") {
    return methodNotAllowed(res, "POST");
  }

  try {
    const payload = parseJsonBody(req);
    const email = String(payload?.email || "").trim().toLowerCase();
    const password = String(payload?.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Missing login fields" });
    }

    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const safeUser = sanitizeUserView(user);
    return res.status(200).json({
      ok: true,
      token: createAuthToken(safeUser),
      user: safeUser
    });
  } catch (_error) {
    return res.status(500).json({ error: "Unable to login" });
  }
};

