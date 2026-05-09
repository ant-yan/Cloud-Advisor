import { useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 120)}px`;
    }
  });

  const submit = () => {
    const value = ref.current?.value.trim();
    if (!value || disabled) return;
    onSend(value);
    ref.current.value = '';
    ref.current.style.height = 'auto';
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <textarea
        ref={ref}
        rows={1}
        disabled={disabled}
        onKeyDown={handleKey}
        placeholder="Ask anything about cloud providers…"
        className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50 leading-relaxed overflow-hidden"
      />
      <button
        onClick={submit}
        disabled={disabled}
        aria-label="Send message"
        className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
      >
        <SendHorizonal className="w-4 h-4" />
      </button>
    </div>
  );
}
