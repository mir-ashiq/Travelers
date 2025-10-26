import { AuthProvider } from './contexts/AuthContext';
import { CustomerProvider } from './contexts/CustomerContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import AppRoutes from './AppRoutes.tsx';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CustomerProvider>
          <NotificationProvider>
            <SettingsProvider>
              <AppRoutes />
            </SettingsProvider>
          </NotificationProvider>
        </CustomerProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;