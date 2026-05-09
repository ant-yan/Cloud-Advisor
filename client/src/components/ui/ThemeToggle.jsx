import { Sun, Moon } from 'lucide-react';
import { useAdvisor } from '../../context/AdvisorContext';

export default function ThemeToggle() {
  const { state, toggleTheme } = useAdvisor();
  const isDark = state.theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
