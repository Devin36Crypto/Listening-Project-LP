import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Initialize Sentry before rendering.
// Only initializes if VITE_SENTRY_DSN is set — safe to omit in local dev.
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,         // 'development' or 'production'
    tracesSampleRate: 1.0,                      // Capture 100% of transactions (lower in prod if needed)
    replaysSessionSampleRate: 0.1,              // Replay 10% of all sessions
    replaysOnErrorSampleRate: 1.0,              // Replay 100% of sessions with errors
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
  });
}

// Debug Marker
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = '<div style="background:red; color:white; padding:20px; position:fixed; z-index:9999;">JS EXECUTING...</div>';
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Analytics />
    </ErrorBoundary>
  </React.StrictMode>
);
