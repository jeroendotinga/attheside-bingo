-- Drop the public SELECT policy
DROP POLICY "Anyone can count registrations" ON public.registrations;

-- Create a database function to get ticket count (safe, returns only count)
CREATE OR REPLACE FUNCTION public.get_tickets_sold()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(aantal_kaarten), 0)::integer FROM public.registrations;
$$;

-- Create SELECT policy for authenticated users only (admin)
CREATE POLICY "Only authenticated users can view registrations" 
ON public.registrations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);