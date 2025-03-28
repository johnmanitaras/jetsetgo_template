import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import { TestPage } from './components/TestPage';
import { Reports } from './pages/Reports';
import { useAuth } from './contexts/AuthContext';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

interface AppProps {
  // Standard prop names for embedded mode
  authToken?: string;
  tenantName?: string;
}

function App({ authToken, tenantName }: AppProps = {}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider authToken={authToken} tenantName={tenantName}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <TestPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;