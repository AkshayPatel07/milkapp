-- Custom auth (username + password) + OTP registration + subscription/inventory/activity
-- These tables are intended to be accessed via server routes using the Supabase service role key.

CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.app_users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  address_full TEXT NOT NULL,
  pincode TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Navsari',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_subscriptions (
  user_id UUID PRIMARY KEY REFERENCES public.app_users(id) ON DELETE CASCADE,
  liters_per_day DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused')),
  pause_until DATE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_inventory_days (
  day DATE PRIMARY KEY,
  total_liters DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_activity_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL REFERENCES public.app_users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_otp_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consumed_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS app_otp_requests_phone_idx ON public.app_otp_requests(phone);

-- Lock down tables from anon/authenticated: service role bypasses RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_inventory_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_otp_requests ENABLE ROW LEVEL SECURITY;

