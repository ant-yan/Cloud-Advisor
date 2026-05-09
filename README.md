# CloudAdvisor

An AI-powered cloud provider selection tool. Answer 6 questions about your project and get a ranked recommendation across AWS, GCP, Azure, DigitalOcean, and Vercel — with a plain-English explanation and an interactive chat assistant.

## Prerequisites

- Node.js 20+
- npm 9+
- An OpenAI API key (optional — the app works without it, but AI explanation and chat will be disabled)

## Setup

### 1. Clone and install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

```bash
# In the server/ directory
cp ../.env.example .env
```

Edit `server/.env`:

```
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=sk-...your-key-here...
```

The `OPENAI_API_KEY` is optional. Without it, the scoring engine still runs and all pages work — you just won't see the AI explanation or chat responses.

### 3. Run locally

Open two terminals:

```bash
# Terminal 1 — API server (port 3001)
cd server
npm run dev

# Terminal 2 — React app (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project structure

```
cloudadvisor/
├── client/          React 18 + Vite + Tailwind CSS frontend
│   └── src/
│       ├── components/   UI, wizard, results, compare, pricing, chat
│       ├── pages/        Route-level page components
│       ├── context/      AdvisorContext (global state + theme)
│       ├── hooks/        useWizard, useRecommendation, useChat
│       └── lib/          api.js (Axios), utils.js
│
└── server/          Node.js + Express API
    └── src/
        ├── routes/   /api/recommend, /api/chat, /api/pricing, /api/export
        ├── engine/   Deterministic scoring algorithm (scorer, matcher, weights)
        ├── services/ OpenAI wrapper (explanation + streaming chat)
        └── data/     providers.json, rules.json, pricing.json
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/recommend` | Score all 5 providers, return ranked results + optional AI explanation |
| POST | `/api/chat` | SSE streaming chat with context-aware system prompt |
| POST | `/api/pricing` | Calculate estimated monthly cost per provider |
| GET  | `/api/health` | Health check |

## Deployment

**Frontend → Vercel**
```bash
cd client && npm run build
# Deploy the dist/ folder to Vercel
```

**Backend → Railway or Render**
- Set the `OPENAI_API_KEY` and `CLIENT_ORIGIN` environment variables in your hosting dashboard
- The start command is `node src/index.js`

## How the scoring works

The scoring engine in `server/src/engine/` is pure deterministic JavaScript — no AI involved. Each provider receives a score 0–100 across 5 weighted dimensions:

| Dimension | Weight |
|---|---|
| Use case match | 30% |
| Budget fit | 25% |
| Ease of use | 20% |
| Geographic coverage | 15% |
| Services match | 10% |

Provider profiles and dimension scores live in `server/src/data/providers.json`.

## Known limitations

- Pricing estimates are approximate on-demand rates; reserved instances and volume discounts are not modelled
- The share link encodes the full result payload in the URL — very long results may exceed browser URL limits
- PDF export uses `window.print()` — layout depends on the browser's print engine
