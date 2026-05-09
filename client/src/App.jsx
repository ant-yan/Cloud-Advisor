import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useAdvisor } from './context/AdvisorContext';
import Navbar from './components/ui/Navbar';
import Footer from './components/ui/Footer';
import ChatPanel from './components/chat/ChatPanel';
import OnboardingBanner from './components/ui/OnboardingBanner';
import ErrorBoundary from './components/ui/ErrorBoundary';

const HomePage     = lazy(() => import('./pages/HomePage'));
const WizardPage   = lazy(() => import('./pages/WizardPage'));
const ResultsPage  = lazy(() => import('./pages/ResultsPage'));
const ComparePage  = lazy(() => import('./pages/ComparePage'));
const PricingPage  = lazy(() => import('./pages/PricingPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const ProviderPage = lazy(() => import('./pages/ProviderPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin" />
    </div>
  );
}

export default function App() {
  const { state } = useAdvisor();

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/providers/:id" element={<ProviderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <ChatPanel />
      <OnboardingBanner />
    </div>
  );
}
