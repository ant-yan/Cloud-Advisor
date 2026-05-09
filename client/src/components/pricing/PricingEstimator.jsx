import { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import { getPricing } from '../../lib/api';
import PricingSlider from './PricingSlider';
import PricingBreakdown from './PricingBreakdown';
import LoadingSpinner from '../ui/LoadingSpinner';

function downloadCSV(estimates, resources) {
  const breakdownKeys = [...new Set(estimates.flatMap((e) => Object.keys(e.breakdown)))];
  const header = ['Provider', 'Monthly (USD)', ...breakdownKeys.map((k) => k.charAt(0).toUpperCase() + k.slice(1))];
  const rows = estimates
    .slice()
    .sort((a, b) => a.monthly_usd - b.monthly_usd)
    .map((e) => [
      e.name,
      e.monthly_usd.toFixed(2),
      ...breakdownKeys.map((k) => (e.breakdown[k] ?? 0).toFixed(2)),
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
        if (!cancelled) setError('Failed to calculate estimates. Is the server running?');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [resources]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-card border border-slate-200 dark:border-slate-700 p-6 shadow-card space-y-7">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Configure your usage</h2>

        <PricingSlider
          label="Compute"
          sublabel="instance hours / month"
          value={resources.computeHours}
          min={0}
          max={2160}
          unit="hrs"
          onChange={(v) => setResource('computeHours', v)}
          hint={
            resources.computeHours === 0
              ? 'No compute — good for static sites or serverless-only.'
              : resources.computeHours <= 720
              ? `${resources.computeHours} hrs = ${(resources.computeHours / 720 * 100).toFixed(0)}% of one server running 24/7 for a month.`
              : `${resources.computeHours} hrs = ${(resources.computeHours / 720).toFixed(1)}× the cost of one always-on server.`
          }
        />
        <PricingSlider
          label="Storage"
          sublabel="GB stored"
          value={resources.storageGb}
          min={0}
          max={5000}
          unit="GB"
          onChange={(v) => setResource('storageGb', v)}
          hint={
            resources.storageGb === 0
              ? 'No persistent storage selected.'
              : resources.storageGb < 100
              ? `${resources.storageGb} GB — suitable for small apps, logs, or a few media files.`
              : resources.storageGb < 1000
              ? `${resources.storageGb} GB — mid-range; covers most production apps.`
              : `${resources.storageGb} GB — large dataset or media-heavy workload.`
          }
        />
        <PricingSlider
          label="Bandwidth"
          sublabel="GB outbound / month"
          value={resources.bandwidthGb}
          min={0}
          max={2000}
          unit="GB"
          onChange={(v) => setResource('bandwidthGb', v)}
          hint={
            resources.bandwidthGb === 0
              ? 'No outbound transfer — good for internal or low-traffic apps.'
              : resources.bandwidthGb < 200
              ? `${resources.bandwidthGb} GB — typical for a low-traffic website or API.`
              : resources.bandwidthGb < 1000
              ? `${resources.bandwidthGb} GB — moderate traffic; egress costs vary widely by provider.`
              : `${resources.bandwidthGb} GB — high traffic; Cloudflare R2 has zero egress fees here.`
          }
        />
        <PricingSlider
          label="Databases"
          sublabel="managed instances"
          value={resources.databaseInstances}
          min={0}
          max={10}
          unit="db"
          onChange={(v) => setResource('databaseInstances', v)}
          hint={
            resources.databaseInstances === 0
              ? 'No managed databases — using a self-managed DB or none.'
              : resources.databaseInstances === 1
              ? '1 managed database — standard for most web apps.'
              : `${resources.databaseInstances} instances — multi-service or microservices setup.`
          }
        />
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-slate-900 rounded-card border border-slate-200 dark:border-slate-700 p-6 shadow-card">
        <div className="flex items-center justify-between mb-5 gap-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Estimated monthly cost
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
                <span className="hidden sm:inline">Export CSV</span>
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
            Adjust the sliders to see estimated costs.
          </p>
        )}
      </div>
    </div>
  );
}
