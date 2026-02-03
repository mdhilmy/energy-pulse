import api from './index';
import { API_ENDPOINTS } from '../../config/api.config';
import { CACHE_KEYS, CACHE_DURATION } from '../../config/constants';
import { getCachedData, setCachedData } from '../cache.service';

/**
 * Parse CSV data to JSON
 * @param {string} csv - CSV string data
 * @returns {Array} Parsed data array
 */
const parseCSV = (csv) => {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }

  return data;
};

/**
 * Fetch WTI daily prices
 * Uses local JSON files as primary source (no CORS issues)
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
    // Primary: Load from local JSON file (no CORS issues)
    console.log('[DataHub] Fetching WTI data from local JSON file...');
    const response = await api.get('/data/historical-wti.json');

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const data = response.data;

      // Validate and transform data
      const transformed = data.map(item => ({
        date: item.date,
        value: parseFloat(item.value),
      })).filter(item => item.date && !isNaN(item.value));

      if (transformed.length > 0) {
        console.log(`[DataHub] Successfully loaded ${transformed.length} WTI data points from local file`);

        // Cache the result
        setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);

        return transformed;
      }
    }

    throw new Error('No valid data in local file');
  } catch (error) {
    console.error('[DataHub] Error loading WTI data:', error);

    // Last resort: Try CSV from DataHub (may fail due to CORS)
    try {
      console.log('[DataHub] Attempting to fetch from DataHub CSV (may be blocked by CORS)...');
      const response = await fetch(API_ENDPOINTS.DATAHUB_WTI);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const data = parseCSV(csvText);

      const transformed = data.map(item => ({
        date: item.Date || item.date,
        value: parseFloat(item.Price || item.price || item['WTI'] || item.value),
      })).filter(item => item.date && !isNaN(item.value));

      if (transformed.length > 0) {
        console.log(`[DataHub] Successfully fetched ${transformed.length} WTI data points from CSV`);
        setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);
        return transformed;
      }
    } catch (csvError) {
      console.warn('[DataHub] CSV fetch failed (likely CORS):', csvError.message);
    }

    // Return empty array as last resort
    console.warn('[DataHub] No WTI data available, returning empty array');
    return [];
  }
};

/**
 * Fetch Brent daily prices
 * Uses local JSON files as primary source (no CORS issues)
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
    // Primary: Load from local JSON file (no CORS issues)
    console.log('[DataHub] Fetching Brent data from local JSON file...');
    const response = await api.get('/data/historical-brent.json');

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const data = response.data;

      // Validate and transform data
      const transformed = data.map(item => ({
        date: item.date,
        value: parseFloat(item.value),
      })).filter(item => item.date && !isNaN(item.value));

      if (transformed.length > 0) {
        console.log(`[DataHub] Successfully loaded ${transformed.length} Brent data points from local file`);

        // Cache the result
        setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);

        return transformed;
      }
    }

    throw new Error('No valid data in local file');
  } catch (error) {
    console.error('[DataHub] Error loading Brent data:', error);

    // Last resort: Try CSV from DataHub (may fail due to CORS)
    try {
      console.log('[DataHub] Attempting to fetch from DataHub CSV (may be blocked by CORS)...');
      const response = await fetch(API_ENDPOINTS.DATAHUB_BRENT);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const data = parseCSV(csvText);

      const transformed = data.map(item => ({
        date: item.Date || item.date,
        value: parseFloat(item.Price || item.price || item['Brent'] || item.value),
      })).filter(item => item.date && !isNaN(item.value));

      if (transformed.length > 0) {
        console.log(`[DataHub] Successfully fetched ${transformed.length} Brent data points from CSV`);
        setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);
        return transformed;
      }
    } catch (csvError) {
      console.warn('[DataHub] CSV fetch failed (likely CORS):', csvError.message);
    }

    // Return empty array as last resort
    console.warn('[DataHub] No Brent data available, returning empty array');
    return [];
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
