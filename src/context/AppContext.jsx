import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getApiKeysStatus } from '../config/api.config';
import { DEFAULT_COMMODITY, DEFAULT_CURRENCY, DEFAULT_DATE_RANGE } from '../config/constants';

// Create context
const AppContext = createContext(null);

// Provider component
export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load preferences from localStorage on initialization
    const savedPreferences = localStorage.getItem('EP_USER_PREFERENCES');
    const defaults = {
      defaultCommodity: DEFAULT_COMMODITY,
      defaultCurrency: DEFAULT_CURRENCY,
      defaultDateRange: DEFAULT_DATE_RANGE,
      theme: 'dark',
      refreshInterval: '15 minutes',
      cacheDataLocally: true,
    };

    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        return { ...defaults, ...parsed };
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
        return defaults;
      }
    }
    return defaults;
  });

  const [apiKeysConfigured, setApiKeysConfigured] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check API keys status on mount
  useEffect(() => {
    const checkApiKeys = () => {
      const status = getApiKeysStatus();
      const configured = status.eia || status.fred || status.oilprice;
      setApiKeysConfigured(configured);
    };

    checkApiKeys();

    // Listen for storage events (API key and preference updates from Settings page)
    const handleStorageChange = () => {
      checkApiKeys();
      // Reload preferences
      const savedPreferences = localStorage.getItem('EP_USER_PREFERENCES');
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to parse saved preferences:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    // Persist to localStorage
    localStorage.setItem('EP_USER_PREFERENCES', JSON.stringify(updated));
  };

  const updateLastRefresh = () => {
    setLastUpdated(new Date());
  };

  const value = {
    settings,
    updateSettings,
    apiKeysConfigured,
    lastUpdated,
    updateLastRefresh,
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the App context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
