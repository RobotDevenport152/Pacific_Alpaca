-- Migration: Update product images with real photos
-- Run after products are seeded. Uses slug to identify rows.

-- ============ Hero / primary images ============
UPDATE public.products SET
  image  = '/images/product-classic-duvet.jpg',
  images = ARRAY['/images/product-classic-duvet.jpg']
WHERE slug = 'duvet-classic';

UPDATE public.products SET
  image  = '/images/product-luxury-duvet.jpg',
  images = ARRAY['/images/product-luxury-duvet.jpg']
WHERE slug = 'duvet-luxury';

UPDATE public.products SET
  image  = '/images/product-premium-duvet.jpg',
  images = ARRAY['/images/product-premium-duvet.jpg']
WHERE slug = 'duvet-premium';

UPDATE public.products SET
  image  = '/images/product-newborn-blanket.jpg',
  images = ARRAY['/images/product-newborn-blanket.jpg']
WHERE slug = 'duvet-newborn';

-- Coat — 5 gallery images (main product + detail + 3 lifestyle)
UPDATE public.products SET
  image  = '/images/product-coat-main.jpg',
  images = ARRAY[
    '/images/product-coat-main.jpg',
    '/images/product-coat-detail.jpg',
    '/images/product-coat-women.jpg',
    '/images/product-coat-men.jpg',
    '/images/product-coat-robe.jpg'
  ]
WHERE slug = 'coat-classic';

-- Vest — 2 gallery images
UPDATE public.products SET
  image  = '/images/product-vest-x6.jpg',
  images = ARRAY[
    '/images/product-vest-x6.jpg',
    '/images/product-vest-x6-front.jpg'
  ]
WHERE slug = 'vest-x6';

-- Sweater — 2 gallery images (product + NZ farm lifestyle)
UPDATE public.products SET
  image  = '/images/product-sweater.jpg',
  images = ARRAY[
    '/images/product-sweater.jpg',
    '/images/product-sweater-farm.jpg'
  ]
WHERE slug = 'sweater-alpaca';

-- Scarf — Maori pattern specific image
UPDATE public.products SET
  image  = '/images/product-scarf-maori.jpg',
  images = ARRAY['/images/product-scarf-maori.jpg']
WHERE slug = 'scarf-alpaca';
