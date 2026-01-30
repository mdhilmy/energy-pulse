/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export const calculateChange = (current, previous) => {
  if (!previous || previous === 0 || !current) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Calculate Pearson correlation coefficient
 * @param {number[]} x - First data array
 * @param {number[]} y - Second data array
 * @returns {number} Correlation coefficient (-1 to 1)
 */
export const calculateCorrelation = (x, y) => {
  if (!x || !y || x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX ** 2) * (n * sumY2 - sumY ** 2));

  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Calculate Simple Moving Average
 * @param {number[]} data - Data array
 * @param {number} period - Period for moving average
 * @returns {number[]} Moving average array
 */
export const calculateSMA = (data, period) => {
  if (!data || data.length < period) return [];

  const result = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
};

/**
 * Calculate standard deviation
 * @param {number[]} data - Data array
 * @returns {number} Standard deviation
 */
export const calculateStdDev = (data) => {
  if (!data || data.length === 0) return 0;

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;

  return Math.sqrt(variance);
};

/**
 * Calculate volatility (annualized standard deviation of returns)
 * @param {number[]} prices - Price array
 * @param {number} tradingDays - Trading days per year (default: 252)
 * @returns {number} Annualized volatility percentage
 */
export const calculateVolatility = (prices, tradingDays = 252) => {
  if (!prices || prices.length < 2) return 0;

  // Calculate daily returns
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] !== 0) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
  }

  if (returns.length === 0) return 0;

  // Calculate standard deviation of returns
  const stdDev = calculateStdDev(returns);

  // Annualize
  return stdDev * Math.sqrt(tradingDays) * 100;
};

/**
 * Calculate R-squared (coefficient of determination)
 * @param {number[]} x - Independent variable
 * @param {number[]} y - Dependent variable
 * @returns {number} R-squared value (0 to 1)
 */
export const calculateRSquared = (x, y) => {
  const correlation = calculateCorrelation(x, y);
  return Math.pow(correlation, 2);
};

/**
 * Calculate mean (average)
 * @param {number[]} data - Data array
 * @returns {number} Mean value
 */
export const calculateMean = (data) => {
  if (!data || data.length === 0) return 0;
  return data.reduce((a, b) => a + b, 0) / data.length;
};

/**
 * Calculate median
 * @param {number[]} data - Data array
 * @returns {number} Median value
 */
export const calculateMedian = (data) => {
  if (!data || data.length === 0) return 0;

  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

/**
 * Find minimum value in array
 * @param {number[]} data - Data array
 * @returns {number} Minimum value
 */
export const findMin = (data) => {
  if (!data || data.length === 0) return 0;
  return Math.min(...data);
};

/**
 * Find maximum value in array
 * @param {number[]} data - Data array
 * @returns {number} Maximum value
 */
export const findMax = (data) => {
  if (!data || data.length === 0) return 0;
  return Math.max(...data);
};

/**
 * Calculate percent rank (percentile)
 * @param {number} value - Value to rank
 * @param {number[]} data - Data array
 * @returns {number} Percentile (0-100)
 */
export const calculatePercentile = (value, data) => {
  if (!data || data.length === 0) return 0;

  const sorted = [...data].sort((a, b) => a - b);
  const index = sorted.findIndex(v => v >= value);

  if (index === -1) return 100;
  return (index / sorted.length) * 100;
};

/**
 * Normalize data to 0-100 scale
 * @param {number[]} data - Data array
 * @returns {number[]} Normalized data
 */
export const normalizeData = (data) => {
  if (!data || data.length === 0) return [];

  const min = findMin(data);
  const max = findMax(data);
  const range = max - min;

  if (range === 0) return data.map(() => 50);

  return data.map(value => ((value - min) / range) * 100);
};

/**
 * Index data to base 100 (first value = 100)
 * @param {number[]} data - Data array
 * @returns {number[]} Indexed data
 */
export const indexToBase100 = (data) => {
  if (!data || data.length === 0) return [];

  const baseValue = data[0];
  if (baseValue === 0) return data;

  return data.map(value => (value / baseValue) * 100);
};

/**
 * Calculate exponential moving average (EMA)
 * @param {number[]} data - Data array
 * @param {number} period - Period for EMA
 * @returns {number[]} EMA array
 */
export const calculateEMA = (data, period) => {
  if (!data || data.length < period) return [];

  const multiplier = 2 / (period + 1);
  const ema = [data[0]];

  for (let i = 1; i < data.length; i++) {
    const value = (data[i] - ema[i - 1]) * multiplier + ema[i - 1];
    ema.push(value);
  }

  return ema;
};

/**
 * Calculate linear regression slope
 * @param {number[]} x - X values
 * @param {number[]} y - Y values
 * @returns {Object} { slope, intercept, rSquared }
 */
export const calculateLinearRegression = (x, y) => {
  if (!x || !y || x.length !== y.length || x.length === 0) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const rSquared = calculateRSquared(x, y);

  return { slope, intercept, rSquared };
};

export default {
  calculateChange,
  calculateCorrelation,
  calculateSMA,
  calculateStdDev,
  calculateVolatility,
  calculateRSquared,
  calculateMean,
  calculateMedian,
  findMin,
  findMax,
  calculatePercentile,
  normalizeData,
  indexToBase100,
  calculateEMA,
  calculateLinearRegression,
};
