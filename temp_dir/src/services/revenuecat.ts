import { Purchases } from '@revenuecat/purchases-js';

const revenueCatApiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY;

if (!revenueCatApiKey) {
  console.warn('Missing RevenueCat Public API Key. Please check your .env file.');
}

// Initialize RevenueCat only if key is present
if (revenueCatApiKey) {
  try {
    Purchases.configure(revenueCatApiKey, 'app_user_id'); 
    console.log('RevenueCat initialized successfully');
  } catch (err) {
    console.error('Failed to initialize RevenueCat:', err);
    // Non-blocking: continue application load
  }
}

export const purchases = Purchases.getSharedInstance();
