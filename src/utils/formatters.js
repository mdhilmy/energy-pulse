/**
 * Format a number as currency
 * @param {number} price - Price value
 * @param {string} currency - Currency code (default: USD)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'USD', decimals = 2) => {
  if (price === null || price === undefined || isNaN(price)) return 'N/A';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  } catch (error) {
    return `${currency} ${price.toFixed(decimals)}`;
  }
};

/**
 * Format percentage change with sign
 * @param {number} change - Percentage change value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted change string with + or - sign
 */
export const formatChange = (change, decimals = 2) => {
  if (change === null || change === undefined || isNaN(change)) return 'N/A';

  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(decimals)}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)}B`;
  } else if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)}M`;
  } else if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)}K`;
  }

  return `${sign}${absNum.toFixed(decimals)}`;
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format volume (barrels) with appropriate suffix
 * @param {number} volume - Volume in barrels
 * @returns {string} Formatted volume string
 */
export const formatVolume = (volume) => {
  if (volume === null || volume === undefined || isNaN(volume)) return 'N/A';

  if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M bbl`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K bbl`;
  }

  return `${volume.toFixed(0)} bbl`;
};

/**
 * Get color class based on change value
 * @param {number} change - Change value
 * @returns {string} Tailwind color class
 */
export const getChangeColor = (change) => {
  if (change === null || change === undefined || isNaN(change)) return 'text-slate-400';
  if (change > 0) return 'text-green-500';
  if (change < 0) return 'text-red-500';
  return 'text-slate-400';
};

/**
 * Get background color class based on change value
 * @param {number} change - Change value
 * @returns {string} Tailwind background color class
 */
export const getChangeBgColor = (change) => {
  if (change === null || change === undefined || isNaN(change)) return 'bg-slate-700';
  if (change > 0) return 'bg-green-500/10';
  if (change < 0) return 'bg-red-500/10';
  return 'bg-slate-700';
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format correlation coefficient
 * @param {number} correlation - Correlation value (-1 to 1)
 * @returns {string} Formatted correlation with interpretation
 */
export const formatCorrelation = (correlation) => {
  if (correlation === null || correlation === undefined || isNaN(correlation)) return 'N/A';

  const absCorr = Math.abs(correlation);
  let strength = '';

  if (absCorr >= 0.8) strength = 'Very Strong';
  else if (absCorr >= 0.6) strength = 'Strong';
  else if (absCorr >= 0.4) strength = 'Moderate';
  else if (absCorr >= 0.2) strength = 'Weak';
  else strength = 'Very Weak';

  return `${correlation.toFixed(2)} (${strength})`;
};

/**
 * Format volatility percentage
 * @param {number} volatility - Volatility value
 * @returns {string} Formatted volatility with label
 */
export const formatVolatility = (volatility) => {
  if (volatility === null || volatility === undefined || isNaN(volatility)) return 'N/A';

  let level = '';
  if (volatility < 20) level = 'Low';
  else if (volatility < 40) level = 'Moderate';
  else level = 'High';

  return `${volatility.toFixed(1)}% (${level})`;
};

export default {
  formatPrice,
  formatChange,
  formatLargeNumber,
  formatNumber,
  formatVolume,
  getChangeColor,
  getChangeBgColor,
  truncateText,
  formatCorrelation,
  formatVolatility,
};
