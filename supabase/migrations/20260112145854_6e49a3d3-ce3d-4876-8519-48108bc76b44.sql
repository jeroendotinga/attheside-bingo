-- Create events table for managing multiple events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location_name TEXT NOT NULL,
  location_address TEXT NOT NULL,
  location_city TEXT NOT NULL,
  price_per_ticket NUMERIC NOT NULL DEFAULT 20,
  max_tickets INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_content table for editable homepage content
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL UNIQUE,
  content_html TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add event_id to registrations table
ALTER TABLE public.registrations 
ADD COLUMN event_id UUID REFERENCES public.events(id);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public can view active events
CREATE POLICY "Anyone can view active events"
ON public.events
FOR SELECT
USING (is_active = true);

-- Admins can manage events (full access via admin_users check)
CREATE POLICY "Admins can manage events"
ON public.events
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Enable RLS on site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can view site content
CREATE POLICY "Anyone can view site content"
ON public.site_content
FOR SELECT
USING (true);

-- Admins can manage site content
CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Insert default site content for homepage intro
INSERT INTO public.site_content (content_key, content_html)
VALUES ('homepage_intro', '<p>Vergeet stilzitten. Vergeet fluisteren. Vergeet "B ". Bij De Grote Bingo Sing-Along-Show draait alles om meezingen, meedansen en meegenieten.</p><p>In plaats van cijfertjes hoor je hits. Grote hits. Guilty pleasures. Keiharde meezingers. Van I Wanna Dance With Somebody tot Unwritten en natuurlijk Sweet Caroline — jíj zingt, danst én streept ondertussen je bingo-kaart af. Serieus spel? Absoluut niet.</p><p>Serieus leuk? 🎤 Kom met je vrienden, vriendinnen, collega''s of complete vrijgezellenbende en bereid je voor op een avond vol muziek, chaos, interactie en prijzen waar je blij van wordt.</p><p>Perfect voor kroegen, festivals, bedrijfsfeesten en iedereen die een onvergetelijke avond wil.</p>');

-- Insert first event (10 April 2026)
INSERT INTO public.events (title, event_date, location_name, location_address, location_city, price_per_ticket, max_tickets, is_active)
VALUES ('De Grote Bingo Sing a Long Show', '2026-04-10 20:00:00+02', 'Wapen van Diemen', 'Ouderkerkerlaan 8', '1112 BE Diemen', 20, 100, true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get tickets sold per event
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