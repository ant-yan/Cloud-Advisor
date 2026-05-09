import { cn } from '../../lib/utils';

function StreamingCursor() {
  return (
    <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse" />
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isEmpty = !message.content && message.isStreaming;

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-primary-500 text-white rounded-br-sm'
            : message.isError
            ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-bl-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm'
        )}
      >
        {isEmpty ? (
          <StreamingCursor />
        ) : (
          <>
            {message.content}
            {message.isStreaming && <StreamingCursor />}
          </>
        )}
      </div>
    </div>
  );
}
