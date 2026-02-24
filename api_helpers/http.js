function parseJsonBody(req) {
  if (typeof req.body === "object" && req.body !== null) {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body || "{}");
    } catch (_error) {
      return {};
    }
  }

  return {};
}

function methodNotAllowed(res, allowed = "POST") {
  res.setHeader("Allow", allowed);
  return res.status(405).json({ error: "Method not allowed" });
}

function setNoStore(res) {
  res.setHeader("Cache-Control", "no-store");
}

module.exports = {
  parseJsonBody,
  methodNotAllowed,
  setNoStore
};

