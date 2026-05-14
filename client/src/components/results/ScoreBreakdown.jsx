import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Tooltip from '../ui/Tooltip';

function getBarColor(pct) {
  if (pct >= 0.75) return 'bg-emerald-500';
  if (pct >= 0.5) return 'bg-amber-500';
  return 'bg-rose-400';
}

export default function ScoreBreakdown({ breakdown, delay = 0 }) {
  const { t } = useTranslation();

  const dimensions = [
    { key: 'useCase',    label: t('scoreBreakdown.useCase'),    max: 30, why: t('scoreBreakdown.useCaseWhy') },
    { key: 'budget',     label: t('scoreBreakdown.budget'),     max: 25, why: t('scoreBreakdown.budgetWhy') },
    { key: 'easeOfUse',  label: t('scoreBreakdown.easeOfUse'),  max: 20, why: t('scoreBreakdown.easeOfUseWhy') },
    { key: 'geography',  label: t('scoreBreakdown.geography'),  max: 15, why: t('scoreBreakdown.geographyWhy') },
    { key: 'services',   label: t('scoreBreakdown.services'),   max: 10, why: t('scoreBreakdown.servicesWhy') },
  ];

  return (
    <div className="space-y-3">
      {dimensions.map((dim, i) => {
        const value = breakdown?.[dim.key] ?? 0;
        const pct = value / dim.max;
        return (
          <div key={dim.key}>
            <div className="flex justify-between items-center mb-1">
              <Tooltip content={dim.why}>
                <span className="text-xs text-slate-500 dark:text-slate-400 cursor-help">{dim.label}</span>
              </Tooltip>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {value}/{dim.max}
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getBarColor(pct)}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct * 100}%` }}
                transition={{ duration: 0.5, delay: delay + i * 0.06, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
        {t('scoreBreakdown.hint')}
      </p>
    </div>
  );
}
