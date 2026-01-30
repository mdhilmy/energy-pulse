import api from './index';
import { API_ENDPOINTS } from '../../config/api.config';
import { getCachedData, setCachedData } from '../cache.service';
import { CACHE_DURATION } from '../../config/constants';

/**
 * Fetch indicator data from World Bank
 * @param {string} country - Country code (e.g., USA, CHN, WLD)
 * @param {string} indicator - Indicator code
 * @param {string} startYear - Start year
 * @param {string} endYear - End year
 * @returns {Promise<Array>} Indicator data
 */
export const fetchIndicator = async (
  country = 'USA',
  indicator = 'NY.GDP.MKTP.CD',
  startYear = '2015',
  endYear = '2023'
) => {
  const cacheKey = `CACHE_WB_${country}_${indicator}_${startYear}_${endYear}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[WorldBank] Using cached data for', indicator);
    return cached;
  }

  try {
    const response = await api.get(
      `${API_ENDPOINTS.WORLD_BANK}/country/${country}/indicator/${indicator}`,
      {
        params: {
          format: 'json',
          date: `${startYear}:${endYear}`,
          per_page: 1000,
        },
      }
    );

    // World Bank returns array with metadata as first element
    const data = Array.isArray(response.data) ? response.data[1] : [];

    if (!data || !Array.isArray(data)) {
      return [];
    }

    // Transform to standard format
    const transformed = data
      .map(item => ({
        date: `${item.date}-01-01`, // Convert year to date
        value: parseFloat(item.value),
        year: item.date,
      }))
      .filter(item => !isNaN(item.value))
      .reverse(); // World Bank returns newest first, we want oldest first

    // Cache the result
    setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);

    return transformed;
  } catch (error) {
    console.error('[WorldBank] Error fetching indicator:', error);
    return [];
  }
};

/**
 * Fetch GDP data
 * @param {string} country - Country code
 * @param {string} startYear - Start year
 * @param {string} endYear - End year
 * @returns {Promise<Array>} GDP data
 */
export const fetchGDP = async (country = 'USA', startYear = '2015', endYear = '2023') => {
  return fetchIndicator(country, 'NY.GDP.MKTP.CD', startYear, endYear);
};

/**
 * Fetch oil rents (% of GDP)
 * @param {string} country - Country code
 * @param {string} startYear - Start year
 * @param {string} endYear - End year
 * @returns {Promise<Array>} Oil rents data
 */
export const fetchOilRents = async (country = 'USA', startYear = '2015', endYear = '2023') => {
  return fetchIndicator(country, 'NY.GDP.PETR.RT.ZS', startYear, endYear);
};

/**
 * Fetch population data
 * @param {string} country - Country code
 * @param {string} startYear - Start year
 * @param {string} endYear - End year
 * @returns {Promise<Array>} Population data
 */
export const fetchPopulation = async (country = 'USA', startYear = '2015', endYear = '2023') => {
  return fetchIndicator(country, 'SP.POP.TOTL', startYear, endYear);
};

export default {
  fetchIndicator,
  fetchGDP,
  fetchOilRents,
  fetchPopulation,
};
