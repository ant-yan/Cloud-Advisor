import { MapPin, Map, Globe, Flag } from 'lucide-react';
import OptionCard from '../OptionCard';

const options = [
  { value: 'single', icon: MapPin, label: 'Just me / one region', description: "My users are all in the same country" },
  { value: 'multiple', icon: Map, label: 'Multiple countries', description: 'Users across a few different regions' },
  { value: 'global', icon: Globe, label: 'Global audience', description: 'Users everywhere — latency matters a lot' },
  { value: 'specific', icon: Flag, label: 'Specific region', description: 'Data must stay in EU, US, or Asia' },
];

export default function Step5Geography({ value, onChange }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        Where are your users?
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        Geographic coverage affects both performance and compliance.
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
