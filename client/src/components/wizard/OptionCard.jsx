import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function OptionCard({ icon: Icon, label, description, selected, disabled, onClick }) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      aria-pressed={selected}
      aria-disabled={disabled}
      className={cn(
        'group w-full text-left flex items-start gap-4 p-4 rounded-card border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : disabled
          ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 opacity-40 cursor-not-allowed'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-card-hover cursor-pointer'
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          'w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center transition-colors duration-150',
          selected
            ? 'bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-500'
        )}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div
          className={cn(
            'text-sm font-semibold leading-snug',
            selected
              ? 'text-primary-700 dark:text-primary-300'
              : 'text-slate-900 dark:text-white'
          )}
        >
          {label}
        </div>
        {description && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            {description}
          </div>
        )}
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </motion.button>
  );
}
