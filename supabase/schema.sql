-- Aman Safar: Women's Safety & Emergency Alert Application
-- PostgreSQL / Supabase Schema with Row Level Security (RLS)

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Emergency Contacts Table
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SOS Alerts Table
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_address TEXT,
  maps_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- 4. Live Location Sessions Table
CREATE TABLE IF NOT EXISTS public.live_location_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. Safety Check-Ins Table
CREATE TABLE IF NOT EXISTS public.safety_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  contact_id UUID REFERENCES public.emergency_contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  note TEXT,
  expected_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'safe', 'missed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Unsafe Place Reports Table
CREATE TABLE IF NOT EXISTS public.unsafe_place_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  location_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('poor_lighting', 'harassment_concern', 'isolated_area', 'road_issue', 'other')),
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_anonymous BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Safety Tips Table
CREATE TABLE IF NOT EXISTS public.safety_tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Contact & Feedback Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_location_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unsafe_place_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile or admin can view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Emergency Contacts Policies
CREATE POLICY "Users can manage own contacts"
  ON public.emergency_contacts FOR ALL
  USING (auth.uid() = user_id);

-- SOS Alerts Policies
CREATE POLICY "Users can view and manage own SOS alerts"
  ON public.sos_alerts FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- Live Location Sessions Policies
CREATE POLICY "Users can manage own live location sessions"
  ON public.live_location_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active session via token"
  ON public.live_location_sessions FOR SELECT
  USING (is_active = true AND expires_at > now());

-- Safety Check-Ins Policies
CREATE POLICY "Users can manage own check-ins"
  ON public.safety_checkins FOR ALL
  USING (auth.uid() = user_id);

-- Unsafe Place Reports Policies
CREATE POLICY "Public can view approved reports"
  ON public.unsafe_place_reports FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit reports"
  ON public.unsafe_place_reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update reports"
  ON public.unsafe_place_reports FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete reports"
  ON public.unsafe_place_reports FOR DELETE
  USING (public.is_admin());

-- Safety Tips Policies
CREATE POLICY "Anyone can view published safety tips"
  ON public.safety_tips FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage safety tips"
  ON public.safety_tips FOR ALL
  USING (public.is_admin());

-- Contact Messages Policies
CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage contact messages"
  ON public.contact_messages FOR ALL
  USING (public.is_admin());
