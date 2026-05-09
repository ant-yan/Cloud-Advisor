import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Trophy, ExternalLink } from 'lucide-react';
import ScoreBreakdown from './ScoreBreakdown';
import { cn, getScoreColor, getScoreBg } from '../../lib/utils';

export default function ProviderCard({ provider, rank, delay = 0 }) {
  const [expanded, setExpanded] = useState(rank === 1);
  const isTop = rank === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={cn(
        'bg-white dark:bg-slate-900 rounded-card border-2 shadow-card overflow-hidden',
        isTop
          ? 'border-primary-400 dark:border-primary-600'
          : 'border-slate-200 dark:border-slate-700'
      )}
    >
      {/* Header */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: provider.brandColor }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: rank + name */}
          <div className="flex items-center gap-3 min-w-0">
            {isTop && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            {!isTop && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">#{rank}</span>
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {provider.name}
                </h3>
                {isTop && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                    Best match
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {provider.description}
              </p>
            </div>
          </div>

          {/* Score badge */}
          <div className={cn('flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center', getScoreBg(provider.score))}>
            <span className={cn('text-2xl font-extrabold leading-none', getScoreColor(provider.score))}>
              {provider.score}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">/100</span>
          </div>
        </div>

        {/* Pros & Cons — always visible */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wide">Pros</p>
            <ul className="space-y-1.5">
              {provider.pros.slice(0, 3).map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 mb-2 uppercase tracking-wide">Cons</p>
            <ul className="space-y-1.5">
              {provider.cons.slice(0, 3).map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row: score toggle + deep-dive link */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {expanded ? 'Hide' : 'Show'} score breakdown
          </button>
          <Link
            to={`/providers/${provider.id}`}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Full profile
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 overflow-hidden"
            >
              <ScoreBreakdown breakdown={provider.breakdown} delay={0.1} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
