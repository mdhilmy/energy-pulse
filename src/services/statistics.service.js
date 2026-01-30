import {
  calculateCorrelation,
  calculateVolatility,
  calculateMean,
  calculateStdDev,
  findMin,
  findMax,
  calculatePercentile,
  calculateChange,
} from '../utils/calculations';

/**
 * Calculate comprehensive price statistics
 * @param {Array} data - Price data [{date, value}]
 * @returns {Object} Statistics object
 */
export const calculatePriceStatistics = (data) => {
  if (!data || data.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      volatility: 0,
      current: 0,
      previous: 0,
      change: 0,
      changePercent: 0,
      dataPoints: 0,
    };
  }

  const values = data.map(d => d.value);

  const current = values[values.length - 1];
  const previous = values.length > 1 ? values[values.length - 2] : current;

  return {
    min: findMin(values),
    max: findMax(values),
    mean: calculateMean(values),
    stdDev: calculateStdDev(values),
    volatility: calculateVolatility(values),
    current,
    previous,
    change: current - previous,
    changePercent: calculateChange(current, previous),
    dataPoints: values.length,
    firstValue: values[0],
    lastValue: current,
    range: findMax(values) - findMin(values),
  };
};

/**
 * Calculate 52-week high and low
 * @param {Array} data - Price data (must include at least 52 weeks)
 * @returns {Object} { high52Week, low52Week, highDate, lowDate }
 */
export const calculate52WeekRange = (data) => {
  if (!data || data.length === 0) {
    return {
      high52Week: 0,
      low52Week: 0,
      highDate: null,
      lowDate: null,
    };
  }

  // Get last 52 weeks of data (approximate with 365 days)
  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  const yearData = data.filter(d => new Date(d.date) >= oneYearAgo);

  if (yearData.length === 0) {
    return {
      high52Week: 0,
      low52Week: 0,
      highDate: null,
      lowDate: null,
    };
  }

  const highPoint = yearData.reduce((max, item) =>
    item.value > max.value ? item : max
  );

  const lowPoint = yearData.reduce((min, item) =>
    item.value < min.value ? item : min
  );

  return {
    high52Week: highPoint.value,
    low52Week: lowPoint.value,
    highDate: highPoint.date,
    lowDate: lowPoint.date,
  };
};

/**
 * Calculate moving average statistics
 * @param {Array} data - Price data
 * @param {number[]} periods - MA periods to calculate
 * @returns {Object} MA values { ma20, ma50, ma200 }
 */
export const calculateMovingAverages = (data, periods = [20, 50, 200]) => {
  if (!data || data.length === 0) {
    return {};
  }

  const values = data.map(d => d.value);
  const result = {};

  periods.forEach(period => {
    if (values.length >= period) {
      const recent = values.slice(-period);
      const average = calculateMean(recent);
      result[`ma${period}`] = average;
    } else {
      result[`ma${period}`] = null;
    }
  });

  return result;
};

/**
 * Calculate price momentum (rate of change)
 * @param {Array} data - Price data
 * @param {number} period - Period for momentum calculation
 * @returns {number} Momentum percentage
 */
export const calculateMomentum = (data, period = 10) => {
  if (!data || data.length < period + 1) {
    return 0;
  }

  const values = data.map(d => d.value);
  const current = values[values.length - 1];
  const previous = values[values.length - 1 - period];

  return calculateChange(current, previous);
};

/**
 * Calculate relative strength index (RSI)
 * @param {Array} data - Price data
 * @param {number} period - RSI period (default: 14)
 * @returns {number} RSI value (0-100)
 */
export const calculateRSI = (data, period = 14) => {
  if (!data || data.length < period + 1) {
    return 50; // Neutral
  }

  const values = data.map(d => d.value);
  const changes = [];

  for (let i = 1; i < values.length; i++) {
    changes.push(values[i] - values[i - 1]);
  }

  const recentChanges = changes.slice(-period);
  const gains = recentChanges.filter(c => c > 0);
  const losses = recentChanges.filter(c => c < 0).map(c => Math.abs(c));

  const avgGain = gains.length > 0 ? calculateMean(gains) : 0;
  const avgLoss = losses.length > 0 ? calculateMean(losses) : 0;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
};

/**
 * Detect price trends
 * @param {Array} data - Price data
 * @param {number} period - Period for trend detection
 * @returns {string} Trend direction ('bullish', 'bearish', 'neutral')
 */
export const detectTrend = (data, period = 20) => {
  if (!data || data.length < period) {
    return 'neutral';
  }

  const recentData = data.slice(-period);
  const values = recentData.map(d => d.value);

  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const firstAvg = calculateMean(firstHalf);
  const secondAvg = calculateMean(secondHalf);

  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (changePercent > 2) return 'bullish';
  if (changePercent < -2) return 'bearish';
  return 'neutral';
};

/**
 * Calculate support and resistance levels
 * @param {Array} data - Price data
 * @returns {Object} { support, resistance }
 */
export const calculateSupportResistance = (data) => {
  if (!data || data.length < 30) {
    return { support: 0, resistance: 0 };
  }

  // Use recent data (last 90 days or available data)
  const recentData = data.slice(-90);
  const values = recentData.map(d => d.value);

  // Simple method: use percentiles
  const support = calculatePercentile(25, values);
  const resistance = calculatePercentile(75, values);

  return {
    support: values.sort((a, b) => a - b)[Math.floor(values.length * 0.25)],
    resistance: values.sort((a, b) => a - b)[Math.floor(values.length * 0.75)],
  };
};

/**
 * Calculate correlation between two price series
 * @param {Array} series1 - First price series
 * @param {Array} series2 - Second price series
 * @returns {number} Correlation coefficient
 */
export const calculatePriceCorrelation = (series1, series2) => {
  if (!series1 || !series2 || series1.length !== series2.length) {
    return 0;
  }

  const values1 = series1.map(d => d.value);
  const values2 = series2.map(d => d.value);

  return calculateCorrelation(values1, values2);
};

/**
 * Generate market summary
 * @param {Object} priceData - Object with commodity price data
 * @returns {Object} Market summary
 */
export const generateMarketSummary = (priceData) => {
  const summary = {};

  Object.keys(priceData).forEach(commodity => {
    const data = priceData[commodity];
    if (data && data.length > 0) {
      summary[commodity] = calculatePriceStatistics(data);
    }
  });

  return summary;
};

export default {
  calculatePriceStatistics,
  calculate52WeekRange,
  calculateMovingAverages,
  calculateMomentum,
  calculateRSI,
  detectTrend,
  calculateSupportResistance,
  calculatePriceCorrelation,
  generateMarketSummary,
};
