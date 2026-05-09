const express = require('express');
const router = express.Router();
const pricingData = require('../data/pricing.json');

function calcProviderCost(providerPricing, resources) {
  const { computeHours = 0, storageGb = 0, bandwidthGb = 0, databaseInstances = 0 } = resources;
  const ft = providerPricing.freeTier;

  const billableCompute = Math.max(0, computeHours - ft.computeHours);
  const billableStorage = Math.max(0, storageGb - ft.storageGb);
  const billableBandwidth = Math.max(0, bandwidthGb - ft.bandwidthGb);
  const billableDb = Math.max(0, databaseInstances - ft.databaseInstances);

  const computeCost = billableCompute * providerPricing.compute.pricePerHour;
  const storageCost = billableStorage * providerPricing.storage.pricePerGbMonth;
  const bandwidthCost = billableBandwidth * providerPricing.bandwidth.pricePerGb;
  const dbCost = billableDb * providerPricing.database.pricePerInstanceMonth;

  const total = computeCost + storageCost + bandwidthCost + dbCost;

  return {
    monthly_usd: Math.round(total * 100) / 100,
    breakdown: {
      compute: Math.round(computeCost * 100) / 100,
      storage: Math.round(storageCost * 100) / 100,
      bandwidth: Math.round(bandwidthCost * 100) / 100,
      database: Math.round(dbCost * 100) / 100,
    },
  };
}

router.post('/', (req, res) => {
  try {
    const { providers: requestedProviders = Object.keys(pricingData.providers), resources = {} } = req.body;

    const estimates = requestedProviders
      .filter((id) => pricingData.providers[id])
      .map((id) => ({
        provider: id,
        name: pricingData.providers[id].name,
        ...calcProviderCost(pricingData.providers[id], resources),
      }));

    res.json({ estimates });
  } catch (err) {
    console.error('Pricing error:', err);
    res.status(500).json({ error: 'Failed to calculate pricing.' });
  }
});

module.exports = router;
