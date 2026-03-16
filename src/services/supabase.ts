import { createClient } from '@supabase/supabase-js';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Safely get env variables with prioritized loading
const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || (isLocal ? `${window.location.origin}/supabase-api` : '');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('SUPABASE CONFIG: Missing environment variables. Using mock client for stability.');
}

console.log('SUPABASE: URL set =', !!supabaseUrl);
console.log('SUPABASE: Key set =', !!supabaseAnonKey);

// Initialize Supabase only if keys are present to prevent top-level crashes
let supabaseInstance: any = null;
let mockSession: any = null;
let authListeners: any[] = [];

const createMockSupabaseClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: mockSession }, error: null }),
      onAuthStateChange: (cb: any) => {
        authListeners.push(cb);
        return { data: { subscription: { unsubscribe: () => {
          authListeners = authListeners.filter(l => l !== cb);
        } } } };
      },
      signUp: async ({ email }: any) => {
        console.log("Mock sign up for", email);
        const user = { id: 'mock-user-id', email };
        mockSession = { user, access_token: 'mock-token' };
        authListeners.forEach(cb => cb('SIGNED_IN', mockSession));
        return { data: { user, session: mockSession }, error: null };
      },
      getUser: async () => ({ data: { user: mockSession?.user || null }, error: null }),
      signOut: async () => {
        console.log("Mock sign out");
        mockSession = null;
        authListeners.forEach(cb => cb('SIGNED_OUT', null));
        window.location.reload();
      }
    },
    from: () => ({
      insert: async () => ({ error: null }),
      select: () => ({
        gte: async () => ({ count: 0, error: null }),
        then: (cb: any) => cb({ count: 0, error: null })
      })
    })
  };
};

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === '') {
  console.warn('Missing or invalid Supabase environment variables. App will run in limited mode.');
  supabaseInstance = createMockSupabaseClient();
} else {
  try {
    // Basic URL validation
    const validUrl = supabaseUrl.startsWith('http') || supabaseUrl.startsWith('/');
    if (!validUrl) throw new Error('Invalid Supabase URL format');
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase:', err);
    supabaseInstance = createMockSupabaseClient();
  }
}

export const supabase = supabaseInstance;

export const recordDownload = async (platform: string) => {
  try {
    const { error } = await supabase
      .from('downloads')
      .insert([{ platform }]);
    if (error) console.error('Error recording download:', error);
  } catch (err) {
    console.error('Failed to record download:', err);
  }
};

export const startTrial = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .insert([{ 
        user_id: userId, 
        status: 'trialing', 
        trial_start_date: new Date().toISOString() 
      }]);
    if (error) {
      console.warn('Error starting trial (schema mismatch likely):', error);
      // Attempt without trial_start_date as fallback
      const { error: retryError } = await supabase
        .from('subscriptions')
        .insert([{ user_id: userId, status: 'trialing' }]);
      if (retryError) console.error('Retry trial start failed:', retryError);
    }
  } catch (err) {
    console.error('Failed to start trial:', err);
  }
};

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
