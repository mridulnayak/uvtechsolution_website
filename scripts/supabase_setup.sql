-- UV Tech Solutions - Supabase Setup Script
-- Run these commands in your Supabase SQL Editor to prepare the database for the Heartbeat system.

-- 1. Create the installations table (or update it)
ALTER TABLE installations 
ADD COLUMN IF NOT EXISTS product_type text CHECK (product_type IN ('Hoteleo', 'Restpro', 'Retail', 'Unknown')),
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Healthy',
ADD COLUMN IF NOT EXISTS error_code text,
ADD COLUMN IF NOT EXISTS last_sync_details jsonb;

-- 2. Add an upsert constraint (if not already present)
-- This ensures client_id + product_type is unique.
-- NOTE: If you already have data, ensure no duplicates exist before applying this.
-- If the table is fresh, this constraint allows the upsert logic in the API to work.
-- ALTER TABLE installations ADD CONSTRAINT unique_installation UNIQUE (client_id, product_type);

-- 3. Enable RLS (Optional - adjustment for admin dashboard)
-- Ensure your admin dashboard has access to read this table.
-- ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read for heartbeats" ON installations FOR SELECT USING (true);

-- 4. Enable Anonymous Writes (FIX FOR RLS ERROR)
-- Since the API uses the anon key when no service role is present,
-- you MUST run these to allow the heartbeats to UPSERT their data.

CREATE POLICY "Allow anonymous inserts for heartbeats"
ON installations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow anonymous updates for heartbeats"
ON installations FOR UPDATE 
USING (true)
WITH CHECK (true);
