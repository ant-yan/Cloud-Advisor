import { useTranslation } from 'react-i18next';

export default function PricingSlider({ label, sublabel, value, min, max, step = 1, unit, onChange, hint }) {
  const { t } = useTranslation();
  const pct = ((value - min) / (max - min)) * 100;

  function clamp(v) {
    return Math.min(max, Math.max(min, Math.round(v / step) * step));
  }

  function handleInput(e) {
    const parsed = Number(e.target.value);
    if (!isNaN(parsed) && e.target.value.trim() !== '') onChange(clamp(parsed));
  }

  function handleBlur(e) {
    const parsed = Number(e.target.value);
    if (isNaN(parsed) || e.target.value.trim() === '') onChange(value);
    else onChange(clamp(parsed));
  }

  return (
    <div>
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0 mr-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
          {sublabel && (
            <span className="block sm:inline sm:ml-1.5 text-xs text-slate-400 dark:text-slate-500">{sublabel}</span>
          )}
        </div>
        {/* Custom stepper: − value + unit */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
            <button
              type="button"
              onClick={() => onChange(clamp(value - step))}
              disabled={value <= min}
              className="px-2.5 h-8 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base leading-none select-none"
              aria-label={`${t('common.decrease')} ${label}`}
            >
              −
            </button>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleInput}
              onBlur={handleBlur}
              className="w-16 text-center text-sm font-semibold bg-transparent text-primary-600 dark:text-primary-400 focus:outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label={`${label} value`}
            />
            <button
              type="button"
              onClick={() => onChange(clamp(value + step))}
              disabled={value >= max}
              className="px-2.5 h-8 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base leading-none select-none"
              aria-label={`${t('common.increase')} ${label}`}
            >
              +
            </button>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium w-6">{unit}</span>
        </div>
      </div>

      {/* Slider track — taller hit area for mobile */}
      <div className="relative h-8 flex items-center">
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-8 touch-manipulation"
          aria-label={label}
        />
      </div>

      {/* Range labels + hint */}
      <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
      {hint && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">{hint}</p>
      )}
    </div>
  );
}
