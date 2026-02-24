# PERFECT-STORE

Sleepora storefront:
- `client/`: React + Vite frontend
- `api/`: Vercel serverless APIs (PayPal checkout, admin auth, admin orders, contact)
- `server/`: local legacy backend for file-based product editing (`/api/local-admin/*`)

## Payment

Stripe has been removed.

Payments now use **PayPal Smart Buttons**:
- customer can pay with PayPal or card via PayPal
- order is created **only after PayPal capture status = `COMPLETED`**
- no order is created before successful payment

Flow:
1. Frontend requests `/api/paypal-create-order`
2. PayPal button opens checkout
3. Frontend calls `/api/paypal-capture-order` after approval
4. Backend stores paid order + sends owner email

## Admin

- Admin URL: `/admin`
- Not linked publicly in navbar
- Auth uses env credentials (`ADMIN_USER`, `ADMIN_PASS`) via secure cookie session
- Paid orders endpoint: `/api/admin/orders` (requires admin session)

## Vercel Environment Variables

Required:
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `ADMIN_USER`
- `ADMIN_PASS`
- `EMAIL_PROVIDER_API_KEY`
- `OWNER_EMAIL=sleepora.contact@gmail.com`

Optional:
- `PAYPAL_CURRENCY` (default: `USD`)
- `PAYPAL_ENV` (`sandbox` or `live`, default: `live`)
- `PAYPAL_API_BASE` (override API base URL)
- `EMAIL_FROM` (default: `Sleepora <onboarding@resend.dev>`)
- `SITE_URL` (used for PayPal return/cancel URL generation)
- `ORDER_STORE_PATH` (custom local JSON store path)
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` (recommended for persistent orders on Vercel)

## Email

After successful payment capture, the backend sends order details to `OWNER_EMAIL` using Resend API format and `EMAIL_PROVIDER_API_KEY`.

## Local Development

Frontend:
```bash
cd client
npm install
npm run dev
```

Optional local product admin backend:
```bash
cd server
npm install
npm run dev
```

Build:
```bash
cd client
npm run build
```
