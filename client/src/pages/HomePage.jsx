import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Zap, RotateCcw, PlayCircle, ExternalLink } from 'lucide-react';
import UseCaseShortcuts from '../components/shortcuts/UseCaseShortcuts';
import { useAdvisor } from '../context/AdvisorContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { PROVIDERS } from '../data/providers';

const STEP_FIELDS = ['useCase', 'profile', 'budget', 'priorities', 'geography', 'services'];

function getResumeStep(answers) {
  for (let i = 0; i < STEP_FIELDS.length; i++) {
    const val = answers[STEP_FIELDS[i]];
    const empty = val === null || val === undefined || (Array.isArray(val) && val.length === 0);
    if (empty) return i + 1;
  }
  return 6;
}

function ResumeBar({ answers, results, onReset }) {
  const navigate = useNavigate();
  const hasPartial = STEP_FIELDS.some((f) => {
    const v = answers[f];
    return v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0);
  });

  if (!hasPartial) return null;

  if (results) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/40"
      >
        <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
          You have a saved recommendation — want to view it?
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/results"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            View results
          </Link>
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary-200 dark:border-primary-700 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Start fresh
          </button>
        </div>
      </motion.div>
    );
  }

  const resumeStep = getResumeStep(answers);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40"
    >
      <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
        You have a wizard session in progress — continue from step {resumeStep}?
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => navigate('/wizard', { state: { startAtStep: resumeStep } })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          Continue
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-700 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Start fresh
        </button>
      </div>
    </motion.div>
  );
}

const TYPING_TEXTS = [
  'Answer 6 questions. Get an AI-powered cloud recommendation.',
  'AWS, GCP, Azure — find out which one is right for you.',
  'Stop guessing. Start building on the right cloud.',
  'From free tier to enterprise scale, we score it all.',
  'The fastest way to pick your cloud provider.',
];

const TYPE_SPEED = 38;
const DELETE_SPEED = 18;
const PAUSE_AFTER = 2400;

function TypewriterText() {
  const [display, setDisplay] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPING_TEXTS[textIdx];

    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, TYPE_SPEED);
      return () => clearTimeout(t);
    }

    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), PAUSE_AFTER);
      return () => clearTimeout(t);
    }

    if (deleting && charIdx > 0) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, DELETE_SPEED);
      return () => clearTimeout(t);
    }

    if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((i) => (i + 1) % TYPING_TEXTS.length);
    }
  }, [charIdx, deleting, textIdx]);

  return (
    <span>
      {display}
      <span className="inline-block w-0.5 h-[1.1em] bg-primary-400 align-middle ml-0.5 animate-pulse" />
    </span>
  );
}

const features = [
  { icon: Zap, text: '6-step guided wizard — done in under 2 minutes' },
  { icon: CheckCircle, text: 'Deterministic scoring across 5 weighted dimensions' },
  { icon: Star, text: 'AI-generated explanation in plain English' },
];

export default function HomePage() {
  usePageTitle(null);
  const { state, reset } = useAdvisor();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <AnimatePresence>
            <ResumeBar answers={state.answers} results={state.results} onReset={reset} />
          </AnimatePresence>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            Free &amp; No account required
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5 leading-tight">
            Find your perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
              cloud provider
            </span>
          </h1>

          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed min-h-[1.75rem]">
            <TypewriterText />
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              to="/wizard"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors text-base shadow-md shadow-primary-500/25"
            >
              Start the wizard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-base"
            >
              Compare providers
            </Link>
          </div>

          {/* Feature bullets */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-slate-500 dark:text-slate-400">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Quick-start shortcuts */}
      <UseCaseShortcuts />

      {/* How it works */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-10">
            How CloudAdvisor works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Answer 6 questions',
                desc: "Tell us what you're building, your budget, and what matters most to you.",
              },
              {
                step: '02',
                title: 'Get your score',
                desc: 'Our scoring engine rates all 8 providers — AWS, GCP, Azure, DigitalOcean, Vercel, Netlify, Render, and Cloudflare — across 5 weighted dimensions.',
              },
              {
                step: '03',
                title: 'Understand why',
                desc: 'An AI assistant explains the recommendation in plain English and answers your follow-up questions.',
              },
            ].map((item) => (
              <div key={item.step} className="text-left">
                <div className="text-4xl font-black text-primary-100 dark:text-primary-900 mb-3">{item.step}</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse all providers */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Browse all 8 providers
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Explore full profiles, pros/cons, and feature checklists for every platform we evaluate.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
            {PROVIDERS.map((p, i) => {
              const displayColor = p.brandColor === '#000000' ? '#111827' : p.brandColor;
              return (
                <motion.div
                  key={p.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <Link
                    to={`/providers/${p.id}`}
                    className="group h-full flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-150"
                  >
                    <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: displayColor }} />
                    <div className="p-4 flex-1 flex flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                          {p.fullName}
                        </span>
                        {p.alwaysFree && (
                          <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                            Free
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1 mb-3">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-end">
                        <span className="text-[10px] font-semibold text-primary-500 dark:text-primary-400 group-hover:underline flex items-center gap-0.5">
                          Profile
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
