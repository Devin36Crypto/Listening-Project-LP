import { Purchases } from '@revenuecat/purchases-js';

const revenueCatApiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY;

if (!revenueCatApiKey) {
  console.warn('Missing RevenueCat Public API Key. Please check your .env file.');
}

// Initialize RevenueCat only if key is present
if (revenueCatApiKey) {
  Purchases.configure(revenueCatApiKey, 'app_user_id'); // Replace 'app_user_id' with actual user ID when available
}

export const purchases = Purchases.getSharedInstance();
