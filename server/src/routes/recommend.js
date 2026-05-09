const express = require('express');
const router = express.Router();
const { scoreProvider } = require('../engine/scorer');
const providersData = require('../data/providers.json');
const { generateExplanation } = require('../services/openai');

router.post('/', async (req, res) => {
  try {
    const { useCase, profile, budget, priorities, geography, services } = req.body;
    const userAnswers = { useCase, profile, budget, priorities: priorities || [], geography, services: services || [] };

    const ranked = providersData.providers
      .map((provider) => {
        const { score, breakdown } = scoreProvider(provider, userAnswers);
        return {
          id: provider.id,
          name: provider.name,
          fullName: provider.fullName,
          brandColor: provider.brandColor,
          description: provider.description,
          score,
          breakdown,
          pros: provider.pros,
          cons: provider.cons,
          gettingStarted: provider.gettingStarted,
          features: provider.features,
        };
      })
      .sort((a, b) => b.score - a.score);

    // Attempt OpenAI explanation — fail silently so results always return
    let explanation = null;
    try {
      const withTimeout = Promise.race([
        generateExplanation(userAnswers, ranked),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
      ]);
      explanation = await withTimeout;
    } catch {
      explanation = null;
    }

    res.json({ ranked, explanation });
  } catch (err) {
    console.error('Recommend error:', err);
    res.status(500).json({ error: 'Failed to generate recommendation.' });
  }
});

module.exports = router;
