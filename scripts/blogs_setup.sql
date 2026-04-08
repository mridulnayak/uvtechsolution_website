-- UV Tech Solutions - Blog System Setup
-- Run these in your Supabase SQL Editor.

-- CREATE the blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text CHECK (category IN ('Hoteleo', 'Restpro', 'Retail', 'General')) DEFAULT 'General',
  excerpt text,
  content text NOT NULL,
  published_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- ENABLE Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- CREATE Public READ Policy
CREATE POLICY "Allow public read for blogs"
ON blogs FOR SELECT 
USING (true);

-- CREATE UNIQUE index on slug
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs(slug);

-- INSERT a Sample Post for testing (Recommended)
-- INSERT INTO blogs (title, slug, category, excerpt, content) 
-- VALUES ('The Future of Hospitality Tech in Raipur', 'future-hospitality-tech-raipur', 'Hoteleo', 'Discover how Hoteleo is revolutionizing hotel management in Central India.', '# The Future of Hospitality Tech\n\nRaipur is booming, and so are its hotels. But managing them requires precision...\n\n- **Stability**: Offline-first reliability.\n- **Intelligence**: Real-time cloud sync.\n- **Support**: Native team in Chhattisgarh.\n\nMore to come!');
