# PERFECT-STORE

Ba2i3 storefront:
- `client/`: React + Vite frontend
- `api/`: Vercel serverless APIs for catalog, COD orders, admin auth, admin orders, and contact flows
- `server/`: local legacy backend (optional)

## Checkout Model

The storefront is now **COD only**:
- payment method: `COD` / `Cash on Delivery`
- no PayPal flow
- no card fields
- no online payment gateway UI
- orders are created directly from checkout and stored as COD orders

Flow:
1. Frontend sends shipping + cart data to `POST /api/catalog`
2. Backend creates a COD order record
3. Backend stores the order and optionally emails the owner
4. Customer sees order confirmation with COD as the payment method

## Admin

- Admin URL: `/admin`
- Not linked publicly in navbar
- Auth uses env credentials (`ADMIN_USER`, `ADMIN_PASS`) via secure cookie session
- Orders endpoint: `/api/admin?endpoint=orders` (requires admin session)
- Products endpoint: `/api/admin/products` (requires admin session)
- Public catalog endpoint: `/api/catalog`

## Vercel Environment Variables

Required:
- `ADMIN_USER`
- `ADMIN_PASS`

Optional:
- `EMAIL_PROVIDER_API_KEY`
- `OWNER_EMAIL` (default: `ba2i3.contact@gmail.com`)
- `EMAIL_FROM` (default: `Ba2i3 <onboarding@resend.dev>`)
- `ORDER_STORE_PATH` (custom local JSON store path)
- `PRODUCT_STORE_PATH` (custom local JSON product store path)
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` (recommended for persistent orders/products on Vercel)

## Email

When `EMAIL_PROVIDER_API_KEY` is configured, the backend sends new COD order details to `OWNER_EMAIL`.

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
