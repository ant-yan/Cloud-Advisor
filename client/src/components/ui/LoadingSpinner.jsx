import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

export default function LoadingSpinner({ size = 'md', className }) {
  const { t } = useTranslation();
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={cn(
        'rounded-full border-slate-200 dark:border-slate-700 border-t-primary-500 animate-spin',
        sizes[size],
        className
      )}
      role="status"
      aria-label={t('common.loading')}
    />
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <LoadingSpinner size="lg" />
      <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
    </div>
  );
}
