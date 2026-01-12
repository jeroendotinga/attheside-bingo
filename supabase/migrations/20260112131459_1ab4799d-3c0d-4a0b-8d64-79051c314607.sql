-- Add delete policy for authenticated users only (admin)
CREATE POLICY "Authenticated users can delete registrations" 
ON public.registrations 
FOR DELETE 
USING (auth.uid() IS NOT NULL);