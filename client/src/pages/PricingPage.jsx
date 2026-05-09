import { motion } from 'framer-motion';
import PricingEstimator from '../components/pricing/PricingEstimator';
import { usePageTitle } from '../hooks/usePageTitle';

export default function PricingPage() {
  usePageTitle('Pricing Estimator');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-5xl mx-auto px-4 py-10"
    >
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
          Pricing Estimator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Adjust the sliders to estimate your monthly cloud bill across all 8 providers.
        </p>
      </div>
      <PricingEstimator />
    </motion.div>
  );
}
