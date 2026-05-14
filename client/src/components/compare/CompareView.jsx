import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import FeatureMatrix from './FeatureMatrix';

export default function CompareView({ selectedIds, onToggle, fullProviders }) {
  const { t } = useTranslation();
  const selected = fullProviders.filter((p) => selectedIds.includes(p.id));
  const canCompare = selected.length >= 2 && selected.length <= 3;

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          {t('compare.select23')}{' '}
          {selected.length > 0 && (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {t('compare.selectedCount', { count: selected.length })}
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {fullProviders.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <button
                key={p.id}
                onClick={() => !isDisabled && onToggle(p.id)}
                disabled={isDisabled}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? t('common.remove') : t('common.add')} ${p.name}`}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-150',
                  isSelected
                    ? 'border-transparent text-white shadow-md'
                    : isDisabled
                    ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-900'
                )}
                style={isSelected ? { backgroundColor: p.brandColor === '#000000' ? '#111827' : p.brandColor } : {}}
              >
                {isSelected && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {canCompare ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-900 rounded-card border border-slate-200 dark:border-slate-700 p-5 shadow-card"
        >
          <FeatureMatrix providers={selected} />
        </motion.div>
      ) : (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500 text-sm">
          {t('compare.selectAtLeast2')}
        </div>
      )}
    </div>
  );
}
