const crypto = require("crypto");

const AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
const RESET_OTP_TTL_SECONDS = 60 * 10;

function appSecret() {
  return String(process.env.APP_SECRET || "sleepora-app-secret").trim();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const value = String(storedHash || "");
  if (!value.includes(":")) return false;
  const [salt, hash] = value.split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(String(password || ""), salt, 64);
  const saved = Buffer.from(hash, "hex");
  if (computed.length !== saved.length) return false;
  return crypto.timingSafeEqual(computed, saved);
}

function createAuthToken(user) {
  const payload = {
    sub: String(user?.id || ""),
    email: String(user?.email || "").toLowerCase(),
    full_name: String(user?.full_name || ""),
    exp: Date.now() + AUTH_TOKEN_TTL_SECONDS * 1000
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", appSecret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function createResetOtp() {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const challengeId = `otp_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
  const otpHash = crypto.createHmac("sha256", appSecret()).update(otp).digest("hex");
  return {
    otp,
    challengeId,
    otpHash,
    expiresAt: new Date(Date.now() + RESET_OTP_TTL_SECONDS * 1000).toISOString()
  };
}

function verifyResetOtp(otp, otpHash) {
  const candidate = crypto.createHmac("sha256", appSecret()).update(String(otp || "")).digest("hex");
  const left = Buffer.from(candidate, "utf8");
  const right = Buffer.from(String(otpHash || ""), "utf8");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function isStrongPassword(password) {
  const text = String(password || "");
  return (
    text.length >= 8 &&
    /[a-z]/.test(text) &&
    /[A-Z]/.test(text) &&
    /\d/.test(text) &&
    /[^A-Za-z0-9]/.test(text)
  );
}

module.exports = {
  hashPassword,
  verifyPassword,
  createAuthToken,
  createResetOtp,
  verifyResetOtp,
  isStrongPassword
};

