// Commodities
export const COMMODITIES = {
  WTI: 'WTI',
  BRENT: 'BRENT',
  HENRY_HUB: 'HENRY_HUB',
  OPEC: 'OPEC',
};

export const COMMODITY_LABELS = {
  WTI: 'WTI Crude',
  BRENT: 'Brent Crude',
  HENRY_HUB: 'Henry Hub Natural Gas',
  OPEC: 'OPEC Basket',
};

export const COMMODITY_COLORS = {
  WTI: '#3B82F6',       // blue-500
  BRENT: '#8B5CF6',     // violet-500
  HENRY_HUB: '#F97316', // orange-500
  OPEC: '#14B8A6',      // teal-500
};

// Cache Configuration
export const CACHE_DURATION = {
  PRICES: 15 * 60 * 1000,        // 15 minutes
  HISTORICAL: 24 * 60 * 60 * 1000, // 24 hours
  CURRENCY: 60 * 60 * 1000,      // 1 hour
  INVENTORY: 24 * 60 * 60 * 1000, // 24 hours
};

// Cache Keys
export const CACHE_KEYS = {
  PRICE_WTI: 'CACHE_PRICE_WTI',
  PRICE_BRENT: 'CACHE_PRICE_BRENT',
  PRICE_HENRY_HUB: 'CACHE_PRICE_HENRY_HUB',
  PRICE_OPEC: 'CACHE_PRICE_OPEC',
  HISTORICAL_WTI: 'CACHE_HISTORICAL_WTI',
  HISTORICAL_BRENT: 'CACHE_HISTORICAL_BRENT',
  HISTORICAL_NG: 'CACHE_HISTORICAL_NG',
  CURRENCY_RATES: 'CACHE_CURRENCY_RATES',
  ECONOMIC_DATA: 'CACHE_ECONOMIC_DATA',
  INVENTORY_DATA: 'CACHE_INVENTORY_DATA',
};

// Supported Currencies
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
];

// Date Range Presets
export const DATE_RANGES = {
  ONE_WEEK: { label: '1W', days: 7 },
  ONE_MONTH: { label: '1M', days: 30 },
  THREE_MONTHS: { label: '3M', days: 90 },
  SIX_MONTHS: { label: '6M', days: 180 },
  ONE_YEAR: { label: '1Y', days: 365 },
  FIVE_YEARS: { label: '5Y', days: 1825 },
  ALL: { label: 'ALL', days: null },
};

// Moving Average Periods
export const MA_PERIODS = {
  MA_20: 20,
  MA_50: 50,
  MA_200: 200,
};

// Economic Indicators (FRED Series IDs)
export const ECONOMIC_INDICATORS = {
  GDP: { id: 'GDP', label: 'GDP' },
  CPI: { id: 'CPIAUCSL', label: 'CPI' },
  UNEMPLOYMENT: { id: 'UNRATE', label: 'Unemployment Rate' },
  DOLLAR_INDEX: { id: 'DTWEXBGS', label: 'Dollar Index' },
  SP500: { id: 'SP500', label: 'S&P 500' },
  VIX: { id: 'VIXCLS', label: 'VIX' },
};

// API Rate Limits
export const RATE_LIMITS = {
  OILPRICE_DEMO: 20, // requests per hour
  OILPRICE_FREE: 1000, // requests per month
  EIA: 100, // requests per minute
  FRED: 120, // requests per minute
};

// App Settings
export const APP_NAME = 'EnergyPulse';
export const APP_VERSION = '1.0.0';
export const DEFAULT_COMMODITY = COMMODITIES.WTI;
export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_DATE_RANGE = DATE_RANGES.ONE_MONTH;

// Alert Thresholds
export const ALERT_THRESHOLD_PERCENT = 3; // Alert when price changes > 3%

// Export Settings
export const EXPORT_FORMATS = {
  CSV: 'csv',
  PNG: 'png',
  PDF: 'pdf',
};

// Theme Colors (Tailwind slate palette)
export const THEME_COLORS = {
  bgPrimary: '#0F172A',    // slate-900
  bgCard: '#1E293B',       // slate-800
  bgElevated: '#334155',   // slate-700
  textPrimary: '#F8FAFC',  // slate-50
  textSecondary: '#94A3B8', // slate-400
  textMuted: '#64748B',    // slate-500
  accent: '#3B82F6',       // blue-500
  accentHover: '#2563EB',  // blue-600
  positive: '#22C55E',     // green-500
  negative: '#EF4444',     // red-500
  neutral: '#F59E0B',      // amber-500
  gridLines: '#334155',    // slate-700
  borders: '#334155',      // slate-700
};
