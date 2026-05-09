import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Tooltip({ children, content, className }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        className={cn('underline decoration-dotted cursor-help', className)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={0}
      >
        {children}
      </span>
      {visible && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 text-xs text-white bg-slate-900 dark:bg-slate-700 rounded-lg px-3 py-2 shadow-lg pointer-events-none animate-fade-in">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
        </span>
      )}
    </span>
  );
}
