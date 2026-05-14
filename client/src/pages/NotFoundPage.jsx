import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page Not Found');
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
          <Cloud className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2">404</h1>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {t('notFound.heading')}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-xs">
          {t('notFound.message')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {t('notFound.goHome')}
          </Link>
          <Link
            to="/wizard"
            className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
          >
            {t('notFound.startWizard')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
