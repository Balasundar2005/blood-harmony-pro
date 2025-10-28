-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', ''));
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'patient', 'donor', 'blood_bank');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Blood types enum
CREATE TYPE public.blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Urgency levels enum
CREATE TYPE public.urgency_level AS ENUM ('critical', 'urgent', 'normal');

-- Blood requests table
CREATE TABLE public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  patient_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  hospital_name TEXT NOT NULL,
  blood_type blood_type NOT NULL,
  units_required INTEGER NOT NULL CHECK (units_required > 0),
  location TEXT NOT NULL,
  urgency urgency_level NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

-- Donors table
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  blood_type blood_type NOT NULL,
  weight INTEGER NOT NULL CHECK (weight >= 50),
  location TEXT NOT NULL,
  last_donation_date DATE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Blood banks table
CREATE TABLE public.blood_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blood_banks ENABLE ROW LEVEL SECURITY;

-- Blood inventory table
CREATE TABLE public.blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blood_bank_id UUID REFERENCES public.blood_banks(id) ON DELETE CASCADE NOT NULL,
  blood_type blood_type NOT NULL,
  units_available INTEGER NOT NULL DEFAULT 0 CHECK (units_available >= 0),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blood_bank_id, blood_type)
);

ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for blood_requests
CREATE POLICY "Anyone can view all blood requests"
  ON public.blood_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create blood requests"
  ON public.blood_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blood requests"
  ON public.blood_requests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blood requests"
  ON public.blood_requests FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for donors
CREATE POLICY "Anyone can view all donors"
  ON public.donors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can register as donors"
  ON public.donors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Donors can update their own profile"
  ON public.donors FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Donors can delete their own profile"
  ON public.donors FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for blood_banks
CREATE POLICY "Anyone can view all blood banks"
  ON public.blood_banks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage blood banks"
  ON public.blood_banks FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for blood_inventory
CREATE POLICY "Anyone can view blood inventory"
  ON public.blood_inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Blood banks can manage their own inventory"
  ON public.blood_inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.blood_banks
      WHERE id = blood_bank_id AND user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.blood_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.blood_banks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();