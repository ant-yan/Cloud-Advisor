import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QuickStartGuide({ provider }) {
  const { t } = useTranslation();

  if (!provider?.gettingStarted?.length) return null;

  return (
    <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
      <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
        {t('results.gettingStartedWith', { name: provider.name })}
      </h3>
      <ol className="space-y-2">
        {provider.gettingStarted.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
