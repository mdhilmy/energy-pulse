import api from './index';
import { API_ENDPOINTS } from '../../config/api.config';
import { CACHE_KEYS, CACHE_DURATION } from '../../config/constants';
import { getCachedData, setCachedData } from '../cache.service';

/**
 * Fetch latest currency exchange rates
 * @param {string} baseCurrency - Base currency (default: USD)
 * @returns {Promise<Object>} Exchange rates object
 */
export const fetchExchangeRates = async (baseCurrency = 'usd') => {
  const cacheKey = `${CACHE_KEYS.CURRENCY_RATES}_${baseCurrency}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[Currency] Using cached exchange rates for', baseCurrency);
    return cached;
  }

  try {
    const response = await api.get(`${API_ENDPOINTS.CURRENCY}/currencies/${baseCurrency.toLowerCase()}.json`);

    const data = response.data;
    const rates = data[baseCurrency.toLowerCase()] || {};

    // Cache the result
    setCachedData(cacheKey, rates, CACHE_DURATION.CURRENCY);

    return rates;
  } catch (error) {
    console.error('[Currency] Error fetching exchange rates:', error);

    // Return fallback rates (approximate)
    return {
      eur: 0.92,
      gbp: 0.79,
      jpy: 149.0,
      cny: 7.24,
      cad: 1.36,
      aud: 1.52,
      chf: 0.88,
      inr: 83.0,
      rub: 92.0,
      sar: 3.75,
      aed: 3.67,
      brl: 4.98,
      mxn: 17.0,
      nok: 10.8,
      sgd: 1.34,
      krw: 1320.0,
      zar: 18.5,
      try: 32.0,
      ngn: 1550.0,
    };
  }
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {Promise<number>} Converted amount
 */
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  if (!amount || isNaN(amount)) return 0;
  if (fromCurrency === toCurrency) return amount;

  try {
    // Get rates with USD as base
    const rates = await fetchExchangeRates('usd');

    // If converting from USD
    if (fromCurrency.toUpperCase() === 'USD') {
      const rate = rates[toCurrency.toLowerCase()];
      return rate ? amount * rate : amount;
    }

    // If converting to USD
    if (toCurrency.toUpperCase() === 'USD') {
      const rate = rates[fromCurrency.toLowerCase()];
      return rate ? amount / rate : amount;
    }

    // For other conversions, convert via USD
    const fromRate = rates[fromCurrency.toLowerCase()];
    const toRate = rates[toCurrency.toLowerCase()];

    if (fromRate && toRate) {
      const usdAmount = amount / fromRate;
      return usdAmount * toRate;
    }

    return amount;
  } catch (error) {
    console.error('[Currency] Error converting currency:', error);
    return amount;
  }
};

/**
 * Fetch historical exchange rates for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} baseCurrency - Base currency (default: USD)
 * @returns {Promise<Object>} Historical exchange rates
 */
export const fetchHistoricalRates = async (date, baseCurrency = 'usd') => {
  const cacheKey = `CACHE_CURRENCY_HISTORICAL_${baseCurrency}_${date}`;

  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log('[Currency] Using cached historical rates for', date);
    return cached;
  }

  try {
    const response = await api.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/${baseCurrency.toLowerCase()}.json`
    );

    const data = response.data;
    const rates = data[baseCurrency.toLowerCase()] || {};

    // Cache the result
    setCachedData(cacheKey, rates, CACHE_DURATION.HISTORICAL);

    return rates;
  } catch (error) {
    console.error('[Currency] Error fetching historical rates:', error);
    // Fallback to latest rates
    return fetchExchangeRates(baseCurrency);
  }
};

/**
 * Get popular currency pairs
 * @returns {Array} Array of currency pair objects
 */
export const getPopularPairs = () => {
  return [
    { from: 'USD', to: 'EUR', label: 'USD/EUR' },
    { from: 'USD', to: 'GBP', label: 'USD/GBP' },
    { from: 'USD', to: 'JPY', label: 'USD/JPY' },
    { from: 'USD', to: 'CNY', label: 'USD/CNY' },
    { from: 'EUR', to: 'USD', label: 'EUR/USD' },
    { from: 'GBP', to: 'USD', label: 'GBP/USD' },
  ];
};

export default {
  fetchExchangeRates,
  convertCurrency,
  fetchHistoricalRates,
  getPopularPairs,
};
