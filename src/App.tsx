import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth.tsx';
import { ResponsiveProvider } from './providers/ResponsiveProvider';
import { AnimationProvider } from './providers/AnimationProvider';
import AppContent from './components/AppContent';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Pricing from './pages/Pricing';

function App() {
  // Check current path for routing
  const currentPath = window.location.pathname;
  
  // Static pages WITH auth context (needed for modals)
  if (currentPath === '/terms') {
    return (
      <ResponsiveProvider>
        <AnimationProvider>
          <AuthProvider>
            <TermsOfService />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </AnimationProvider>
      </ResponsiveProvider>
    );
  }

  if (currentPath === '/privacy-policy') {
    return (
      <ResponsiveProvider>
        <AnimationProvider>
          <AuthProvider>
            <PrivacyPolicy />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </AnimationProvider>
      </ResponsiveProvider>
    );
  }

  if (currentPath === '/pricing') {
    return (
      <ResponsiveProvider>
        <AnimationProvider>
          <AuthProvider>
            <Pricing />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </AnimationProvider>
      </ResponsiveProvider>
    );
  }

  // Default app with all providers for main application
  return (
    <ResponsiveProvider>
      <AnimationProvider>
        <AuthProvider>
          <AppContent />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </AnimationProvider>
    </ResponsiveProvider>
  );
}

export default App;