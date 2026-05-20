-- Supabase Schema for Admin User Management

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create a policy to allow service role to manage admin users (optional for RLS)
-- This is only needed if you enable Row Level Security (RLS) on the table

-- Enable RLS on admin_users table (optional)
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow service role to read all admin users
-- CREATE POLICY "Service role can read admin users"
--   ON admin_users
--   FOR SELECT
--   TO service_role
--   USING (true);

-- Allow service role to insert admin users
-- CREATE POLICY "Service role can insert admin users"
--   ON admin_users
--   FOR INSERT
--   TO service_role
--   WITH CHECK (true);

-- Allow service role to delete admin users
-- CREATE POLICY "Service role can delete admin users"
--   ON admin_users
--   FOR DELETE
--   TO service_role
--   USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_users_updated_at_trigger
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert initial admin user (replace with your email)
-- INSERT INTO admin_users (email, role) VALUES ('your-email@example.com', 'admin');
