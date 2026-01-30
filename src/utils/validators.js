/**
 * Validate API key format
 * @param {string} key - API key to validate
 * @param {string} service - Service name (eia, fred, oilprice)
 * @returns {boolean} True if valid
 */
export const validateApiKey = (key, service) => {
  if (!key || typeof key !== 'string') return false;

  const trimmed = key.trim();

  switch (service.toLowerCase()) {
    case 'eia':
      // EIA keys are typically 40 characters alphanumeric
      return trimmed.length >= 30 && /^[a-zA-Z0-9]+$/.test(trimmed);
    case 'fred':
      // FRED keys are typically 32 characters hex
      return trimmed.length >= 30 && /^[a-fA-F0-9]+$/.test(trimmed);
    case 'oilprice':
      // OilPriceAPI keys vary
      return trimmed.length >= 20;
    default:
      return trimmed.length >= 20;
  }
};

/**
 * Validate date string format (YYYY-MM-DD)
 * @param {string} dateStr - Date string
 * @returns {boolean} True if valid
 */
export const validateDateString = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

/**
 * Validate date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {boolean} True if valid range
 */
export const validateDateRange = (startDate, endDate) => {
  if (!validateDateString(startDate) || !validateDateString(endDate)) {
    return false;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  return start <= end;
};

/**
 * Validate currency code
 * @param {string} code - Currency code (e.g., USD, EUR)
 * @returns {boolean} True if valid
 */
export const validateCurrencyCode = (code) => {
  if (!code || typeof code !== 'string') return false;

  const validCodes = [
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD', 'CHF',
    'INR', 'RUB', 'SAR', 'AED', 'BRL', 'MXN', 'NOK', 'SGD',
    'KRW', 'ZAR', 'TRY', 'NGN',
  ];

  return validCodes.includes(code.toUpperCase());
};

/**
 * Validate commodity type
 * @param {string} commodity - Commodity name
 * @returns {boolean} True if valid
 */
export const validateCommodity = (commodity) => {
  if (!commodity || typeof commodity !== 'string') return false;

  const validCommodities = ['WTI', 'BRENT', 'HENRY_HUB', 'OPEC'];
  return validCommodities.includes(commodity.toUpperCase());
};

/**
 * Validate number value
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options {min, max, allowZero, allowNegative}
 * @returns {boolean} True if valid
 */
export const validateNumber = (value, options = {}) => {
  const {
    min = -Infinity,
    max = Infinity,
    allowZero = true,
    allowNegative = true,
  } = options;

  const num = Number(value);

  if (isNaN(num)) return false;
  if (num === 0 && !allowZero) return false;
  if (num < 0 && !allowNegative) return false;
  if (num < min || num > max) return false;

  return true;
};

/**
 * Validate price value
 * @param {any} price - Price value
 * @returns {boolean} True if valid
 */
export const validatePrice = (price) => {
  return validateNumber(price, {
    min: 0,
    allowZero: false,
    allowNegative: false,
  });
};

/**
 * Validate percentage value
 * @param {any} percent - Percentage value
 * @returns {boolean} True if valid (-100 to 10000)
 */
export const validatePercentage = (percent) => {
  return validateNumber(percent, {
    min: -100,
    max: 10000,
  });
};

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL string
 * @returns {boolean} True if valid
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate chart data format
 * @param {Array} data - Chart data array
 * @returns {boolean} True if valid
 */
export const validateChartData = (data) => {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return true; // Empty is valid

  // Check if all items have date and value properties
  return data.every(item =>
    item &&
    typeof item === 'object' &&
    'date' in item &&
    'value' in item &&
    validateDateString(item.date) &&
    !isNaN(Number(item.value))
  );
};

/**
 * Validate time series data
 * @param {Array} data - Time series data
 * @returns {Object} Validation result {valid, errors}
 */
export const validateTimeSeriesData = (data) => {
  const errors = [];

  if (!Array.isArray(data)) {
    errors.push('Data must be an array');
    return { valid: false, errors };
  }

  if (data.length === 0) {
    return { valid: true, errors: [] };
  }

  // Check for required fields
  data.forEach((item, index) => {
    if (!item || typeof item !== 'object') {
      errors.push(`Item at index ${index} is not an object`);
      return;
    }

    if (!('date' in item)) {
      errors.push(`Item at index ${index} missing 'date' field`);
    } else if (!validateDateString(item.date)) {
      errors.push(`Item at index ${index} has invalid date: ${item.date}`);
    }

    if (!('value' in item)) {
      errors.push(`Item at index ${index} missing 'value' field`);
    } else if (isNaN(Number(item.value))) {
      errors.push(`Item at index ${index} has invalid value: ${item.value}`);
    }
  });

  // Check for chronological order
  for (let i = 1; i < data.length; i++) {
    if (new Date(data[i].date) < new Date(data[i - 1].date)) {
      errors.push(`Data not in chronological order at index ${i}`);
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize user input string
 * @param {string} input - User input
 * @param {number} maxLength - Maximum length (default: 1000)
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input, maxLength = 1000) => {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potentially dangerous characters
};

/**
 * Validate export format
 * @param {string} format - Export format (csv, png, pdf)
 * @returns {boolean} True if valid
 */
export const validateExportFormat = (format) => {
  if (!format || typeof format !== 'string') return false;

  const validFormats = ['csv', 'png', 'pdf'];
  return validFormats.includes(format.toLowerCase());
};

/**
 * Check if value is within threshold
 * @param {number} value - Value to check
 * @param {number} threshold - Threshold value
 * @param {string} operator - Comparison operator ('gt', 'gte', 'lt', 'lte', 'eq')
 * @returns {boolean} True if passes threshold check
 */
export const checkThreshold = (value, threshold, operator = 'gt') => {
  if (!validateNumber(value) || !validateNumber(threshold)) return false;

  switch (operator) {
    case 'gt':
      return value > threshold;
    case 'gte':
      return value >= threshold;
    case 'lt':
      return value < threshold;
    case 'lte':
      return value <= threshold;
    case 'eq':
      return value === threshold;
    default:
      return false;
  }
};

export default {
  validateApiKey,
  validateDateString,
  validateDateRange,
  validateCurrencyCode,
  validateCommodity,
  validateNumber,
  validatePrice,
  validatePercentage,
  validateEmail,
  validateUrl,
  validateChartData,
  validateTimeSeriesData,
  sanitizeInput,
  validateExportFormat,
  checkThreshold,
};
