const weights = require('./weights');
const { matchUseCase, matchBudget, matchGeography, matchServices } = require('./matcher');

function applyPriorityBoosts(rawScores, provider, priorities = []) {
  let { useCaseScore, budgetScore, easeScore, geoScore, servicesScore } = rawScores;

  for (const priority of priorities) {
    switch (priority) {
      case 'cost':
        budgetScore *= 1.25;
        break;
      case 'ease':
        easeScore *= 1.25;
        break;
      case 'scalability':
        useCaseScore *= 1.15;
        break;
      case 'compliance':
        if (['azure', 'aws'].includes(provider.id)) {
          useCaseScore *= 1.10;
          geoScore *= 1.10;
        }
        break;
      case 'support':
        if (['aws', 'azure', 'gcp'].includes(provider.id)) {
          easeScore *= 1.10;
        }
        break;
      case 'performance':
        if (['vercel', 'gcp'].includes(provider.id)) {
          geoScore *= 1.12;
        }
        if (provider.id === 'aws') {
          geoScore *= 1.08;
        }
        break;
    }
  }

  return { useCaseScore, budgetScore, easeScore, geoScore, servicesScore };
}

function scoreProvider(provider, userAnswers) {
  const { useCase, budget, priorities, geography, services } = userAnswers;

  const raw = {
    useCaseScore: matchUseCase(provider, useCase) * weights.useCase * 100,
    budgetScore: matchBudget(provider, budget) * weights.budget * 100,
    easeScore: (provider.easeOfUse / 10) * weights.easeOfUse * 100,
    geoScore: matchGeography(provider, geography) * weights.geography * 100,
    servicesScore: matchServices(provider, services) * weights.services * 100,
  };

  const boosted = applyPriorityBoosts(raw, provider, priorities);

  // Cap each dimension at its max weight to prevent boosts from inflating past 100
  const maxes = {
    useCaseScore: weights.useCase * 100,
    budgetScore: weights.budget * 100,
    easeScore: weights.easeOfUse * 100,
    geoScore: weights.geography * 100,
    servicesScore: weights.services * 100,
  };

  const capped = {
    useCaseScore: Math.min(boosted.useCaseScore, maxes.useCaseScore),
    budgetScore: Math.min(boosted.budgetScore, maxes.budgetScore),
    easeScore: Math.min(boosted.easeScore, maxes.easeScore),
    geoScore: Math.min(boosted.geoScore, maxes.geoScore),
    servicesScore: Math.min(boosted.servicesScore, maxes.servicesScore),
  };

  const total = Object.values(capped).reduce((sum, v) => sum + v, 0);

  return {
    score: Math.min(100, Math.round(total)),
    breakdown: {
      useCase: Math.round(capped.useCaseScore),
      budget: Math.round(capped.budgetScore),
      easeOfUse: Math.round(capped.easeScore),
      geography: Math.round(capped.geoScore),
      services: Math.round(capped.servicesScore),
    },
  };
}

module.exports = { scoreProvider };
