-- ============================================================
-- Sift — Seed Categories
-- Migration: 00002_seed_categories.sql
-- ============================================================

-- ============================================================
-- TOP-LEVEL CONSUMER CATEGORIES
-- IDs: 10000000-0000-0000-0000-000000000001 through ...012
-- ============================================================
INSERT INTO public.categories (id, parent_id, name, slug, icon, type, level, description) VALUES
  ('10000000-0000-0000-0000-000000000001', NULL, 'Groceries',     'groceries',     'ShoppingCart',  'consumer', 0, 'Supermarkets, grocery stores, and food markets'),
  ('10000000-0000-0000-0000-000000000002', NULL, 'Dining',        'dining',        'UtensilsCrossed','consumer', 0, 'Restaurants, cafes, takeout, and food delivery'),
  ('10000000-0000-0000-0000-000000000003', NULL, 'Transportation','transportation','Car',           'consumer', 0, 'All forms of travel and transport'),
  ('10000000-0000-0000-0000-000000000004', NULL, 'Shopping',      'shopping',      'ShoppingBag',   'consumer', 0, 'Retail purchases and online shopping'),
  ('10000000-0000-0000-0000-000000000005', NULL, 'Health',        'health',        'Heart',         'consumer', 0, 'Medical, pharmacy, fitness, and wellness'),
  ('10000000-0000-0000-0000-000000000006', NULL, 'Home',          'home',          'Home',          'consumer', 0, 'Home improvement, furniture, and utilities'),
  ('10000000-0000-0000-0000-000000000007', NULL, 'Entertainment', 'entertainment', 'Tv',            'consumer', 0, 'Streaming, events, hobbies, and recreation'),
  ('10000000-0000-0000-0000-000000000008', NULL, 'Office',        'office',        'Briefcase',     'consumer', 0, 'Office supplies, software, and work expenses'),
  ('10000000-0000-0000-0000-000000000009', NULL, 'Personal Care', 'personal-care', 'Smile',         'consumer', 0, 'Beauty, grooming, and personal hygiene'),
  ('10000000-0000-0000-0000-000000000010', NULL, 'Kids & Toys',   'kids-and-toys', 'Baby',          'consumer', 0, 'Children''s products, toys, and activities'),
  ('10000000-0000-0000-0000-000000000011', NULL, 'Pets',          'pets',          'PawPrint',      'consumer', 0, 'Pet food, supplies, vet, and grooming'),
  ('10000000-0000-0000-0000-000000000012', NULL, 'Other',         'other',         'MoreHorizontal','consumer', 0, 'Uncategorized and miscellaneous expenses');

-- ============================================================
-- SUBCATEGORIES: Groceries (parent: ...001)
-- ============================================================
INSERT INTO public.categories (id, parent_id, name, slug, icon, type, level, description) VALUES
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Produce',         'groceries-produce',    'Leaf',        'consumer', 1, 'Fresh fruits and vegetables'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Meat & Seafood',  'groceries-meat',       'Beef',        'consumer', 1, 'Fresh and frozen meat, poultry, and seafood'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Dairy & Eggs',    'groceries-dairy',      'Milk',        'consumer', 1, 'Milk, cheese, yogurt, and eggs'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Bakery',          'groceries-bakery',     'Croissant',   'consumer', 1, 'Bread, pastries, and baked goods'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Beverages',       'groceries-beverages',  'Coffee',      'consumer', 1, 'Drinks, juices, and non-alcoholic beverages'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Snacks',          'groceries-snacks',     'Cookie',      'consumer', 1, 'Chips, crackers, candy, and snack foods'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Frozen',          'groceries-frozen',     'Snowflake',   'consumer', 1, 'Frozen meals, vegetables, and desserts'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Pantry',          'groceries-pantry',     'Package',     'consumer', 1, 'Canned goods, dry goods, and staples'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Household',       'groceries-household',  'Trash2',      'consumer', 1, 'Cleaning supplies and household items'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000001', 'Alcohol',         'groceries-alcohol',    'Wine',        'consumer', 1, 'Beer, wine, and spirits');

-- ============================================================
-- SUBCATEGORIES: Transportation (parent: ...003)
-- ============================================================
INSERT INTO public.categories (id, parent_id, name, slug, icon, type, level, description) VALUES
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000003', 'Fuel',           'transportation-fuel',    'Fuel',        'consumer', 1, 'Gas stations and fuel purchases'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000003', 'Rideshare',      'transportation-rideshare','Navigation',  'consumer', 1, 'Uber, Lyft, and other rideshare services'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000003', 'Public Transit', 'transportation-transit', 'Train',       'consumer', 1, 'Bus, subway, rail, and ferry'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000003', 'Parking',        'transportation-parking', 'ParkingCircle','consumer', 1, 'Parking lots, garages, and meters'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000003', 'Car Maintenance','transportation-car-maint','Wrench',      'consumer', 1, 'Repairs, oil changes, and auto services');

-- ============================================================
-- SUBCATEGORIES: Shopping (parent: ...004)
-- ============================================================
INSERT INTO public.categories (id, parent_id, name, slug, icon, type, level, description) VALUES
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000004', 'Clothing',         'shopping-clothing',   'Shirt',       'consumer', 1, 'Apparel, shoes, and accessories'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000004', 'Electronics',      'shopping-electronics','Laptop',      'consumer', 1, 'Computers, phones, and gadgets'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000004', 'Books & Media',    'shopping-books',      'BookOpen',    'consumer', 1, 'Books, music, movies, and digital media'),
  (uuid_generate_v4(), '10000000-0000-0000-0000-000000000004', 'Sports & Outdoors','shopping-sports',     'Dumbbell',    'consumer', 1, 'Sports equipment and outdoor gear');

-- ============================================================
-- IRS SCHEDULE C TAX CATEGORIES
-- IDs: 20000000-0000-0000-0000-000000000001 through ...010
-- ============================================================
INSERT INTO public.categories (id, parent_id, name, slug, icon, type, level, description) VALUES
  ('20000000-0000-0000-0000-000000000001', NULL, 'Advertising',      'tax-advertising',      'Megaphone',    'tax', 0, 'Schedule C Line 8 — advertising and marketing costs'),
  ('20000000-0000-0000-0000-000000000002', NULL, 'Car & Truck',      'tax-car-truck',        'Truck',        'tax', 0, 'Schedule C Line 9 — vehicle expenses for business use'),
  ('20000000-0000-0000-0000-000000000003', NULL, 'Contract Labor',   'tax-contract-labor',   'Users',        'tax', 0, 'Schedule C Line 11 — payments to contractors and freelancers'),
  ('20000000-0000-0000-0000-000000000004', NULL, 'Insurance',        'tax-insurance',        'Shield',       'tax', 0, 'Schedule C Line 15 — business insurance premiums'),
  ('20000000-0000-0000-0000-000000000005', NULL, 'Office Expense',   'tax-office-expense',   'Monitor',      'tax', 0, 'Schedule C Line 18 — general office expenses'),
  ('20000000-0000-0000-0000-000000000006', NULL, 'Supplies',         'tax-supplies',         'Package',      'tax', 0, 'Schedule C Line 22 — business supplies and materials'),
  ('20000000-0000-0000-0000-000000000007', NULL, 'Travel',           'tax-travel',           'Plane',        'tax', 0, 'Schedule C Line 24a — business travel expenses'),
  ('20000000-0000-0000-0000-000000000008', NULL, 'Meals',            'tax-meals',            'Utensils',     'tax', 0, 'Schedule C Line 24b — business meals (50% deductible)'),
  ('20000000-0000-0000-0000-000000000009', NULL, 'Utilities',        'tax-utilities',        'Zap',          'tax', 0, 'Schedule C Line 25 — utilities for business premises'),
  ('20000000-0000-0000-0000-000000000010', NULL, 'Other Expenses',   'tax-other-expenses',   'MoreHorizontal','tax', 0, 'Schedule C Line 48 — other ordinary and necessary business expenses');
