/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_ERROR_TRACKING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
