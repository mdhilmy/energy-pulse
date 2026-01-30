import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Lazy load pages
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PricesPage = lazy(() => import('./pages/PricesPage'));
const CorrelationPage = lazy(() => import('./pages/CorrelationPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const CurrencyPage = lazy(() => import('./pages/CurrencyPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/correlation" element={<CorrelationPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/currency" element={<CurrencyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
