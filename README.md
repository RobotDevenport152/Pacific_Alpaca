# Pacific Alpacas

Bilingual (English / Chinese) e-commerce and brand site for alpaca fiber products. **Vite + React + TypeScript** SPA with **Supabase** (Postgres, auth, RLS) and **Stripe** checkout. Supabase Edge Functions implement checkout sessions, Stripe webhooks, and optional AI chat. **Admin** tools cover orders, products, growers, fiber batches, and promos; **grower** roles get batch and credit views.

---

## Prerequisites

- **Node.js** 18+ (recommended)
- **npm** (lockfile: `package-lock.json`)

---

## Getting started

```bash
npm install
cp .env .env.local   # optional: keep secrets out of git; edit values
npm run dev
```

The dev server listens on **http://localhost:8080** by default (`vite.config.ts`).

### Environment

Set these for the client (see `.env` for placeholders):

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon (public) key |
| `VITE_SUPABASE_PROJECT_ID` | Project reference ID |

**Important:** `.env` may document a **legacy vs active Supabase project**. For production, use API keys from the **correct** project in the [Supabase dashboard](https://supabase.com/dashboard) → Project Settings → API.

Edge Functions need secrets configured in Supabase (Stripe keys, `SUPABASE_SERVICE_ROLE_KEY`, webhook signing secret, etc.). After changing functions:

```bash
supabase functions deploy create-checkout
supabase functions deploy stripe-webhook
supabase functions deploy chat
```

---

## Tech stack

| Layer | Technology |
|--------|------------|
| UI | React 18, React Router 6, Tailwind CSS, shadcn/ui (Radix), Framer Motion |
| Data | TanStack React Query |
| Forms | react-hook-form, Zod |
| Backend | Supabase (migrations + Edge Functions) |
| Payments | Stripe (`create-checkout`, `stripe-webhook`) |
| Charts | Recharts (admin) |
| Unit tests | Vitest, Testing Library |
| E2E | Playwright (`e2e/`) |

---

## Project structure

| Path | Contents |
|------|----------|
| `src/` | Pages, components, `AppContext` (locale / theme), Supabase client |
| `supabase/migrations/` | Schema and RLS |
| `supabase/functions/` | `create-checkout`, `stripe-webhook`, `chat` (CORS for hosted domains) |
| `e2e/` | Playwright (shop, checkout, auth, traceability, RLS) |

Main routes are **lazy-loaded** in `src/App.tsx` with a shared loading fallback.

### Routes (overview)

- **Public:** `/`, `/shop`, `/product/:id`, `/compare`, `/traceability`, `/contact`, `/growers-info`, `/wholesale`, `/china`, `/returns`, `/login`, `/register`, `/forgot-password`, `/reset-password`
- **Signed-in:** `/checkout`, `/order-success`, `/my-orders`
- **Grower:** `/grower/batches`, `/grower/credits`
- **Admin:** `/admin`, `/admin/orders`, `/admin/products`, `/admin/growers`, `/admin/fiber-batches`, `/admin/promos`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm test` | Vitest (once) |
| `npm run test:watch` | Vitest watch mode |

**E2E:** `npx playwright test` — set `PLAYWRIGHT_BASE_URL` if not using `http://localhost:8080`.

---

## Documentation

| File | Contents |
|------|----------|
| `PROJECT_SUMMARY.md` | Condensed project overview |
| `BUGFIXES.md` / `BUGFIX_CHANGELOG.md` | QA fixes, CORS, checkout, admin, cart, password reset, deployment notes |

---

## Operations

- Allow **custom domains** (e.g. pacificalpacas.nz) and **Lovable preview URLs** in Edge Function CORS where needed.
- **Stock notification emails** may be a future sprint; confirm against your launch plan.
- Admin revenue/charts need **real orders** to show meaningful data.

---

Built with [Lovable](https://lovable.dev) tooling; align secrets and URLs with your deployment environment.
