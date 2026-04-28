import { Client } from 'pg';

const connectionString = 'postgres://postgres.navwagghjtiokeatqjdu:RYavEnp79OazxcY7@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require';

async function setup() {
  const client = new Client({ connectionString });
  await client.connect();

  const sql = `
    -- Allow public read on storage.objects for the media bucket
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read media') THEN
        CREATE POLICY "Public read media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
      END IF;
    END $$;

    -- Allow authenticated users to upload to media bucket
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth upload media') THEN
        CREATE POLICY "Auth upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
      END IF;
    END $$;

    -- Allow authenticated users to update files in media bucket
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth update media') THEN
        CREATE POLICY "Auth update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');
      END IF;
    END $$;

    -- Allow authenticated users to delete files from media bucket
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth delete media') THEN
        CREATE POLICY "Auth delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');
      END IF;
    END $$;
  `;

  try {
    await client.query(sql);
    console.log('Successfully applied storage policies.');
  } catch (err) {
    console.error('Error applying policies:', err);
  } finally {
    await client.end();
  }
}

setup();
