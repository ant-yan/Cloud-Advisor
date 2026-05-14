import { Gift, DollarSign, TrendingUp, BarChart2, Infinity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OptionCard from '../OptionCard';

export default function Step3Budget({ value, onChange }) {
  const { t } = useTranslation();

  const options = [
    { value: 'free',     icon: Gift,       label: t('wizard.step3.free'),     description: t('wizard.step3.freeDesc') },
    { value: 'under50',  icon: DollarSign, label: t('wizard.step3.under50'),  description: t('wizard.step3.under50Desc') },
    { value: '50-200',   icon: TrendingUp, label: t('wizard.step3.50_200'),   description: t('wizard.step3.50_200Desc') },
    { value: '200-1000', icon: BarChart2,  label: t('wizard.step3.200_1000'), description: t('wizard.step3.200_1000Desc') },
    { value: '1000+',    icon: Infinity,   label: t('wizard.step3.1000plus'), description: t('wizard.step3.1000plusDesc') },
  ];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        {t('wizard.step3.title')}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        {t('wizard.step3.subtitle')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
