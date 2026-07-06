import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from '@/lib/ThemeContext';
import { SearchProvider } from '@/lib/SearchContext';
import AuthGate from '@/lib/AuthGate';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import ItemDetail from '@/pages/ItemDetail';
import EvaluationReport from '@/pages/EvaluationReport';
import { Toaster } from "@/components/ui/toaster";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user\u005Fnot\u005Fregistered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth\u005Frequired') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/report" element={<EvaluationReport />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeProvider>
          <SearchProvider>
            <Router basename="/Thrills-Dashboard/">
              <ScrollToTop />
              <AuthGate>
                <AuthenticatedApp />
              </AuthGate>
            </Router>
            <Toaster />
          </SearchProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App