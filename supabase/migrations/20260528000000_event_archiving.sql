-- Index for efficient date-based filtering of events
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events (event_date);
CREATE INDEX IF NOT EXISTS idx_events_active_date ON public.events (is_active, event_date);

-- Prevent new registrations for past events at the database level
CREATE OR REPLACE FUNCTION public.check_event_not_past()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.events
    WHERE id = NEW.event_id
      AND event_date < NOW()
  ) THEN
    RAISE EXCEPTION 'Registrations are not allowed for past events';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_no_past_event_registration
  BEFORE INSERT ON public.registrations
  FOR EACH ROW
  WHEN (NEW.event_id IS NOT NULL)
  EXECUTE FUNCTION public.check_event_not_past();
