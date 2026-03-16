console.log('MAIN.TSX: Initialization started - Version 1.0.2');

import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Client-side hydration guard
const rootElement = document.getElementById('root');
console.log('MAIN.TSX: Checking root element:', !!rootElement);

if (!rootElement) {
  console.error('MAIN.TSX: Critical Error - Root element #root not found!');
} else {
  try {
    console.log('MAIN.TSX: Starting React hydration...');
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
          <Analytics />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    // Successful render marker
    console.log('MAIN.TSX: Initial render call successful');
    
    // Attempt to clear fallback after a microtask to allow initial paint
    setTimeout(() => {
      const fallback = document.getElementById('fallback-ui');
      if (fallback) {
        console.log('MAIN.TSX: Clearing fallback UI');
        // Use opacity for smoother transition if possible, or just hide
        fallback.style.opacity = '0';
        setTimeout(() => {
            fallback.style.display = 'none';
        }, 300);
      }
    }, 200);

  } catch (error) {
    console.error('MAIN.TSX: Fatal rendering exception:', error);
    const fallbackHint = document.querySelector('.fallback-ui-hint');
    if (fallbackHint) {
      fallbackHint.textContent = 'Fatal Error: ' + (error instanceof Error ? error.message : 'Unknown error');
      fallbackHint.classList.add('text-red-500');
    }
  }
}

// Forced sync trigger: 03/15/2026 22:00:00