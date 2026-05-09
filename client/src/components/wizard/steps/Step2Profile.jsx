import { BookOpen, User, Rocket, Building2, Building } from 'lucide-react';
import OptionCard from '../OptionCard';

const options = [
  { value: 'student', icon: BookOpen, label: 'Student / learning', description: 'Taking a course or building a portfolio project' },
  { value: 'solo', icon: User, label: 'Solo developer', description: 'Indie hacker or freelancer' },
  { value: 'startup', icon: Rocket, label: 'Startup', description: 'Early-stage team moving fast' },
  { value: 'small-business', icon: Building2, label: 'Small business', description: 'Established company with a team' },
  { value: 'enterprise', icon: Building, label: 'Enterprise', description: 'Large org with compliance needs' },
];

export default function Step2Profile({ value, onChange }) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        Who are you?
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm sm:text-base">
        This helps us calibrate ease-of-use and support recommendations.
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
