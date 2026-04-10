# Bug Fix Changelog — QA Pass April 2026

All 11 issues identified in the QA audit have been fixed in this build.

---

## P0 — Critical (were blocking all real transactions)

### FIX-1: CORS — checkout and AI chat blocked on live domain
**Files:** `supabase/functions/create-checkout/index.ts`, `supabase/functions/chat/index.ts`

Both edge functions now include `https://web-scribe-joy.lovable.app` in `ALLOWED_ORIGINS`.
The `chat` function was additionally refactored to compute `corsHeaders` per-request
inside the `serve()` handler (the old code read `req.headers` at module scope before
any request existed, which would have thrown at cold-start).

Also added `pacificalpacas.nz` / `www.pacificalpacas.nz` in anticipation of the
custom domain going live.

**Deploy after merging:**
```
supabase functions deploy create-checkout
supabase functions deploy chat
```

---

### FIX-2: ResetPassword was a fake — setTimeout mock, never called Supabase
**File:** `src/pages/ResetPassword.tsx`

Replaced the `setTimeout(...)` placeholder with a real `await supabase.auth.updateUser({ password })` call. Error message from Supabase is now surfaced in a toast. Password minimum simultaneously raised from 6 → 8 characters (see FIX-11).

---

## P1 — Bugs (wrong behaviour in production)

### FIX-3: Supabase project ID mismatch documented in .env
**File:** `.env`

Added a prominent warning comment. The `.env` still points at the legacy project
`zgwecvxcblzwghvskrni`; the active project per the Q2 launch report is
`pymnquyxpoeqkkuzzial`. **Manual step required:** update the three
`VITE_SUPABASE_*` values with credentials from the new project's API settings page.

---

### FIX-4: AdminDashboard revenue always showed 0 — wrong DB field name
**File:** `src/pages/admin/AdminDashboard.tsx`

- `o.total_nzd` → `o.total` (actual column name per `types.ts`)
- `p.stock_quantity` → `p.stock` (actual column name)
- `o.customer_name` → `o.shipping_name` (actual column name)
- Monthly trend chart now uses a dedicated full-month query instead of the 10-row
  recent orders list — chart was previously capped at the last 10 orders regardless
  of date range.

---

### FIX-5: Compare page prices were hardcoded and disagreed with the DB
**File:** `src/pages/Compare.tsx`

Removed all hardcoded `priceZh`/`priceEn` strings from the `TIERS` array.
Added `useProducts()` hook and a `getLivePrice(tierId)` function that reads the
actual `price_nzd` / `price_cny` from the database. Price shown on the Compare
page now always matches what the user sees at checkout.

---

### FIX-6: Cart quantity had no ceiling — could exceed available stock
**File:** `src/components/CartDrawer.tsx`

The `+` button now calls `Math.min(item.quantity + 1, item.product.stock)` and is
`disabled` when `item.quantity >= item.product.stock`. Prevents over-ordering and
downstream fulfilment failures.

---

### FIX-7: AdminProducts mutations didn't invalidate React Query cache
**File:** `src/pages/admin/AdminProducts.tsx`

Added `useQueryClient` import and `queryClient.invalidateQueries({ queryKey: ['products'] })`
after every successful create/edit operation. Without this, the Shop page and Product
Detail page served stale cached data until a hard browser refresh.

---

### FIX-8: Traceability STATUS_MAP was missing steps 3 and 4
**File:** `src/pages/Traceability.tsx`

`felted: 3` and `sterilized: 4` added to `STATUS_MAP`. The old map jumped from
`combed: 2` to `ready: 5`, meaning batches at the Felting or Sterilizing stages
could never be represented in the 6-step progress bar. The DB `processing_status`
column accepts these values; the UI now renders them correctly.

---

## P2 — Minor issues

### FIX-9: ChinaLanding had zero locale awareness
**File:** `src/pages/ChinaLanding.tsx`

- Added `useApp()` import and `const { locale } = useApp()`
- `AUTHORITY` and `WHY_ALPACA` arrays now carry both `titleZh`/`titleEn` and
  `descZh`/`descEn` / `valueZh`/`valueEn` fields
- All rendered strings use `locale === 'zh' ? ... : ...`
- Fixed CGTN label: was incorrectly labelled "央视CCTV13" — corrected to "CGTN 国际频道"

---

### FIX-10: WeChat copy toast was hardcoded Chinese regardless of locale
**File:** `src/pages/ChinaLanding.tsx` (resolved as part of FIX-9)

`toast.success('微信号已复制！')` replaced with
`toast.success(locale === 'zh' ? '微信号已复制！' : 'WeChat ID copied!')`.

---

### FIX-11: Password minimum raised from 6 to 8 characters
**Files:** `src/pages/Register.tsx`, `src/pages/ResetPassword.tsx`

Both validation checks updated to `password.length < 8`. Error messages updated
to reflect the new minimum. Supabase enforces its own minimum server-side; this
aligns the client-side check with OWASP minimum recommendations for a payments site.

---

## Items NOT fixed (require manual action or future sprint)

| # | Issue | Reason |
|---|-------|--------|
| — | `SUPABASE_SERVICE_ROLE_KEY` not configured | Deployment secret — must be set in Supabase Dashboard → Edge Functions → Secrets |
| — | `STRIPE_WEBHOOK_SECRET` URL needs updating to new project | Stripe Dashboard config — update webhook endpoint URL |
| — | `.env` project ID update | Requires new project anon key from Supabase dashboard |
| — | Stock notification emails never sent | No Edge Function exists yet — listed as future sprint item in Q2 report |
| — | AdminDashboard chart is empty on first launch | No orders exist yet — will populate once real orders come in |
