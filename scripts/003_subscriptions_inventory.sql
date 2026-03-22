-- Subscription + address + activity + inventory tables (Navsari only)

-- Helper to identify admin from phone OTP auth (E.164)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.jwt() ->> 'phone', '') = '+919537781635';
$$;

-- User profile / address (required for subscription)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_full TEXT NOT NULL,
  pincode TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Navsari',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One subscription per user (daily liters)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  liters_per_day DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused')),
  pause_until DATE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin-managed daily inventory (liters)
CREATE TABLE IF NOT EXISTS public.inventory_days (
  day DATE PRIMARY KEY,
  total_liters DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity audit log (visible to admin)
CREATE TABLE IF NOT EXISTS public.activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles: user can select own" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "profiles: user can upsert own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles: user can update own" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles: user can delete own" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "subscriptions: user can select own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "subscriptions: user can upsert own" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions: user can update own" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "subscriptions: user can delete own" ON public.subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Inventory policies (admin only)
CREATE POLICY "inventory: admin can select" ON public.inventory_days
  FOR SELECT USING (public.is_admin());
CREATE POLICY "inventory: admin can write" ON public.inventory_days
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Activity policies
CREATE POLICY "activity: user can insert own" ON public.activity_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activity: user can select own; admin all" ON public.activity_events
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

