const { methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const { requireAdminSession } = require("../../api_helpers/adminAuth");

module.exports = async function handler(req, res) {
  setNoStore(res);

  if (req.method !== "POST") {
    return methodNotAllowed(res, "POST");
  }

  const session = requireAdminSession(req, res);
  if (!session) return;

  return res.status(501).json({
    error: "Direct file upload is not configured on this deployment. Please use hosted image/video URLs."
  });
};

