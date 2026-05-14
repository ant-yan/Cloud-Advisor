import { Table2, ListTree, HardDrive, Network, KeyRound, Cloud, Container, BrainCircuit, Mail, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import OptionCard from '../OptionCard';

export default function Step6Services({ value = [], onChange, onConfirm, isSubmitting }) {
  const { t } = useTranslation();

  const options = [
    { value: 'database',   icon: Table2,      label: t('wizard.step6.database'),    description: t('wizard.step6.databaseDesc') },
    { value: 'nosql',      icon: ListTree,    label: t('wizard.step6.nosql'),       description: t('wizard.step6.nosqlDesc') },
    { value: 'storage',    icon: HardDrive,   label: t('wizard.step6.storage'),     description: t('wizard.step6.storageDesc') },
    { value: 'cdn',        icon: Network,     label: t('wizard.step6.cdn'),         description: t('wizard.step6.cdnDesc') },
    { value: 'auth',       icon: KeyRound,    label: t('wizard.step6.auth'),        description: t('wizard.step6.authDesc') },
    { value: 'serverless', icon: Cloud,       label: t('wizard.step6.serverless'),  description: t('wizard.step6.serverlessDesc') },
    { value: 'containers', icon: Container,   label: t('wizard.step6.containers'),  description: t('wizard.step6.containersDesc') },
    { value: 'ml',         icon: BrainCircuit,label: t('wizard.step6.ml'),          description: t('wizard.step6.mlDesc') },
    { value: 'email',      icon: Mail,        label: t('wizard.step6.email'),       description: t('wizard.step6.emailDesc') },
    { value: 'none',       icon: X,           label: t('wizard.step6.none'),        description: t('wizard.step6.noneDesc') },
  ];

  const toggle = (v) => {
    if (v === 'none') {
      onChange(value.includes('none') ? [] : ['none']);
      return;
    }
    const withoutNone = value.filter((x) => x !== 'none');
    if (withoutNone.includes(v)) {
      onChange(withoutNone.filter((x) => x !== v));
    } else {
      onChange([...withoutNone, v]);
    }
  };

  const canContinue = value.length > 0;

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        {t('wizard.step6.title')}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        {t('wizard.step6.subtitle')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = value.includes(opt.value);
          const isDisabled = !isSelected && value.includes('none') && opt.value !== 'none';
          return (
            <OptionCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              description={opt.description}
              selected={isSelected}
              disabled={isDisabled}
              onClick={() => toggle(opt.value)}
            />
          );
        })}
      </div>

      <motion.div
        className="mt-6 flex justify-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: canContinue ? 1 : 0, y: canContinue ? 0 : 8 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onConfirm}
          disabled={!canContinue || isSubmitting}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('wizard.step6.analyzing')}
            </>
          ) : (
            t('wizard.step6.getRecommendation')
          )}
        </button>
      </motion.div>
    </div>
  );
}
