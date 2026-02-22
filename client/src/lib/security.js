function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex) {
  const pairs = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(pairs.map((pair) => Number.parseInt(pair, 16)));
}

function randomSaltHex(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes);
}

export async function hashPassword(password, saltHex = randomSaltHex()) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: hexToBuffer(saltHex),
      iterations: 120000
    },
    keyMaterial,
    256
  );

  return {
    salt: saltHex,
    hash: bufferToHex(derived)
  };
}

export async function verifyPassword(password, storedSalt, storedHash) {
  if (!password || !storedSalt || !storedHash) return false;
  const generated = await hashPassword(password, storedSalt);
  return generated.hash === storedHash;
}
