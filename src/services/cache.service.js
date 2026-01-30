/**
 * Get cached data from localStorage
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp, duration } = JSON.parse(cached);

    // Check if cache is still valid
    if (Date.now() - timestamp > duration) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Set cached data in localStorage
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} duration - Cache duration in milliseconds
 */
export const setCachedData = (key, data, duration) => {
  try {
    const cacheObject = {
      data,
      timestamp: Date.now(),
      duration,
    };

    localStorage.setItem(key, JSON.stringify(cacheObject));
  } catch (error) {
    console.error('Error setting cache:', error);
    // If quota exceeded, clear old cache entries
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      // Try again
      try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), duration }));
      } catch {
        console.error('Unable to cache data even after cleanup');
      }
    }
  }
};

/**
 * Clear specific cache key
 * @param {string} key - Cache key to clear
 */
export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all application cache keys
 */
export const clearAllCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('CACHE_') || key.startsWith('EP_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

/**
 * Clear old cache entries to free up space
 */
const clearOldCache = () => {
  try {
    const keys = Object.keys(localStorage);
    const cacheEntries = [];

    // Collect all cache entries with timestamps
    keys.forEach(key => {
      if (key.startsWith('CACHE_')) {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          if (cached && cached.timestamp) {
            cacheEntries.push({ key, timestamp: cached.timestamp });
          }
        } catch {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    });

    // Sort by timestamp (oldest first)
    cacheEntries.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest 25% of entries
    const removeCount = Math.ceil(cacheEntries.length * 0.25);
    for (let i = 0; i < removeCount; i++) {
      localStorage.removeItem(cacheEntries[i].key);
    }
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
};

/**
 * Get cache statistics
 * @returns {Object} Cache stats {totalEntries, totalSize, oldestEntry, newestEntry}
 */
export const getCacheStats = () => {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('CACHE_'));

    let totalSize = 0;
    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;

    cacheKeys.forEach(key => {
      const value = localStorage.getItem(key);
      totalSize += value.length;

      try {
        const cached = JSON.parse(value);
        if (cached && cached.timestamp) {
          oldestTimestamp = Math.min(oldestTimestamp, cached.timestamp);
          newestTimestamp = Math.max(newestTimestamp, cached.timestamp);
        }
      } catch {
        // Skip invalid entries
      }
    });

    return {
      totalEntries: cacheKeys.length,
      totalSize,
      oldestEntry: cacheKeys.length > 0 ? new Date(oldestTimestamp) : null,
      newestEntry: cacheKeys.length > 0 ? new Date(newestTimestamp) : null,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return {
      totalEntries: 0,
      totalSize: 0,
      oldestEntry: null,
      newestEntry: null,
    };
  }
};

/**
 * Check if cache exists and is valid
 * @param {string} key - Cache key
 * @returns {boolean} True if cache exists and is valid
 */
export const isCacheValid = (key) => {
  return getCachedData(key) !== null;
};

export default {
  getCachedData,
  setCachedData,
  clearCache,
  clearAllCache,
  getCacheStats,
  isCacheValid,
};
