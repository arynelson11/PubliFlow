-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    platform TEXT NOT NULL CHECK (platform IN ('Instagram', 'TikTok', 'YouTube')),
    status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea', 'scripting', 'filming', 'done')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can only see their own ideas
CREATE POLICY "Users can view their own ideas"
ON ideas FOR SELECT
USING (auth.uid() = user_id);

-- Create Policy: Users can insert their own ideas
CREATE POLICY "Users can insert their own ideas"
ON ideas FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create Policy: Users can update their own ideas
CREATE POLICY "Users can update their own ideas"
ON ideas FOR UPDATE
USING (auth.uid() = user_id);

-- Create Policy: Users can delete their own ideas
CREATE POLICY "Users can delete their own ideas"
ON ideas FOR DELETE
USING (auth.uid() = user_id);
