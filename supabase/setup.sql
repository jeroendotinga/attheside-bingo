-- =============================================================
-- At The Side Bingo - Complete Database Setup
-- Run this in your new Supabase project's SQL Editor
-- =============================================================

-- 1. Registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL,
  email TEXT NOT NULL,
  telefoon TEXT NOT NULL,
  aantal_kaarten INTEGER NOT NULL CHECK (aantal_kaarten >= 1 AND aantal_kaarten <= 10),
  totaal_prijs DECIMAL(10,2) NOT NULL,
  betaald BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register"
ON public.registrations FOR INSERT WITH CHECK (true);

CREATE INDEX idx_registrations_created_at ON public.registrations(created_at);

-- 2. Admin users table
CREATE TABLE public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can check own admin status"
ON public.admin_users FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "No client-side admin creation"
ON public.admin_users FOR INSERT WITH CHECK (false);

CREATE POLICY "No client-side admin updates"
ON public.admin_users FOR UPDATE USING (false);

CREATE POLICY "No client-side admin deletion"
ON public.admin_users FOR DELETE USING (false);

-- 3. Admin-only policies on registrations
CREATE POLICY "Only admins can view registrations"
ON public.registrations FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can delete registrations"
ON public.registrations FOR DELETE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update registrations"
ON public.registrations FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- 4. Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location_name TEXT NOT NULL,
  location_address TEXT NOT NULL,
  location_city TEXT NOT NULL,
  price_per_ticket NUMERIC NOT NULL DEFAULT 20,
  max_tickets INTEGER,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active events"
ON public.events FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage events"
ON public.events FOR ALL
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- 5. Add event_id to registrations
ALTER TABLE public.registrations
ADD COLUMN event_id UUID REFERENCES public.events(id);

-- 6. Site content table
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_html TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content"
ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

-- 7. Functions
CREATE OR REPLACE FUNCTION public.get_tickets_sold()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(aantal_kaarten), 0)::integer FROM public.registrations;
$$;

CREATE OR REPLACE FUNCTION public.get_tickets_sold_for_event(event_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(aantal_kaarten), 0)::INTEGER
  FROM public.registrations
  WHERE event_id = event_uuid;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 8. Triggers
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Default content
INSERT INTO public.site_content (content_key, content_html)
VALUES ('homepage_intro', '<p>Vergeet stilzitten. Vergeet fluisteren. Vergeet "B ". Bij De Grote Bingo Sing-Along-Show draait alles om meezingen, meedansen en meegenieten.</p><p>In plaats van cijfertjes hoor je hits. Grote hits. Guilty pleasures. Keiharde meezingers. Van I Wanna Dance With Somebody tot Unwritten en natuurlijk Sweet Caroline — jíj zingt, danst én streept ondertussen je bingo-kaart af. Serieus spel? Absoluut niet.</p><p>Serieus leuk? 🎤 Kom met je vrienden, vriendinnen, collega''s of complete vrijgezellenbende en bereid je voor op een avond vol muziek, chaos, interactie en prijzen waar je blij van wordt.</p><p>Perfect voor kroegen, festivals, bedrijfsfeesten en iedereen die een onvergetelijke avond wil.</p>');

INSERT INTO public.events (title, event_date, location_name, location_address, location_city, price_per_ticket, max_tickets, is_active)
VALUES ('De Grote Bingo Sing a Long Show', '2026-04-10 20:00:00+02', 'Wapen van Diemen', 'Ouderkerkerlaan 8', '1112 BE Diemen', 20, 100, true);

-- =============================================================
-- DONE! Now create an admin user:
-- 1. Go to Authentication > Users > Add User (email + password)
-- 2. Copy the user UUID and run:
--    INSERT INTO public.admin_users (user_id) VALUES ('ce14d27c-b968-4c99-85d1-10fa5f25d856');
-- =============================================================
