# Pacific Alpacas — Project Summary

**Pacific Alpacas** is a bilingual (English / Chinese) e-commerce and brand site for alpaca fiber products. It ships as a **Vite + React + TypeScript** SPA, backed by **Supabase** (Postgres, auth, Row Level Security) and **Stripe** for payments. Edge Functions handle checkout sessions, Stripe webhooks, and an optional AI chat. An **admin** area supports orders, products, growers, fiber batches, and promo codes; **grower** accounts see batch and credit views.

---

## Tech stack

| Layer | Technology |
|--------|------------|
| UI | React 18, React Router 6, Tailwind CSS, shadcn/ui (Radix), Framer Motion |
| Data / cache | TanStack React Query |
| Forms / validation | react-hook-form, Zod |
| Backend | Supabase (client + migrations + Edge Functions) |
| Payments | Stripe (via `create-checkout` + `stripe-webhook` functions) |
| Charts | Recharts (admin dashboard) |
| Unit tests | Vitest, Testing Library |
| E2E | Playwright (`e2e/`) |

Dev server defaults to **port 8080** (`vite.config.ts`).

---

## Repository layout (high level)

- **`src/`** — App entry, pages, components, contexts (`AppContext` for locale/theme), Supabase client
- **`supabase/migrations/`** — Schema and RLS evolution
- **`supabase/functions/`** — `create-checkout`, `stripe-webhook`, `chat` (CORS-aware for hosted domains)
- **`e2e/`** — Playwright specs (shop, checkout, auth, traceability, RLS)

---

## Routes

**Public:** `/` (home), `/shop`, `/product/:id`, `/compare`, `/traceability`, `/contact`, `/growers-info`, `/wholesale`, `/china`, `/returns`, `/login`, `/register`, `/forgot-password`, `/reset-password`

**Authenticated:** `/checkout`, `/order-success`, `/my-orders`

**Grower role:** `/grower/batches`, `/grower/credits`

**Admin role:** `/admin` (dashboard), `/admin/orders`, `/admin/products`, `/admin/growers`, `/admin/fiber-batches`, `/admin/promos`

Heavy routes are **lazy-loaded** in `App.tsx` behind a shared suspense fallback.

---

## Configuration

- **`VITE_SUPABASE_URL`**, **`VITE_SUPABASE_PUBLISHABLE_KEY`**, **`VITE_SUPABASE_PROJECT_ID`** — required for the app to talk to Supabase.
- **`.env`** in this repo documents a **known mismatch**: example values may still point at a legacy Supabase project; production should use the **active** project’s API keys from the Supabase dashboard.
- Edge Functions need appropriate **secrets** in Supabase (e.g. Stripe keys, `SUPABASE_SERVICE_ROLE_KEY`, webhook signing secret). Deploy with `supabase functions deploy <name>` after changes.

---

## Scripts (`package.json`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:watch` | Vitest |

Playwright is a dev dependency; run E2E with `npx playwright test` (set `PLAYWRIGHT_BASE_URL` if not using `http://localhost:8080`).

---

## Documentation in this repo

- **`BUGFIXES.md` / `BUGFIX_CHANGELOG.md`** — QA fixes and deployment notes (CORS, checkout, admin fields, cart stock, password reset, etc.)

---

## Operational notes

- **Custom domains** (e.g. pacificalpacas.nz) and Lovable preview URLs should be allowed in Edge Function CORS where applicable.
- **Stock notification emails** and some email flows may be future work; verify against your launch checklist.
- Admin dashboard charts need **real order data** to show meaningful trends.

---

*Generated as a project overview; align secrets and URLs with your deployment environment.*
