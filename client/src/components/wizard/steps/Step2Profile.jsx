import { BookOpen, User, Rocket, Building2, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OptionCard from '../OptionCard';

export default function Step2Profile({ value, onChange }) {
  const { t } = useTranslation();

  const options = [
    { value: 'student',       icon: BookOpen,  label: t('wizard.step2.student'),      description: t('wizard.step2.studentDesc') },
    { value: 'solo',          icon: User,      label: t('wizard.step2.solo'),         description: t('wizard.step2.soloDesc') },
    { value: 'startup',       icon: Rocket,    label: t('wizard.step2.startup'),      description: t('wizard.step2.startupDesc') },
    { value: 'small-business',icon: Building2, label: t('wizard.step2.smallBusiness'),description: t('wizard.step2.smallBusinessDesc') },
    { value: 'enterprise',    icon: Building,  label: t('wizard.step2.enterprise'),   description: t('wizard.step2.enterpriseDesc') },
  ];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        {t('wizard.step2.title')}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        {t('wizard.step2.subtitle')}
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
