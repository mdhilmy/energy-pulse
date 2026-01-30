import { format, parseISO, subDays, subMonths, subYears, isValid, differenceInDays } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} dateStr - Date string or Date object
 * @param {string} formatStr - Format pattern (default: 'MMM d, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateStr, formatStr = 'MMM d, yyyy') => {
  if (!dateStr) return 'N/A';

  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    if (!isValid(date)) return 'Invalid Date';
    return format(date, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format date with time
 * @param {string|Date} dateStr - Date string or Date object
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateStr) => {
  return formatDate(dateStr, 'MMM d, yyyy h:mm a');
};

/**
 * Format date as ISO string (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} ISO date string
 */
export const toISODateString = (date) => {
  if (!date || !isValid(date)) return '';
  return format(date, 'yyyy-MM-dd');
};

/**
 * Get date range based on preset
 * @param {string} preset - Preset name ('1W', '1M', '3M', '6M', '1Y', '5Y', 'ALL')
 * @param {Date} endDate - End date (default: today)
 * @returns {Object} { startDate, endDate }
 */
export const getDateRange = (preset, endDate = new Date()) => {
  let startDate;

  switch (preset) {
    case '1W':
      startDate = subDays(endDate, 7);
      break;
    case '1M':
      startDate = subMonths(endDate, 1);
      break;
    case '3M':
      startDate = subMonths(endDate, 3);
      break;
    case '6M':
      startDate = subMonths(endDate, 6);
      break;
    case '1Y':
      startDate = subYears(endDate, 1);
      break;
    case '5Y':
      startDate = subYears(endDate, 5);
      break;
    case 'ALL':
      startDate = subYears(endDate, 20); // 20 years max
      break;
    default:
      startDate = subMonths(endDate, 1);
  }

  return {
    startDate: toISODateString(startDate),
    endDate: toISODateString(endDate),
  };
};

/**
 * Calculate days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of days
 */
export const daysBetween = (startDate, endDate) => {
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

    if (!isValid(start) || !isValid(end)) return 0;
    return differenceInDays(end, start);
  } catch (error) {
    return 0;
  }
};

/**
 * Get relative time description
 * @param {string|Date} dateStr - Date string or Date object
 * @returns {string} Relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateStr) => {
  if (!dateStr) return 'N/A';

  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    if (!isValid(date)) return 'Invalid Date';

    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    return formatDate(date);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Check if date is recent (within last N minutes)
 * @param {string|Date} dateStr - Date string or Date object
 * @param {number} minutes - Number of minutes (default: 15)
 * @returns {boolean} True if recent
 */
export const isRecent = (dateStr, minutes = 15) => {
  if (!dateStr) return false;

  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    if (!isValid(date)) return false;

    const now = new Date();
    const diffMs = now - date;
    const diffMin = diffMs / (1000 * 60);

    return diffMin <= minutes;
  } catch (error) {
    return false;
  }
};

/**
 * Parse date string to Date object
 * @param {string} dateStr - Date string
 * @returns {Date|null} Date object or null
 */
export const parseDateString = (dateStr) => {
  if (!dateStr) return null;

  try {
    const date = parseISO(dateStr);
    return isValid(date) ? date : null;
  } catch (error) {
    return null;
  }
};

/**
 * Get start and end of current month
 * @returns {Object} { startDate, endDate }
 */
export const getCurrentMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return {
    startDate: toISODateString(startDate),
    endDate: toISODateString(endDate),
  };
};

/**
 * Get start and end of current year
 * @returns {Object} { startDate, endDate }
 */
export const getCurrentYearRange = () => {
  const now = new Date();
  const year = now.getFullYear();

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  return {
    startDate: toISODateString(startDate),
    endDate: toISODateString(endDate),
  };
};

/**
 * Format date for API request (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatForApi = (date) => {
  return toISODateString(date);
};

/**
 * Get array of dates between start and end
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string[]} Array of ISO date strings
 */
export const getDateArray = (startDate, endDate) => {
  const dates = [];
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  if (!isValid(start) || !isValid(end)) return [];

  let currentDate = start;
  while (currentDate <= end) {
    dates.push(toISODateString(currentDate));
    currentDate = subDays(currentDate, -1); // Add 1 day
  }

  return dates;
};

export default {
  formatDate,
  formatDateTime,
  toISODateString,
  getDateRange,
  daysBetween,
  getRelativeTime,
  isRecent,
  parseDateString,
  getCurrentMonthRange,
  getCurrentYearRange,
  formatForApi,
  getDateArray,
};
