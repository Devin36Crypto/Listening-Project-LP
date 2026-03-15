export { };

declare global {
    interface Window {
        aistudio?: {
            hasSelectedApiKey?: () => Promise<boolean>;
            openSelectKey?: () => Promise<void>;
        };
    }

    interface ImportMetaEnv {
        readonly VITE_SENTRY_DSN?: string;
        readonly MODE: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }

    namespace NodeJS {
        interface ProcessEnv {
            GEMINI_API_KEY: string;
            DISABLE_HMR?: string;
        }
    }
}
