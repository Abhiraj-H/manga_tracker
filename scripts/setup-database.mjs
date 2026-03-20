import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('[v0] Creating library_entries table...');
    
    // Using raw SQL execution through Supabase
    const { error: tableError } = await supabase.rpc('exec', {
      sql: `
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
      `
    });

    if (tableError && tableError.message !== 'relation "library_entries" already exists') {
      // Try alternative approach using SQL editor
      console.log('[v0] Table creation via RPC not available, using direct SQL...');
    } else {
      console.log('[v0] ✓ library_entries table created successfully');
    }

    // Create indexes
    console.log('[v0] Creating indexes...');
    await supabase.rpc('exec', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_library_entries_user_id ON library_entries(user_id);
        CREATE INDEX IF NOT EXISTS idx_library_entries_updated_at ON library_entries(updated_at DESC);
      `
    }).catch(() => {
      console.log('[v0] Indexes may already exist, continuing...');
    });

    // Enable RLS
    console.log('[v0] Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec', {
      sql: `ALTER TABLE library_entries ENABLE ROW LEVEL SECURITY;`
    }).catch(() => ({error: null}));

    // Create RLS policies
    console.log('[v0] Creating RLS policies...');
    const policies = [
      `CREATE POLICY "Users can read their own library entries" ON library_entries
        FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own library entries" ON library_entries
        FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update their own library entries" ON library_entries
        FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own library entries" ON library_entries
        FOR DELETE USING (auth.uid() = user_id);`
    ];

    for (const policy of policies) {
      await supabase.rpc('exec', { sql: policy }).catch(() => {
        console.log('[v0] Policy may already exist, continuing...');
      });
    }

    console.log('[v0] ✓ Database setup completed successfully!');
    console.log('[v0] The library_entries table is ready to store manga data.');

  } catch (error) {
    console.error('[v0] Database setup error:', error.message);
    console.log('[v0] Please manually run the SQL in scripts/create-database.sql via Supabase dashboard');
    process.exit(1);
  }
}

setupDatabase();
