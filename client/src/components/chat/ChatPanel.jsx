import { useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, RotateCcw, Square, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdvisor } from '../../context/AdvisorContext';
import { useChat } from '../../hooks/useChat';
import i18n from '../../i18n';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

function StarterQuestions({ topProvider, onSelect }) {
  const { t } = useTranslation();

  const questions = useMemo(() => {
    if (topProvider) {
      return [
        t('chat.questionWhyRecommended', { name: topProvider }),
        t('chat.questionGetStarted', { name: topProvider }),
        t('chat.questionHiddenCosts'),
        t('chat.questionBeginner', { name: topProvider }),
      ];
    }
    return [
      t('chat.questionDifference'),
      t('chat.questionStartup'),
      t('chat.questionServerless'),
      t('chat.questionWebApp'),
    ];
  }, [topProvider, t]);

  return (
    <div className="p-4">
      {!topProvider && (
        <div className="mb-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/40">
          <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-0.5">{t('chat.title')}</p>
          <p className="text-xs text-primary-600 dark:text-primary-400 leading-relaxed">
            {t('chat.starterMessage')}
          </p>
        </div>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{t('chat.suggestedQuestions')}</p>
      <div className="space-y-2">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="w-full text-left text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPanel() {
  const { state } = useAdvisor();
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  const context = useMemo(() => {
    const top = state.results?.ranked?.[0];
    return {
      topProvider: top?.name ?? null,
      score: top?.score ?? null,
      useCase: state.answers?.useCase ?? null,
      budget: state.answers?.budget ?? null,
      priorities: state.answers?.priorities ?? [],
      lang: i18n.language,
    };
  }, [state.results, state.answers, i18n.language]);

  const { messages, isStreaming, isOpen, apiKeyMissing, sendMessage, abortStream, clearMessages, toggleOpen } = useChat(context);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const topProvider = context.topProvider;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[calc(100vw-2.5rem)] sm:w-[460px] flex flex-col rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900"
            style={{ maxHeight: 'min(620px, 80vh)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary-500">
              <div>
                <p className="text-sm font-semibold text-white">{t('chat.title')}</p>
                <p className="text-xs text-primary-200">
                  {topProvider ? t('chat.contextWith', { name: topProvider }) : t('chat.contextDefault')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {isStreaming && (
                  <button
                    onClick={abortStream}
                    aria-label={t('chat.stopResponse')}
                    title={t('chat.stopResponse')}
                    className="p-1.5 rounded-lg text-primary-200 hover:text-white hover:bg-primary-600 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}
                {messages.length > 0 && !isStreaming && (
                  <button
                    onClick={clearMessages}
                    aria-label={t('chat.clearConversation')}
                    className="p-1.5 rounded-lg text-primary-200 hover:text-white hover:bg-primary-600 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={toggleOpen}
                  aria-label={t('chat.closeChat')}
                  className="p-1.5 rounded-lg text-primary-200 hover:text-white hover:bg-primary-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {messages.length === 0 ? (
                <StarterQuestions topProvider={topProvider} onSelect={sendMessage} />
              ) : (
                <div className="p-4 space-y-3">
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* No API key warning */}
            {apiKeyMissing && (
              <div className="mx-4 mb-3 flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                <KeyRound className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{t('chat.apiKeyMissingTitle')}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 leading-relaxed">
                    {t('chat.apiKeyMissingMessage')}
                  </p>
                </div>
              </div>
            )}

            {/* Input */}
            <ChatInput onSend={sendMessage} disabled={isStreaming || apiKeyMissing} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={toggleOpen}
        whileTap={{ scale: 0.93 }}
        aria-label={isOpen ? t('chat.closeChat') : t('chat.openChat')}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
