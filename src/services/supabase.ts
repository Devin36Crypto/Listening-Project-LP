import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase URL or Anon Key. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
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
      console.warn('Error fetching download stats:', weeklyError || totalError);
      return { weekly: 0, total: 0 };
    }

    return {
      weekly: weeklyCount || 0,
      total: totalCount || 0
    };
  } catch (e) {
    console.warn('Error fetching download stats:', e);
    return { weekly: 0, total: 0 };
  }
}
