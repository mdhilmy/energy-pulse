import { calculateSMA, indexToBase100 } from './calculations';

/**
 * Transform API data to chart format
 * @param {Array} data - Raw API data
 * @param {string} dateField - Field name for date (default: 'date')
 * @param {string} valueField - Field name for value (default: 'value')
 * @returns {Array} Chart-ready data [{date, value}]
 */
export const transformToChartData = (data, dateField = 'date', valueField = 'value') => {
  if (!data || !Array.isArray(data)) return [];

  return data
    .map(item => ({
      date: item[dateField],
      value: parseFloat(item[valueField]),
    }))
    .filter(item => item.date && !isNaN(item.value))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Add moving average to chart data
 * @param {Array} data - Chart data [{date, value}]
 * @param {number} period - MA period
 * @returns {Array} Data with MA [{date, value, ma}]
 */
export const addMovingAverage = (data, period) => {
  if (!data || data.length < period) return data;

  const values = data.map(d => d.value);
  const maValues = calculateSMA(values, period);

  // Pad beginning with nulls
  const paddedMA = Array(period - 1).fill(null).concat(maValues);

  return data.map((item, index) => ({
    ...item,
    [`ma${period}`]: paddedMA[index],
  }));
};

/**
 * Normalize chart data to percentage change (indexed to 100)
 * @param {Array} data - Chart data [{date, value}]
 * @returns {Array} Normalized data [{date, value, normalized}]
 */
export const normalizeChartData = (data) => {
  if (!data || data.length === 0) return [];

  const values = data.map(d => d.value);
  const normalized = indexToBase100(values);

  return data.map((item, index) => ({
    ...item,
    normalized: normalized[index],
  }));
};

/**
 * Merge multiple commodity data series
 * @param {Object} dataSeries - Object with commodity names as keys
 * @returns {Array} Merged data with all commodities
 */
export const mergeChartSeries = (dataSeries) => {
  if (!dataSeries || Object.keys(dataSeries).length === 0) return [];

  // Get all unique dates
  const allDates = new Set();
  Object.values(dataSeries).forEach(series => {
    series.forEach(item => allDates.add(item.date));
  });

  const dates = Array.from(allDates).sort();

  // Create merged data structure
  return dates.map(date => {
    const row = { date };
    Object.keys(dataSeries).forEach(commodity => {
      const dataPoint = dataSeries[commodity].find(d => d.date === date);
      row[commodity] = dataPoint ? dataPoint.value : null;
    });
    return row;
  });
};

/**
 * Filter chart data by date range
 * @param {Array} data - Chart data [{date, value}]
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Filtered data
 */
export const filterByDateRange = (data, startDate, endDate) => {
  if (!data || !startDate || !endDate) return data;

  const start = new Date(startDate);
  const end = new Date(endDate);

  return data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });
};

/**
 * Calculate chart statistics
 * @param {Array} data - Chart data [{date, value}]
 * @returns {Object} Statistics {min, max, avg, first, last, change}
 */
export const calculateChartStats = (data) => {
  if (!data || data.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      first: 0,
      last: 0,
      change: 0,
      changePercent: 0,
    };
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const first = values[0];
  const last = values[values.length - 1];
  const change = last - first;
  const changePercent = first !== 0 ? ((last - first) / first) * 100 : 0;

  return {
    min,
    max,
    avg,
    first,
    last,
    change,
    changePercent,
  };
};

/**
 * Resample data to lower frequency (daily → weekly, monthly)
 * @param {Array} data - Chart data [{date, value}]
 * @param {string} frequency - 'weekly' or 'monthly'
 * @returns {Array} Resampled data
 */
export const resampleData = (data, frequency) => {
  if (!data || data.length === 0) return [];

  const grouped = {};

  data.forEach(item => {
    const date = new Date(item.date);
    let key;

    if (frequency === 'weekly') {
      // Group by week (Monday start)
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay() + 1);
      key = weekStart.toISOString().split('T')[0];
    } else if (frequency === 'monthly') {
      // Group by month
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    } else {
      return data;
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item.value);
  });

  // Calculate average for each group
  return Object.keys(grouped)
    .sort()
    .map(date => ({
      date,
      value: grouped[date].reduce((a, b) => a + b, 0) / grouped[date].length,
    }));
};

/**
 * Detect outliers in chart data (using IQR method)
 * @param {Array} data - Chart data [{date, value}]
 * @returns {Array} Data with outlier flag [{date, value, isOutlier}]
 */
export const detectOutliers = (data) => {
  if (!data || data.length < 4) return data;

  const values = data.map(d => d.value).sort((a, b) => a - b);
  const q1Index = Math.floor(values.length * 0.25);
  const q3Index = Math.floor(values.length * 0.75);

  const q1 = values[q1Index];
  const q3 = values[q3Index];
  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return data.map(item => ({
    ...item,
    isOutlier: item.value < lowerBound || item.value > upperBound,
  }));
};

/**
 * Fill missing dates in chart data with interpolated values
 * @param {Array} data - Chart data [{date, value}]
 * @returns {Array} Data with filled gaps
 */
export const fillMissingDates = (data) => {
  if (!data || data.length < 2) return data;

  const filled = [];
  for (let i = 0; i < data.length - 1; i++) {
    filled.push(data[i]);

    const currentDate = new Date(data[i].date);
    const nextDate = new Date(data[i + 1].date);
    const daysDiff = Math.floor((nextDate - currentDate) / (1000 * 60 * 60 * 24));

    // If there's a gap, interpolate
    if (daysDiff > 1) {
      for (let j = 1; j < daysDiff; j++) {
        const interpDate = new Date(currentDate);
        interpDate.setDate(interpDate.getDate() + j);

        const interpValue =
          data[i].value + ((data[i + 1].value - data[i].value) / daysDiff) * j;

        filled.push({
          date: interpDate.toISOString().split('T')[0],
          value: interpValue,
          interpolated: true,
        });
      }
    }
  }

  filled.push(data[data.length - 1]);
  return filled;
};

/**
 * Create correlation matrix from multiple series
 * @param {Object} series - Object with series names as keys, value arrays as values
 * @returns {Object} Correlation matrix { labels, values }
 */
export const createCorrelationMatrix = (series) => {
  const labels = Object.keys(series);
  const n = labels.length;
  const matrix = Array(n).fill(null).map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else {
        const correlation = calculateCorrelation(series[labels[i]], series[labels[j]]);
        matrix[i][j] = correlation;
      }
    }
  }

  return { labels, values: matrix };
};

/**
 * Helper function to calculate correlation for matrix
 */
const calculateCorrelation = (x, y) => {
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

export default {
  transformToChartData,
  addMovingAverage,
  normalizeChartData,
  mergeChartSeries,
  filterByDateRange,
  calculateChartStats,
  resampleData,
  detectOutliers,
  fillMissingDates,
  createCorrelationMatrix,
};
