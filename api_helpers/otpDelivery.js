function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function sendEmailOtp({ to, otp }) {
  const apiKey = String(process.env.EMAIL_PROVIDER_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("Email provider is not configured");
  }
  const from = String(process.env.EMAIL_FROM || "Sleepora <onboarding@resend.dev>").trim();
  const target = String(to || "").trim().toLowerCase();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [target],
      subject: "Sleepora password reset OTP",
      text: `Your Sleepora OTP is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your Sleepora OTP is <strong>${escapeHtml(otp)}</strong>.</p><p>This code expires in 10 minutes.</p>`
    })
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Failed to send email OTP (${response.status}): ${payload}`);
  }
}

async function sendPhoneOtp({ to, otp }) {
  const sid = String(process.env.TWILIO_ACCOUNT_SID || "").trim();
  const authToken = String(process.env.TWILIO_AUTH_TOKEN || "").trim();
  const from = String(process.env.TWILIO_FROM_NUMBER || "").trim();

  if (!sid || !authToken || !from) {
    throw new Error("SMS provider is not configured");
  }

  const target = String(to || "").trim();
  if (!target.startsWith("+")) {
    throw new Error("Invalid phone number");
  }

  const auth = Buffer.from(`${sid}:${authToken}`).toString("base64");
  const body = new URLSearchParams({
    To: target,
    From: from,
    Body: `Sleepora OTP: ${otp}. Expires in 10 minutes.`
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Failed to send SMS OTP (${response.status}): ${payload}`);
  }
}

module.exports = {
  sendEmailOtp,
  sendPhoneOtp
};

