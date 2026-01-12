-- Drop the problematic self-referencing policy
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;

-- Create a simpler policy that allows authenticated users to check if they're in the table
CREATE POLICY "Users can check own admin status"
ON public.admin_users
FOR SELECT
USING (auth.uid() = user_id);