import { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getPricing } from '../../lib/api';
import PricingSlider from './PricingSlider';
import PricingBreakdown from './PricingBreakdown';
import LoadingSpinner from '../ui/LoadingSpinner';

function downloadCSV(estimates, resources) {
  const breakdownKeys = [...new Set(estimates.flatMap((e) => Object.keys(e.breakdown)))];
  const header = ['Provider', 'Monthly (USD)', ...breakdownKeys.map((k) => k.charAt(0).toUpperCase() + k.slice(1)), 'Notes'];
  const rows = estimates
    .slice()
    .sort((a, b) => a.monthly_usd - b.monthly_usd)
    .map((e) => [
      e.name,
      e.monthly_usd.toFixed(2),
      ...breakdownKeys.map((k) => (e.breakdown[k] ?? 0).toFixed(2)),
      e.serverless_note ? `"${e.serverless_note.replace(/"/g, '""')}"` : '',
    ]);
  const meta = [
    [],
    ['# Configuration'],
    [`Compute,${resources.computeHours} hrs/mo`],
    [`Storage,${resources.storageGb} GB`],
    [`Bandwidth,${resources.bandwidthGb} GB/mo`],
    [`Databases,${resources.databaseInstances}`],
  ];
  const csv = [[header, ...rows, ...meta].map((r) => r.join(',')).join('\n')];
  const blob = new Blob(csv, { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cloudadvisor-pricing.csv';
  a.click();
  URL.revokeObjectURL(url);
}

const DEFAULT_RESOURCES = {
  computeHours: 720,
  storageGb: 50,
  bandwidthGb: 100,
  databaseInstances: 1,
};

const ALL_PROVIDER_IDS = ['aws', 'gcp', 'azure', 'digitalocean', 'vercel', 'netlify', 'render', 'cloudflare'];

export default function PricingEstimator() {
  const { t } = useTranslation();
  const [resources, setResources] = useState(DEFAULT_RESOURCES);
  const [estimates, setEstimates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const setResource = useCallback((key, value) => {
    setResources((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPricing(ALL_PROVIDER_IDS, resources);
        if (!cancelled) setEstimates(data.estimates);
      } catch {
        if (!cancelled) setError(t('pricing.fetchError'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [resources, t]);

  const computeHint = resources.computeHours === 0
    ? t('pricing.computeHint0')
    : resources.computeHours <= 720
    ? t('pricing.computeHintLow', { n: resources.computeHours, pct: (resources.computeHours / 720 * 100).toFixed(0) })
    : t('pricing.computeHintHigh', { n: resources.computeHours, x: (resources.computeHours / 720).toFixed(1) });

  const storageHint = resources.storageGb === 0
    ? t('pricing.storageHint0')
    : resources.storageGb < 100
    ? t('pricing.storageHintXS', { n: resources.storageGb })
    : resources.storageGb < 1000
    ? t('pricing.storageHintMd', { n: resources.storageGb })
    : t('pricing.storageHintLg', { n: resources.storageGb });

  const bandwidthHint = resources.bandwidthGb === 0
    ? t('pricing.bandwidthHint0')
    : resources.bandwidthGb < 200
    ? t('pricing.bandwidthHintXS', { n: resources.bandwidthGb })
    : resources.bandwidthGb < 1000
    ? t('pricing.bandwidthHintMd', { n: resources.bandwidthGb })
    : t('pricing.bandwidthHintLg', { n: resources.bandwidthGb });

  const databasesHint = resources.databaseInstances === 0
    ? t('pricing.databasesHint0')
    : resources.databaseInstances === 1
    ? t('pricing.databasesHint1')
    : t('pricing.databasesHintN', { n: resources.databaseInstances });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-card border border-slate-200 dark:border-slate-700 p-6 shadow-card space-y-7">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t('pricing.configureUsage')}</h2>

        <div className="space-y-1.5">
          <PricingSlider
            label={t('pricing.compute')}
            sublabel={t('pricing.computeSublabel')}
            value={resources.computeHours}
            min={0}
            max={2160}
            unit="hrs"
            onChange={(v) => setResource('computeHours', v)}
            hint={computeHint}
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            {t('pricing.computeNote')}
          </p>
        </div>
        <PricingSlider
          label={t('pricing.storage')}
          sublabel={t('pricing.storageSublabel')}
          value={resources.storageGb}
          min={0}
          max={5000}
          unit="GB"
          onChange={(v) => setResource('storageGb', v)}
          hint={storageHint}
        />
        <PricingSlider
          label={t('pricing.bandwidth')}
          sublabel={t('pricing.bandwidthSublabel')}
          value={resources.bandwidthGb}
          min={0}
          max={2000}
          unit="GB"
          onChange={(v) => setResource('bandwidthGb', v)}
          hint={bandwidthHint}
        />
        <PricingSlider
          label={t('pricing.databases')}
          sublabel={t('pricing.databasesSublabel')}
          value={resources.databaseInstances}
          min={0}
          max={10}
          unit="db"
          onChange={(v) => setResource('databaseInstances', v)}
          hint={databasesHint}
        />
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-slate-900 rounded-card border border-slate-200 dark:border-slate-700 p-6 shadow-card">
        <div className="flex items-center justify-between mb-5 gap-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            {t('pricing.estimatedCost')}
          </h2>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isLoading && <LoadingSpinner size="sm" />}
            {estimates && !isLoading && (
              <button
                onClick={() => downloadCSV(estimates, resources)}
                title="Download as CSV"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('pricing.exportCSV')}</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>
        )}

        {!error && estimates && (
          <PricingBreakdown estimates={estimates} />
        )}

        {!error && !estimates && !isLoading && (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {t('pricing.adjustSliders')}
          </p>
        )}
      </div>
    </div>
  );
}
