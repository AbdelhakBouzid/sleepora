const { parseJsonBody, methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const { getUserByEmail, getUserByPhone, sanitizeUserView, setResetOtp } = require("../../api_helpers/usersStore");
const { createResetOtp } = require("../../api_helpers/authSecurity");
const { sendEmailOtp, sendPhoneOtp } = require("../../api_helpers/otpDelivery");

function normalizePhoneE164(dialCode, phone) {
  const dial = String(dialCode || "").replace(/[^\d+]/g, "");
  const local = String(phone || "").replace(/[^\d]/g, "");
  if (!dial || !local) return "";
  const withPlus = dial.startsWith("+") ? dial : `+${dial.replace(/\+/g, "")}`;
  return `${withPlus}${local}`;
}

module.exports = async function handler(req, res) {
  setNoStore(res);

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
};

