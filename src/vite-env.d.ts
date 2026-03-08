/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_REVENUECAT_PUBLIC_API_KEY: string
  readonly VITE_SENTRY_DSN: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
