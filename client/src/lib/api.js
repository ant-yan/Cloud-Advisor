import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export async function getRecommendation(answers) {
  const { data } = await api.post('/recommend', answers);
  return data;
}

export async function getPricing(providers, resources) {
  const { data } = await api.post('/pricing', { providers, resources });
  return data;
}

export async function sendChatMessage(messages, context) {
  const { data } = await api.post('/chat', { messages, context });
  return data;
}

export default api;
