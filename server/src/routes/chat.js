const express = require('express');
const router = express.Router();
const { buildSystemPrompt, getClient } = require('../services/openai');

const MODEL = 'gpt-4o-mini';
const MAX_MESSAGE_LENGTH = 600;   // characters per user message
const MAX_HISTORY_MESSAGES = 20;  // total messages kept in context (10 exchanges)

const FALLBACK_MESSAGE =
  'AI chat requires an OpenAI API key. Add OPENAI_API_KEY to the server .env file to enable this feature.';

router.post('/', async (req, res) => {
  const { messages = [], context = {} } = req.body;

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendToken = (token) => res.write(`data: ${JSON.stringify({ token })}\n\n`);
  const sendDone = () => { res.write('data: [DONE]\n\n'); res.end(); };

  // Validate incoming messages array
  if (!Array.isArray(messages)) {
    sendToken('Invalid request format.');
    sendDone();
    return;
  }

  // Sanitise and cap history depth
  const safeMessages = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .slice(-MAX_HISTORY_MESSAGES)
    .map(({ role, content }) => ({
      role,
      content: String(content).slice(0, MAX_MESSAGE_LENGTH),
    }));

  // Ensure the last message is from the user and is non-empty
  const lastMsg = safeMessages[safeMessages.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || !lastMsg.content.trim()) {
    sendToken('Please enter a message.');
    sendDone();
    return;
  }

  const ai = getClient();
  if (!ai) {
    sendToken(FALLBACK_MESSAGE);
    sendDone();
    return;
  }

  const systemPrompt = buildSystemPrompt(context);

  try {
    const stream = await ai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...safeMessages],
      stream: true,
      max_tokens: 400,
      temperature: 0.65,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) sendToken(token);
    }
  } catch (err) {
    console.error('Chat stream error:', err.message);
    sendToken('\n\nSomething went wrong. Please try again.');
  }

  sendDone();
});

module.exports = router;
