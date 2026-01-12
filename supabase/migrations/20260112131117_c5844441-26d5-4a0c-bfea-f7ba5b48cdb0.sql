-- Create registrations table for event signups
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL,
  email TEXT NOT NULL,
  telefoon TEXT NOT NULL,
  aantal_kaarten INTEGER NOT NULL CHECK (aantal_kaarten >= 1 AND aantal_kaarten <= 10),
  totaal_prijs DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public registration form)
CREATE POLICY "Anyone can register" 
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading for counting available tickets (public)
CREATE POLICY "Anyone can count registrations" 
ON public.registrations 
FOR SELECT 
USING (true);

-- Create index for faster counting
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at);