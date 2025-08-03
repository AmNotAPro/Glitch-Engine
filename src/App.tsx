import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth.tsx';
import { ResponsiveProvider } from './providers/ResponsiveProvider';
import { AnimationProvider } from './providers/AnimationProvider';
import AppContent from './components/AppContent';

function App() {
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

