-- Add subscription columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled')),
ADD COLUMN IF NOT EXISTS trial_ends_at timestamp with time zone DEFAULT (now() + interval '7 days');

-- Update existing users to ensure they have the default values (Postgres usually handles this on column addition with default, but good to be sure)
UPDATE profiles 
SET trial_ends_at = (now() + interval '7 days') 
WHERE trial_ends_at IS NULL;

UPDATE profiles
SET subscription_status = 'trial'
WHERE subscription_status IS NULL;
