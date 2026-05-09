import { Coins, Smile, TrendingUp, ShieldCheck, Headphones, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import OptionCard from '../OptionCard';

const options = [
  { value: 'cost', icon: Coins, label: 'Lowest cost', description: 'Keep the bill as small as possible' },
  { value: 'ease', icon: Smile, label: 'Easiest to use', description: "Simple UI, great docs, gentle learning curve" },
  { value: 'scalability', icon: TrendingUp, label: 'Best scalability', description: 'Ready to handle sudden traffic spikes' },
  { value: 'compliance', icon: ShieldCheck, label: 'Compliance / security', description: 'GDPR, HIPAA, SOC 2, FedRAMP support' },
  { value: 'support', icon: Headphones, label: '24/7 support', description: 'Real humans available when things break' },
  { value: 'performance', icon: Zap, label: 'Fastest performance', description: 'Lowest latency and highest throughput' },
];

const MAX_SELECTIONS = 2;

export default function Step4Priorities({ value = [], onChange, onConfirm }) {
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
        What matters most?
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        Pick up to <strong>2</strong> priorities for your project.
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

      {/* Confirm button */}
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
          {value.length === 0 ? 'Select at least 1' : `Continue with ${value.length} selected →`}
        </button>
      </motion.div>
    </div>
  );
}
