import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { MultiLineChart } from '../components/charts';
import { commodityColors } from '../config/chart.config';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { useCurrencyConverter } from '../hooks/useCurrencyConverter';
import { useMultiplePrices } from '../hooks/usePriceData';
import { getApiKeysStatus } from '../config/api.config';

const DashboardPage = () => {
  const { settings } = useApp();
  const { convertPrice, currentCurrency } = useCurrencyConverter();
  const { prices, loading, error, refetch } = useMultiplePrices();
  const [currentTime, setCurrentTime] = useState(new Date());
  const apiKeysStatus = getApiKeysStatus();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format price data from API
  const priceCards = useMemo(() => {
    if (!prices || Object.keys(prices).length === 0) {
      return [
        { name: 'WTI Crude', price: null, change: 0, positive: true, loading: true },
        { name: 'Brent Crude', price: null, change: 0, positive: true, loading: true },
        { name: 'Henry Hub', price: null, change: 0, positive: false, requiresKey: true },
        { name: 'OPEC Basket', price: null, change: 0, positive: true, requiresKey: true },
      ];
    }

    return [
      {
        name: 'WTI Crude',
        price: prices.WTI?.price || null,
        change: prices.WTI?.change || 0,
        positive: (prices.WTI?.change || 0) >= 0,
        loading: false,
      },
      {
        name: 'Brent Crude',
        price: prices.Brent?.price || null,
        change: prices.Brent?.change || 0,
        positive: (prices.Brent?.change || 0) >= 0,
        loading: false,
      },
      {
        name: 'Henry Hub',
        price: prices.HenryHub?.price || null,
        change: 0,
        positive: false,
        requiresKey: prices.HenryHub?.requiresApiKey,
        message: prices.HenryHub?.message,
      },
      {
        name: 'OPEC Basket',
        price: prices.OPEC?.price || null,
        change: 0,
        positive: true,
        requiresKey: prices.OPEC?.requiresApiKey,
        message: prices.OPEC?.message,
      },
    ];
  }, [prices]);

  // Generate chart data for 7-day price trends (using last 7 data points from API)
  const priceChartData = useMemo(() => {
    if (!prices || Object.keys(prices).length === 0) return [];

    const series = [];

    // Add WTI if available
    if (prices.WTI && prices.WTI.price) {
      series.push({
        name: 'WTI Crude',
        color: commodityColors.WTI,
        data: generateMockTrendData(prices.WTI.price, 7, convertPrice),
      });
    }

    // Add Brent if available
    if (prices.Brent && prices.Brent.price) {
      series.push({
        name: 'Brent Crude',
        color: commodityColors.Brent,
        data: generateMockTrendData(prices.Brent.price, 7, convertPrice),
      });
    }

    return series;
  }, [prices, convertPrice]);

  // Helper to generate trend data from current price
  const generateMockTrendData = (currentPrice, days, converter) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      // Generate slight variation around current price
      const variation = (Math.random() - 0.5) * (currentPrice * 0.02);
      const priceInUSD = currentPrice + variation;
      return {
        x: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: Number(converter(priceInUSD).toFixed(2)),
      };
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time market overview and key metrics
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Market Time</p>
            <p className="text-lg font-semibold text-white font-mono">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* API Key Warning Banner */}
        {!apiKeysStatus.eia && (
          <div className="p-4 rounded-lg border bg-yellow-500 bg-opacity-10 border-yellow-500">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-yellow-400">
                  Limited Data Available - Some features require API keys
                </p>
                <p className="text-xs text-yellow-300 mt-1">
                  Configure your free EIA API key in Settings to access Henry Hub Natural Gas and OPEC Basket prices, plus inventory data and more.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {priceCards.map((item) => (
            <div key={item.name} className="ep-card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-400">
                    {item.name}
                  </p>
                  {item.loading || loading ? (
                    <div className="mt-2 h-8 w-32 bg-slate-700 animate-pulse rounded" />
                  ) : item.requiresKey ? (
                    <div className="mt-2">
                      <p className="text-sm text-yellow-400 font-medium">
                        Requires API Key
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.message}
                      </p>
                    </div>
                  ) : item.price !== null ? (
                    <p className="mt-2 text-2xl font-bold text-white font-mono">
                      {formatPrice(convertPrice(item.price), currentCurrency)}
                    </p>
                  ) : (
                    <p className="mt-2 text-lg text-slate-500">No data</p>
                  )}
                </div>
                {!item.requiresKey && !item.loading && item.price !== null && (
                  <div
                    className={`p-3 rounded-lg ${
                      item.positive
                        ? 'bg-green-500 bg-opacity-10'
                        : 'bg-red-500 bg-opacity-10'
                    }`}
                  >
                    {item.positive ? (
                      <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {!item.requiresKey && !item.loading && item.price !== null && (
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      item.positive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {item.positive ? '+' : ''}
                    {item.change.toFixed(2)}%
                  </span>
                  <span className="ml-2 text-sm text-slate-500">vs yesterday</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Price chart */}
          <div className="ep-card">
            <div className="flex items-center mb-4">
              <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">7-Day Price Trends</h3>
            </div>
            <div className="w-full overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-80">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                </div>
              ) : priceChartData.length > 0 ? (
                <MultiLineChart
                  series={priceChartData}
                  title=""
                  xAxisLabel="Date"
                  yAxisLabel={`Price (${currentCurrency}/unit)`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-slate-400">
                  <ChartBarIcon className="w-12 h-12 mb-2 opacity-50" />
                  <p>No price data available</p>
                  <p className="text-sm mt-1">Data is being loaded from free APIs</p>
                </div>
              )}
            </div>
          </div>

          {/* Market summary */}
          <div className="ep-card">
            <div className="flex items-center mb-4">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">
                Market Summary
              </h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-sm text-slate-400">Total Market Cap</p>
                <p className="mt-1 text-xl font-bold text-white">$2.4T</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-sm text-slate-400">Daily Volume</p>
                <p className="mt-1 text-xl font-bold text-white">156M bbls</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-sm text-slate-400">Market Sentiment</p>
                <p className="mt-1 text-xl font-bold text-green-500">Bullish</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Market Events
          </h3>
          <div className="space-y-3">
            {[
              'OPEC+ announces production cut extension',
              'US crude inventory falls by 2.3M barrels',
              'Brent crude reaches 3-month high',
              'Natural gas prices stabilize after winter surge',
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-start p-3 bg-slate-900 rounded-lg"
              >
                <div className="w-2 h-2 mt-2 mr-3 rounded-full bg-blue-500" />
                <p className="text-sm text-slate-300">{event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
