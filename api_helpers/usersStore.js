const fs = require("fs/promises");
const path = require("path");

const defaultStore = {
  users: [],
  resetOtps: {}
};

const kvStoreKey = "sleepora:users_store:v1";

function resolveStorePath() {
  if (process.env.USER_STORE_PATH) return String(process.env.USER_STORE_PATH);
  if (process.env.VERCEL) return "/tmp/sleepora-users-store.json";
  return path.join(process.cwd(), ".data", "sleepora-users-store.json");
}

function hasKvConfig() {
  return Boolean(String(process.env.KV_REST_API_URL || "").trim() && String(process.env.KV_REST_API_TOKEN || "").trim());
}

async function kvCommand(commandArgs) {
  const url = String(process.env.KV_REST_API_URL || "").trim();
  const token = String(process.env.KV_REST_API_TOKEN || "").trim();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commandArgs)
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || "KV request failed");
  }
  return payload?.result;
}

function normalizeStore(raw) {
  const users = Array.isArray(raw?.users) ? raw.users : [];
  const resetOtps = raw?.resetOtps && typeof raw.resetOtps === "object" ? raw.resetOtps : {};
  return { users, resetOtps };
}

async function ensureStoreDir(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

async function readStore() {
  if (hasKvConfig()) {
    try {
      const raw = await kvCommand(["GET", kvStoreKey]);
      if (!raw) return { ...defaultStore };
      return normalizeStore(JSON.parse(raw));
    } catch (_error) {
      return { ...defaultStore };
    }
  }

  const filePath = resolveStorePath();
  try {
    const content = await fs.readFile(filePath, "utf8");
    return normalizeStore(JSON.parse(content));
  } catch (_error) {
    return { ...defaultStore };
  }
}

async function writeStore(nextStore) {
  const normalized = normalizeStore(nextStore);
  if (hasKvConfig()) {
    await kvCommand(["SET", kvStoreKey, JSON.stringify(normalized)]);
    return;
  }
  const filePath = resolveStorePath();
  await ensureStoreDir(filePath);
  await fs.writeFile(filePath, JSON.stringify(normalized, null, 2), "utf8");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhoneE164(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const cleaned = text.replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  return cleaned.startsWith("+") ? cleaned : `+${cleaned.replace(/\+/g, "")}`;
}

function sanitizeUserView(user) {
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: user.full_name,
    email: user.email,
    gender: user.gender,
    age: user.age,
    phone_country_name: user.phone_country_name,
    phone_country_code: user.phone_country_code,
    phone_dial_code: user.phone_dial_code,
    phone_number: user.phone_number,
    phone_e164: user.phone_e164,
    created_at: user.created_at
  };
}

async function getUserByEmail(email) {
  const normalized = normalizeEmail(email);
  const store = await readStore();
  return store.users.find((user) => normalizeEmail(user?.email) === normalized) || null;
}

async function getUserByPhone(phoneE164) {
  const normalized = normalizePhoneE164(phoneE164);
  const store = await readStore();
  return store.users.find((user) => normalizePhoneE164(user?.phone_e164) === normalized) || null;
}

async function createUser(input) {
  const store = await readStore();
  const email = normalizeEmail(input?.email);
  const phoneE164 = normalizePhoneE164(input?.phone_e164);

  if (store.users.some((item) => normalizeEmail(item?.email) === email)) {
    throw new Error("Email already exists");
  }
  if (phoneE164 && store.users.some((item) => normalizePhoneE164(item?.phone_e164) === phoneE164)) {
    throw new Error("Phone already exists");
  }

  const now = new Date().toISOString();
  const user = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    first_name: String(input?.first_name || "").trim(),
    last_name: String(input?.last_name || "").trim(),
    full_name: String(input?.full_name || "").trim(),
    email,
    password_hash: String(input?.password_hash || ""),
    gender: String(input?.gender || "").trim(),
    age: Number(input?.age || 0),
    phone_country_name: String(input?.phone_country_name || "").trim(),
    phone_country_code: String(input?.phone_country_code || "").trim().toUpperCase(),
    phone_dial_code: String(input?.phone_dial_code || "").trim(),
    phone_number: String(input?.phone_number || "").trim(),
    phone_e164: phoneE164,
    created_at: now
  };

  store.users.unshift(user);
  await writeStore(store);
  return sanitizeUserView(user);
}

async function updateUserPassword(userId, newPasswordHash) {
  const store = await readStore();
  const index = store.users.findIndex((user) => String(user?.id) === String(userId));
  if (index < 0) return null;
  store.users[index].password_hash = String(newPasswordHash || "");
  await writeStore(store);
  return sanitizeUserView(store.users[index]);
}

async function setResetOtp(challengeId, payload) {
  const store = await readStore();
  store.resetOtps[String(challengeId)] = payload;
  await writeStore(store);
}

async function getResetOtp(challengeId) {
  const store = await readStore();
  return store.resetOtps[String(challengeId)] || null;
}

async function consumeResetOtp(challengeId) {
  const store = await readStore();
  delete store.resetOtps[String(challengeId)];
  await writeStore(store);
}

module.exports = {
  getUserByEmail,
  getUserByPhone,
  createUser,
  updateUserPassword,
  setResetOtp,
  getResetOtp,
  consumeResetOtp,
  sanitizeUserView
};

