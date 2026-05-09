import { Table2, ListTree, HardDrive, Network, KeyRound, Cloud, Container, BrainCircuit, Mail, X } from 'lucide-react';
import { motion } from 'framer-motion';
import OptionCard from '../OptionCard';

const options = [
  { value: 'database', icon: Table2, label: 'Relational database', description: 'PostgreSQL, MySQL, SQL Server' },
  { value: 'nosql', icon: ListTree, label: 'NoSQL database', description: 'MongoDB, DynamoDB, Firestore' },
  { value: 'storage', icon: HardDrive, label: 'File storage', description: 'S3-compatible object storage' },
  { value: 'cdn', icon: Network, label: 'CDN', description: 'Global content delivery network' },
  { value: 'auth', icon: KeyRound, label: 'Authentication', description: 'User login, OAuth, SSO' },
  { value: 'serverless', icon: Cloud, label: 'Serverless functions', description: 'Lambda, Cloud Functions, Edge' },
  { value: 'containers', icon: Container, label: 'Containers / Kubernetes', description: 'Docker, ECS, GKE, AKS' },
  { value: 'ml', icon: BrainCircuit, label: 'AI / ML APIs', description: 'Vision, NLP, custom models' },
  { value: 'email', icon: Mail, label: 'Email service', description: 'Transactional or marketing email' },
  { value: 'none', icon: X, label: 'None of the above', description: "I don't need specific services" },
];

export default function Step6Services({ value = [], onChange, onConfirm, isSubmitting }) {
  const toggle = (v) => {
    if (v === 'none') {
      onChange(value.includes('none') ? [] : ['none']);
      return;
    }
    const withoutNone = value.filter((x) => x !== 'none');
    if (withoutNone.includes(v)) {
      onChange(withoutNone.filter((x) => x !== v));
    } else {
      onChange([...withoutNone, v]);
    }
  };

  const canContinue = value.length > 0;

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        Any specific services needed?
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        Select all that apply — this sharpens the recommendation.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = value.includes(opt.value);
          const isDisabled = !isSelected && value.includes('none') && opt.value !== 'none';
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

      <motion.div
        className="mt-6 flex justify-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: canContinue ? 1 : 0, y: canContinue ? 0 : 8 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onConfirm}
          disabled={!canContinue || isSubmitting}
          className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            'Get my recommendation →'
          )}
        </button>
      </motion.div>
    </div>
  );
}
