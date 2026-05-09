import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function pingBucket() {
  console.log('--- DIRECT BUCKET PING ---');
  
  // Try to list files in 'assets' - this works with Anon key if bucket is public
  const { data, error } = await supabase.storage.from('assets').list('', { limit: 1 });

  if (error) {
    console.error('❌ BUCKET ERROR:', error.message);
    if (error.message.includes('not found')) {
      console.log('Suggestion: Double check the name is exactly "assets"');
    }
  } else {
    console.log('✅ SUCCESS: "assets" bucket is reachable and active!');
  }
}

pingBucket();
