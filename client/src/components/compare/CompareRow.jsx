import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function CompareRow({ label, values, delay = 0 }) {
  // A cell is a "winner" when this row is contested (not all providers share the same boolean value)
  const boolValues = values.filter((v) => typeof v === 'boolean');
  const contested = boolValues.length > 1 && boolValues.some((v) => v) && boolValues.some((v) => !v);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay, ease: 'easeOut' }}
      className="border-b border-slate-100 dark:border-slate-800 last:border-0"
    >
      <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap w-44">
        {label}
      </td>
      {values.map((val, i) => {
        const isWinner = contested && val === true;
        return (
          <td
            key={i}
            className={`py-3 px-4 text-center ${isWinner ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
          >
            {typeof val === 'boolean' ? (
              val ? (
                <span
                  className={`inline-flex items-center justify-center mx-auto ${
                    isWinner ? 'w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40' : ''
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 ${
                      isWinner ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500'
                    }`}
                  />
                </span>
              ) : (
                <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
              )
            ) : (
              <span className="text-sm text-slate-700 dark:text-slate-300">{val ?? '—'}</span>
            )}
          </td>
        );
      })}
    </motion.tr>
  );
}
