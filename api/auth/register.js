const { parseJsonBody, methodNotAllowed, setNoStore } = require("../../api_helpers/http");
const { createUser } = require("../../api_helpers/usersStore");
const { hashPassword, createAuthToken, isStrongPassword } = require("../../api_helpers/authSecurity");

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
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !gender ||
      !age ||
      !phoneCountryName ||
      !phoneCountryCode ||
      !phoneDialCode ||
      !phoneNumber
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
};

