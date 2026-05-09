import { motion } from 'framer-motion';
import { useAdvisor } from '../../context/AdvisorContext';

const stepLabels = ['Use Case', 'Profile', 'Budget', 'Priorities', 'Geography', 'Services'];

export default function WizardProgress({ step, totalSteps }) {
  const { state } = useAdvisor();
  const isDark = state.theme === 'dark';
  const pct = (step / totalSteps) * 100;

  // Hardcoded hex is required for Framer Motion animate — derive from theme
  const dotInactive = isDark ? '#1e293b' : '#e2e8f0';

  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-4">
      {/* Step label */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Step {step} of {totalSteps}
        </span>
        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
          {stepLabels[step - 1]}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {/* Dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            animate={{
              backgroundColor: i < step ? '#6366f1' : dotInactive,
              scale: i === step - 1 ? 1.4 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
