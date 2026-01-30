import api from './index';
import { API_ENDPOINTS } from '../../config/api.config';
import { CACHE_KEYS, CACHE_DURATION } from '../../config/constants';
import { getCachedData, setCachedData } from '../cache.service';

/**
 * Fetch WTI daily prices from DataHub (static fallback)
 * @returns {Promise<Array>} WTI price data
 */
export const fetchWTIDailyPrices = async () => {
  const cacheKey = CACHE_KEYS.HISTORICAL_WTI;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[DataHub] Using cached WTI data');
    return cached;
  }

  try {
    const response = await api.get(API_ENDPOINTS.DATAHUB_WTI);

    const data = response.data || [];

    // Transform to standard format
    const transformed = data.map(item => ({
      date: item.Date || item.date,
      value: parseFloat(item.Price || item.price || item.value),
    })).filter(item => item.date && !isNaN(item.value));

    // Cache the result
    setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);

    return transformed;
  } catch (error) {
    console.error('[DataHub] Error fetching WTI data:', error);

    // Try to load from local fallback file
    try {
      const fallback = await api.get('/data/historical-wti.json');
      return fallback.data || [];
    } catch {
      return [];
    }
  }
};

/**
 * Fetch Brent daily prices from DataHub (static fallback)
 * @returns {Promise<Array>} Brent price data
 */
export const fetchBrentDailyPrices = async () => {
  const cacheKey = CACHE_KEYS.HISTORICAL_BRENT;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[DataHub] Using cached Brent data');
    return cached;
  }

  try {
    const response = await api.get(API_ENDPOINTS.DATAHUB_BRENT);

    const data = response.data || [];

    // Transform to standard format
    const transformed = data.map(item => ({
      date: item.Date || item.date,
      value: parseFloat(item.Price || item.price || item.value),
    })).filter(item => item.date && !isNaN(item.value));

    // Cache the result
    setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);

    return transformed;
  } catch (error) {
    console.error('[DataHub] Error fetching Brent data:', error);

    // Try to load from local fallback file
    try {
      const fallback = await api.get('/data/historical-brent.json');
      return fallback.data || [];
    } catch {
      return [];
    }
  }
};

/**
 * Fetch combined oil prices
 * @returns {Promise<Object>} Object with WTI and Brent data
 */
export const fetchCombinedPrices = async () => {
  try {
    const [wti, brent] = await Promise.all([
      fetchWTIDailyPrices(),
      fetchBrentDailyPrices(),
    ]);

    return {
      WTI: wti,
      BRENT: brent,
    };
  } catch (error) {
    console.error('[DataHub] Error fetching combined prices:', error);
    return {
      WTI: [],
      BRENT: [],
    };
  }
};

export default {
  fetchWTIDailyPrices,
  fetchBrentDailyPrices,
  fetchCombinedPrices,
};
