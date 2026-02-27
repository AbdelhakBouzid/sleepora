const { parseJsonBody, methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const { getResetOtp, consumeResetOtp, updateUserPassword } = require("../../api_helpers/usersStore");
const { verifyResetOtp, hashPassword, isStrongPassword } = require("../../api_helpers/authSecurity");

module.exports = async function handler(req, res) {
  setNoStore(res);

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
};

