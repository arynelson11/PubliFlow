-- Migration: Enable public read access for report sharing
-- This allows anonymous users to view deals, partners, and deliverables via the /report route

-- Enable read access for all users on deals table
CREATE POLICY "Enable read access for all users on deals"
ON deals FOR SELECT
USING (true);

-- Enable read access for all users on partners table
CREATE POLICY "Enable read access for all users on partners"
ON partners FOR SELECT
USING (true);

-- Enable read access for all users on deliverables table
CREATE POLICY "Enable read access for all users on deliverables"
ON deliverables FOR SELECT
USING (true);
