-- Migration: Webhook support + RLS consistency fixes
-- Addresses P0 (webhook stock decrement) and P1 (RLS test mismatch)

-- ============ ATOMIC STOCK DECREMENT (required by stripe-webhook) ============
-- This function is called by the webhook after payment confirmation.
-- Using a function ensures atomicity and prevents race conditions when
-- multiple webhook retries fire concurrently.
CREATE OR REPLACE FUNCTION public.decrement_product_stock(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - p_quantity),
      updated_at = now()
  WHERE id = p_product_id;
END;
$$;

-- ============ FIX: fiber_batches RLS (P1 — RLS vs test mismatch) ============
-- The original policy "Batches are viewable by everyone" conflicts with:
-- - e2e/rls.spec.ts: "regular user cannot read other users fiber_batches"
-- - Business intent: growers should only see their own batches; public sees
--   anonymised traceability data via a separate view.
--
-- Resolution: Grower-owned batches are private; public traceability
-- reads go through a view that exposes only non-PII batch data.

DROP POLICY IF EXISTS "Batches are viewable by everyone" ON public.fiber_batches;

-- Growers can see their own batches
CREATE POLICY "Growers can view own batches"
  ON public.fiber_batches FOR SELECT
  USING (grower_user_id = auth.uid());

-- Admins can see and manage all batches
CREATE POLICY "Admins can manage all batches"
  ON public.fiber_batches FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Public traceability: read-only view of non-PII fields only
-- The Traceability page should query this view, not the base table directly
CREATE OR REPLACE VIEW public.public_fiber_batches AS
  SELECT
    batch_code,
    farm_name,
    region,
    shearing_date,
    fiber_grade,
    micron_measurement,
    processing_date,
    product_type,
    manufacturing_date,
    status
    -- grower_name, grower_user_id, payout are intentionally excluded
  FROM public.fiber_batches;

-- Allow public read on the view (no RLS on views — table RLS is the guard)
GRANT SELECT ON public.public_fiber_batches TO anon, authenticated;

-- ============ ORDER STATUS CONSTRAINT ============
-- Add explicit allowed statuses to prevent arbitrary strings
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'payment_failed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));
