const { methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const { requireAdminSession } = require("../../api_helpers/adminAuth");

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "GET") {
    return methodNotAllowed(res, "GET");
  }

  const session = requireAdminSession(req, res);
  if (!session) return;

  return res.status(200).json({
    ok: true,
    username: session.username
  });
};

