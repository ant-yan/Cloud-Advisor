// Rates verified: May 2026 — check provider pricing pages for updates
const express = require('express');
const router = express.Router();
const pricingData = require('../data/pricing.json');

// Serverless conversion: realistic average of ~5,000 requests/hr for typical web apps
// (100% CPU-saturation at 50ms/req = 72,000/hr is unrealistic; 5,000/hr is a practical baseline)
const REQUESTS_PER_COMPUTE_HOUR = 5000;

function calcProviderCost(providerPricing, resources) {
  const { computeHours = 0, storageGb = 0, bandwidthGb = 0, databaseInstances = 0 } = resources;
  const ft = providerPricing.freeTier;

  let computeCost = 0;
  let serverlessNote = null;

  if (providerPricing.serverless) {
    // Convert compute hours to estimated function invocations
    const estimatedInvocations = Math.round(computeHours * REQUESTS_PER_COMPUTE_HOUR);
    const billableInvocations = Math.max(0, estimatedInvocations - ft.freeInvocations);
    computeCost = billableInvocations * providerPricing.compute.pricePerInvocation;
    serverlessNote =
      `Serverless platform: ${estimatedInvocations.toLocaleString()} estimated invocations ` +
      `(${computeHours} hr × ${REQUESTS_PER_COMPUTE_HOUR.toLocaleString()} req/hr typical average). ` +
      `Pricing is based on function invocations and bandwidth, not server hours.`;
  } else {
    const billableCompute = Math.max(0, computeHours - ft.computeHours);
    computeCost = billableCompute * providerPricing.compute.pricePerHour;
  }

  const billableStorage = Math.max(0, storageGb - ft.storageGb);
  const billableBandwidth = Math.max(0, bandwidthGb - ft.bandwidthGb);
  const billableDb = Math.max(0, databaseInstances - ft.databaseInstances);

  const storageCost = billableStorage * providerPricing.storage.pricePerGbMonth;
  let bandwidthCost = billableBandwidth * providerPricing.bandwidth.pricePerGb;
  const dbCost = billableDb * providerPricing.database.pricePerInstanceMonth;

  const bwCap = providerPricing.bandwidth.maxMonthlyCost;
  const bandwidthCapped = bwCap !== undefined && bandwidthCost > bwCap;
  if (bandwidthCapped) bandwidthCost = bwCap;

  const total = computeCost + storageCost + bandwidthCost + dbCost;

  const result = {
    monthly_usd: Math.round(total * 100) / 100,
    breakdown: {
      compute: Math.round(computeCost * 100) / 100,
      storage: Math.round(storageCost * 100) / 100,
      bandwidth: Math.round(bandwidthCost * 100) / 100,
      database: Math.round(dbCost * 100) / 100,
    },
  };

  if (serverlessNote) result.serverless_note = serverlessNote;
  if (bandwidthCapped) result.bandwidth_cap_note = 'High bandwidth usage — consider a CDN or traditional cloud provider for workloads above 100 GB/mo';

  const dbNote = providerPricing.database.note;
  if (dbNote && databaseInstances > 0) result.database_note = dbNote;

  return result;
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
