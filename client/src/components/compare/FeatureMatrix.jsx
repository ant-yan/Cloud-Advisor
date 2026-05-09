import React from 'react';
import { Link } from 'react-router-dom';
import CompareRow from './CompareRow';
import TermTooltip from '../ui/TermTooltip';

const categories = [
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
      { key: 'managedDatabase', label: 'Managed databases', tooltip: 'Managed databases' },
      { key: 'serverless', label: 'Serverless functions', tooltip: 'Serverless functions' },
      { key: 'kubernetes', label: 'Managed Kubernetes', tooltip: 'Managed Kubernetes' },
      { key: 'cdn', label: 'Built-in CDN', tooltip: 'Built-in CDN' },
      { key: 'aiMlApis', label: 'AI / ML APIs', tooltip: 'AI / ML APIs' },
    ],
  },
  {
    name: 'Infrastructure',
    rows: [
      { key: 'multiRegion', label: 'Multi-region', tooltip: 'Multi-region' },
      { key: 'globalNetwork', label: 'Global edge network', tooltip: 'Global edge network' },
      { key: 'ddosProtection', label: 'DDoS protection', tooltip: 'DDoS protection' },
      { key: 'sla99_9', label: '99.9%+ SLA', tooltip: '99.9%+ SLA' },
    ],
  },
  {
    name: 'Compliance',
    rows: [
      { key: 'gdpr', label: 'GDPR', tooltip: 'GDPR' },
      { key: 'hipaa', label: 'HIPAA eligible', tooltip: 'HIPAA eligible' },
      { key: 'soc2', label: 'SOC 2', tooltip: 'SOC 2' },
      { key: 'iso27001', label: 'ISO 27001', tooltip: 'ISO 27001' },
    ],
  },
  {
    name: 'Developer Experience',
    rows: [
      { key: 'cli', label: 'Official CLI' },
      { key: 'terraformSupport', label: 'Terraform support', tooltip: 'Terraform support' },
      { key: 'githubIntegration', label: 'GitHub integration', tooltip: 'GitHub integration' },
      { key: 'monitoring', label: 'Built-in monitoring' },
    ],
  },
];

export default function FeatureMatrix({ providers }) {
  if (!providers.length) return null;

  let rowIndex = 0;

  return (
    <div>
      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
              <th className="pb-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-44">
                Feature
              </th>
              {providers.map((p) => (
                <th key={p.id} className="pb-3 px-4 text-center">
                  <Link
                    to={`/providers/${p.id}`}
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: p.brandColor === '#000000' ? '#111827' : p.brandColor }}
                    title={`View ${p.name} full profile`}
                  >
                    {p.name}
                  </Link>
                  {p.score !== undefined && (
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                      {Math.round(p.score)}<span className="font-normal text-slate-400 dark:text-slate-500">/100</span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <React.Fragment key={cat.name}>
                <tr className="bg-slate-50 dark:bg-slate-800/40">
                  <td
                    colSpan={providers.length + 1}
                    className="py-2 px-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                  >
                    {cat.name}
                  </td>
                </tr>
                {cat.rows.map((row) => {
                  const delay = rowIndex++ * 0.03;
                  const label = row.tooltip ? (
                    <TermTooltip term={row.tooltip}>{row.label}</TermTooltip>
                  ) : (
                    row.label
                  );
                  return (
                    <CompareRow
                      key={row.key}
                      label={label}
                      values={providers.map((p) => p.features?.[row.key] ?? false)}
                      delay={delay}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-flex w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          Unique advantage among selected providers
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Shared by all selected providers
        </span>
      </div>
    </div>
  );
}
