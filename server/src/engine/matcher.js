// All match functions return a value 0–1 (normalized from 0–10 scores).

function matchUseCase(provider, useCase) {
  if (!useCase) return 0.5;
  const score = provider.useCaseScores[useCase];
  return score != null ? score / 10 : 0.5;
}

function matchBudget(provider, budget) {
  if (!budget) return 0.5;
  const score = provider.budgetScores[budget];
  if (score == null) return 0.5;

  // For "free" tier: penalize providers whose free offering is only a time-limited trial
  // (AWS = 12-month trial, Azure = 30-day credit) vs genuinely always-free tiers
  // (GCP e2-micro, Vercel Hobby plan — free forever).
  if (budget === 'free' && !provider.alwaysFree) {
    return (score / 10) * 0.6;
  }

  return score / 10;
}

function matchGeography(provider, geography) {
  if (!geography) return 0.5;
  const score = provider.geographyScores[geography];
  return score != null ? score / 10 : 0.5;
}

function matchServices(provider, services) {
  if (!services || services.length === 0 || services.includes('none')) return 0.5;
  const requested = services.filter((s) => s !== 'none');
  if (requested.length === 0) return 0.5;
  const supported = requested.filter((s) => provider.services.includes(s));
  return supported.length / requested.length;
}

module.exports = { matchUseCase, matchBudget, matchGeography, matchServices };
