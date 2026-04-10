-- Migration: UX fixes — tracking, traceability, stock notifications
-- Corresponds to P1/P2 UX audit fixes applied 2026-04

-- ============ P1: Shipment tracking fields ============
-- Added to orders table so Admin can fill in carrier + tracking number
-- when marking an order as shipped. MyOrders page reads these to show
-- a live tracking link to the customer.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS carrier TEXT;

COMMENT ON COLUMN public.orders.tracking_number IS 'Carrier tracking number, set by admin when status → shipped';
COMMENT ON COLUMN public.orders.carrier IS 'Carrier name e.g. NZ Post, DHL, Courier Post';

-- ============ P2: Traceability link per order item ============
-- Stores the fiber batch code at the time of purchase so customers
-- can trace their specific product even if batch data changes later.

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS batch_code TEXT;

COMMENT ON COLUMN public.order_items.batch_code IS 'Snapshot of fiber_batches.batch_code at purchase time for traceability';

-- ============ P1: Out-of-stock notifications ============
-- Customers can leave their email when a product is out of stock.
-- When admin restocks, a batch email job reads this table.

CREATE TABLE IF NOT EXISTS public.stock_notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notified_at TIMESTAMPTZ,
  UNIQUE(product_id, email)
);

ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;

-- Anyone (including guests) can subscribe
CREATE POLICY "Anyone can subscribe to stock notifications"
  ON public.stock_notifications FOR INSERT
  WITH CHECK (length(email) > 3);

-- Only admins can view and manage
CREATE POLICY "Admins can manage stock notifications"
  ON public.stock_notifications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_stock_notif_product
  ON public.stock_notifications(product_id)
  WHERE notified_at IS NULL;
