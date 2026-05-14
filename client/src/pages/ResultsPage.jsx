import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { RotateCcw, BarChart3, AlertCircle, Link2, Printer, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdvisor } from '../context/AdvisorContext';
import ProviderCard from '../components/results/ProviderCard';
import AIExplanation from '../components/results/AIExplanation';
import QuickStartGuide from '../components/results/QuickStartGuide';
import { encodeResults, decodeResults } from '../lib/utils';
import { usePageTitle } from '../hooks/usePageTitle';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-card border-2 border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-slate-100 dark:bg-slate-800 rounded" />)}
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-3 bg-slate-100 dark:bg-slate-800 rounded" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
        <BarChart3 className="w-8 h-8 text-primary-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('results.noResultsTitle')}</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm text-sm">
        {t('results.noResultsMessage')}
      </p>
      <Link
        to="/wizard"
        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
      >
        {t('results.startWizard')}
      </Link>
    </div>
  );
}

function ErrorBanner({ error }) {
  const { t } = useTranslation();
  return (
    <div className="p-5 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 flex items-start gap-3 mb-6">
      <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">{t('results.errorTitle')}</p>
        <p className="text-sm text-rose-600 dark:text-rose-500 mt-0.5">{error}</p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { state, reset, setAnswers, setResults } = useAdvisor();
  const { results, isLoading, error } = state;
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const topName = results?.ranked?.[0]?.name;
  usePageTitle(topName ? `${topName} recommended` : 'Your Results');

  useEffect(() => {
    const encoded = searchParams.get('share');
    if (!encoded || state.results) return;
    const decoded = decodeResults(encoded);
    if (decoded?.answers && decoded?.results) {
      setAnswers(decoded.answers);
      setResults(decoded.results);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopyLink = () => {
    const encoded = encodeResults(state.answers, results);
    const url = `${window.location.origin}/results?share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded mb-8 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!results && !error) return <EmptyState />;

  const ranked = results?.ranked || [];
  const top = ranked[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10" data-print-content>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {t('results.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t('results.subtitle')}
          </p>
        </div>

        <div className="flex gap-2 flex-shrink-0" data-print-hide>
          <button
            onClick={handleCopyLink}
            title="Copy shareable link"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
            {copied ? t('results.copied') : t('results.share')}
          </button>
          <button
            onClick={() => window.print()}
            title="Download as PDF"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            {t('results.pdf')}
          </button>
        </div>
      </div>

      {error && <ErrorBanner error={error} />}

      <div className="mb-6">
        <AIExplanation explanation={results?.explanation} />
      </div>

      <div className="space-y-4 mb-8">
        {ranked.map((provider, i) => (
          <ProviderCard key={provider.id} provider={provider} rank={i + 1} delay={i * 0.08} />
        ))}
      </div>

      {top && (
        <div className="mb-8">
          <QuickStartGuide provider={top} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3" data-print-hide>
        <Link
          to="/compare"
          className="flex-1 text-center px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
        >
          {t('results.compareSideBySide')}
        </Link>
        <button
          onClick={() => { reset(); navigate('/wizard'); }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          {t('results.startOver')}
        </button>
      </div>
    </div>
  );
}
