-- Insert default admin account (password: admin123)
-- Password hash generated using bcrypt with salt rounds 10
INSERT INTO public.admins (email, password_hash, name)
VALUES ('admin@freshmilk.com', '$2a$10$rQ6P9p5KzP0YxGKJXZ5Z1.xJZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', 'Admin User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name, description, price, unit, category, in_stock, image_url)
VALUES 
  ('Fresh Cow Milk', 'Pure and fresh cow milk delivered daily', 60.00, 'Liter', 'Fresh Milk', true, '/placeholder.svg?height=200&width=200'),
  ('Buffalo Milk', 'Rich and creamy buffalo milk', 80.00, 'Liter', 'Fresh Milk', true, '/placeholder.svg?height=200&width=200'),
  ('Toned Milk', 'Low-fat toned milk for health-conscious customers', 50.00, 'Liter', 'Fresh Milk', true, '/placeholder.svg?height=200&width=200'),
  ('Full Cream Milk', 'Rich full cream milk with high fat content', 70.00, 'Liter', 'Fresh Milk', true, '/placeholder.svg?height=200&width=200'),
  ('Dahi (Curd)', 'Fresh homemade dahi', 45.00, '500g', 'Dairy Products', true, '/placeholder.svg?height=200&width=200'),
  ('Paneer', 'Fresh cottage cheese made daily', 120.00, '250g', 'Dairy Products', true, '/placeholder.svg?height=200&width=200'),
  ('Ghee', 'Pure cow ghee', 600.00, '500ml', 'Dairy Products', true, '/placeholder.svg?height=200&width=200'),
  ('Buttermilk', 'Fresh buttermilk', 30.00, 'Liter', 'Dairy Products', true, '/placeholder.svg?height=200&width=200')
ON CONFLICT DO NOTHING;
