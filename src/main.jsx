import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from '@contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { NotificationProvider } from '@contexts/NotificationContext';

// Components
import App from './App';
import ErrorBoundary from '@components/error/ErrorBoundary';

// Styles
import '@styles/index.css';

// Create Query Client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 30 minutes
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (disabled for better UX)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Show error boundary on error
      useErrorBoundary: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Show error boundary on error
      useErrorBoundary: false,
    },
  },
});

// Toast configuration
const toasterConfig = {
  position: 'top-right',
  reverseOrder: false,
  gutter: 12,
  containerClassName: '',
  containerStyle: {
    top: 80,
    right: 20,
  },
  toastOptions: {
    // Default options for all toasts
    duration: 4000,
    style: {
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#f1f5f9',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    // Success toast
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#00D4FF',
        secondary: '#0f172a',
      },
      style: {
        borderLeft: '4px solid #00D4FF',
      },
    },
    // Error toast
    error: {
      duration: 5000,
      iconTheme: {
        primary: '#EF4444',
        secondary: '#0f172a',
      },
      style: {
        borderLeft: '4px solid #EF4444',
      },
    },
    // Loading toast
    loading: {
      iconTheme: {
        primary: '#A855F7',
        secondary: '#0f172a',
      },
      style: {
        borderLeft: '4px solid #A855F7',
      },
    },
  },
};

// Performance: Wrap in concurrent mode
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider>
              <AuthProvider>
                <NotificationProvider>
                  <App />
                  <Toaster {...toasterConfig} />
                </NotificationProvider>
              </AuthProvider>
            </ThemeProvider>
          </BrowserRouter>
          {/* React Query Devtools - only in development */}
          {import.meta.env.DEV && (
            <ReactQueryDevtools 
              initialIsOpen={false} 
              position="bottom-right"
              buttonPosition="bottom-right"
            />
          )}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Report Web Vitals (optional)
if (import.meta.env.PROD) {
  // You can send metrics to an analytics endpoint
  const reportWebVitals = async (onPerfEntry) => {
    if (onPerfEntry && typeof onPerfEntry === 'function') {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }
  };
  
  reportWebVitals(console.log);
}

// Service Worker Registration (PWA support)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}
