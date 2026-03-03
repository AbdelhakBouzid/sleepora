const { parseJsonBody, methodNotAllowed, setNoStore } = require("../api_helpers/http");
const {
  createUser,
  getUserByEmail,
  getUserByPhone,
  getUserById,
  sanitizeUserView,
  setResetOtp,
  getResetOtp,
  consumeResetOtp,
  updateUserPassword,
  updateUserProfile
} = require("../api_helpers/usersStore");
const {
  hashPassword,
  verifyPassword,
  createAuthToken,
  verifyAuthToken,
  isStrongPassword,
  createResetOtp,
  verifyResetOtp
} = require("../api_helpers/authSecurity");
const { sendEmailOtp, sendPhoneOtp } = require("../api_helpers/otpDelivery");

function readEndpoint(req) {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    return String(url.searchParams.get("endpoint") || "").trim().toLowerCase();
  } catch (_error) {
    return "";
  }
}

function normalizePhoneE164(dialCode, phone) {
  const dial = String(dialCode || "").replace(/[^\d+]/g, "");
  const local = String(phone || "").replace(/[^\d]/g, "");
  if (!dial || !local) return "";
  const withPlus = dial.startsWith("+") ? dial : `+${dial.replace(/\+/g, "")}`;
  return `${withPlus}${local}`;
}

async function requireUser(req, res) {
  const authHeader = String(req.headers?.authorization || "").trim();
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  const token = authHeader.slice(7).trim();
  const payload = verifyAuthToken(token);
  if (!payload?.sub) {
    res.status(401).json({ error: "Invalid session" });
    return null;
  }

  const user = await getUserById(payload.sub);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return null;
  }

  return user;
}

module.exports = async function handler(req, res) {
  setNoStore(res);

  const endpoint = readEndpoint(req);

  if (endpoint === "register") {
    if (req.method !== "POST") {
      return methodNotAllowed(res, "POST");
    }

    try {
      const payload = parseJsonBody(req);
      const firstName = String(payload?.firstName || "").trim();
      const lastName = String(payload?.lastName || "").trim();
      const email = String(payload?.email || "").trim().toLowerCase();
      const password = String(payload?.password || "");
      const gender = String(payload?.gender || "").trim();
      const age = Number(payload?.age || 0);
      const phoneCountryName = String(payload?.phoneCountryName || "").trim();
      const phoneCountryCode = String(payload?.phoneCountryCode || "").trim().toUpperCase();
      const phoneDialCode = String(payload?.phoneDialCode || "").trim();
      const phoneNumber = String(payload?.phoneNumber || "").trim();

      if (
        !firstName || !lastName || !email || !password || !gender || !age || !phoneCountryName ||
        !phoneCountryCode || !phoneDialCode || !phoneNumber
      ) {
        return res.status(400).json({ error: "Missing register fields" });
      }

      if (!email.includes("@")) {
        return res.status(400).json({ error: "Invalid email" });
      }

      if (!Number.isInteger(age) || age < 13 || age > 120) {
        return res.status(400).json({ error: "Invalid age" });
      }

      if (!isStrongPassword(password)) {
        return res.status(400).json({ error: "Password must include upper/lower letters, number, and symbol" });
      }

      const phoneE164 = normalizePhoneE164(phoneDialCode, phoneNumber);
      if (!phoneE164 || phoneE164.length < 8) {
        return res.status(400).json({ error: "Invalid phone number" });
      }

      const created = await createUser({
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        email,
        password_hash: hashPassword(password),
        gender,
        age,
        phone_country_name: phoneCountryName,
        phone_country_code: phoneCountryCode,
        phone_dial_code: phoneDialCode,
        phone_number: phoneNumber,
        phone_e164: phoneE164
      });

      return res.status(200).json({
        ok: true,
        token: createAuthToken(created),
        user: created
      });
    } catch (error) {
      const message = String(error?.message || "");
      if (message.includes("already exists")) {
        return res.status(409).json({ error: message });
      }
      return res.status(500).json({ error: "Unable to register user" });
    }
  }

  if (endpoint === "login") {
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
  }

  if (endpoint === "request-reset-otp") {
    if (req.method !== "POST") {
      return methodNotAllowed(res, "POST");
    }

    try {
      const payload = parseJsonBody(req);
      const method = String(payload?.method || "").trim().toLowerCase();
      const email = String(payload?.email || "").trim().toLowerCase();
      const phoneDialCode = String(payload?.phoneDialCode || "").trim();
      const phoneNumber = String(payload?.phoneNumber || "").trim();
      let user = null;

      if (method === "email") {
        if (!email || !email.includes("@")) {
          return res.status(400).json({ error: "Invalid email" });
        }
        user = await getUserByEmail(email);
      } else if (method === "phone") {
        const phoneE164 = normalizePhoneE164(phoneDialCode, phoneNumber);
        if (!phoneE164) {
          return res.status(400).json({ error: "Invalid phone number" });
        }
        user = await getUserByPhone(phoneE164);
      } else {
        return res.status(400).json({ error: "Invalid OTP method" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const otpData = createResetOtp();
      const safeUser = sanitizeUserView(user);

      await setResetOtp(otpData.challengeId, {
        user_id: safeUser.id,
        method,
        email: safeUser.email,
        phone_e164: safeUser.phone_e164,
        otp_hash: otpData.otpHash,
        expires_at: otpData.expiresAt,
        attempts: 0,
        created_at: new Date().toISOString()
      });

      if (method === "email") {
        await sendEmailOtp({ to: safeUser.email, otp: otpData.otp });
      } else {
        await sendPhoneOtp({ to: safeUser.phone_e164, otp: otpData.otp });
      }

      return res.status(200).json({
        ok: true,
        challengeId: otpData.challengeId
      });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Unable to send OTP" });
    }
  }

  if (endpoint === "session") {
    if (req.method !== "GET") {
      return methodNotAllowed(res, "GET");
    }

    try {
      const user = await requireUser(req, res);
      if (!user) return;
      const safeUser = sanitizeUserView(user);
      return res.status(200).json({
        ok: true,
        token: createAuthToken(safeUser),
        user: safeUser
      });
    } catch (_error) {
      return res.status(500).json({ error: "Unable to load session" });
    }
  }

  if (endpoint === "profile") {
    if (req.method !== "PUT") {
      return methodNotAllowed(res, "PUT");
    }

    try {
      const user = await requireUser(req, res);
      if (!user) return;

      const payload = parseJsonBody(req);
      const firstName = String(payload?.firstName || payload?.first_name || "").trim();
      const lastName = String(payload?.lastName || payload?.last_name || "").trim();

      if (!firstName || !lastName) {
        return res.status(400).json({ error: "Missing profile fields" });
      }

      const updated = await updateUserProfile(user.id, {
        first_name: firstName,
        last_name: lastName
      });

      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        ok: true,
        token: createAuthToken(updated),
        user: updated
      });
    } catch (_error) {
      return res.status(500).json({ error: "Unable to update profile" });
    }
  }

  if (endpoint === "change-password") {
    if (req.method !== "POST") {
      return methodNotAllowed(res, "POST");
    }

    try {
      const user = await requireUser(req, res);
      if (!user) return;

      const payload = parseJsonBody(req);
      const currentPassword = String(payload?.currentPassword || "");
      const newPassword = String(payload?.newPassword || "");

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Missing password fields" });
      }

      if (!verifyPassword(currentPassword, user.password_hash)) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      if (!isStrongPassword(newPassword)) {
        return res.status(400).json({ error: "Password must include upper/lower letters, number, and symbol" });
      }

      const updated = await updateUserPassword(user.id, hashPassword(newPassword));
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        ok: true,
        token: createAuthToken(updated),
        user: updated
      });
    } catch (_error) {
      return res.status(500).json({ error: "Unable to change password" });
    }
  }

  if (endpoint === "reset-password") {
    if (req.method !== "POST") {
      return methodNotAllowed(res, "POST");
    }

    try {
      const payload = parseJsonBody(req);
      const challengeId = String(payload?.challengeId || "").trim();
      const otp = String(payload?.otp || "").trim();
      const newPassword = String(payload?.newPassword || "");

      if (!challengeId || !otp || !newPassword) {
        return res.status(400).json({ error: "Missing reset fields" });
      }

      if (!isStrongPassword(newPassword)) {
        return res.status(400).json({ error: "Password must include upper/lower letters, number, and symbol" });
      }

      const record = await getResetOtp(challengeId);
      if (!record) {
        return res.status(404).json({ error: "OTP challenge not found" });
      }

      if (Date.now() > Date.parse(String(record?.expires_at || 0))) {
        await consumeResetOtp(challengeId);
        return res.status(400).json({ error: "OTP expired" });
      }

      if (!verifyResetOtp(otp, record?.otp_hash)) {
        return res.status(401).json({ error: "Invalid OTP code" });
      }

      const updated = await updateUserPassword(record.user_id, hashPassword(newPassword));
      await consumeResetOtp(challengeId);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ ok: true });
    } catch (_error) {
      return res.status(500).json({ error: "Unable to reset password" });
    }
  }

  return res.status(404).json({ error: "Unknown auth endpoint" });
};
