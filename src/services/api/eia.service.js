import api from './index';
import { API_ENDPOINTS, EIA_SERIES, getApiKey } from '../../config/api.config';
import { CACHE_KEYS, CACHE_DURATION } from '../../config/constants';
import { getCachedData, setCachedData } from '../cache.service';

/**
 * Fetch petroleum spot prices from EIA
 * @param {string} seriesId - EIA series ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Historical price data
 */
export const fetchPetroleumPrices = async (seriesId, startDate, endDate) => {
  const cacheKey = `${CACHE_KEYS.HISTORICAL_WTI}_${seriesId}_${startDate}_${endDate}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[EIA] Using cached data for', seriesId);
    return cached;
  }

  const apiKey = getApiKey('eia');

  if (!apiKey) {
    console.warn('[EIA] No API key available');
    return [];
  }

  try {
    const response = await api.get(`${API_ENDPOINTS.EIA}/petroleum/pri/spt/data/`, {
      params: {
        api_key: apiKey,
        frequency: 'daily',
        'data[0]': 'value',
        'facets[series][]': seriesId,
        start: startDate,
        end: endDate,
        sort: { 0: { column: 'period', direction: 'asc' } },
      },
    });

    const data = response.data?.response?.data || [];

    // Transform to standard format
    const transformed = data.map(item => ({
      date: item.period,
      value: parseFloat(item.value),
    }));

    // Cache the result
    setCachedData(cacheKey, transformed, CACHE_DURATION.HISTORICAL);

    return transformed;
  } catch (error) {
    console.error('[EIA] Error fetching petroleum prices:', error);
    return [];
  }
};

/**
 * Fetch petroleum inventory data from EIA
 * @param {string} seriesId - EIA series ID (stocks)
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Inventory data
 */
export const fetchInventoryData = async (seriesId, startDate, endDate) => {
  const cacheKey = `${CACHE_KEYS.INVENTORY_DATA}_${seriesId}_${startDate}_${endDate}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[EIA] Using cached inventory data for', seriesId);
    return cached;
  }

  const apiKey = getApiKey('eia');

  if (!apiKey) {
    console.warn('[EIA] No API key available');
    return [];
  }

  try {
    const response = await api.get(`${API_ENDPOINTS.EIA}/petroleum/sum/sndw/data/`, {
      params: {
        api_key: apiKey,
        frequency: 'weekly',
        'data[0]': 'value',
        'facets[series][]': seriesId,
        start: startDate,
        end: endDate,
        sort: { 0: { column: 'period', direction: 'asc' } },
      },
    });

    const data = response.data?.response?.data || [];

    // Transform to standard format
    const transformed = data.map(item => ({
      date: item.period,
      value: parseFloat(item.value),
    }));

    // Cache the result
    setCachedData(cacheKey, transformed, CACHE_DURATION.INVENTORY);

    return transformed;
  } catch (error) {
    console.error('[EIA] Error fetching inventory data:', error);
    return [];
  }
};

/**
 * Fetch WTI spot prices
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} WTI price data
 */
export const fetchWTIPrices = async (startDate, endDate) => {
  return fetchPetroleumPrices(EIA_SERIES.WTI_SPOT, startDate, endDate);
};

/**
 * Fetch Brent spot prices
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Brent price data
 */
export const fetchBrentPrices = async (startDate, endDate) => {
  return fetchPetroleumPrices(EIA_SERIES.BRENT_SPOT, startDate, endDate);
};

/**
 * Fetch Henry Hub natural gas prices
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Natural gas price data
 */
export const fetchNaturalGasPrices = async (startDate, endDate) => {
  return fetchPetroleumPrices(EIA_SERIES.HENRY_HUB, startDate, endDate);
};

/**
 * Fetch crude oil stocks
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Crude stocks data
 */
export const fetchCrudeStocks = async (startDate, endDate) => {
  return fetchInventoryData(EIA_SERIES.CRUDE_STOCKS, startDate, endDate);
};

/**
 * Fetch gasoline stocks
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Gasoline stocks data
 */
export const fetchGasolineStocks = async (startDate, endDate) => {
  return fetchInventoryData(EIA_SERIES.GASOLINE_STOCKS, startDate, endDate);
};

/**
 * Fetch distillate stocks
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<Array>} Distillate stocks data
 */
export const fetchDistillateStocks = async (startDate, endDate) => {
  return fetchInventoryData(EIA_SERIES.DISTILLATE_STOCKS, startDate, endDate);
};

export default {
  fetchPetroleumPrices,
  fetchInventoryData,
  fetchWTIPrices,
  fetchBrentPrices,
  fetchNaturalGasPrices,
  fetchCrudeStocks,
  fetchGasolineStocks,
  fetchDistillateStocks,
};
