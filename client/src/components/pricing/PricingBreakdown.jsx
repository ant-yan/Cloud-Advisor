import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const BRAND_COLORS = {
  aws:          '#FF9900',
  gcp:          '#4285F4',
  azure:        '#0078D4',
  digitalocean: '#0080FF',
  vercel:       '#525252',
  netlify:      '#00AD9F',
  render:       '#7C3AED',
  cloudflare:   '#F6821F',
};

const SERVERLESS_PROVIDERS = new Set(['vercel', 'netlify', 'cloudflare']);

// AWS and Azure free tiers are trial-only (12 months), not permanent
const TIME_LIMITED_FREE_TIER = new Set(['aws', 'azure']);

const BANDWIDTH_NOTE_PROVIDERS = new Set(['cloudflare']);
const TIER_NOTE_PROVIDERS = new Set(['render']);

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ProviderRow({ est, isCheapest, maxCost, index }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const pct = (est.monthly_usd / maxCost) * 100;
  const color = BRAND_COLORS[est.provider] || '#6366f1';
  const isServerless = SERVERLESS_PROVIDERS.has(est.provider);
  const isWithinFreeTier = est.monthly_usd === 0;
  const hasTimeLimitedFree = TIME_LIMITED_FREE_TIER.has(est.provider);
  const serverlessNote = est.serverless_note || null;
  const databaseNote = est.database_note || null;
  const bandwidthCapNote = est.bandwidth_cap_note || null;
  const hasBandwidthNote = BANDWIDTH_NOTE_PROVIDERS.has(est.provider);
  const hasTierNote = TIER_NOTE_PROVIDERS.has(est.provider);
  const hasDetails =
    isWithinFreeTier || serverlessNote || databaseNote || bandwidthCapNote || hasBandwidthNote || hasTierNote ||
    Object.values(est.breakdown).some((v) => v > 0);

  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      {/* Main row — always visible */}
      <button
        onClick={() => hasDetails && setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t('common.pricingDetails', { name: est.name })}
        className={`w-full text-left px-4 py-3 bg-white dark:bg-slate-900 transition-colors ${hasDetails ? 'hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center justify-between mb-2.5">
          {/* Left: dot + name + badges */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{est.name}</span>
            {isServerless && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 flex-shrink-0 leading-tight whitespace-nowrap">
                <span className="hidden sm:inline">{t('pricingBreakdown.serverlessFull')}</span>
                <span className="sm:hidden">{t('pricingBreakdown.serverlessShort')}</span>
              </span>
            )}
            {isCheapest && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                {t('pricingBreakdown.bestValue')}
              </span>
            )}
          </div>

          {/* Right: price + chevron */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              ${est.monthly_usd.toFixed(2)}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">{t('pricingBreakdown.perMonth')}</span>
            </span>
            {hasDetails && <ChevronIcon open={open} />}
          </div>
        </div>

        {/* Animated cost bar */}
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(pct, 2)}%` }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
          />
        </div>
      </button>

      {/* Expandable detail panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              {/* Cost breakdown by dimension */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                {Object.entries(est.breakdown).map(([k, v]) =>
                  v > 0 ? (
                    <span key={k} className="text-xs text-slate-500 dark:text-slate-400">
                      {k}:{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                        ${v.toFixed(2)}
                      </span>
                    </span>
                  ) : k === 'database' && databaseNote ? (
                    <span key={k} className="text-xs text-slate-500 dark:text-slate-400">
                      database:{' '}
                      <span className="font-semibold text-slate-400 dark:text-slate-500 tabular-nums">—</span>
                    </span>
                  ) : null
                )}
              </div>

              {/* Contextual notes */}
              <div className="space-y-1">
                {isWithinFreeTier && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
                    {t('pricingBreakdown.freeTierNote')}
                    {hasTimeLimitedFree && ' ' + t('pricingBreakdown.freeTier12Month')}
                  </p>
                )}
                {serverlessNote && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                    ⚡ {serverlessNote}
                  </p>
                )}
                {databaseNote && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                    🗄 {databaseNote}
                  </p>
                )}
                {bandwidthCapNote && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 leading-relaxed">
                    {t('pricingBreakdown.bandwidthCap')} {bandwidthCapNote}
                  </p>
                )}
                {hasBandwidthNote && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed">
                    ✦ {t('pricingBreakdown.cloudflareBandwidth')}
                  </p>
                )}
                {hasTierNote && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                    ℹ {t('pricingBreakdown.renderTier')}
                  </p>
                )}
              </div>

              <Link
                to={`/providers/${est.provider}`}
                className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                {t('pricingBreakdown.viewProfile', { name: est.name })}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingBreakdown({ estimates }) {
  const { t } = useTranslation();

  if (!estimates || estimates.length === 0) return null;

  const sorted = estimates.slice().sort((a, b) => a.monthly_usd - b.monthly_usd);
  const cheapestId = sorted[0]?.provider;
  const maxCost = Math.max(...estimates.map((e) => e.monthly_usd), 1);

  return (
    <div className="space-y-2">
      {sorted.map((est, i) => (
        <ProviderRow
          key={est.provider}
          est={est}
          isCheapest={est.provider === cheapestId}
          maxCost={maxCost}
          index={i}
        />
      ))}

      <p className="text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800 italic leading-relaxed">
        {t('pricingBreakdown.disclaimer')}
      </p>
    </div>
  );
}
