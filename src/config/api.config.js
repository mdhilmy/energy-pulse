// API Endpoints
export const API_ENDPOINTS = {
  OILPRICE: 'https://api.oilpriceapi.com/v1',
  OILPRICE_DEMO: 'https://api.oilpriceapi.com/v1/demo',
  EIA: 'https://api.eia.gov/v2',
  FRED: 'https://api.stlouisfed.org/fred',
  WORLD_BANK: 'https://api.worldbank.org/v2',
  CURRENCY: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1',
  DATAHUB_WTI: 'https://datahub.io/core/oil-prices/r/wti-daily.json',
  DATAHUB_BRENT: 'https://datahub.io/core/oil-prices/r/brent-daily.json',
};

// EIA Series IDs
export const EIA_SERIES = {
  WTI_SPOT: 'PET.RWTC.D',
  BRENT_SPOT: 'PET.RBRTE.D',
  HENRY_HUB: 'NG.RNGWHHD.D',
  CRUDE_STOCKS: 'PET.WCESTUS1.W',
  GASOLINE_STOCKS: 'PET.WGTSTUS1.W',
  DISTILLATE_STOCKS: 'PET.WDISTUS1.W',
};

// FRED Series IDs
export const FRED_SERIES = {
  WTI: 'DCOILWTICO',
  BRENT: 'DCOILBRENTEU',
  HENRY_HUB: 'DHHNGSP',
  GDP: 'GDP',
  CPI: 'CPIAUCSL',
  UNEMPLOYMENT: 'UNRATE',
  DOLLAR_INDEX: 'DTWEXBGS',
  SP500: 'SP500',
  VIX: 'VIXCLS',
};

/**
 * Get API key from localStorage (user-provided) or environment (dev only)
 * @param {string} service - Service name (eia, fred, oilprice)
 * @returns {string|null} API key or null
 */
export const getApiKey = (service) => {
  // Priority 1: User-provided key in localStorage
  const userKey = localStorage.getItem(`EP_API_KEY_${service.toUpperCase()}`);
  if (userKey) return userKey;

  // Priority 2: Environment variable (development only)
  if (import.meta.env.DEV) {
    const envKey = import.meta.env[`VITE_${service.toUpperCase()}_API_KEY`];
    if (envKey) return envKey;
  }

  // Priority 3: No key available
  return null;
};

/**
 * Check if user has configured API keys for full features
 * @returns {boolean} True if EIA and FRED keys are available
 */
export const hasFullAccess = () => {
  return !!(getApiKey('eia') && getApiKey('fred'));
};

/**
 * Set API key in localStorage
 * @param {string} service - Service name
 * @param {string} key - API key
 */
export const setApiKey = (service, key) => {
  if (key && key.trim().length > 0) {
    localStorage.setItem(`EP_API_KEY_${service.toUpperCase()}`, key.trim());
  } else {
    localStorage.removeItem(`EP_API_KEY_${service.toUpperCase()}`);
  }
};

/**
 * Get all configured API keys status
 * @returns {Object} Status of each API key
 */
export const getApiKeysStatus = () => {
  return {
    eia: !!getApiKey('eia'),
    fred: !!getApiKey('fred'),
    oilprice: !!getApiKey('oilprice'),
  };
};

/**
 * Clear all API keys from localStorage
 */
export const clearAllApiKeys = () => {
  localStorage.removeItem('EP_API_KEY_EIA');
  localStorage.removeItem('EP_API_KEY_FRED');
  localStorage.removeItem('EP_API_KEY_OILPRICE');
};

// Request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 10000;

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // milliseconds
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};
