const crypto = require("crypto");

const COOKIE_NAME = "sleepora_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function authSecret() {
  const adminUser = String(process.env.ADMIN_USER || "");
  const adminPass = String(process.env.ADMIN_PASS || "");
  return `${adminUser}:${adminPass}:sleepora-admin`;
}

function parseCookies(req) {
  const raw = String(req.headers?.cookie || "");
  if (!raw) return {};

  return raw.split(";").reduce((acc, pair) => {
    const idx = pair.indexOf("=");
    if (idx <= 0) return acc;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function safeEqualText(a, b) {
  const left = Buffer.from(String(a || ""), "utf8");
  const right = Buffer.from(String(b || ""), "utf8");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function sign(payload) {
  return crypto.createHmac("sha256", authSecret()).update(payload).digest("base64url");
}

function createSessionToken(username) {
  const payload = {
    username,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

function verifySessionToken(token) {
  const value = String(token || "");
  if (!value.includes(".")) return null;

  const [encodedPayload, encodedSignature] = value.split(".");
  const expected = sign(encodedPayload);
  if (!safeEqualText(encodedSignature, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (!payload?.username || Date.now() > Number(payload?.exp || 0)) return null;
    return payload;
  } catch (_error) {
    return null;
  }
}

function setSessionCookie(res, token) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Max-Age=${SESSION_TTL_SECONDS}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax"
  ];

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearSessionCookie(res) {
  const parts = [`${COOKIE_NAME}=`, "Max-Age=0", "Path=/", "HttpOnly", "SameSite=Lax"];
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }
  res.setHeader("Set-Cookie", parts.join("; "));
}

function envAuthConfigured() {
  return Boolean(String(process.env.ADMIN_USER || "") && String(process.env.ADMIN_PASS || ""));
}

function validateCredentials(username, password) {
  if (!envAuthConfigured()) return false;
  return (
    safeEqualText(username, String(process.env.ADMIN_USER || "")) &&
    safeEqualText(password, String(process.env.ADMIN_PASS || ""))
  );
}

function readSession(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifySessionToken(token);
}

function requireAdminSession(req, res) {
  const session = readSession(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return session;
}

module.exports = {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  envAuthConfigured,
  validateCredentials,
  readSession,
  requireAdminSession
};

