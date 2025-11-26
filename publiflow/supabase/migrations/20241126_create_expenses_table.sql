-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Equipamento', 'Transporte', 'Software', 'Outros')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can only see their own expenses
CREATE POLICY "Users can view their own expenses"
ON expenses FOR SELECT
USING (auth.uid() = user_id);

-- Create Policy: Users can insert their own expenses
CREATE POLICY "Users can insert their own expenses"
ON expenses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create Policy: Users can update their own expenses
CREATE POLICY "Users can update their own expenses"
ON expenses FOR UPDATE
USING (auth.uid() = user_id);

-- Create Policy: Users can delete their own expenses
CREATE POLICY "Users can delete their own expenses"
ON expenses FOR DELETE
USING (auth.uid() = user_id);
