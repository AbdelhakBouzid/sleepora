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

function randomSocialPassword() {
  return `S!eepora_${Math.random().toString(36).slice(2, 10)}A9`;
}

function getGoogleClientId() {
  return String(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || "").trim();
}

function getFacebookAppId() {
  return String(process.env.FACEBOOK_APP_ID || process.env.VITE_FACEBOOK_APP_ID || "").trim();
}

async function readJsonSafe(response) {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
}

async function exchangeGoogleCodeForProfile({ code, redirectUri }) {
  const clientId = getGoogleClientId();
  const clientSecret = String(process.env.GOOGLE_CLIENT_SECRET || "").trim();

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured on server.");
  }

  const tokenBody = new URLSearchParams({
    code: String(code || ""),
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: String(redirectUri || ""),
    grant_type: "authorization_code"
  });

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenBody.toString()
  });
  const tokenPayload = await readJsonSafe(tokenResponse);
  if (!tokenResponse.ok) {
    throw new Error(tokenPayload?.error_description || tokenPayload?.error || "Google token exchange failed.");
  }

  const accessToken = String(tokenPayload?.access_token || "").trim();
  if (!accessToken) {
    throw new Error("Missing Google access token.");
  }

  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const profilePayload = await readJsonSafe(profileResponse);
  if (!profileResponse.ok) {
    throw new Error(profilePayload?.error_description || "Unable to load Google profile.");
  }

  return {
    providerUserId: String(profilePayload?.sub || ""),
    email: String(profilePayload?.email || "").trim().toLowerCase(),
    firstName: String(profilePayload?.given_name || "").trim(),
    lastName: String(profilePayload?.family_name || "").trim(),
    fullName: String(profilePayload?.name || "").trim()
  };
}

async function exchangeFacebookCodeForProfile({ code, redirectUri }) {
  const appId = getFacebookAppId();
  const appSecret = String(process.env.FACEBOOK_APP_SECRET || "").trim();

  if (!appId || !appSecret) {
    throw new Error("Facebook OAuth is not configured on server.");
  }

  const tokenUrl = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("client_secret", appSecret);
  tokenUrl.searchParams.set("redirect_uri", String(redirectUri || ""));
  tokenUrl.searchParams.set("code", String(code || ""));

  const tokenResponse = await fetch(tokenUrl.toString(), { method: "GET" });
  const tokenPayload = await readJsonSafe(tokenResponse);
  if (!tokenResponse.ok) {
    throw new Error(tokenPayload?.error?.message || "Facebook token exchange failed.");
  }

  const accessToken = String(tokenPayload?.access_token || "").trim();
  if (!accessToken) {
    throw new Error("Missing Facebook access token.");
  }

  const profileUrl = new URL("https://graph.facebook.com/me");
  profileUrl.searchParams.set("fields", "id,name,first_name,last_name,email");
  profileUrl.searchParams.set("access_token", accessToken);

  const profileResponse = await fetch(profileUrl.toString(), { method: "GET" });
  const profilePayload = await readJsonSafe(profileResponse);
  if (!profileResponse.ok) {
    throw new Error(profilePayload?.error?.message || "Unable to load Facebook profile.");
  }

  return {
    providerUserId: String(profilePayload?.id || ""),
    email: String(profilePayload?.email || "").trim().toLowerCase(),
    firstName: String(profilePayload?.first_name || "").trim(),
    lastName: String(profilePayload?.last_name || "").trim(),
    fullName: String(profilePayload?.name || "").trim()
  };
}

async function findOrCreateSocialUser({ provider, profile }) {
  const email = String(profile?.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error(`${provider} account did not return a valid email.`);
  }

  const existing = await getUserByEmail(email);
  if (existing) return sanitizeUserView(existing);

  const firstName = String(profile?.firstName || "").trim() || provider;
  const lastName = String(profile?.lastName || "").trim() || "User";
  const fullName = String(profile?.fullName || `${firstName} ${lastName}`).trim();

  return createUser({
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    email,
    password_hash: hashPassword(randomSocialPassword()),
    gender: "",
    age: 0,
    phone_country_name: "",
    phone_country_code: "",
    phone_dial_code: "",
    phone_number: "",
    phone_e164: ""
  });
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

  if (endpoint === "social-login") {
    if (req.method !== "POST") {
      return methodNotAllowed(res, "POST");
    }

    try {
      const payload = parseJsonBody(req);
      const provider = String(payload?.provider || "").trim().toLowerCase();
      const code = String(payload?.code || "").trim();
      const redirectUri = String(payload?.redirectUri || "").trim();

      if (!provider || !code || !redirectUri) {
        return res.status(400).json({ error: "Missing social login fields" });
      }

      if (provider !== "google" && provider !== "facebook") {
        return res.status(400).json({ error: "Unsupported social provider" });
      }

      const profile =
        provider === "google"
          ? await exchangeGoogleCodeForProfile({ code, redirectUri })
          : await exchangeFacebookCodeForProfile({ code, redirectUri });

      const user = await findOrCreateSocialUser({ provider, profile });
      return res.status(200).json({
        ok: true,
        token: createAuthToken(user),
        user
      });
    } catch (error) {
      return res.status(500).json({ error: String(error?.message || "Unable to complete social login") });
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
