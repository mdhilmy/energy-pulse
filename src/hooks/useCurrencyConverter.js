import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { fetchExchangeRates } from '../services/api/currency.service';

/**
 * Custom hook for converting prices to the user's selected currency
 * @returns {Object} - { convertPrice, isLoading, error }
 */
export const useCurrencyConverter = () => {
  const { settings } = useApp();
  const [exchangeRates, setExchangeRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exchange rates when currency changes
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setIsLoading(true);
        const rates = await fetchExchangeRates('usd');
        setExchangeRates(rates);
        setError(null);
      } catch (err) {
        console.error('Failed to load exchange rates:', err);
        setError(err.message);
        // Set fallback rates
        setExchangeRates({
          eur: 0.92,
          gbp: 0.79,
          jpy: 149.0,
          usd: 1.0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadExchangeRates();
  }, [settings.defaultCurrency]);

  /**
   * Convert a price from USD to the selected currency
   * @param {number} usdPrice - Price in USD
   * @returns {number} - Converted price
   */
  const convertPrice = useCallback(
    (usdPrice) => {
      if (!usdPrice || isNaN(usdPrice)) return 0;

      const targetCurrency = settings.defaultCurrency.toLowerCase();

      // If already USD, return as-is
      if (targetCurrency === 'usd') return usdPrice;

      // If rates not loaded yet, return USD price
      if (!exchangeRates) return usdPrice;

      // Get the exchange rate for target currency
      const rate = exchangeRates[targetCurrency];

      // If rate not found, return USD price
      if (!rate) return usdPrice;

      // Convert and return
      return usdPrice * rate;
    },
    [settings.defaultCurrency, exchangeRates]
  );

  return {
    convertPrice,
    isLoading,
    error,
    currentCurrency: settings.defaultCurrency,
  };
};

export default useCurrencyConverter;
