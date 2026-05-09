require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { globalLimiter, recommendLimiter, chatLimiter, pricingLimiter } = require('./middleware/rateLimits');

const recommendRoute = require('./routes/recommend');
const chatRoute = require('./routes/chat');
const pricingRoute = require('./routes/pricing');

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// Trust proxy headers (needed for correct IP detection behind Render/Railway/Vercel)
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));

// Limit body size — 32 KB is more than enough for any legitimate request
app.use(express.json({ limit: '32kb' }));

// Global rate limit applied to every route
app.use(globalLimiter);

// Route-specific rate limits (stricter than global)
app.use('/api/recommend', recommendLimiter, recommendRoute);
app.use('/api/chat', chatLimiter, chatRoute);
app.use('/api/pricing', pricingLimiter, pricingRoute);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`CloudAdvisor API running on http://localhost:${PORT}`);
});
