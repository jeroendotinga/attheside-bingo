-- Add explicit restrictive policies on admin_users table
-- These ensure no client-side modifications are possible

-- Deny all client-side inserts (admins must be added via SQL/dashboard)
CREATE POLICY "No client-side admin creation"
ON public.admin_users
FOR INSERT
WITH CHECK (false);

-- Deny all client-side updates
CREATE POLICY "No client-side admin updates"
ON public.admin_users
FOR UPDATE
USING (false);

-- Deny all client-side deletes
CREATE POLICY "No client-side admin deletion"
ON public.admin_users
FOR DELETE
USING (false);