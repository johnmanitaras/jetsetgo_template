import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initEmbeddedModeListener, isRunningInIframe } from './lib/embeddedMode';

// Check if we're running in embedded mode (iframe)
const isEmbedded = isRunningInIframe();

// If we're in embedded mode, we'll use this component to handle auth data
function EmbeddedModeWrapper() {
  const [authData, setAuthData] = useState<{ authToken?: string; tenantName?: string }>({});
  const [isReady, setIsReady] = useState(!isEmbedded); // If not embedded, we're ready immediately

  useEffect(() => {
    if (isEmbedded) {
      console.log('Running in embedded mode, waiting for auth data from parent');
      
      // Initialize the embedded mode listener
      initEmbeddedModeListener((authToken, tenantName) => {
        console.log('Setting auth data from parent');
        setAuthData({ authToken, tenantName });
        setIsReady(true);
      });
    }
  }, []);

  // Show loading state until we receive auth data in embedded mode
  if (!isReady) {
    return <div>Loading embedded app...</div>;
  }

  // Force the app to render at the root path regardless of iframe URL
  if (isEmbedded && window.location.pathname !== '/') {
    console.log('Forcing app to render at root path instead of', window.location.pathname);
    // We need to render the app without the router's basename to avoid path issues
    return <App authToken={authData.authToken} tenantName={authData.tenantName} />;
  }

  // Render the app with auth data if in embedded mode
  return <App authToken={authData.authToken} tenantName={authData.tenantName} />;
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <EmbeddedModeWrapper />
      </StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
});
