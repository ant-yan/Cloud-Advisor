import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Link2, Check } from 'lucide-react';
import { useAdvisor } from '../context/AdvisorContext';
import CompareView from '../components/compare/CompareView';
import { usePageTitle } from '../hooks/usePageTitle';

const HISTORY_KEY = 'cloudadvisor_compare_history';
const MAX_HISTORY = 5;

const f = (obj) => obj;

const STATIC_PROVIDERS = [
  { id: 'aws',          name: 'AWS',          brandColor: '#FF9900', features: f({ freeTier: true,  payAsYouGo: true, predictablePricing: false, managedDatabase: true,  serverless: true,  kubernetes: true,  cdn: true,  aiMlApis: true,  multiRegion: true, globalNetwork: true,  ddosProtection: true, sla99_9: true, gdpr: true, hipaa: true,  soc2: true, iso27001: true,  cli: true, terraformSupport: true,  githubIntegration: true, monitoring: true }) },
  { id: 'gcp',          name: 'GCP',          brandColor: '#4285F4', features: f({ freeTier: true,  payAsYouGo: true, predictablePricing: false, managedDatabase: true,  serverless: true,  kubernetes: true,  cdn: true,  aiMlApis: true,  multiRegion: true, globalNetwork: true,  ddosProtection: true, sla99_9: true, gdpr: true, hipaa: true,  soc2: true, iso27001: true,  cli: true, terraformSupport: true,  githubIntegration: true, monitoring: true }) },
  { id: 'azure',        name: 'Azure',        brandColor: '#0078D4', features: f({ freeTier: true,  payAsYouGo: true, predictablePricing: false, managedDatabase: true,  serverless: true,  kubernetes: true,  cdn: true,  aiMlApis: true,  multiRegion: true, globalNetwork: true,  ddosProtection: true, sla99_9: true, gdpr: true, hipaa: true,  soc2: true, iso27001: true,  cli: true, terraformSupport: true,  githubIntegration: true, monitoring: true }) },
  { id: 'digitalocean', name: 'DigitalOcean', brandColor: '#0080FF', features: f({ freeTier: false, payAsYouGo: true, predictablePricing: true,  managedDatabase: true,  serverless: true,  kubernetes: true,  cdn: true,  aiMlApis: false, multiRegion: true, globalNetwork: false, ddosProtection: true, sla99_9: true, gdpr: true, hipaa: false, soc2: true, iso27001: true,  cli: true, terraformSupport: true,  githubIntegration: true, monitoring: true }) },
  { id: 'vercel',       name: 'Vercel',       brandColor: '#000000', features: f({ freeTier: true,  payAsYouGo: true, predictablePricing: true,  managedDatabase: false, serverless: true,  kubernetes: false, cdn: true,  aiMlApis: false, multiRegion: true, globalNetwork: true,  ddosProtection: true, sla99_9: true, gdpr: true, hipaa: false, soc2: true, iso27001: false, cli: true, terraformSupport: false, githubIntegration: true, monitoring: true }) },
  { id: 'netlify',      name: 'Netlify',      brandColor: '#00AD9F', features: f({ freeTier: true,  payAsYouGo: true, predictablePricing: true,  managedDatabase: false, serverless: true,  kubernetes: false, cdn: true,  aiMlApis: false, multiRegion: true, globalNetwork: true,  ddosProtection: true, sla99_9: true, gdpr: true, hipaa: false, soc2: true, iso27001: false, cli: true, terraformSupport: true,  githubIntegration: true, monitoring: true }) },
  { id: 'render',       name: 'Render',       brandColor: '#7C3AED', features: f({ freeTier: true,  payAsYouGo: true, predictablePricing: true,  managedDatabase: true,  serverless: false, kubernetes: false, cdn: false, aiMlApis: false, multiRegion: true, globalNetwork: false, ddosProtection: true, sla99_9: true, gdpr: true, hipaa: false, soc2: true, iso27001: false, cli: true, terraformSupport: true,  githubIntegration: true, monitoring: true }) },
  { id: 'cloudflare',   name: 'Cloudflare',   brandColor: '#F6821F', features: f({ freeTier: true,  payAsYouGo: true, predictablePricing: true,  managedDatabase: true,  serverless: true,  kubernetes: false, cdn: true,  aiMlApis: true,  multiRegion: true, globalNetwork: true,  ddosProtection: true, sla99_9: true, gdpr: true, hipaa: false, soc2: true, iso27001: true,  cli: true, terraformSupport: true,  githubIntegration: true, monitoring: true }) },
];

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveToHistory(ids, allProviders) {
  if (ids.length < 2) return;
  const label = ids
    .map((id) => allProviders.find((p) => p.id === id)?.name || id)
    .join(', ');
  const entry = { ids, label, timestamp: Date.now() };
  const prev = loadHistory().filter((h) => h.label !== label);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...prev].slice(0, MAX_HISTORY)));
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ComparePage() {
  usePageTitle('Compare Providers');
  const { state } = useAdvisor();
  const ranked = state.results?.ranked ?? [];
  const [searchParams, setSearchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  // Always show all 8 providers; merge scores from wizard results where available
  const fullProviders = useMemo(() =>
    STATIC_PROVIDERS.map((p) => {
      const r = ranked.find((r) => r.id === p.id);
      return r ? { ...p, score: r.score } : p;
    }),
  [ranked]);

  const defaultSelected = useMemo(() => {
    // 1. Prefer ?p= URL param (accepts 1+ IDs; fills to 3 with defaults if only 1 given)
    const urlParam = searchParams.get('p');
    if (urlParam) {
      const ids = urlParam.split(',').filter((id) => STATIC_PROVIDERS.some((p) => p.id === id));
      if (ids.length >= 2) return ids;
      if (ids.length === 1) {
        const fill = STATIC_PROVIDERS.filter((p) => !ids.includes(p.id)).slice(0, 2).map((p) => p.id);
        return [...ids, ...fill];
      }
    }
    // 2. Wizard results
    if (ranked.length > 0) return ranked.slice(0, 3).map((p) => p.id);
    // 3. Default first 3
    return STATIC_PROVIDERS.slice(0, 3).map((p) => p.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedIds, setSelectedIds] = useState(defaultSelected);
  const [history, setHistory] = useState(loadHistory);

  const fromResults = ranked.length > 0;

  // Persist to history whenever a valid comparison is active
  useEffect(() => {
    if (selectedIds.length >= 2) {
      saveToHistory(selectedIds, fullProviders);
      setHistory(loadHistory());
    }
  }, [selectedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      // Keep URL in sync so the link is always shareable
      if (next.length >= 2) {
        setSearchParams({ p: next.join(',') }, { replace: true });
      }
      return next;
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const restoreHistory = (ids) => {
    // Only restore ids that exist in fullProviders
    const valid = ids.filter((id) => fullProviders.some((p) => p.id === id));
    setSelectedIds(valid);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto px-4 py-10"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
            Compare providers
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {fromResults
              ? 'Pre-populated with your top 3 results. All 8 providers available — toggle to swap any out.'
              : 'Select 2–3 providers from all 8 to compare side-by-side.'}
          </p>
        </div>
        {selectedIds.length >= 2 && (
          <button
            onClick={handleCopyLink}
            title="Copy shareable link"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors flex-shrink-0 self-start"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share link'}
          </button>
        )}
      </div>

      <CompareView
        selectedIds={selectedIds}
        onToggle={toggle}
        fullProviders={fullProviders}
      />

      {/* Comparison history */}
      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Recent comparisons
          </h2>
          <div className="flex flex-wrap gap-2">
            {history.map((item) => (
              <button
                key={item.timestamp}
                onClick={() => restoreHistory(item.ids)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(item.timestamp)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </motion.div>
  );
}
