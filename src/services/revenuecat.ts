import { Purchases } from '@revenuecat/purchases-js';

const revenueCatApiKey = import.meta.env.VITE_REVENUECAT_PUBLIC_API_KEY;

let isConfigured = false;
let mockPurchases: any = null;

if (!revenueCatApiKey) {
  console.warn('Missing RevenueCat Public API Key. App will run in demo mode.');
  mockPurchases = {
    getOfferings: async () => ({
      current: {
        monthly: { identifier: 'mock-monthly' },
        annual: { identifier: 'mock-annual' }
      }
    }),
    purchasePackage: async (pkg: any) => {
      console.log('Mock purchase for', pkg.identifier);
      return { customerInfo: {} };
    }
  };
} else {
  try {
    Purchases.configure(revenueCatApiKey, 'app_user_id'); 
    console.log('RevenueCat initialized successfully');
    isConfigured = true;
  } catch (err) {
    console.error('Failed to initialize RevenueCat:', err);
    // Non-blocking: continue application load
  }
}

export const purchases = isConfigured ? Purchases.getSharedInstance() : mockPurchases;
