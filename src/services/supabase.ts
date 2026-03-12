import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase URL or Anon Key. Please check your .env file.');
}

// Production fallbacks to ensure live site works even if env vars are missing in dashboard
const DEFAULT_URL = 'https://uydybhioyjdmncvixsoc.supabase.co';
const DEFAULT_KEY = 'sb_publishable_n5zHT7U443Bs7rrwVRra9w_7PzCxxVb';

export const supabase = createClient(
  supabaseUrl || DEFAULT_URL,
  supabaseAnonKey || DEFAULT_KEY
);

export async function recordDownload(platform: string) {
  try {
    const { error } = await supabase
      .from('downloads')
      .insert([{ platform }]);

    if (error) {
      console.warn('Failed to record download:', error);
    }
  } catch (e) {
    console.warn('Error recording download:', e);
  }
}

export async function startTrial(userId: string) {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        status: 'trialing',
        trial_start_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      console.warn('Failed to start trial:', error);
      throw error;
    }
  } catch (e) {
    console.error('Error starting trial:', e);
    throw e;
  }
}

export async function getDownloadStats() {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    // Get weekly count
    const { count: weeklyCount, error: weeklyError } = await supabase
      .from('downloads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfWeek.toISOString());

    // Get total count
    const { count: totalCount, error: totalError } = await supabase
      .from('downloads')
      .select('*', { count: 'exact', head: true });

    if (weeklyError || totalError) {
      // If table doesn't exist, it's a 404. We should just return 0 and not log it every time as a warning if it's expected in some envs.
      if (weeklyError?.code !== '42P01' && totalError?.code !== '42P01') {
        console.warn('Error fetching download stats:', weeklyError || totalError);
      }
      return { weekly: 0, total: 0 };
    }

    return {
      weekly: weeklyCount || 0,
      total: totalCount || 0
    };
  } catch (e) {
    // Avoid crashing the whole app if stats fail
    return { weekly: 0, total: 0 };
  }
}
