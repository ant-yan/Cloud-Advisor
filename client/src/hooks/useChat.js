import { useState, useCallback, useRef } from 'react';

const MAX_MESSAGE_LENGTH = 600;
const API_BASE = import.meta.env.VITE_API_URL || '/api';
const NO_KEY_SIGNAL = 'AI chat requires an OpenAI API key';

export function useChat(context) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (content) => {
    if (isStreaming) return;

    const trimmed = content.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!trimmed) return;

    const userMsg = { role: 'user', content: trimmed, timestamp: Date.now() };
    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true },
    ]);
    setIsStreaming(true);

    abortRef.current = new AbortController();

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content: c }) => ({ role, content: c })),
          context,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;
          try {
            const { token } = JSON.parse(payload);
            accumulated += token;
            if (accumulated.startsWith(NO_KEY_SIGNAL)) setApiKeyMissing(true);
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { ...next[next.length - 1], content: accumulated };
              return next;
            });
          } catch {
            // malformed SSE line — skip
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      const msg = err.message.startsWith('HTTP 429')
        ? 'Rate limit reached. Please wait a few minutes before sending more messages.'
        : 'Sorry, something went wrong. Please try again.';
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: msg, isError: true };
        return next;
      });
    } finally {
      setIsStreaming(false);
      setMessages((prev) => {
        const next = [...prev];
        if (next[next.length - 1]?.isStreaming) {
          next[next.length - 1] = { ...next[next.length - 1], isStreaming: false };
        }
        return next;
      });
    }
  }, [isStreaming, messages, context]);

  const abortStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearMessages = useCallback(() => { setMessages([]); setApiKeyMissing(false); }, []);
  const toggleOpen = useCallback(() => setIsOpen((o) => !o), []);

  return { messages, isStreaming, isOpen, apiKeyMissing, sendMessage, abortStream, clearMessages, toggleOpen };
}
