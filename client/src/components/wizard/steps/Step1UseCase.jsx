import { Globe, LayoutDashboard, Smartphone, Database, Brain, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OptionCard from '../OptionCard';

export default function Step1UseCase({ value, onChange }) {
  const { t } = useTranslation();

  const options = [
    { value: 'website', icon: Globe,          label: t('wizard.step1.website'),  description: t('wizard.step1.websiteDesc') },
    { value: 'webapp',  icon: LayoutDashboard, label: t('wizard.step1.webapp'),   description: t('wizard.step1.webappDesc') },
    { value: 'mobile',  icon: Smartphone,      label: t('wizard.step1.mobile'),   description: t('wizard.step1.mobileDesc') },
    { value: 'storage', icon: Database,        label: t('wizard.step1.storage'),  description: t('wizard.step1.storageDesc') },
    { value: 'ml',      icon: Brain,           label: t('wizard.step1.ml'),       description: t('wizard.step1.mlDesc') },
    { value: 'other',   icon: HelpCircle,      label: t('wizard.step1.other'),    description: t('wizard.step1.otherDesc') },
  ];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        {t('wizard.step1.title')}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        {t('wizard.step1.subtitle')}
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
