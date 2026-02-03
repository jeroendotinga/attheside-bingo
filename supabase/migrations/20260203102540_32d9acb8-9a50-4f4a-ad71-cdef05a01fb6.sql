-- Add description column to events table
ALTER TABLE public.events 
ADD COLUMN description text;