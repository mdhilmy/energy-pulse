import { useState, useEffect, useCallback } from 'react';
import { fetchWTIDailyPrices, fetchBrentDailyPrices } from '../services/api/datahub.service';
import { fetchLatestPrice } from '../services/api/oilPrice.service';
import { getApiKeysStatus } from '../config/api.config';

/**
 * Custom hook for fetching commodity price data
 * Uses free APIs (DataHub) with fallback to cached data
 * @param {string} commodity - Commodity to fetch (WTI, Brent, HenryHub, OPEC)
 * @param {string} timeRange - Time range for historical data
 * @returns {Object} { data, loading, error, refetch, latestPrice }
 */
export const usePriceData = (commodity = 'WTI', timeRange = '1M') => {
  const [data, setData] = useState([]);
  const [latestPrice, setLatestPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKeysStatus = getApiKeysStatus();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let historicalData = [];
      let currentPrice = null;

      // Fetch historical data from DataHub (free API)
      if (commodity === 'WTI') {
        historicalData = await fetchWTIDailyPrices();
      } else if (commodity === 'Brent') {
        historicalData = await fetchBrentDailyPrices();
      }

      // Filter data based on time range
      if (historicalData && historicalData.length > 0) {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
          case '1D':
            startDate.setDate(now.getDate() - 1);
            break;
          case '1W':
            startDate.setDate(now.getDate() - 7);
            break;
          case '1M':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case '3M':
            startDate.setMonth(now.getMonth() - 3);
            break;
          case '6M':
            startDate.setMonth(now.getMonth() - 6);
            break;
          case '1Y':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
          case 'ALL':
            startDate = new Date('1900-01-01');
            break;
          default:
            startDate.setMonth(now.getMonth() - 1);
        }

        const filtered = historicalData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= now;
        });

        setData(filtered);

        // Get latest price from historical data
        if (filtered.length > 0) {
          const latest = filtered[filtered.length - 1];
          currentPrice = {
            value: latest.value,
            date: latest.date,
            source: 'DataHub',
          };
        }
      }

      // Try to fetch latest price from OilPrice API (optional)
      if (commodity === 'WTI' || commodity === 'Brent') {
        try {
          const commodityCode = commodity === 'WTI' ? 'WTI_USD' : 'BRENT_CRUDE_USD';
          const priceData = await fetchLatestPrice(commodityCode);

          if (priceData && priceData.data && priceData.data.price) {
            currentPrice = {
              value: priceData.data.price,
              date: priceData.data.created_at,
              source: 'OilPrice API',
            };
          }
        } catch (err) {
          console.warn('[usePriceData] OilPrice API not available, using DataHub data');
        }
      }

      // For commodities without free API support, show placeholder
      if (!historicalData || historicalData.length === 0) {
        if (commodity === 'HenryHub') {
          setError('Henry Hub Natural Gas requires EIA API key. Configure in Settings.');
        } else if (commodity === 'OPEC') {
          setError('OPEC Basket requires EIA API key. Configure in Settings.');
        } else {
          setError('No data available for this commodity.');
        }
      }

      setLatestPrice(currentPrice);
    } catch (err) {
      console.error('[usePriceData] Error fetching price data:', err);
      setError(err.message || 'Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  }, [commodity, timeRange, apiKeysStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    latestPrice,
    loading,
    error,
    refetch: fetchData,
    hasApiKey: apiKeysStatus.eia || apiKeysStatus.oilprice,
  };
};

/**
 * Hook for fetching multiple commodity prices at once
 * @returns {Object} { prices, loading, error, refetch }
 */
export const useMultiplePrices = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch WTI and Brent from DataHub
      const [wtiData, brentData] = await Promise.all([
        fetchWTIDailyPrices(),
        fetchBrentDailyPrices(),
      ]);

      const priceData = {};

      // Get latest WTI price
      if (wtiData && wtiData.length > 0) {
        const latest = wtiData[wtiData.length - 1];
        priceData.WTI = {
          price: latest.value,
          date: latest.date,
          change: calculateChange(wtiData),
        };
      }

      // Get latest Brent price
      if (brentData && brentData.length > 0) {
        const latest = brentData[brentData.length - 1];
        priceData.Brent = {
          price: latest.value,
          date: latest.date,
          change: calculateChange(brentData),
        };
      }

      // Try to fetch from OilPrice API for more recent data
      try {
        const [wtiPrice, brentPrice] = await Promise.all([
          fetchLatestPrice('WTI_USD'),
          fetchLatestPrice('BRENT_CRUDE_USD'),
        ]);

        if (wtiPrice && wtiPrice.data && wtiPrice.data.price) {
          priceData.WTI = {
            ...priceData.WTI,
            price: wtiPrice.data.price,
            date: wtiPrice.data.created_at,
          };
        }

        if (brentPrice && brentPrice.data && brentPrice.data.price) {
          priceData.Brent = {
            ...priceData.Brent,
            price: brentPrice.data.price,
            date: brentPrice.data.created_at,
          };
        }
      } catch (err) {
        console.warn('[useMultiplePrices] OilPrice API not available, using DataHub data');
      }

      // Add placeholders for Henry Hub and OPEC (require EIA key)
      priceData.HenryHub = {
        price: null,
        requiresApiKey: true,
        message: 'Requires EIA API key',
      };

      priceData.OPEC = {
        price: null,
        requiresApiKey: true,
        message: 'Requires EIA API key',
      };

      setPrices(priceData);
    } catch (err) {
      console.error('[useMultiplePrices] Error fetching prices:', err);
      setError(err.message || 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    prices,
    loading,
    error,
    refetch: fetchData,
  };
};

/**
 * Calculate percentage change from historical data
 * @param {Array} data - Historical price data
 * @returns {number} Percentage change
 */
const calculateChange = (data) => {
  if (!data || data.length < 2) return 0;

  const latest = data[data.length - 1].value;
  const previous = data[data.length - 2].value;

  if (!latest || !previous || previous === 0) return 0;

  return ((latest - previous) / previous) * 100;
};

export default usePriceData;
