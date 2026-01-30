import api from './index';
import { API_ENDPOINTS, FRED_SERIES, getApiKey } from '../../config/api.config';
import { CACHE_KEYS, CACHE_DURATION } from '../../config/constants';
import { getCachedData, setCachedData } from '../cache.service';

/**
 * Fetch series observations from FRED
 * @param {string} seriesId - FRED series ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Time series data
 */
export const fetchSeries = async (seriesId, startDate, endDate) => {
  const cacheKey = `CACHE_FRED_${seriesId}_${startDate}_${endDate}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[FRED] Using cached data for', seriesId);
    return cached;
  }

  const apiKey = getApiKey('fred');

  if (!apiKey) {
    console.warn('[FRED] No API key available');
    return [];
  }

  try {
    const response = await api.get(`${API_ENDPOINTS.FRED}/series/observations`, {
      params: {
        series_id: seriesId,
        api_key: apiKey,
        file_type: 'json',
        observation_start: startDate,
        observation_end: endDate,
      },
    });

    const data = response.data?.observations || [];

    // Transform to standard format and filter out non-numeric values
    const transformed = data
      .map(item => ({
        date: item.date,
        value: parseFloat(item.value),
      }))
      .filter(item => !isNaN(item.value));

    // Cache the result
    setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);

    return transformed;
  } catch (error) {
    console.error('[FRED] Error fetching series:', error);
    return [];
  }
};

/**
 * Fetch WTI prices from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} WTI price data
 */
export const fetchWTIPrices = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.WTI, startDate, endDate);
};

/**
 * Fetch Brent prices from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Brent price data
 */
export const fetchBrentPrices = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.BRENT, startDate, endDate);
};

/**
 * Fetch Henry Hub natural gas prices from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Natural gas price data
 */
export const fetchNaturalGasPrices = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.HENRY_HUB, startDate, endDate);
};

/**
 * Fetch GDP data from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} GDP data
 */
export const fetchGDP = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.GDP, startDate, endDate);
};

/**
 * Fetch CPI data from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} CPI data
 */
export const fetchCPI = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.CPI, startDate, endDate);
};

/**
 * Fetch unemployment rate from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Unemployment data
 */
export const fetchUnemployment = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.UNEMPLOYMENT, startDate, endDate);
};

/**
 * Fetch dollar index from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Dollar index data
 */
export const fetchDollarIndex = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.DOLLAR_INDEX, startDate, endDate);
};

/**
 * Fetch S&P 500 from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} S&P 500 data
 */
export const fetchSP500 = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.SP500, startDate, endDate);
};

/**
 * Fetch VIX from FRED
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} VIX data
 */
export const fetchVIX = async (startDate, endDate) => {
  return fetchSeries(FRED_SERIES.VIX, startDate, endDate);
};

/**
 * Fetch multiple economic indicators
 * @param {string[]} seriesIds - Array of FRED series IDs
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Object>} Object with series data
 */
export const fetchMultipleSeries = async (seriesIds, startDate, endDate) => {
  try {
    const promises = seriesIds.map(seriesId => fetchSeries(seriesId, startDate, endDate));
    const results = await Promise.all(promises);

    const data = {};
    results.forEach((result, index) => {
      data[seriesIds[index]] = result;
    });

    return data;
  } catch (error) {
    console.error('[FRED] Error fetching multiple series:', error);
    return {};
  }
};

export default {
  fetchSeries,
  fetchWTIPrices,
  fetchBrentPrices,
  fetchNaturalGasPrices,
  fetchGDP,
  fetchCPI,
  fetchUnemployment,
  fetchDollarIndex,
  fetchSP500,
  fetchVIX,
  fetchMultipleSeries,
};
