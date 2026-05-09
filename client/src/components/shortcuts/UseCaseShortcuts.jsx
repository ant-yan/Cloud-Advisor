import { useNavigate } from 'react-router-dom';
import { Globe, Cpu, Database, Brain, Smartphone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdvisor } from '../../context/AdvisorContext';

const shortcuts = [
  {
    icon: Globe,
    label: 'Host a Website',
    description: 'Static site, landing page, or portfolio',
    answers: { useCase: 'website', budget: 'under50' },
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Cpu,
    label: 'Build a Web App',
    description: 'SaaS product, dashboard, or API',
    answers: { useCase: 'webapp' },
    color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
  },
  {
    icon: Database,
    label: 'Store Files & Data',
    description: 'Backups, media storage, or databases',
    answers: { useCase: 'storage' },
    color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Brain,
    label: 'Train an ML Model',
    description: 'AI, machine learning, or data science',
    answers: { useCase: 'ml' },
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  },
  {
    icon: Smartphone,
    label: 'Mobile App Backend',
    description: 'API and data layer for iOS/Android',
    answers: { useCase: 'mobile' },
    color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  },
  {
    icon: Zap,
    label: 'Something Else',
    description: "Not sure yet? We'll help you figure it out",
    answers: { useCase: 'other' },
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  },
];

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

  const handleClick = (shortcut) => {
    setAnswers(shortcut.answers);
    // Start at step 2 since useCase is pre-filled — skip the first step
    navigate('/wizard', { state: { startAtStep: 2 } });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          What are you building?
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          Pick a starting point and we'll pre-fill the wizard for you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcuts.map((shortcut, i) => {
          const Icon = shortcut.icon;
          return (
            <motion.button
              key={shortcut.label}
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
                {shortcut.label}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {shortcut.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
