import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft, ExternalLink, Check, X } from 'lucide-react';
import { getProvider } from '../data/providers';
import { usePageTitle } from '../hooks/usePageTitle';

const FEATURE_CATEGORIES = [
  {
    name: 'Pricing',
    rows: [
      { key: 'freeTier', label: 'Free tier' },
      { key: 'payAsYouGo', label: 'Pay-as-you-go' },
      { key: 'predictablePricing', label: 'Predictable billing' },
    ],
  },
  {
    name: 'Services',
    rows: [
      { key: 'managedDatabase', label: 'Managed databases' },
      { key: 'serverless', label: 'Serverless functions' },
      { key: 'kubernetes', label: 'Managed Kubernetes' },
      { key: 'cdn', label: 'Built-in CDN' },
      { key: 'aiMlApis', label: 'AI / ML APIs' },
    ],
  },
  {
    name: 'Infrastructure',
    rows: [
      { key: 'multiRegion', label: 'Multi-region' },
      { key: 'globalNetwork', label: 'Global edge network' },
      { key: 'ddosProtection', label: 'DDoS protection' },
      { key: 'sla99_9', label: '99.9%+ SLA' },
    ],
  },
  {
    name: 'Compliance',
    rows: [
      { key: 'gdpr', label: 'GDPR' },
      { key: 'hipaa', label: 'HIPAA eligible' },
      { key: 'soc2', label: 'SOC 2' },
      { key: 'iso27001', label: 'ISO 27001' },
    ],
  },
  {
    name: 'Developer Experience',
    rows: [
      { key: 'cli', label: 'Official CLI' },
      { key: 'terraformSupport', label: 'Terraform support' },
      { key: 'githubIntegration', label: 'GitHub integration' },
      { key: 'monitoring', label: 'Built-in monitoring' },
    ],
  },
];

function EaseBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-sm ${
              i < value ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400">{value}/10</span>
    </div>
  );
}

export default function ProviderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const provider = getProvider(id);

  usePageTitle(provider ? `${provider.fullName} — Full Profile` : 'Provider Not Found');

  if (!provider) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-4">Provider "{id}" not found.</p>
        <Link to="/compare" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
          ← Back to compare
        </Link>
      </div>
    );
  }

  const displayColor = provider.brandColor === '#000000' ? '#111827' : provider.brandColor;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-card mb-6"
      >
        <div className="h-2 w-full" style={{ backgroundColor: displayColor }} />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {provider.fullName}
                </h1>
                {provider.alwaysFree && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    Always-free tier
                  </span>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                {provider.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Ease of use:</span>
                <EaseBar value={provider.easeOfUse} />
              </div>
            </div>
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: displayColor }}
            >
              Visit website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Pros */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08, ease: 'easeOut' }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-card"
        >
          <h2 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">
            Pros
          </h2>
          <ul className="space-y-2.5">
            {provider.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                {pro}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Cons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12, ease: 'easeOut' }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-card"
        >
          <h2 className="text-xs font-semibold text-rose-500 dark:text-rose-400 uppercase tracking-wider mb-3">
            Cons
          </h2>
          <ul className="space-y-2.5">
            {provider.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                {con}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Features grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.16, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-card mb-6"
      >
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          {FEATURE_CATEGORIES.map((cat) => (
            <div key={cat.name} className="mb-3">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                {cat.name}
              </p>
              <div className="space-y-1.5">
                {cat.rows.map((row) => {
                  const has = provider.features?.[row.key] ?? false;
                  return (
                    <div key={row.key} className="flex items-center gap-2">
                      {has ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${has ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                        {row.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Getting started */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-card mb-8"
      >
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Getting started</h2>
        <ol className="space-y-3">
          {provider.gettingStarted.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: displayColor }}
              >
                {i + 1}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* CTA row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={provider.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: displayColor }}
        >
          Visit {provider.name}
          <ExternalLink className="w-4 h-4" />
        </a>
        <Link
          to={`/compare?p=${provider.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Compare providers
        </Link>
        <Link
          to="/wizard"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-sm font-semibold text-white transition-colors"
        >
          Get my recommendation
        </Link>
      </div>
    </div>
  );
}
