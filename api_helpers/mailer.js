function esc(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildOrderText(order) {
  const items = Array.isArray(order?.items) ? order.items : [];
  const itemLines = items
    .map((item) => `- ${item.name} | qty: ${item.quantity} | unit: ${item.unit_price}`)
    .join("\n");

  return [
    "New Paid Order - Sleepora",
    "",
    `Name: ${order?.name || ""}`,
    `Email: ${order?.email || ""}`,
    `Phone: ${order?.phone || ""}`,
    "",
    "Shipping Address:",
    `${order?.address || ""}`,
    `${order?.city || ""}, ${order?.state || ""} ${order?.zip || ""}`,
    `${order?.country || ""}`,
    "",
    "Items:",
    itemLines,
    "",
    `Total: ${order?.total_amount || 0} ${order?.currency || "USD"}`,
    `Payment Status: ${order?.payment_status || "paid"}`,
    `Payment Method: ${order?.payment_method || "paypal"}`,
    `PayPal Order ID: ${order?.paypal_order_id || ""}`,
    `PayPal Capture ID: ${order?.paypal_capture_id || ""}`,
    `Created: ${order?.created_at || ""}`
  ].join("\n");
}

function buildOrderHtml(order) {
  const items = Array.isArray(order?.items) ? order.items : [];
  const itemRows = items
    .map(
      (item) =>
        `<li><strong>${esc(item.name)}</strong> - qty: ${esc(item.quantity)} - unit: ${esc(item.unit_price)}</li>`
    )
    .join("");

  return `
    <h2>New Paid Order - Sleepora</h2>
    <p><strong>Name:</strong> ${esc(order?.name)}</p>
    <p><strong>Email:</strong> ${esc(order?.email)}</p>
    <p><strong>Phone:</strong> ${esc(order?.phone)}</p>
    <p><strong>Address:</strong> ${esc(order?.address)}, ${esc(order?.city)}, ${esc(order?.state)} ${esc(order?.zip)}, ${esc(order?.country)}</p>
    <h3>Items</h3>
    <ul>${itemRows}</ul>
    <p><strong>Total:</strong> ${esc(order?.total_amount)} ${esc(order?.currency)}</p>
    <p><strong>Payment Status:</strong> ${esc(order?.payment_status || "paid")}</p>
    <p><strong>Payment Method:</strong> ${esc(order?.payment_method || "paypal")}</p>
    <p><strong>PayPal Order ID:</strong> ${esc(order?.paypal_order_id)}</p>
    <p><strong>PayPal Capture ID:</strong> ${esc(order?.paypal_capture_id)}</p>
    <p><strong>Created:</strong> ${esc(order?.created_at)}</p>
  `;
}

async function sendOrderNotificationEmail(order) {
  const ownerEmail = String(process.env.OWNER_EMAIL || "sleepora.contact@gmail.com").trim();
  const apiKey = String(process.env.EMAIL_PROVIDER_API_KEY || "").trim();
  const from = String(process.env.EMAIL_FROM || "Sleepora <onboarding@resend.dev>").trim();

  if (!apiKey) {
    console.log("[order-email] EMAIL_PROVIDER_API_KEY is missing, email skipped", {
      ownerEmail,
      paypalOrderId: order?.paypal_order_id
    });
    return { ok: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [ownerEmail],
      subject: `New paid order - ${order?.paypal_order_id || "Sleepora"}`,
      text: buildOrderText(order),
      html: buildOrderHtml(order)
    })
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Failed to send order email (${response.status}): ${payload}`);
  }

  return { ok: true };
}

module.exports = {
  sendOrderNotificationEmail
};
