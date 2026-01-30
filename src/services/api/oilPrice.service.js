import api from './index';
import { API_ENDPOINTS, getApiKey } from '../../config/api.config';
import { CACHE_KEYS, CACHE_DURATION } from '../../config/constants';
import { getCachedData, setCachedData } from '../cache.service';

/**
 * Fetch latest oil prices from OilPriceAPI
 * @param {string} commodity - Commodity code (BRENT_CRUDE_USD, WTI_USD, etc.)
 * @returns {Promise<Object>} Price data
 */
export const fetchLatestPrice = async (commodity = 'BRENT_CRUDE_USD') => {
  const cacheKey = `${CACHE_KEYS.PRICE_WTI}_${commodity}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[OilPrice] Using cached data for', commodity);
    return cached;
  }

  const apiKey = getApiKey('oilprice');

  try {
    let data;

    if (apiKey) {
      // Use authenticated endpoint
      const response = await api.get(`${API_ENDPOINTS.OILPRICE}/prices/latest`, {
        headers: { Authorization: `Token ${apiKey}` },
        params: { code: commodity },
      });
      data = response.data;
    } else {
      // Use demo endpoint (limited)
      const response = await api.get(`${API_ENDPOINTS.OILPRICE_DEMO}/prices`);
      data = response.data;
    }

    // Cache the result
    if (data) {
      setCachedData(cacheKey, data, CACHE_DURATION.PRICES);
    }

    return data;
  } catch (error) {
    console.error('[OilPrice] Error fetching latest price:', error);

    // Return fallback data structure
    return {
      status: 'error',
      data: {
        price: 0,
        formatted: 'N/A',
        currency: 'USD',
        code: commodity,
        created_at: new Date().toISOString(),
      },
    };
  }
};

/**
 * Fetch multiple commodity prices
 * @param {string[]} commodities - Array of commodity codes
 * @returns {Promise<Object>} Price data for all commodities
 */
export const fetchMultiplePrices = async (commodities = ['WTI_USD', 'BRENT_CRUDE_USD', 'NATURAL_GAS_USD']) => {
  try {
    const promises = commodities.map(commodity => fetchLatestPrice(commodity));
    const results = await Promise.all(promises);

    const prices = {};
    results.forEach((result, index) => {
      if (result && result.data) {
        prices[commodities[index]] = result.data;
      }
    });

    return prices;
  } catch (error) {
    console.error('[OilPrice] Error fetching multiple prices:', error);
    return {};
  }
};

export default {
  fetchLatestPrice,
  fetchMultiplePrices,
};
