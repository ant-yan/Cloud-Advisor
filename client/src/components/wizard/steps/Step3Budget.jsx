import { Gift, DollarSign, TrendingUp, BarChart2, Infinity } from 'lucide-react';
import OptionCard from '../OptionCard';

const options = [
  { value: 'free', icon: Gift, label: 'Free tier only', description: "I need to get started at $0" },
  { value: 'under50', icon: DollarSign, label: 'Under $50 / mo', description: 'Small project or side hustle' },
  { value: '50-200', icon: TrendingUp, label: '$50 – $200 / mo', description: 'Growing project with real traffic' },
  { value: '200-1000', icon: BarChart2, label: '$200 – $1,000 / mo', description: 'Established product or business' },
  { value: '1000+', icon: Infinity, label: '$1,000+ / mo', description: 'Scale or enterprise workload' },
];

export default function Step3Budget({ value, onChange }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        What's your monthly budget?
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        This is an estimate — you can always scale up later.
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
