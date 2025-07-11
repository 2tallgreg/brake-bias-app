// lib/api/pricing.js
import { getCache, setCache } from '../cache';

/**
 * Fetches mock pricing data for a given vehicle.
 * @param {string} vehicleName - The full name of the vehicle.
 * @returns {Promise<object>} - A promise that resolves to an object with msrp and usedAvg.
 */
export async function getPricing(vehicleName) {
  const [year, make, model] = vehicleName.split(' ');
  const cacheKey = `pricing-${year}-${make}-${model}`;
  const cachedData = getCache(cacheKey);
  if (cachedData) return cachedData;

  // Mock data generation
  const basePrice = (make.charCodeAt(0) + model.charCodeAt(0)) * 200;
  const yearModifier = 1 - (new Date().getFullYear() - parseInt(year)) * 0.05;
  const msrp = Math.floor(basePrice * (1 + (make.length % 5) / 10));
  const usedAvg = Math.floor(msrp * yearModifier * 0.8);

  const pricingData = {
    msrp: `$${msrp.toLocaleString()}`,
    usedAvg: `$${usedAvg.toLocaleString()}`,
  };

  setCache(cacheKey, pricingData);
  return pricingData;
}