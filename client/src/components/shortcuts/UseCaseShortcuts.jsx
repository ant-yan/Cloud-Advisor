import { useNavigate } from 'react-router-dom';
import { Globe, Cpu, Database, Brain, Smartphone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAdvisor } from '../../context/AdvisorContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.25, ease: 'easeOut' },
  }),
};

export default function UseCaseShortcuts() {
  const navigate = useNavigate();
  const { setAnswers } = useAdvisor();
  const { t } = useTranslation();

  const shortcuts = [
    {
      icon: Globe,
      labelKey: 'shortcuts.hostWebsite',
      descKey: 'shortcuts.hostWebsiteDesc',
      answers: { useCase: 'website', budget: 'under50' },
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      icon: Cpu,
      labelKey: 'shortcuts.buildWebApp',
      descKey: 'shortcuts.buildWebAppDesc',
      answers: { useCase: 'webapp' },
      color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: Database,
      labelKey: 'shortcuts.storeFiles',
      descKey: 'shortcuts.storeFilesDesc',
      answers: { useCase: 'storage' },
      color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Brain,
      labelKey: 'shortcuts.trainML',
      descKey: 'shortcuts.trainMLDesc',
      answers: { useCase: 'ml' },
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
    {
      icon: Smartphone,
      labelKey: 'shortcuts.mobileBackend',
      descKey: 'shortcuts.mobileBackendDesc',
      answers: { useCase: 'mobile' },
      color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    },
    {
      icon: Zap,
      labelKey: 'shortcuts.somethingElse',
      descKey: 'shortcuts.somethingElseDesc',
      answers: { useCase: 'other' },
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    },
  ];

  const handleClick = (shortcut) => {
    setAnswers(shortcut.answers);
    navigate('/wizard', { state: { startAtStep: 2 } });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {t('shortcuts.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {t('shortcuts.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcuts.map((shortcut, i) => {
          const Icon = shortcut.icon;
          return (
            <motion.button
              key={shortcut.labelKey}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              onClick={() => handleClick(shortcut)}
              className="group text-left p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-card shadow-card hover:shadow-card-hover hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${shortcut.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {t(shortcut.labelKey)}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t(shortcut.descKey)}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
