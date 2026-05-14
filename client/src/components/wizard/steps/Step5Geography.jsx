import { MapPin, Map, Globe, Flag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OptionCard from '../OptionCard';

export default function Step5Geography({ value, onChange }) {
  const { t } = useTranslation();

  const options = [
    { value: 'single',   icon: MapPin, label: t('wizard.step5.single'),   description: t('wizard.step5.singleDesc') },
    { value: 'multiple', icon: Map,    label: t('wizard.step5.multiple'),  description: t('wizard.step5.multipleDesc') },
    { value: 'global',   icon: Globe,  label: t('wizard.step5.global'),    description: t('wizard.step5.globalDesc') },
    { value: 'specific', icon: Flag,   label: t('wizard.step5.specific'),  description: t('wizard.step5.specificDesc') },
  ];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        {t('wizard.step5.title')}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        {t('wizard.step5.subtitle')}
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
