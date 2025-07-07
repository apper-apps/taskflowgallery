import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import App from './App.jsx'
import './index.css'
// Error boundary for SDK-related errors
class ApperSDKErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if error is related to canvas operations
    if (error?.message?.includes('canvas') || error?.message?.includes('drawImage')) {
      console.warn('Canvas-related error caught, likely from Apper SDK:', error);
      return { hasError: true, error };
    }
    return null;
  }

  componentDidCatch(error, errorInfo) {
    if (error?.message?.includes('canvas') || error?.message?.includes('drawImage')) {
      console.error('Canvas operation failed:', error, errorInfo);
      // Log to monitoring service if available
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI - app continues to work
      return this.props.children;
    }
    return this.props.children;
  }
}

// Ensure DOM is ready and viewport has proper dimensions
function initializeApperSDK() {
  return new Promise((resolve, reject) => {
    try {
      // Check if SDK is available
      if (!window.ApperSDK) {
        reject(new Error('Apper SDK not loaded'));
        return;
      }

      const { ApperClient, ApperUI } = window.ApperSDK;
      
      if (!ApperClient || !ApperUI) {
        reject(new Error('ApperClient or ApperUI not available'));
        return;
      }

      // Initialize ApperClient with credentials
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Setup ApperUI for authentication
      ApperUI.setup(apperClient, {
        target: '#authentication',
        clientId: import.meta.env.VITE_APPER_PROJECT_ID,
        view: 'both',
        onSuccess: function (user) {
          console.log('Apper SDK initialized successfully', user ? 'with user' : 'without user');
          resolve({ client: apperClient, ui: ApperUI, user });
        },
        onError: function(error) {
          console.error("Apper SDK authentication error:", error);
          // Don't reject here - authentication errors are handled by the auth flow
          resolve({ client: apperClient, ui: ApperUI, user: null });
        }
      });

    } catch (error) {
      console.error('Error initializing Apper SDK:', error);
      reject(error);
    }
  });
}

function initializeApp() {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found');
      return;
    }

    // Check if viewport is ready
    if (window.innerWidth === 0 || window.innerHeight === 0) {
      console.warn('Viewport not ready, delaying app initialization');
      setTimeout(initializeApp, 50);
      return;
    }

    // Initialize Apper SDK first, then React app
    initializeApperSDK()
      .then(() => {
        console.log('SDK initialized, starting React app');
        
        // Initialize React app with error boundary
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <Provider store={store}>
              <BrowserRouter>
                <ApperSDKErrorBoundary>
                  <App />
                </ApperSDKErrorBoundary>
              </BrowserRouter>
            </Provider>
          </React.StrictMode>
        );
      })
      .catch((error) => {
        console.error('Failed to initialize Apper SDK:', error);
        
        // Fallback: Initialize React app without SDK
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <Provider store={store}>
              <BrowserRouter>
                <ApperSDKErrorBoundary>
                  <App />
                </ApperSDKErrorBoundary>
              </BrowserRouter>
            </Provider>
          </React.StrictMode>
        );
      });

    // Add global error handler for unhandled canvas errors
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes('canvas') || 
          event.error?.message?.includes('drawImage') ||
          event.filename?.includes('apper')) {
        console.warn('Canvas/Apper SDK error handled:', event.error);
        event.preventDefault(); // Prevent error from crashing the app
      }
    });

    // Handle unhandled promise rejections from SDK
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('canvas') || 
          event.reason?.message?.includes('drawImage')) {
        console.warn('Canvas promise rejection handled:', event.reason);
        event.preventDefault();
      }
    });

  } catch (error) {
    console.error('Error initializing app:', error);
    // Fallback: try to render basic app without error boundary
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<App />);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already ready, but wait a tick to ensure viewport is stable
  setTimeout(initializeApp, 0);
}