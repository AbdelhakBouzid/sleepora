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
    "New COD Order - Ba2i3",
    "",
    `Order Ref: ${order?.order_number || order?.id || ""}`,
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
    `Subtotal: ${order?.subtotal_amount || 0} ${order?.currency || "MAD"}`,
    `Discount: ${order?.discount_amount || 0} ${order?.currency || "MAD"}`,
    `Shipping: ${order?.shipping_amount || 0} ${order?.currency || "MAD"}`,
    `Total: ${order?.total_amount || 0} ${order?.currency || "MAD"}`,
    `Payment Status: ${order?.payment_status || "pending"}`,
    `Payment Method: ${order?.payment_method || "cod"}`,
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
    <h2>New COD Order - Ba2i3</h2>
    <p><strong>Order Ref:</strong> ${esc(order?.order_number || order?.id)}</p>
    <p><strong>Name:</strong> ${esc(order?.name)}</p>
    <p><strong>Email:</strong> ${esc(order?.email)}</p>
    <p><strong>Phone:</strong> ${esc(order?.phone)}</p>
    <p><strong>Address:</strong> ${esc(order?.address)}, ${esc(order?.city)}, ${esc(order?.state)} ${esc(order?.zip)}, ${esc(order?.country)}</p>
    <h3>Items</h3>
    <ul>${itemRows}</ul>
    <p><strong>Subtotal:</strong> ${esc(order?.subtotal_amount)} ${esc(order?.currency)}</p>
    <p><strong>Discount:</strong> ${esc(order?.discount_amount)} ${esc(order?.currency)}</p>
    <p><strong>Shipping:</strong> ${esc(order?.shipping_amount)} ${esc(order?.currency)}</p>
    <p><strong>Total:</strong> ${esc(order?.total_amount)} ${esc(order?.currency)}</p>
    <p><strong>Payment Status:</strong> ${esc(order?.payment_status || "pending")}</p>
    <p><strong>Payment Method:</strong> ${esc(order?.payment_method || "cod")}</p>
    <p><strong>Created:</strong> ${esc(order?.created_at)}</p>
  `;
}

async function sendOrderNotificationEmail(order) {
  const ownerEmail = String(process.env.OWNER_EMAIL || "ba2i3.contact@gmail.com").trim();
  const apiKey = String(process.env.EMAIL_PROVIDER_API_KEY || "").trim();
  const from = String(process.env.EMAIL_FROM || "Ba2i3 <onboarding@resend.dev>").trim();

  if (!apiKey) {
    console.log("[order-email] EMAIL_PROVIDER_API_KEY is missing, email skipped", {
      ownerEmail,
      orderId: order?.id
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
      subject: `New COD order - ${order?.order_number || order?.id || "Ba2i3"}`,
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
