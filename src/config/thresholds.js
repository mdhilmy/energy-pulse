// Alert and notification thresholds

// Price change thresholds (percentage)
export const PRICE_CHANGE_THRESHOLDS = {
  MINOR: 1,    // 1% change - yellow indicator
  MODERATE: 3, // 3% change - orange indicator
  MAJOR: 5,    // 5% change - red indicator / alert
};

// Volatility thresholds (annualized %)
export const VOLATILITY_THRESHOLDS = {
  LOW: 20,      // < 20% - low volatility
  MODERATE: 40, // 20-40% - moderate volatility
  HIGH: 60,     // > 40% - high volatility
};

// Inventory thresholds (deviation from 5-year average)
export const INVENTORY_THRESHOLDS = {
  VERY_LOW: -15,  // < -15% - critically low
  LOW: -10,       // -15% to -10% - below average
  NORMAL: 10,     // -10% to +10% - normal range
  HIGH: 15,       // +10% to +15% - above average
  VERY_HIGH: 15,  // > +15% - critically high
};

// Correlation strength thresholds
export const CORRELATION_THRESHOLDS = {
  VERY_WEAK: 0.2,   // |r| < 0.2 - very weak
  WEAK: 0.4,        // 0.2 <= |r| < 0.4 - weak
  MODERATE: 0.6,    // 0.4 <= |r| < 0.6 - moderate
  STRONG: 0.8,      // 0.6 <= |r| < 0.8 - strong
  VERY_STRONG: 0.8, // |r| >= 0.8 - very strong
};

// Data freshness thresholds (minutes)
export const DATA_FRESHNESS = {
  CURRENT: 15,  // < 15 min - current (green)
  RECENT: 60,   // 15-60 min - recent (yellow)
  STALE: 60,    // > 60 min - stale (red)
};

// API retry thresholds
export const API_RETRY_THRESHOLDS = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,     // 1 second
  MAX_DELAY: 10000,        // 10 seconds
  BACKOFF_MULTIPLIER: 2,
};

// Cache size thresholds (number of items)
export const CACHE_SIZE_THRESHOLDS = {
  WARNING: 50,   // Warn when cache has > 50 items
  CRITICAL: 100, // Auto-clear oldest when > 100 items
};

export default {
  PRICE_CHANGE_THRESHOLDS,
  VOLATILITY_THRESHOLDS,
  INVENTORY_THRESHOLDS,
  CORRELATION_THRESHOLDS,
  DATA_FRESHNESS,
  API_RETRY_THRESHOLDS,
  CACHE_SIZE_THRESHOLDS,
};
