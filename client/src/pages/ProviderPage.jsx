import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowLeft, ExternalLink, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getProvider } from '../data/providers';
import { usePageTitle } from '../hooks/usePageTitle';

const FEATURE_CATEGORY_KEYS = ['Pricing', 'Services', 'Infrastructure', 'Compliance', 'Developer Experience'];

const ROWS_BY_CATEGORY = {
  'Pricing': [
    { key: 'freeTier' },
    { key: 'payAsYouGo' },
    { key: 'predictablePricing' },
  ],
  'Services': [
    { key: 'managedDatabase' },
    { key: 'serverless' },
    { key: 'kubernetes' },
    { key: 'cdn' },
    { key: 'aiMlApis' },
  ],
  'Infrastructure': [
    { key: 'multiRegion' },
    { key: 'globalNetwork' },
    { key: 'ddosProtection' },
    { key: 'sla99_9' },
  ],
  'Compliance': [
    { key: 'gdpr' },
    { key: 'hipaa' },
    { key: 'soc2' },
    { key: 'iso27001' },
  ],
  'Developer Experience': [
    { key: 'cli' },
    { key: 'terraformSupport' },
    { key: 'githubIntegration' },
    { key: 'monitoring' },
  ],
};

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
  const { t } = useTranslation();
  const provider = getProvider(id);

  usePageTitle(provider ? `${provider.fullName} — Full Profile` : 'Provider Not Found');

  if (!provider) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-4">{t('provider.notFound', { id })}</p>
        <Link to="/compare" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
          {t('provider.backToCompare')}
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
        {t('provider.back')}
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
                    {t('provider.alwaysFreeTier')}
                  </span>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                {provider.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('provider.easeOfUse')}</span>
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
              {t('provider.visitWebsite')}
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
            {t('provider.pros')}
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
            {t('provider.cons')}
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
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('provider.features')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          {FEATURE_CATEGORY_KEYS.map((catKey) => (
            <div key={catKey} className="mb-3">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                {t(`compare.categories.${catKey}`)}
              </p>
              <div className="space-y-1.5">
                {ROWS_BY_CATEGORY[catKey].map((row) => {
                  const has = provider.features?.[row.key] ?? false;
                  return (
                    <div key={row.key} className="flex items-center gap-2">
                      {has ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${has ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                        {t(`compare.features.${row.key}`)}
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
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('provider.gettingStarted')}</h2>
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
          {t('provider.visitProvider', { name: provider.name })}
          <ExternalLink className="w-4 h-4" />
        </a>
        <Link
          to={`/compare?p=${provider.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {t('provider.compareProviders')}
        </Link>
        <Link
          to="/wizard"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-sm font-semibold text-white transition-colors"
        >
          {t('provider.getMyRecommendation')}
        </Link>
      </div>
    </div>
  );
}
