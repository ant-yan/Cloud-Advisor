import { Coins, Smile, TrendingUp, ShieldCheck, Headphones, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import OptionCard from '../OptionCard';

const MAX_SELECTIONS = 2;

export default function Step4Priorities({ value = [], onChange, onConfirm }) {
  const { t } = useTranslation();

  const options = [
    { value: 'cost',        icon: Coins,       label: t('wizard.step4.cost'),        description: t('wizard.step4.costDesc') },
    { value: 'ease',        icon: Smile,       label: t('wizard.step4.ease'),        description: t('wizard.step4.easeDesc') },
    { value: 'scalability', icon: TrendingUp,  label: t('wizard.step4.scalability'), description: t('wizard.step4.scalabilityDesc') },
    { value: 'compliance',  icon: ShieldCheck, label: t('wizard.step4.compliance'),  description: t('wizard.step4.complianceDesc') },
    { value: 'support',     icon: Headphones,  label: t('wizard.step4.support'),     description: t('wizard.step4.supportDesc') },
    { value: 'performance', icon: Zap,         label: t('wizard.step4.performance'), description: t('wizard.step4.performanceDesc') },
  ];

  const toggle = (v) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else if (value.length < MAX_SELECTIONS) {
      onChange([...value, v]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        {t('wizard.step4.title')}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        <Trans i18nKey="wizard.step4.subtitle" components={{ strong: <strong /> }} />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = value.includes(opt.value);
          const isDisabled = !isSelected && value.length >= MAX_SELECTIONS;
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
        animate={{ opacity: value.length > 0 ? 1 : 0, y: value.length > 0 ? 0 : 8 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onConfirm}
          disabled={value.length === 0}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors"
        >
          {value.length === 0
            ? t('wizard.step4.selectAtLeast1')
            : t('wizard.step4.continueWith', { count: value.length })}
        </button>
      </motion.div>
    </div>
  );
}
