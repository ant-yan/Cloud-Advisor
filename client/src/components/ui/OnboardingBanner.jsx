import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'cloudadvisor_onboarded';

export default function OnboardingBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setVisible(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage blocked — skip
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-[4.5rem] sm:bottom-5 left-1/2 -translate-x-1/2 sm:left-5 sm:translate-x-0 sm:right-auto z-50 w-[calc(100vw-2.5rem)] sm:w-auto max-w-sm"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mt-0.5">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                  New here? Find your cloud in 2 min
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Answer 6 quick questions — our scoring engine ranks all 8 providers for your exact use case.
                </p>
                <Link
                  to="/wizard"
                  onClick={dismiss}
                  className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Start the wizard
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <button
                onClick={dismiss}
                aria-label="Dismiss"
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
