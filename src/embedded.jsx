// This file handles the embedded mode functionality for the template app
// It ensures proper communication with the parent app and correct rendering

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Check if we're running in an iframe (embedded mode)
export function isRunningInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access window.top due to same-origin policy,
    // we're definitely in an iframe
    return true;
  }
}

// Main entry point for the application
export function initializeApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  // Check if we're in embedded mode
  const isEmbedded = isRunningInIframe();
  
  // Create the React root
  const root = createRoot(rootElement);
  
  if (isEmbedded) {
    // In embedded mode, we need to handle auth data from parent
    console.log('Initializing in embedded mode');
    root.render(<EmbeddedModeHandler />);
  } else {
    // In standalone mode, just render the app normally
    console.log('Initializing in standalone mode');
    root.render(<App />);
  }
}

// Component to handle embedded mode and auth data
function EmbeddedModeHandler() {
  const [authData, setAuthData] = useState({ authToken: null, tenantName: null });
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    console.log('EmbeddedModeHandler mounted, setting up message listener');
    
    // Function to handle messages from parent
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'AUTH_DATA') {
        console.log('Received AUTH_DATA message:', {
          authToken: event.data.authToken ? `${event.data.authToken.substring(0, 10)}...` : null,
          tenantName: event.data.tenantName
        });
        
        setAuthData({
          authToken: event.data.authToken,
          tenantName: event.data.tenantName
        });
        
        setIsReady(true);
      }
    };
    
    // Add event listener for messages
    window.addEventListener('message', handleMessage);
    
    // Notify parent that we're ready to receive auth data
    console.log('Sending IFRAME_READY message to parent');
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  // Show loading state until we receive auth data
  if (!isReady) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>Loading embedded application...</h2>
        <p>Waiting for authentication data from parent application.</p>
      </div>
    );
  }
  
  // Render the app with auth data
  console.log('Rendering App with auth data in embedded mode');
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Template App (Embedded Mode)</h2>
      <div style={{ marginBottom: '10px', padding: '5px', background: '#f0f0f0' }}>
        <p><strong>Auth Status:</strong> Authenticated</p>
        <p><strong>Tenant:</strong> {authData.tenantName}</p>
      </div>
      <App authToken={authData.authToken} tenantName={authData.tenantName} />
    </div>
  );
}
