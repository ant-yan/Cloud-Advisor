import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, RotateCcw, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdvisor } from '../../context/AdvisorContext';
import { getRecommendation } from '../../lib/api';
import i18n from '../../i18n';
import WizardProgress from './WizardProgress';
import Step1UseCase from './steps/Step1UseCase';
import Step2Profile from './steps/Step2Profile';
import Step3Budget from './steps/Step3Budget';
import Step4Priorities from './steps/Step4Priorities';
import Step5Geography from './steps/Step5Geography';
import Step6Services from './steps/Step6Services';

const TOTAL_STEPS = 6;

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }),
};

function ResetConfirmDialog({ onConfirm, onCancel }) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t('wizard.resetTitle')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('wizard.resetMessage')}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {t('wizard.resetCancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors"
          >
            {t('wizard.resetConfirm')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function WizardContainer() {
  const location = useLocation();
  const { t } = useTranslation();
  const [step, setStep] = useState(location.state?.startAtStep ?? 1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { state, setAnswer, setResults, reset } = useAdvisor();
  const navigate = useNavigate();
  const answers = state.answers;

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSingleSelect = useCallback((field, value) => {
    setAnswer(field, value);
    setTimeout(goNext, 180);
  }, [setAnswer, goNext]);

  const handleStartOver = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const confirmReset = useCallback(() => {
    reset();
    setShowResetConfirm(false);
    setApiError(null);
    setDirection(-1);
    setStep(1);
  }, [reset]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const results = await getRecommendation({ ...answers, lang: i18n.language });
      setResults(results);
      navigate('/results');
    } catch (err) {
      setApiError(err.message || t('common.wizardError'));
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, setResults, navigate]);

  useEffect(() => {
    function onKeyDown(e) {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (showResetConfirm) return;

      if (e.key === 'ArrowLeft' && step > 1) {
        goBack();
        return;
      }
      if (e.key === 'Enter') {
        if (step === 4 && answers.priorities?.length > 0) { goNext(); return; }
        if (step === 6 && !isSubmitting) { handleSubmit(); return; }
        const autoField = { 1: 'useCase', 2: 'profile', 3: 'budget', 5: 'geography' }[step];
        if (autoField && answers[autoField]) goNext();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [step, answers, isSubmitting, showResetConfirm, goNext, goBack, handleSubmit]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1UseCase value={answers.useCase} onChange={(v) => handleSingleSelect('useCase', v)} />;
      case 2: return <Step2Profile value={answers.profile} onChange={(v) => handleSingleSelect('profile', v)} />;
      case 3: return <Step3Budget value={answers.budget} onChange={(v) => handleSingleSelect('budget', v)} />;
      case 4: return <Step4Priorities value={answers.priorities} onChange={(v) => setAnswer('priorities', v)} onConfirm={goNext} />;
      case 5: return <Step5Geography value={answers.geography} onChange={(v) => handleSingleSelect('geography', v)} />;
      case 6: return <Step6Services value={answers.services} onChange={(v) => setAnswer('services', v)} onConfirm={handleSubmit} isSubmitting={isSubmitting} />;
      default: return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showResetConfirm && (
          <ResetConfirmDialog
            onConfirm={confirmReset}
            onCancel={() => setShowResetConfirm(false)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col items-center justify-start pt-8 pb-16 px-4">
        <div className="w-full max-w-xl flex items-center justify-between mb-6">
          <button
            onClick={step > 1 ? goBack : undefined}
            disabled={step === 1}
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('wizard.back')}
          </button>

          <button
            onClick={handleStartOver}
            className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('wizard.startOver')}
          </button>
        </div>

        <WizardProgress step={step} totalSteps={TOTAL_STEPS} />

        {apiError && (
          <div className="w-full max-w-xl mb-4 flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700 dark:text-rose-400">{apiError}</p>
          </div>
        )}

        <div className="w-full max-w-xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
