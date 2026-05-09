# CloudAdvisor — Complete Project Documentation

> Everything about this project in one place. How it was built, how every feature works, how every calculation is made, and why every design decision was made.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [State Management](#5-state-management)
6. [Routing & Code Splitting](#6-routing--code-splitting)
7. [Design System](#7-design-system)
8. [The 6-Step Wizard](#8-the-6-step-wizard)
9. [The Scoring Engine](#9-the-scoring-engine)
10. [The 8 Cloud Providers](#10-the-8-cloud-providers)
11. [Results Page](#11-results-page)
12. [Compare Page](#12-compare-page)
13. [Pricing Estimator Page](#13-pricing-estimator-page)
14. [Provider Profile Pages](#14-provider-profile-pages)
15. [Cloud Glossary](#15-cloud-glossary)
16. [AI Chat Assistant](#16-ai-chat-assistant)
17. [Home Page](#17-home-page)
18. [Server & API](#18-server--api)
19. [Security & Rate Limiting](#19-security--rate-limiting)
20. [Accessibility](#20-accessibility)
21. [Responsive Design](#21-responsive-design)
22. [Session Persistence](#22-session-persistence)
23. [Dark Mode](#23-dark-mode)

---

## 1. Project Overview

**CloudAdvisor** is a web application that helps non-technical users — students, solo founders, freelancers, and small businesses — choose the right cloud provider for their project without needing to read hundreds of pages of documentation.

The problem it solves: cloud provider documentation is written for engineers. AWS alone has over 200 services. A first-time user has no idea whether they need EC2, Lambda, Amplify, or Lightsail — let alone whether AWS is the right choice versus DigitalOcean, Vercel, or Cloudflare. CloudAdvisor bridges that gap by asking 6 plain-English questions and running a deterministic scoring algorithm to produce a ranked recommendation with an optional AI explanation.

### What the app does

- Guides users through a 6-step wizard about their use case, experience level, budget, priorities, geography, and required services
- Scores all 8 cloud providers across 5 weighted dimensions using pure math (never AI)
- Presents ranked results with score breakdowns, pros/cons, and a getting-started guide
- Optionally generates a personalized 2–3 paragraph explanation using GPT-4o-mini
- Provides a side-by-side feature comparison matrix for 2–3 providers at a time
- Provides a real-time pricing estimator with sliders for compute, storage, bandwidth, and databases
- Includes a full-screen glossary of 125 cloud computing terms in plain English
- Includes a floating AI chat assistant that answers cloud infrastructure questions 24/7
- Has individual deep-dive profile pages for all 8 providers
- Supports shareable URLs for both results and comparisons
- Supports PDF export of results via the browser's print function
- Supports CSV export of pricing estimates
- Works fully offline for the wizard and comparison (only the AI features need a server connection)

---

## 2. Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | Component-based UI framework |
| Vite | 5.4 | Build tool, dev server, HMR |
| React Router | v6 | Client-side routing, URL params |
| Tailwind CSS | 3 | Utility-first CSS styling |
| Framer Motion | latest | Animations (page transitions, height collapses, bar fills) |
| Lucide React | latest | Icon library (consistent SVG icons throughout) |
| react-helmet-async | 3.0 | Document head management for meta tags |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 | JavaScript runtime |
| Express.js | 4 | HTTP server and API routing |
| OpenAI SDK | 4 | GPT-4o-mini for explanation and chat |
| express-rate-limit | latest | API abuse prevention |
| helmet | latest | Security HTTP headers |
| cors | latest | Cross-origin request control |
| dotenv | latest | Environment variable loading |

### Data storage

No database. All provider data lives in two JSON files on the server:
- `server/src/data/providers.json` — scoring data, features, pros, cons, getting-started steps
- `server/src/data/pricing.json` — per-provider pricing rates and free tier limits

User session data (wizard answers and results) is stored in the browser's `localStorage` only.

---

## 3. Project Structure

```
cloudadvisor/
├── client/                          # React frontend (Vite)
│   ├── index.html                   # HTML shell, Open Graph meta tags
│   ├── tailwind.config.js           # Design tokens (colors, shadows, radius)
│   ├── vite.config.js               # Vite configuration
│   └── src/
│       ├── main.jsx                 # React root, HelmetProvider wrapper
│       ├── App.jsx                  # Layout shell, lazy routes, ErrorBoundary
│       ├── styles/
│       │   └── globals.css          # Tailwind base, focus-visible rings, print CSS
│       ├── context/
│       │   └── AdvisorContext.jsx   # Global state (answers, results, theme)
│       ├── hooks/
│       │   ├── useChat.js           # SSE streaming chat hook
│       │   └── usePageTitle.js      # Document title + meta tag updater
│       ├── lib/
│       │   ├── api.js               # Fetch wrappers for all server endpoints
│       │   ├── utils.js             # cn(), scoring colors, share encoding
│       │   └── glossaryTooltips.js  # Tooltip term registry
│       ├── data/
│       │   └── providers.js         # Client-side static provider data (profile pages)
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── WizardPage.jsx
│       │   ├── ResultsPage.jsx
│       │   ├── ComparePage.jsx
│       │   ├── PricingPage.jsx
│       │   ├── GlossaryPage.jsx
│       │   ├── ProviderPage.jsx
│       │   └── NotFoundPage.jsx
│       └── components/
│           ├── ui/
│           │   ├── Navbar.jsx
│           │   ├── Footer.jsx
│           │   ├── ThemeToggle.jsx
│           │   ├── Tooltip.jsx
│           │   ├── TermTooltip.jsx
│           │   ├── Badge.jsx
│           │   ├── LoadingSpinner.jsx
│           │   ├── OnboardingBanner.jsx
│           │   └── ErrorBoundary.jsx
│           ├── wizard/
│           │   ├── WizardContainer.jsx
│           │   ├── WizardProgress.jsx
│           │   ├── OptionCard.jsx
│           │   └── steps/
│           │       ├── Step1UseCase.jsx
│           │       ├── Step2Profile.jsx
│           │       ├── Step3Budget.jsx
│           │       ├── Step4Priorities.jsx
│           │       ├── Step5Geography.jsx
│           │       └── Step6Services.jsx
│           ├── results/
│           │   ├── ProviderCard.jsx
│           │   ├── ScoreBreakdown.jsx
│           │   ├── AIExplanation.jsx
│           │   └── QuickStartGuide.jsx
│           ├── compare/
│           │   ├── CompareView.jsx
│           │   ├── FeatureMatrix.jsx
│           │   └── CompareRow.jsx
│           ├── pricing/
│           │   ├── PricingEstimator.jsx
│           │   ├── PricingSlider.jsx
│           │   └── PricingBreakdown.jsx
│           ├── chat/
│           │   ├── ChatPanel.jsx
│           │   ├── ChatMessage.jsx
│           │   └── ChatInput.jsx
│           └── shortcuts/
│               └── UseCaseShortcuts.jsx
│
└── server/                          # Express backend
    └── src/
        ├── index.js                 # Server entry point, middleware, routes
        ├── engine/
        │   ├── scorer.js            # Main scoring function
        │   ├── matcher.js           # Per-dimension match functions (returns 0–1)
        │   └── weights.js           # Dimension weights (must sum to 1.0)
        ├── routes/
        │   ├── recommend.js         # POST /api/recommend
        │   ├── chat.js              # POST /api/chat (SSE streaming)
        │   └── pricing.js           # POST /api/pricing
        ├── services/
        │   └── openai.js            # GPT-4o-mini client, prompts, explanation generator
        ├── middleware/
        │   └── rateLimits.js        # Per-route rate limiters
        └── data/
            ├── providers.json       # Provider scoring data
            └── pricing.json         # Pricing rates and free tier info
```

---

## 4. Architecture & Data Flow

CloudAdvisor is a classic **client–server** architecture. The frontend is a single-page React app; the backend is a JSON API.

### How a recommendation works (end to end)

```
User answers wizard
       ↓
WizardContainer.jsx collects answers into AdvisorContext state
       ↓
Step 6 "Get my recommendation" button fires handleSubmit()
       ↓
api.js sends POST /api/recommend with { useCase, profile, budget, priorities, geography, services }
       ↓
server/routes/recommend.js receives the request
       ↓
scorer.js runs scoreProvider() for each of the 8 providers
       ↓
matcher.js calculates 5 dimension scores (0–1 each), weighted and multiplied
       ↓
Priority boosts are applied and capped per dimension
       ↓
All 8 providers are sorted descending by total score
       ↓
openai.js attempts generateExplanation() with a 15-second timeout
       ↓
Response { ranked: [...], explanation: "..." } is returned
       ↓
AdvisorContext stores results; user is navigated to /results
       ↓
ResultsPage renders ProviderCards in ranked order
```

### Why scoring is deterministic (never AI)

The scoring engine was intentionally built as pure math, not AI inference, for two reasons:

1. **Consistency** — Two users with identical answers always get identical rankings. AI responses are probabilistic and would produce different orderings on different calls.
2. **Trust** — Users can understand and verify why a provider was ranked where it was by reading the score breakdown. An AI black-box recommendation can't be audited.

GPT-4o-mini is used exclusively to *explain* the result in plain English after the ranking is already determined, and for the chat assistant. It never influences which provider wins.

---

## 5. State Management

All global application state lives in `AdvisorContext.jsx`, which uses React's built-in `useReducer` hook — no external state library.

### State shape

```js
{
  answers: {
    useCase: null,      // "website" | "webapp" | "mobile" | "storage" | "ml" | "other"
    profile: null,      // "beginner" | "developer" | "team"
    budget: null,       // "free" | "under50" | "50-200" | "200-1000" | "1000+"
    priorities: [],     // array of up to 2: "cost"|"ease"|"scalability"|"compliance"|"support"|"performance"
    geography: null,    // "single" | "multiple" | "global" | "specific"
    services: [],       // array: "database"|"nosql"|"storage"|"cdn"|"auth"|"serverless"|"containers"|"ml"|"email"|"none"
  },
  results: null,        // { ranked: [...providers with scores], explanation: "..." }
  isLoading: false,
  error: null,
  theme: "light",       // "light" | "dark"
}
```

### Actions

| Action | What it does |
|---|---|
| `SET_ANSWER` | Updates a single answer field and saves to localStorage |
| `SET_ANSWERS` | Bulk-updates multiple answer fields (used by use-case shortcuts) |
| `SET_RESULTS` | Stores recommendation results and saves to localStorage |
| `SET_LOADING` | Toggles loading state during API call |
| `SET_ERROR` | Stores error message |
| `RESET` | Clears answers and results, removes localStorage session |
| `TOGGLE_THEME` | Flips light/dark, updates `document.documentElement.classList`, saves to localStorage |

### localStorage persistence

Every time `SET_ANSWER`, `SET_ANSWERS`, or `SET_RESULTS` fires, the current answers and results are serialized to JSON and written to `localStorage` under the key `cloudadvisor_session`. When the app loads, it reads this key first — so if a user refreshes or returns later, their session is restored.

Theme preference is stored separately under `theme`.

---

## 6. Routing & Code Splitting

All routes are defined in `App.jsx` using React Router v6. Every page is **lazy-loaded** using `React.lazy()` wrapped in `<Suspense>`, which means each page's JavaScript is only downloaded when the user first navigates to it.

| Route | Page | Lazy chunk |
|---|---|---|
| `/` | HomePage | `HomePage-*.js` |
| `/wizard` | WizardPage | `WizardPage-*.js` |
| `/results` | ResultsPage | `ResultsPage-*.js` |
| `/compare` | ComparePage | `ComparePage-*.js` |
| `/pricing` | PricingPage | `PricingPage-*.js` |
| `/glossary` | GlossaryPage | `GlossaryPage-*.js` |
| `/providers/:id` | ProviderPage | `ProviderPage-*.js` |
| `*` | NotFoundPage | `NotFoundPage-*.js` |

While a page chunk is loading, a centered spinning ring (`PageLoader`) is shown. The entire route tree is also wrapped in an `ErrorBoundary` class component — if any page throws an unhandled error, the app shows a friendly recovery UI with "Refresh page" and "Go to homepage" buttons instead of crashing blank.

---

## 7. Design System

### Color palette (Tailwind config)

**Primary — Indigo**
- 500: `#6366f1` — buttons, active states, rings
- 600: `#4f46e5` — hover states
- 50–900: full range for backgrounds and text

**Secondary — Cyan**
- 500: `#06b6d4` — used in gradients alongside primary

**Semantic**
- Success: `#10b981` (emerald)
- Warning: `#f59e0b` (amber)
- Danger: `#f43f5e` (rose)

**Brand colors (per provider)**
- AWS: `#FF9900`
- GCP: `#4285F4`
- Azure: `#0078D4`
- DigitalOcean: `#0080FF`
- Vercel: `#000000` (rendered as `#111827` dark slate)
- Netlify: `#00AD9F`
- Render: `#7C3AED`
- Cloudflare: `#F6821F`

### Typography

- Font family: **Inter** (loaded via Google Fonts in `index.html`), with system-ui fallback
- Body size: 16px, line-height 1.6
- Headings: `font-semibold tracking-tight`
- Logo wordmark: `font-extrabold tracking-tight` — "Cloud" is rendered with gradient text (`bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500`), "Advisor" is solid dark/white

### Logo mark

The navbar and footer both show the CloudAdvisor logo as:
- A small rounded square icon with a diagonal gradient background (indigo → cyan) and a white Cloud icon inside
- The wordmark "CloudAdvisor" where "Cloud" is gradient-colored and "Advisor" is in solid dark/white text

This gradient is the same one used on the hero headline's "cloud provider" text — it creates visual consistency across the whole product.

### Border radius

- Cards: `rounded-card` = 12px (custom Tailwind token)
- Buttons: `rounded-btn` = 8px
- Pills/badges: `rounded-full`
- Inputs: `rounded-xl` = 12px

### Shadows

- `shadow-card`: subtle `0 1px 3px` — resting state
- `shadow-card-hover`: `0 4px 12px` — interactive hover state

### Animations

All animations use Framer Motion:
- **Page entrance**: `opacity: 0, y: 12` → `opacity: 1, y: 0` over 250ms
- **Wizard step transitions**: slide left/right (60px) with fade over 250ms
- **Score bars**: animate from 0% width to final width over 500ms with staggered delays
- **Expand/collapse panels**: `height: 0, opacity: 0` → `height: auto, opacity: 1` over 200ms
- **Chat panel**: scale + y translation on open/close
- **Provider cards on homepage**: scroll-triggered `whileInView` with staggered delays

### Dark mode

Dark mode is implemented with Tailwind's `class` strategy. The `dark` class is toggled on `document.documentElement` by `AdvisorContext`'s `TOGGLE_THEME` action. A `ThemeToggle` button in the navbar triggers this. The preference is persisted to `localStorage` under the key `theme`.

Every component has explicit `dark:` variants for all colors. The app loads with the stored preference on every visit.

### Focus rings (accessibility)

A global `:focus-visible` rule in `globals.css` applies a `ring-2 ring-primary-500 ring-offset-2` focus ring to all interactive elements. This only shows when navigating by keyboard (not on mouse click), following the Web Content Accessibility Guidelines. Default browser outlines are suppressed and replaced by this consistent ring.

### Print / PDF stylesheet

A `@media print` block in `globals.css` handles the "Download PDF" feature:
- Forces light mode
- Hides header, footer, navbar, `.fixed` elements, and anything marked `data-print-hide`
- The results content area (marked `data-print-content`) fills the full page
- Removes shadows and forces card borders
- Forces `print-color-adjust: exact` so score bar backgrounds print correctly
- Uses `break-inside: avoid` to prevent cards from splitting across pages

---

## 8. The 6-Step Wizard

The wizard is the heart of the app. It is a step-by-step question flow that collects the user's requirements. All state is managed in `AdvisorContext` and persisted to `localStorage` so users can resume if they close the tab.

The wizard is housed in `WizardContainer.jsx`. It shows a progress bar at the top, a back/start-over header, the current step (animated in with a slide transition), and keyboard navigation.

### Keyboard navigation

| Key | Effect |
|---|---|
| `ArrowLeft` | Go back one step (if step > 1) |
| `Enter` | Advance to next step if answer is selected; on Step 6, submit |

Keys are ignored when a modal is open or when focus is inside an `<input>`, `<textarea>`, or `<select>`.

### Resume from homepage

When a user has a wizard session in progress (some answers saved but no results), the homepage shows an amber banner: "You have a wizard session in progress — continue from step N?" The step number is calculated by finding the first unanswered field. Clicking "Continue" navigates to `/wizard` with `state: { startAtStep: N }`, which `WizardContainer` reads to initialize at the right step.

---

### Step 1 — What are you building? (Use Case)

**Field:** `useCase`

The user picks one option from 6 choices. Selecting one auto-advances to Step 2 (no "Next" button needed).

| Option | Value | Description |
|---|---|---|
| Simple website | `website` | Landing page, blog, or portfolio |
| Web app / SaaS | `webapp` | Dashboard, product, or platform |
| Mobile app backend | `mobile` | API and data for iOS / Android |
| Data storage / backup | `storage` | Files, databases, or backups |
| ML / AI workloads | `ml` | Training, inference, or data science |
| Something else | `other` | Not sure yet |

---

### Step 2 — What's your experience level? (Profile)

**Field:** `profile`

Three choices. Selecting one auto-advances.

| Option | Value | Meaning |
|---|---|---|
| Individual / Beginner | `beginner` | Little or no cloud experience |
| Developer / Small Team | `developer` | Comfortable with code and CLIs |
| Company / Enterprise | `team` | Needs enterprise features, compliance, support |

---

### Step 3 — What's your monthly budget? (Budget)

**Field:** `budget`

Five choices. Selecting one auto-advances.

| Option | Value |
|---|---|
| Free tier only | `free` |
| Under $50/month | `under50` |
| $50–$200/month | `50-200` |
| $200–$1,000/month | `200-1000` |
| $1,000+/month | `1000+` |

---

### Step 4 — What matters most to you? (Priorities)

**Field:** `priorities` (array, up to 2 items)

The user can select up to 2 priorities. A "Continue with N selected →" button appears once at least one is chosen.

| Option | Value | Effect on scoring |
|---|---|---|
| Lowest cost | `cost` | Budget score × 1.25 |
| Easiest to use | `ease` | Ease score × 1.25 |
| Best scalability | `scalability` | Use case score × 1.15 |
| Compliance / security | `compliance` | +10% on use case & geo for AWS and Azure only |
| 24/7 support | `support` | +10% on ease score for AWS, Azure, GCP only |
| Fastest performance | `performance` | +12% on geo for Vercel/GCP; +8% for AWS |

All boosts are capped at the dimension maximum (can't exceed 100/100 total) to prevent priority boosts from creating artificially inflated scores.

---

### Step 5 — Where are your users? (Geography)

**Field:** `geography`

Four choices. Selecting one auto-advances.

| Option | Value | Description |
|---|---|---|
| Single country | `single` | All users in one country |
| Multiple regions | `multiple` | Users across several countries |
| Global | `global` | Users everywhere worldwide |
| Specific region | `specific` | Need low-latency in a particular country |

---

### Step 6 — Any specific services needed? (Services)

**Field:** `services` (array, multi-select)

The user can select any combination. "None of the above" deselects everything else. A "Get my recommendation →" submit button appears once at least one option is selected. This step submits the form and triggers the API call.

| Option | Value |
|---|---|
| Relational database | `database` |
| NoSQL database | `nosql` |
| File storage | `storage` |
| CDN | `cdn` |
| Authentication | `auth` |
| Serverless functions | `serverless` |
| Containers / Kubernetes | `containers` |
| AI / ML APIs | `ml` |
| Email service | `email` |
| None of the above | `none` |

---

### Use Case Shortcuts (homepage)

The homepage also has a "What are you building?" section with 6 shortcut cards. Clicking one pre-fills the `useCase` (and sometimes `budget`) field in the wizard and navigates directly to Step 2, skipping Step 1. This is a fast path for users who know their use case.

---

## 9. The Scoring Engine

The scoring engine is entirely server-side in `server/src/engine/`. It is pure deterministic JavaScript — no randomness, no AI.

### Dimension weights

```js
// weights.js
{
  useCase:   0.30,   // 30 points max
  budget:    0.25,   // 25 points max
  easeOfUse: 0.20,   // 20 points max
  geography: 0.15,   // 15 points max
  services:  0.10,   // 10 points max
}
// Total: 1.00 (100 points max)
```

### How each provider is scored

For each provider, the scoring function runs this pipeline:

```
1. Calculate raw dimension scores (each returns 0–10, normalized to 0–1)
2. Multiply by weight × 100 to get points (e.g., 0.85 × 0.30 × 100 = 25.5 pts)
3. Apply priority boosts (multiply the relevant dimension score)
4. Cap each dimension at its maximum possible points
5. Sum all 5 dimensions → total score (integer, max 100)
```

### Dimension calculations

#### Use Case (max 30 points)

Each provider has a `useCaseScores` object in `providers.json` with a score from 0–10 for each possible use case. The matcher returns this score divided by 10 (normalized to 0–1).

```js
function matchUseCase(provider, useCase) {
  if (!useCase) return 0.5;
  return provider.useCaseScores[useCase] / 10;
}
```

Example — provider use case scores (out of 10):

| Provider | website | webapp | mobile | storage | ml | other |
|---|---|---|---|---|---|---|
| AWS | 8 | 10 | 9 | 10 | 9 | 8 |
| GCP | 7 | 9 | 8 | 9 | 10 | 7 |
| Azure | 7 | 9 | 8 | 9 | 8 | 9 |
| DigitalOcean | 9 | 8 | 7 | 7 | 4 | 8 |
| Vercel | 10 | 7 | 3 | 3 | 3 | 5 |
| Netlify | 10 | 7 | 2 | 2 | 2 | 5 |
| Render | 7 | 9 | 7 | 5 | 4 | 8 |
| Cloudflare | 9 | 8 | 4 | 8 | 6 | 7 |

So if the user selects "Simple website", Vercel and Netlify both score a perfect 10 for use case match. If they select "ML / AI workloads", GCP scores 10 and AWS scores 9, while Netlify scores only 2.

#### Budget (max 25 points)

Each provider has a `budgetScores` object. There is one special rule: if the user selected "free" budget AND the provider does not have an always-free tier (`alwaysFree: false`), the score is penalized by 40% (multiplied by 0.6). This penalizes AWS and Azure (whose "free" is a time-limited trial) versus GCP, Vercel, Netlify, and Cloudflare (which have genuinely always-free tiers).

```js
function matchBudget(provider, budget) {
  const score = provider.budgetScores[budget];
  if (budget === 'free' && !provider.alwaysFree) {
    return (score / 10) * 0.6;  // 40% penalty for trial-only free tiers
  }
  return score / 10;
}
```

Budget scores (out of 10):

| Provider | free | under$50 | $50-200 | $200-1000 | $1000+ |
|---|---|---|---|---|---|
| AWS | 7 | 7 | 9 | 10 | 10 |
| GCP | 8 | 8 | 8 | 9 | 10 |
| Azure | 6 | 6 | 8 | 9 | 10 |
| DigitalOcean | 5 | 10 | 9 | 7 | 5 |
| Vercel | 10 | 9 | 7 | 5 | 4 |
| Netlify | 10 | 9 | 6 | 4 | 3 |
| Render | 5 | 10 | 9 | 7 | 5 |
| Cloudflare | 10 | 10 | 8 | 7 | 6 |

#### Ease of Use (max 20 points)

This dimension does not depend on user answers at all — it is a fixed property of each provider based on how beginner-friendly it is, rated 0–10.

```js
easeScore = (provider.easeOfUse / 10) * weights.easeOfUse * 100
```

Ease of use ratings:

| Provider | Rating |
|---|---|
| Vercel | 10/10 |
| Netlify | 10/10 |
| DigitalOcean | 9/10 |
| Render | 8/10 |
| Cloudflare | 7/10 |
| GCP | 6/10 |
| AWS | 5/10 |
| Azure | 5/10 |

This rating reflects how approachable the platform is for a non-technical user. Vercel and Netlify score 10 because deploying is literally just pushing to Git. AWS and Azure score 5 because their consoles are complex and their service catalogs are overwhelming.

Note: The `profile` (experience level) from Step 2 does NOT directly modify the ease score — it is captured and sent to the AI for the explanation paragraph and chat context, but the scoring engine doesn't use it numerically. The ease-of-use dimension already proxies for beginner-friendliness.

#### Geography (max 15 points)

Each provider has a `geographyScores` object for the 4 geography options. Providers with more global infrastructure (AWS, Azure, GCP) score higher for "global" geography than smaller providers.

Geography scores (out of 10):

| Provider | single | multiple | global | specific |
|---|---|---|---|---|
| AWS | 8 | 10 | 10 | 9 |
| GCP | 8 | 9 | 9 | 8 |
| Azure | 8 | 10 | 10 | 10 |
| DigitalOcean | 9 | 7 | 6 | 7 |
| Vercel | 9 | 9 | 9 | 7 |
| Netlify | 9 | 9 | 8 | 7 |
| Render | 8 | 6 | 5 | 6 |
| Cloudflare | 9 | 10 | 10 | 9 |

#### Services (max 10 points)

The services dimension compares what the user said they need against what each provider natively supports.

```js
function matchServices(provider, services) {
  if (!services || services.length === 0 || services.includes('none')) return 0.5;
  const requested = services.filter(s => s !== 'none');
  const supported = requested.filter(s => provider.services.includes(s));
  return supported.length / requested.length;
}
```

If the user selects "none of the above", or selects nothing, every provider gets a neutral 0.5 (5 points) — a non-answer doesn't help or hurt anyone.

Otherwise: score = (services the provider supports ÷ services the user requested). If you need 3 things and the provider supports 2 of them, that's 2/3 = 0.67 → 6.7 points.

Provider service catalogs:

| Provider | database | nosql | storage | cdn | auth | serverless | containers | ml | email |
|---|---|---|---|---|---|---|---|---|---|
| AWS | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| GCP | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Azure | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| DigitalOcean | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | — |
| Vercel | — | — | ✓ | ✓ | — | ✓ | — | — | — |
| Netlify | — | — | — | ✓ | ✓ | ✓ | — | — | — |
| Render | ✓ | — | ✓ | — | — | — | ✓ | — | — |
| Cloudflare | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | — |

### Priority boosts (applied after raw scores)

After the 5 dimension scores are calculated, priority boosts are applied:

```
"cost" priority       → budget score × 1.25
"ease" priority       → ease score × 1.25
"scalability"         → use case score × 1.15
"compliance"          → (if AWS or Azure) use case × 1.10 AND geo × 1.10
"support"             → (if AWS, Azure, or GCP) ease × 1.10
"performance"         → (if Vercel or GCP) geo × 1.12
                        (if AWS) geo × 1.08
```

After boosting, each dimension is capped at its maximum (e.g., use case can never exceed 30 points even if boosted beyond that).

### Complete scoring example

**User inputs:** Web app, under $50 budget, priorities: cost + ease, single region, needs database + containers

For **DigitalOcean**:
- Use case: webapp score = 8 → 8/10 × 0.30 × 100 = **24.0 pts**
- Budget: under50 score = 10 → 10/10 × 0.25 × 100 = **25.0 pts**
- Ease: 9/10 × 0.20 × 100 = **18.0 pts**
- Geography: single = 9 → 9/10 × 0.15 × 100 = **13.5 pts**
- Services: database ✓, containers ✓ = 2/2 → 1.0 × 0.10 × 100 = **10.0 pts**
- Raw total: **90.5 pts**
- Apply "cost" boost: budget 25.0 × 1.25 = 31.25 → capped at 25.0
- Apply "ease" boost: ease 18.0 × 1.25 = 22.5 → capped at 20.0
- Final: 24.0 + 25.0 + 20.0 + 13.5 + 10.0 = **92 pts**

---

## 10. The 8 Cloud Providers

### Amazon Web Services (AWS)

- **Website:** aws.amazon.com
- **Brand color:** #FF9900 (orange)
- **Ease of use:** 5/10
- **Always-free tier:** No (12-month trial only)
- **Strengths:** Largest service catalog (200+ services), 30+ global regions, best enterprise compliance, most mature ecosystem
- **Weaknesses:** Steep learning curve, complex billing, overwhelming console
- **Best for:** Large web apps, enterprise workloads, ML, storage, any use case requiring maximum service breadth
- **Supported services:** database, nosql, storage, cdn, auth, serverless, containers, ml, email
- **Getting started:** Create account → explore Free Tier → start with Amplify or EC2

### Google Cloud Platform (GCP)

- **Website:** cloud.google.com
- **Brand color:** #4285F4 (blue)
- **Ease of use:** 6/10
- **Always-free tier:** Yes (e2-micro VM, 5 GB storage, 1 GB network free forever)
- **Strengths:** Best-in-class ML/AI (Vertex AI), invented Kubernetes (GKE), $300 new-user credit, Google's private global network
- **Weaknesses:** Smaller service catalog than AWS, fewer regions, inconsistent documentation
- **Best for:** ML/AI workloads, Kubernetes-heavy systems, data analytics
- **Supported services:** database, nosql, storage, cdn, auth, serverless, containers, ml, email
- **Getting started:** Sign up → $300 free credit → Firebase for apps, Vertex AI for ML, Cloud Run for serverless

### Microsoft Azure

- **Website:** azure.microsoft.com
- **Brand color:** #0078D4 (blue)
- **Ease of use:** 5/10
- **Always-free tier:** No ($200 credit for 30 days only)
- **Strengths:** Best Microsoft/Windows/.NET integration, 60+ compliance certifications, most data center regions globally, deepest enterprise presence
- **Weaknesses:** Complex pricing, steep for non-Microsoft users, UI inconsistency
- **Best for:** Enterprise teams already using Microsoft 365, Windows workloads, government/regulated industries
- **Supported services:** database, nosql, storage, cdn, auth, serverless, containers, ml, email
- **Getting started:** Create account → $200 credit → Azure App Service for web apps

### DigitalOcean

- **Website:** digitalocean.com
- **Brand color:** #0080FF (blue)
- **Ease of use:** 9/10
- **Always-free tier:** No (no free tier; $200 new-user credit)
- **Strengths:** Simplest interface of any provider, flat predictable pricing, excellent beginner documentation, great price-to-performance
- **Weaknesses:** No ML/AI APIs, fewer regions, not suitable for very large enterprise workloads
- **Best for:** Startups, indie developers, small teams wanting simplicity and predictable bills
- **Supported services:** database, nosql, storage, cdn, serverless, containers
- **Getting started:** Sign up → $200 credit → App Platform for quick deploys, Managed Databases for PostgreSQL/MySQL/Redis

### Vercel

- **Website:** vercel.com
- **Brand color:** #000000 (black, displayed as dark slate #111827)
- **Ease of use:** 10/10
- **Always-free tier:** Yes (Hobby plan, free forever)
- **Strengths:** Push-to-deploy, global edge CDN, generous free tier, first-class Next.js/React support, automatic PR previews
- **Weaknesses:** No backend infrastructure, no databases, no containers, costs escalate at high usage
- **Best for:** Frontend developers, static sites, Next.js apps, landing pages
- **Supported services:** cdn, serverless, storage
- **Getting started:** Sign up → import GitHub repo → deploy in one click → add custom domain

### Netlify

- **Website:** netlify.com
- **Brand color:** #00AD9F (teal)
- **Ease of use:** 10/10
- **Always-free tier:** Yes (Starter plan: 100 GB bandwidth, 300 build minutes/month, free forever)
- **Strengths:** Zero-config deploys, instant rollbacks, built-in forms and identity (auth), A/B split testing, global CDN
- **Weaknesses:** No persistent backend compute, no database, build minutes deplete fast on active projects
- **Best for:** Static sites, Jamstack apps, marketing pages, simple frontend deployments
- **Supported services:** cdn, serverless, auth
- **Getting started:** Sign up → import GitHub repo → auto-deploy → add custom domain

### Render

- **Website:** render.com
- **Brand color:** #7C3AED (purple)
- **Ease of use:** 8/10
- **Always-free tier:** No (free tier web services exist but spin down after 15 min of inactivity)
- **Strengths:** Modern Heroku alternative, flat-rate pricing, full-stack platform (web services + cron jobs + workers + databases in one place), managed PostgreSQL and Redis with daily backups, one-click rollback
- **Weaknesses:** Free tier services cold-start on first request, only 4 regions, no CDN, not for ML/enterprise
- **Best for:** Full-stack web apps, Node.js/Python/Ruby backends, teams wanting Heroku simplicity without vendor lock-in
- **Supported services:** database, storage, containers
- **Getting started:** Sign up → connect GitHub → select service type → add database in one click

### Cloudflare

- **Website:** cloudflare.com
- **Brand color:** #F6821F (orange)
- **Ease of use:** 7/10
- **Always-free tier:** Yes (100K Workers requests/day, 10 GB R2 storage, free forever)
- **Strengths:** Zero egress fees on R2 storage (a massive cost advantage over AWS S3/GCP/Azure), 300+ edge locations globally, market-leading DDoS protection on every plan, Workers AI for on-edge ML inference
- **Weaknesses:** Edge/serverless only (no VMs, no SSH), D1 is SQLite not full PostgreSQL, some products still maturing
- **Best for:** High-traffic static sites, edge computing, zero-egress storage, CDN-heavy architectures, cost-conscious deployments
- **Supported services:** cdn, serverless, storage, nosql, database, ml
- **Getting started:** Sign up → deploy with Cloudflare Pages via GitHub → add Worker + R2 bucket

---

## 11. Results Page (`/results`)

After the wizard completes and the API responds, the user lands on the Results page.

### What's shown

**Header row** — "Your cloud recommendation" title with:
- Share button (copies a base64-encoded URL containing the full answers + results)
- PDF button (triggers `window.print()`, styled by the print CSS)

**AI Explanation** — a 2–3 paragraph card generated by GPT-4o-mini explaining why the top provider was recommended and briefly mentioning the runner-up. If no OpenAI API key is configured on the server, this section shows a placeholder asking the user to configure the key.

**Provider cards** (one per provider, ranked 1st through 8th):
- Top provider gets a gold Trophy badge and a primary-colored border
- Each card shows: brand color strip, rank badge, provider name, description, score badge (out of 100)
- Always-visible pros (up to 3) and cons (up to 3)
- Expandable score breakdown (animated height collapse) showing the 5 dimension bars colored green/amber/red by percentage
- "Full profile →" link to the provider's deep-dive page

**Quick Start Guide** — for the top provider, a 3-step getting-started checklist shown in an emerald-tinted card.

**Bottom CTAs** — "Compare providers side-by-side →" (links to /compare, pre-populated with top 3 results) and "Start over" button (resets the wizard).

### Shared results

The Share button encodes the full `answers` and `results` objects as a base64 JSON string appended to the URL as `?share=<encoded>`. When someone opens this URL, the page reads the `share` param and restores both answers and results into context — the shared person sees the exact same recommendation.

### Loading skeleton

While the API call is in progress, the Results page shows animated skeleton cards (pulsing gray blocks in the shape of provider cards) rather than a blank screen.

---

## 12. Compare Page (`/compare`)

The Compare page allows users to select 2 or 3 providers and see them side-by-side in a feature matrix.

### Provider selector

All 8 providers appear as toggle pills at the top. Each pill shows the provider name on its brand color background when selected (with a checkmark). When 3 are already selected, unselected pills become disabled (greyed out, cursor blocked).

### Feature matrix

The `FeatureMatrix` component renders a scrollable table with:
- A sticky-ish header row showing the selected providers as colored pills (linked to their profile pages)
- If the user came from the Results page, each provider pill shows their wizard score (e.g., `87/100`) below the name
- 5 category groups: Pricing, Services, Infrastructure, Compliance, Developer Experience
- 20 total feature rows

**Category breakdown:**

*Pricing:* Free tier, Pay-as-you-go, Predictable billing

*Services:* Managed databases, Serverless functions, Managed Kubernetes, Built-in CDN, AI/ML APIs

*Infrastructure:* Multi-region, Global edge network, DDoS protection, 99.9%+ SLA

*Compliance:* GDPR, HIPAA eligible, SOC 2, ISO 27001

*Developer Experience:* Official CLI, Terraform support, GitHub integration, Built-in monitoring

**Winner highlighting:** When a feature row is "contested" (not all providers share the same value), the cells where the provider has `true` are highlighted with an emerald background and a circular badge icon. This makes it immediately obvious which providers have a unique advantage.

**TermTooltip:** Feature names with technical terms (e.g., "Managed Kubernetes", "GDPR", "Terraform support") are wrapped in tooltip components that show a plain-English definition on hover, pulled from the glossary.

**Legend:** Below the table is a legend explaining the circular badge (unique advantage) vs plain checkmark (shared by all).

### Shareable compare URLs

When 2+ providers are selected, the URL updates to `/compare?p=aws,gcp,azure` (replacing the browser history entry without adding a new one). The "Share link" button copies this URL. Anyone opening it sees the same comparison pre-loaded.

If the URL contains only 1 valid provider ID (e.g., `/compare?p=vercel`), the page automatically pairs it with the first 2 other providers (AWS and GCP by default), so the comparison matrix still loads immediately.

### Comparison history

The last 5 unique comparisons are saved to `localStorage` under `cloudadvisor_compare_history`. They appear as clickable chips at the bottom of the page with relative timestamps ("2h ago", "3d ago"). Clicking restores that comparison.

---

## 13. Pricing Estimator Page (`/pricing`)

The Pricing Estimator lets users adjust sliders for 4 resource types and instantly see estimated monthly costs for all 8 providers, sorted cheapest to most expensive.

### How the frontend works

`PricingEstimator.jsx` manages the 4 resource sliders. Every time any slider changes, a 300ms debounce timer fires and sends a `POST /api/pricing` request. This prevents spamming the server on every slider drag.

While the request is in flight, a small loading spinner appears in the results panel header. The previous estimates stay visible until new ones arrive.

### The 4 sliders

| Slider | Default | Min | Max | Unit | What it represents |
|---|---|---|---|---|---|
| Compute | 720 | 0 | 2160 | hrs/mo | Instance-hours of virtual compute per month (720 = one server running 24/7) |
| Storage | 50 | 0 | 5000 | GB | Gigabytes of persistent object/block storage |
| Bandwidth | 100 | 0 | 2000 | GB/mo | Outbound data transfer from the cloud to the internet |
| Databases | 1 | 0 | 10 | db | Number of managed database instances |

Each slider has a custom stepper (−, number input, +) that replaces the browser's default spinners. The slider track is also a full-width range input overlaid transparently on a styled visual track. The number input and the slider stay in sync in both directions. Below each slider is a contextual hint text that changes based on the current value (e.g., "720 hrs = 100% of one server running 24/7 for a month").

### How pricing is calculated (server)

`server/routes/pricing.js` runs `calcProviderCost()` for each requested provider:

```
billableCompute   = max(0, computeHours   − freeTier.computeHours)
billableStorage   = max(0, storageGb      − freeTier.storageGb)
billableBandwidth = max(0, bandwidthGb    − freeTier.bandwidthGb)
billableDb        = max(0, databaseInstances − freeTier.databaseInstances)

computeCost   = billableCompute   × pricePerHour
storageCost   = billableStorage   × pricePerGbMonth
bandwidthCost = billableBandwidth × pricePerGb
dbCost        = billableDb        × pricePerInstanceMonth

total = sum of all four costs
```

Free tier usage is subtracted first. You only pay for what exceeds the free tier.

### Pricing rates used (from pricing.json)

**Compute (price per hour):**
- AWS: $0.0232 (t3.small EC2, us-east-1 on-demand)
- GCP: $0.01675 (e2-small, us-central1)
- Azure: $0.0207 (B1ms VM, East US)
- DigitalOcean: $0.00893 (Basic Droplet 1 vCPU/1 GB)
- Vercel: $0.00 (serverless, bundled in Pro plan)
- Netlify: $0.00 (Edge Functions, event-driven not hourly)
- Render: $0.00694 (Starter web service)
- Cloudflare: $0.00 (Workers, request-driven not hourly)

**Storage (price per GB/month):**
- AWS: $0.023 (S3 Standard)
- GCP: $0.020 (Cloud Storage Standard)
- Azure: $0.018 (Blob Storage LRS Hot tier)
- DigitalOcean: $0.020 (Spaces Object Storage)
- Vercel: $0.023 (Vercel Blob)
- Netlify: $0.023 (Netlify Blobs)
- Render: $0.25 (Render Disks — most expensive)
- Cloudflare: $0.015 (R2 — cheapest)

**Bandwidth (price per GB outbound):**
- AWS: $0.09
- GCP: $0.08
- Azure: $0.087
- DigitalOcean: $0.01 (1 TB free per Droplet)
- Vercel: $0.15
- Netlify: $0.20
- Render: $0.10
- Cloudflare: $0.00 ← ZERO — R2 has no egress fees

**Database (price per managed instance/month):**
- AWS: $15.33 (RDS db.t3.micro)
- GCP: $9.37 (Cloud SQL db-f1-micro)
- Azure: $12.41 (PostgreSQL Flexible Burstable B1ms)
- DigitalOcean: $15.00 (Managed PostgreSQL Basic)
- Vercel: $0.00 (no native DB; uses external providers)
- Netlify: $0.00 (no native DB)
- Render: $7.00 (Managed PostgreSQL Starter)
- Cloudflare: $0.00 (D1 SQLite — 5 GB free, then $0.001/GB)

**Free tier allowances:**

| Provider | Compute hrs | Storage GB | Bandwidth GB | DB instances |
|---|---|---|---|---|
| AWS | 750 | 5 | 1 | 1 |
| GCP | 744 | 5 | 1 | 0 |
| Azure | 750 | 5 | 5 | 0 |
| DigitalOcean | 0 | 0 | 1024 | 0 |
| Vercel | ∞ | 1 | 100 | 0 |
| Netlify | 0 | 1 | 100 | 0 |
| Render | 750 | 0 | 100 | 0 |
| Cloudflare | 0 | 10 | 0 (infinite) | 1 |

### Pricing results display

Results appear in `PricingBreakdown.jsx` as a sorted list (cheapest first). Each provider row shows:
- Brand color dot
- Provider name
- "Best value" badge on the cheapest provider
- Monthly cost in dollars
- An animated horizontal bar (width proportional to cost relative to the most expensive provider)

Each row is expandable. Clicking it reveals:
- Cost breakdown by category (compute, storage, bandwidth, database — only non-zero items shown)
- Contextual notes (e.g., Vercel's compute shows $0 with a note explaining that serverless functions are bundled in the $20/mo Pro plan)
- A "View full profile →" link to the provider's profile page

Contextual notes are shown for:
- Vercel, Netlify, Cloudflare when compute = $0 (explains the serverless/edge model)
- Cloudflare when bandwidth is calculated (explains zero egress from R2)
- Render when it appears in results (explains the free tier spin-down behavior)

### Export to CSV

The "Export CSV" button in the results header generates and downloads a `.csv` file containing:
- All providers sorted cheapest to most expensive
- Monthly total and per-category breakdown
- Configuration summary (the 4 slider values)
- File name: `cloudadvisor-pricing.csv`

---

## 14. Provider Profile Pages (`/providers/:id`)

Each of the 8 providers has a dedicated full-profile page at `/providers/aws`, `/providers/gcp`, etc.

### Page structure

**Back button** — `navigate(-1)` returns the user to wherever they came from.

**Hero card** — colored top strip, provider full name, "Always-free tier" badge if applicable, description text, ease-of-use bar (10 colored squares), and a "Visit website" button in the provider's brand color.

**Pros / Cons grid** — two-column card (stacks to one column on mobile). Pros listed with green `CheckCircle2` icons, cons with red `XCircle` icons.

**Features checklist** — organized into 5 categories (same as the compare matrix): Pricing, Services, Infrastructure, Compliance, Developer Experience. Each feature is a row with a green check or gray X. Items the provider doesn't support are visually faded.

**Getting started** — numbered steps (3 steps per provider) with the provider's brand color as the step number background.

**CTA row** — three buttons: "Visit [Provider]" (external link), "Compare providers" (links to `/compare?p={id}`, pre-selecting this provider), "Get my recommendation" (links to wizard).

### Data source

Profile page data comes from `client/src/data/providers.js` — the client-side static data file. This is separate from `server/src/data/providers.json` (which is used for scoring) but contains the same core information plus richer content (full descriptions, all pros/cons, getting-started steps).

---

## 15. Cloud Glossary (`/glossary`)

The Glossary page contains **125 plain-English definitions** of cloud computing terms, organized into categories.

### Features

**Search** — A real-time search input filters terms by name, full name, or definition content as the user types.

**Category filter** — Tag pills at the top let users filter by category. Selecting a tag shows only terms in that category. Selecting "All" shows everything.

**Term cards** — Each term shows:
- The short term name (bold, larger)
- The full name ("CDN" → "Content Delivery Network")
- The plain-English definition

### Categories and terms

**basics** — Cloud Computing, On-Premises, Server, Hosting, Domain Name, IP Address, DNS, SSL/TLS

**compute** — vCPU, Spot Instance, Reserved Instance, Cold Start, Container (Docker), VM, Serverless, IaaS, PaaS, SaaS, AWS Lambda, AWS EC2, Cloudflare Pages, Firebase, Vercel KV

**networking** — VPC, CDN, Load Balancer, Firewall, Subnet, NAT Gateway, Port, DNS Record, HTTPS, WebSocket, TCP/IP

**storage** — Object Storage, Block Storage, File Storage, AWS S3, AWS RDS

**databases** — Managed Database, PostgreSQL, MySQL, Redis, NoSQL, SQL, ACID, Connection Pooling, Migration, ORM, Caching

**devops** — CI/CD, Docker, Kubernetes, Helm, GitOps, Pipeline, Container Registry, Environment Variables, Staging Environment, Rollback, Terraform, Ansible

**architecture** — Microservices, Monolith, API, REST API, GraphQL, Message Queue, Pub/Sub, Event-Driven, Webhook, Blue/Green Deployment, Canary Deployment, Feature Flag

**security** — IAM, Zero Trust, OAuth 2.0, JWT, MFA, WAF, CORS, Secret Manager, Encryption at Rest, DDoS

**monitoring** — Logging, Metrics, Distributed Tracing, APM, Uptime, Alert, SLO, RTO, RPO

**cost** — Free Tier, FinOps, Cost Allocation Tags, Ingress, Egress

**reliability** — SLA, High Availability, Fault Tolerance, Auto Scaling, Disaster Recovery

**service model** — IaaS, PaaS, SaaS (also cross-listed)

**performance** — Latency, Throughput, Caching, CDN (cross-listed)

### How search and filtering work

```js
const filtered = terms.filter(t => {
  const matchesTag = activeTag === 'All' || t.tags.includes(activeTag);
  const matchesQuery = !query ||
    t.term.toLowerCase().includes(query) ||
    t.full.toLowerCase().includes(query) ||
    t.definition.toLowerCase().includes(query);
  return matchesTag && matchesQuery;
});
```

Both filters apply simultaneously. The result count ("Showing 12 of 125 terms") updates live.

### TermTooltip (inline glossary)

Technical terms in the feature matrix's compare rows are wrapped in `TermTooltip` components. Hovering shows a small tooltip with the glossary definition. This lets users understand what "Terraform support" or "ISO 27001" means without leaving the compare page.

---

## 16. AI Chat Assistant

The AI Chat Assistant is a floating panel in the bottom-right corner of every page. It is always accessible regardless of which page the user is on.

### How to open it

A circular button (primary gradient background, white chat bubble icon) sits at `fixed bottom-5 right-5`. Clicking it opens the chat panel with an animation (scale + y transition). Clicking again (or the X button inside) closes it. The icon animates between a chat bubble and an X on open/close.

### Chat panel layout

- **Header bar** — purple primary background with "CloudAdvisor AI" title and a subtitle showing either "Context: [top provider] recommendation" (if the user has results) or "Ask me anything about cloud"
- **Stop button** — appears during streaming; clicking it aborts the current response mid-stream
- **Clear button** — appears when messages exist and streaming is stopped; clears the conversation
- **Messages area** — scrollable, with auto-scroll to the latest message
- **Input area** — auto-resizing textarea (max 3 lines) + send button

### Starter questions

When no messages exist, the panel shows a set of 4 suggested questions. These are context-aware:

If the user has completed the wizard:
- "Why was [top provider] recommended for me?"
- "How do I get started with [top provider]?"
- "What are the hidden costs I should know about?"
- "Is [top provider] right for a complete beginner?"

If the user has not completed the wizard:
- "What's the difference between AWS, GCP, and Azure?"
- "Which cloud provider is best for a small startup?"
- "How do I choose between serverless and containers?"
- "What cloud services do I need to host a web app?"

### Streaming (SSE — Server-Sent Events)

The chat does NOT use the standard request/response pattern. It uses **Server-Sent Events** for streaming:

1. Frontend sends `POST /api/chat` with the message history and optional context
2. Server keeps the connection open and streams the GPT-4o-mini response token by token
3. Each token arrives as a JSON SSE event: `data: {"token": "word"}`
4. The frontend appends each token to the last message in real time
5. The `[DONE]` sentinel closes the stream
6. If aborted by the user, `AbortController.abort()` closes the connection

This creates a typewriter effect as the response streams in — the user sees words appearing as they are generated rather than waiting for the full response.

### Context injection

Before sending to OpenAI, the server builds a system prompt that includes the user's recommendation context:

```
TOP RECOMMENDATION: [provider name] (score: X/100)
USE CASE: [label]
BUDGET: [label]
PRIORITIES: [list]
```

This means the AI knows what the user selected and can give answers specific to their situation. For example, if the user was recommended AWS for an ML workload, the AI will answer "how do I reduce costs?" in the context of AWS EC2 and SageMaker specifically.

### Strict topic scope

The AI is restricted to cloud infrastructure topics only. The system prompt includes an explicit scope rule:

> "STRICT SCOPE RULE — You are exclusively a cloud infrastructure assistant. You ONLY answer questions about: cloud providers, cloud services, cloud architecture, pricing, security, DevOps, CI/CD, Kubernetes/Docker in cloud context, cloud migration..."
>
> "If the user asks ANYTHING outside these topics (cooking, sports, general coding, personal advice, math, etc.), respond with exactly: 'I'm CloudAdvisor, so I can only help with cloud infrastructure questions...'"

This cannot be bypassed regardless of how the user frames their request.

### No API key detection

If the server doesn't have an `OPENAI_API_KEY` configured, the `/api/chat` route responds with a fallback message: "AI chat requires an OpenAI API key". The frontend detects this string during streaming and shows an amber warning banner above the input: "API key not configured — Add OPENAI_API_KEY to server/.env to enable AI chat." The input is disabled in this state.

### Message length limit

User messages are capped at 600 characters on the frontend before being sent. This prevents abuse and keeps context window usage reasonable.

### Rate limiting

The `/api/chat` endpoint is rate-limited to **20 requests per 15 minutes** per IP address. Hitting the limit returns a 429 error. The frontend detects HTTP 429 and shows: "Rate limit reached. Please wait a few minutes before sending more messages."

---

## 17. Home Page (`/`)

The home page has 4 sections:

### Hero section
- Animated badge: "Free & No account required" with a pulsing green dot
- Large headline: "Find your perfect cloud provider" with gradient text on "cloud provider"
- Typewriter subtitle that cycles through 5 messages at different speeds
- Two CTA buttons: "Start the wizard" (primary) and "Compare providers" (secondary)
- Three feature bullets: guided wizard, deterministic scoring, AI explanation

**Resume bar:** If the user has a wizard session in progress (partial or complete), an animated banner appears at the top of the hero:
- Amber banner: "You have a wizard session in progress — continue from step N?" with "Continue" and "Start fresh" buttons
- Blue/primary banner: "You have a saved recommendation — want to view it?" with "View results" and "Start fresh" buttons

### Use case shortcuts
A "What are you building?" grid with 6 clickable cards. Each card pre-fills a use-case answer and navigates directly to wizard Step 2. This saves users from going through Step 1 if they already know their use case.

### How it works
A 3-step explainer: "Answer 6 questions" → "Get your score" → "Understand why"

### Browse all providers
A 4-column (2 on mobile, 3 on tablet) grid showing all 8 provider cards. Each card has:
- Provider's brand color strip at top
- Full name (truncated to 1 line to keep all cards equal height)
- "Free" badge if the provider has an always-free tier
- 2-line description
- "Profile →" link to the full provider page

Cards animate in as the user scrolls down using Framer Motion's `whileInView`.

### Onboarding banner
First-time visitors (detected by absence of `cloudadvisor_onboarded` in localStorage) see a toast notification in the bottom-left corner after 900ms:
- "New here? Find your cloud in 2 min"
- Brief description and a "Start the wizard" link
- X dismiss button
- Once dismissed, the key is written to localStorage and the banner never appears again

---

## 18. Server & API

The backend runs on Express.js on port 3001. In production it should be deployed on Railway, Render, or any Node.js host.

### Endpoints

#### `POST /api/recommend`

Accepts wizard answers, runs the scoring engine, optionally calls OpenAI, returns ranked results.

**Request body:**
```json
{
  "useCase": "webapp",
  "profile": "beginner",
  "budget": "under50",
  "priorities": ["cost", "ease"],
  "geography": "single",
  "services": ["database", "containers"]
}
```

**Response:**
```json
{
  "ranked": [
    {
      "id": "digitalocean",
      "name": "DigitalOcean",
      "score": 92,
      "breakdown": {
        "useCase": 24,
        "budget": 25,
        "easeOfUse": 20,
        "geography": 14,
        "services": 10
      },
      "pros": [...],
      "cons": [...],
      ...
    }
  ],
  "explanation": "DigitalOcean stood out for you because..."
}
```

The OpenAI call has a **15-second timeout**. If it times out or fails for any reason, `explanation` is `null` and results still return normally. The API never fails because of OpenAI.

**Rate limit:** 8 requests per 15 minutes per IP.

#### `POST /api/chat`

Accepts message history and optional context. Returns a **Server-Sent Events stream**.

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "Why is DigitalOcean good for me?" }
  ],
  "context": {
    "topProvider": "DigitalOcean",
    "score": 92,
    "useCase": "webapp",
    "budget": "under50",
    "priorities": ["cost", "ease"]
  }
}
```

**Response** (streaming SSE):
```
data: {"token": "Digital"}
data: {"token": "Ocean"}
data: {"token": " is"}
...
data: [DONE]
```

**Rate limit:** 20 requests per 15 minutes per IP.

#### `POST /api/pricing`

Accepts provider IDs and resource quantities. Returns cost estimates.

**Request body:**
```json
{
  "providers": ["aws", "gcp", "azure", "digitalocean", "vercel", "netlify", "render", "cloudflare"],
  "resources": {
    "computeHours": 720,
    "storageGb": 50,
    "bandwidthGb": 100,
    "databaseInstances": 1
  }
}
```

**Response:**
```json
{
  "estimates": [
    {
      "provider": "cloudflare",
      "name": "Cloudflare",
      "monthly_usd": 0.60,
      "breakdown": {
        "compute": 0.00,
        "storage": 0.60,
        "bandwidth": 0.00,
        "database": 0.00
      }
    },
    ...
  ]
}
```

**Rate limit:** 60 requests per minute per IP.

#### `GET /api/health`

Returns `{ status: "ok", timestamp: "..." }`. Used to verify the server is running.

---

## 19. Security & Rate Limiting

### HTTP security headers (Helmet)

The server uses the `helmet` middleware which automatically sets:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection`
- `Strict-Transport-Security`
- `Content-Security-Policy` (default Helmet policy)

### CORS

Cross-origin requests are restricted to the client origin: `http://localhost:5173` in development, and the value of the `CLIENT_ORIGIN` environment variable in production. Requests from any other origin are rejected.

### Rate limiting (express-rate-limit)

| Endpoint | Limit | Window | Why |
|---|---|---|---|
| All routes (global) | 100 req | 15 min | Overall abuse prevention |
| `/api/recommend` | 8 req | 15 min | OpenAI calls are expensive |
| `/api/chat` | 20 req | 15 min | Each message costs tokens |
| `/api/pricing` | 60 req | 1 min | Pure math, cheap, but still limited |

The server is configured with `trust proxy: 1` so rate limiting uses the real client IP behind a reverse proxy (Render, Railway, Vercel, etc.) rather than the proxy's IP.

### Request body size limit

The JSON body parser is limited to **32 KB**. This prevents large payload attacks.

### OpenAI key isolation

The OpenAI API key is stored only in `server/.env` and never sent to the client. The client talks to `/api/chat` which talks to OpenAI server-side. There is no way for a browser user to extract the API key.

---

## 20. Accessibility

CloudAdvisor was built with WCAG 2.1 AA guidelines in mind.

### Keyboard navigation

- All interactive elements (buttons, links, inputs) are reachable by Tab
- Wizard steps support ArrowLeft to go back and Enter to advance
- Modal dialogs (the reset confirmation) trap focus and can be dismissed with keyboard
- The wizard's ResetConfirm dialog is fully keyboard operable

### Focus rings

Global `:focus-visible` rule in `globals.css` ensures every focused interactive element shows a clear `ring-2 ring-primary-500 ring-offset-2` ring. This only appears during keyboard navigation (not on mouse click).

### ARIA attributes

Throughout the app:
- Buttons use `aria-label` where the label isn't obvious from visible text
- Toggle buttons use `aria-pressed={true/false}`
- Expandable panels use `aria-expanded={true/false}`
- The chat close button: `aria-label="Close chat"`
- Provider selector pills: `aria-label="Add/Remove {name} from comparison"` and `aria-pressed`
- Slider input: `aria-label={label}` on the range element

### Color contrast

All text on colored backgrounds (e.g., the primary-colored header bar, branded buttons) uses white text which meets WCAG AA contrast ratios. Score bars use a color system where red = low, amber = medium, green = high — but scores are also shown numerically so color-blind users can still read them.

### Screen reader support

Semantic HTML is used throughout: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<h1>`–`<h3>`, `<ol>`, `<ul>`, `<button>`, `<a>`. The wizard uses `<div>` containers but all interactive elements are proper `<button>` elements.

---

## 21. Responsive Design

The app is fully responsive from 320px (iPhone SE) to 1440px+ (desktop).

### Breakpoints (Tailwind defaults)

| Name | Width | Usage |
|---|---|---|
| (mobile) | < 640px | Single column everything, larger touch targets |
| `sm` | 640px+ | Two-column grids, horizontal button rows |
| `md` | 768px+ | Footer grid, some layout shifts |
| `lg` | 1024px+ | Pricing estimator side-by-side, 4-column provider grid |

### Key responsive decisions

**Navbar:** On mobile, the desktop nav links and "Start Free →" button are hidden. A hamburger `Menu` icon opens a full-width dropdown mobile nav with all links plus the CTA button.

**Home page hero:** CTAs stack vertically on mobile (`flex-col`), horizontal on `sm+` (`sm:flex-row`).

**Home page provider grid:** `grid-cols-2` on mobile, `sm:grid-cols-3` on tablet, `lg:grid-cols-4` on desktop. All cards are the same height because provider names are truncated to 1 line (`truncate`) and descriptions are clamped to 2 lines (`line-clamp-2`).

**Wizard steps:** Option cards stack vertically on mobile (`grid-cols-1`), 2-column on `sm+` (`sm:grid-cols-2`).

**Results page:** Provider cards are single-column on all sizes. The pros/cons grid inside each card stacks on mobile, goes 2-column on `sm+`.

**Compare feature matrix:** The table uses `min-w-[500px]` with `overflow-x-auto` on the container — so on mobile users can scroll horizontally to see all columns. The row label column is `w-44` (176px wide), leaving room for 2–3 provider columns.

**Pricing estimator:** Sliders and results stack vertically on mobile (`grid-cols-1`), side-by-side on large screens (`lg:grid-cols-2`). The slider's sublabel breaks to its own line on mobile to prevent overflow.

**Chat panel:** On mobile the panel is `width = 100vw - 2.5rem` (almost full width). On `sm+` it's `460px` fixed width. Height is capped at `min(620px, 80vh)` so it never fills a small phone's screen entirely.

**Onboarding banner:** Centered at the bottom on mobile (`left-1/2 -translate-x-1/2`), positioned bottom-left on desktop (`sm:left-5`). On mobile it sits at `bottom-[4.5rem]` — above the chat button (which is at `bottom-5`, 80px lower) — to prevent overlap.

**Footer:** Stacks to 1 column on mobile, 4-column grid on `md+` (brand column spans 2 of 4).

---

## 22. Session Persistence

User data is stored in the browser's `localStorage`. No accounts, no server-side sessions.

| Key | Contents | When written | When cleared |
|---|---|---|---|
| `cloudadvisor_session` | `{ answers, results }` as JSON | Every wizard answer update; on results | On "Start over" |
| `theme` | `"light"` or `"dark"` | On theme toggle | Never (persists across resets) |
| `cloudadvisor_compare_history` | Last 5 comparisons as JSON | Each time a valid 2+ comparison is viewed | Never (max 5, oldest removed) |
| `cloudadvisor_onboarded` | `"1"` | When onboarding banner is dismissed | Never |

On app load, `AdvisorContext` reads `cloudadvisor_session` and initializes state with saved answers/results. This means:
- Refreshing mid-wizard: returns to same step with same answers
- Closing the tab and returning: session restored
- "Start over" button: clears the session and resets all answers and results

---

## 23. Dark Mode

Dark mode uses Tailwind's `class` strategy. Every component has explicit `dark:` class variants.

**How it works:**
1. On app load, `AdvisorContext` reads the `theme` key from localStorage
2. If `theme === "dark"`, it adds the `dark` class to `document.documentElement`
3. Tailwind's dark mode is triggered and all `dark:` variants activate
4. The `ThemeToggle` button in the navbar dispatches `TOGGLE_THEME`
5. The reducer flips the class and saves the new value to localStorage

**Implementation notes:**
- The `dark` class check runs in `App.jsx` via a `useEffect` that watches `state.theme`
- The print CSS always forces light mode (`color-scheme: light`) regardless of the current theme, so PDFs always print with white backgrounds
- All scoring bars, provider color strips, and gradient backgrounds use `print-color-adjust: exact` to ensure they print correctly

---

*This document was generated on 2026-05-10 and reflects the complete state of the CloudAdvisor project.*
