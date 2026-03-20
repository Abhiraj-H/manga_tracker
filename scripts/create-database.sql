-- Create library_entries table for storing user's manga library
CREATE TABLE IF NOT EXISTS library_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  manga_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'PLANNING',
  progress INTEGER DEFAULT 0,
  total INTEGER,
  rating INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, manga_id)
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_library_entries_user_id ON library_entries(user_id);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_library_entries_updated_at ON library_entries(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE library_entries ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read only their own entries
CREATE POLICY "Users can read their own library entries" ON library_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own entries
CREATE POLICY "Users can insert their own library entries" ON library_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own entries
CREATE POLICY "Users can update their own library entries" ON library_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to delete their own entries
CREATE POLICY "Users can delete their own library entries" ON library_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_library_entries_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER library_entries_update_timestamp
  BEFORE UPDATE ON library_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_library_entries_timestamp();
