import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AIExplanation({ explanation }) {
  const { t } = useTranslation();

  if (!explanation) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500">{t('results.aiExplanation')}</span>
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500 italic">
          {t('results.aiExplanationFallback')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-100 dark:border-primary-800/50">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">{t('results.aiExplanation')}</span>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
        {explanation}
      </p>
    </div>
  );
}
