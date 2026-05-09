import { Globe, LayoutDashboard, Smartphone, Database, Brain, HelpCircle } from 'lucide-react';
import OptionCard from '../OptionCard';

const options = [
  { value: 'website', icon: Globe, label: 'Simple website', description: 'Landing page, blog, or portfolio' },
  { value: 'webapp', icon: LayoutDashboard, label: 'Web app / SaaS', description: 'Dashboard, product, or platform' },
  { value: 'mobile', icon: Smartphone, label: 'Mobile app backend', description: 'API and data for iOS / Android' },
  { value: 'storage', icon: Database, label: 'Data storage / backup', description: 'Files, databases, or backups' },
  { value: 'ml', icon: Brain, label: 'ML / AI workloads', description: 'Training, inference, or data science' },
  { value: 'other', icon: HelpCircle, label: 'Something else', description: "Not sure yet — we'll help figure it out" },
];

export default function Step1UseCase({ value, onChange }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        What are you building?
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        Pick the option that best describes your project.
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
