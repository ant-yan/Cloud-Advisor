import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CompareRow from './CompareRow';
import TermTooltip from '../ui/TermTooltip';

const CATEGORY_KEYS = ['Pricing', 'Services', 'Infrastructure', 'Compliance', 'Developer Experience'];

const ROWS_BY_CATEGORY = {
  'Pricing': [
    { key: 'freeTier' },
    { key: 'payAsYouGo' },
    { key: 'predictablePricing' },
  ],
  'Services': [
    { key: 'managedDatabase', tooltip: true },
    { key: 'serverless', tooltip: true },
    { key: 'kubernetes', tooltip: true },
    { key: 'cdn', tooltip: true },
    { key: 'aiMlApis', tooltip: true },
  ],
  'Infrastructure': [
    { key: 'multiRegion', tooltip: true },
    { key: 'globalNetwork', tooltip: true },
    { key: 'ddosProtection', tooltip: true },
    { key: 'sla99_9', tooltip: true },
  ],
  'Compliance': [
    { key: 'gdpr', tooltip: true },
    { key: 'hipaa', tooltip: true },
    { key: 'soc2', tooltip: true },
    { key: 'iso27001', tooltip: true },
  ],
  'Developer Experience': [
    { key: 'cli' },
    { key: 'terraformSupport', tooltip: true },
    { key: 'githubIntegration', tooltip: true },
    { key: 'monitoring' },
  ],
};

export default function FeatureMatrix({ providers }) {
  const { t } = useTranslation();
  if (!providers.length) return null;

  let rowIndex = 0;

  return (
    <div>
      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
              <th className="pb-3 text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider w-44">
                {t('compare.featureColumn')}
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
            {CATEGORY_KEYS.map((catKey) => {
              const rows = ROWS_BY_CATEGORY[catKey];
              return (
                <React.Fragment key={catKey}>
                  <tr className="bg-slate-50 dark:bg-slate-800/40">
                    <td
                      colSpan={providers.length + 1}
                      className="py-2 px-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                    >
                      {t(`compare.categories.${catKey}`)}
                    </td>
                  </tr>
                  {rows.map((row) => {
                    const delay = rowIndex++ * 0.03;
                    const featureLabel = t(`compare.features.${row.key}`);
                    const label = row.tooltip ? (
                      <TermTooltip term={featureLabel}>{featureLabel}</TermTooltip>
                    ) : (
                      featureLabel
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
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-flex w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 items-center justify-center flex-shrink-0">
            <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          {t('compare.uniqueAdvantage')}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {t('compare.sharedByAll')}
        </span>
      </div>
    </div>
  );
}
