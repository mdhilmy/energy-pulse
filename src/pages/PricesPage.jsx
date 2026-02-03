import { useState, useMemo, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { CurrencyDollarIcon, ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { LineChart } from '../components/charts';
import { commodityColors } from '../config/chart.config';
import { getApiKeysStatus } from '../config/api.config';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { useCurrencyConverter } from '../hooks/useCurrencyConverter';
import { usePriceData, useMultiplePrices } from '../hooks/usePriceData';

const PricesPage = () => {
  const { settings } = useApp();
  const { convertPrice, currentCurrency } = useCurrencyConverter();
  const [selectedCommodity, setSelectedCommodity] = useState('WTI');
  const [timeRange, setTimeRange] = useState('1M');
  const apiKeysStatus = getApiKeysStatus();

  // Fetch all prices for the commodity selector
  const { prices: allPrices, loading: pricesLoading, refetch: refetchAll } = useMultiplePrices();

  // Fetch detailed data for selected commodity
  const {
    data: historicalData,
    latestPrice,
    loading: dataLoading,
    error: dataError,
    refetch: refetchData
  } = usePriceData(selectedCommodity, timeRange);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const timeRanges = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

  // Format commodities for display
  const commodities = useMemo(() => {
    if (!allPrices || Object.keys(allPrices).length === 0) {
      return [
        { id: 'WTI', name: 'WTI Crude', price: null, change: 0, unit: '$/bbl', loading: true },
        { id: 'Brent', name: 'Brent Crude', price: null, change: 0, unit: '$/bbl', loading: true },
        { id: 'HenryHub', name: 'Henry Hub Natural Gas', price: null, change: 0, unit: '$/MMBtu', requiresKey: true },
        { id: 'OPEC', name: 'OPEC Basket', price: null, change: 0, unit: '$/bbl', requiresKey: true },
      ];
    }

    return [
      {
        id: 'WTI',
        name: 'WTI Crude',
        price: allPrices.WTI?.price || null,
        change: allPrices.WTI?.change || 0,
        unit: '$/bbl',
        loading: false,
      },
      {
        id: 'Brent',
        name: 'Brent Crude',
        price: allPrices.Brent?.price || null,
        change: allPrices.Brent?.change || 0,
        unit: '$/bbl',
        loading: false,
      },
      {
        id: 'HenryHub',
        name: 'Henry Hub Natural Gas',
        price: allPrices.HenryHub?.price || null,
        change: 0,
        unit: '$/MMBtu',
        requiresKey: allPrices.HenryHub?.requiresApiKey,
        message: allPrices.HenryHub?.message,
      },
      {
        id: 'OPEC',
        name: 'OPEC Basket',
        price: allPrices.OPEC?.price || null,
        change: 0,
        unit: '$/bbl',
        requiresKey: allPrices.OPEC?.requiresApiKey,
        message: allPrices.OPEC?.message,
      },
    ];
  }, [allPrices]);

  // Format historical data for chart
  const chartData = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return [];
    }

    return historicalData.map(item => ({
      x: item.date,
      y: Number(convertPrice(item.value).toFixed(2)),
    }));
  }, [historicalData, convertPrice]);

  const getChartColor = () => {
    const colorMap = {
      WTI: commodityColors.WTI,
      Brent: commodityColors.Brent,
      HenryHub: commodityColors.HenryHub,
      OPEC: commodityColors.OPEC,
    };
    return colorMap[selectedCommodity] || commodityColors.WTI;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchAll(), refetchData()]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate statistics from historical data
  const statistics = useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return { high: null, low: null, avg: null };
    }

    const values = historicalData.map(item => item.value);
    return {
      high: Math.max(...values),
      low: Math.min(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    };
  }, [historicalData]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Price Tracker</h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time commodity prices and historical data
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="ep-btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* API Status Banners */}
        <div className="space-y-3">
          {/* EIA API Status */}
          <div className={`p-4 rounded-lg border ${
            apiKeysStatus.eia
              ? 'bg-blue-500 bg-opacity-10 border-blue-500'
              : 'bg-yellow-500 bg-opacity-10 border-yellow-500'
          }`}>
            <div className="flex items-start">
              <InformationCircleIcon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                apiKeysStatus.eia ? 'text-blue-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  apiKeysStatus.eia ? 'text-blue-400' : 'text-yellow-400'
                }`}>
                  {apiKeysStatus.eia
                    ? 'EIA API Key: Configured - Using real-time energy price data'
                    : 'EIA API Key: Not configured - Configure in Settings for live energy prices'}
                </p>
              </div>
            </div>
          </div>

          {/* OilPrice API Status */}
          <div className={`p-4 rounded-lg border ${
            apiKeysStatus.oilprice
              ? 'bg-blue-500 bg-opacity-10 border-blue-500'
              : 'bg-yellow-500 bg-opacity-10 border-yellow-500'
          }`}>
            <div className="flex items-start">
              <InformationCircleIcon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                apiKeysStatus.oilprice ? 'text-blue-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  apiKeysStatus.oilprice ? 'text-blue-400' : 'text-yellow-400'
                }`}>
                  {apiKeysStatus.oilprice
                    ? 'OilPrice API Key: Configured - Enhanced real-time oil price data available'
                    : 'OilPrice API Key: Not configured (Optional) - Configure in Settings for additional price data sources'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Commodity selector */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">
            Select Commodity
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {commodities.map((commodity) => (
              <button
                key={commodity.id}
                onClick={() => !commodity.requiresKey && setSelectedCommodity(commodity.id)}
                disabled={commodity.requiresKey}
                className={`p-4 rounded-lg border transition-all ${
                  selectedCommodity === commodity.id
                    ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                    : commodity.requiresKey
                    ? 'bg-slate-900 border-slate-700 opacity-60 cursor-not-allowed'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
              >
                <p className="text-sm font-medium text-slate-400">
                  {commodity.name}
                </p>
                {commodity.loading || pricesLoading ? (
                  <div className="mt-2 h-8 w-24 bg-slate-700 animate-pulse rounded" />
                ) : commodity.requiresKey ? (
                  <div className="mt-2">
                    <p className="text-sm text-yellow-400 font-medium">API Key Required</p>
                    <p className="text-xs text-slate-500 mt-1">{commodity.message}</p>
                  </div>
                ) : commodity.price !== null ? (
                  <>
                    <p className="mt-2 text-2xl font-bold text-white font-mono">
                      {formatPrice(convertPrice(commodity.price), currentCurrency)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{commodity.unit}</p>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        commodity.change >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {commodity.change >= 0 ? '+' : ''}
                      {commodity.change.toFixed(2)}%
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">No data</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Time range selector */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">Time Range</h3>
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Price chart */}
        <div className="ep-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">
                {commodities.find((c) => c.id === selectedCommodity)?.name} Price Chart
              </h3>
            </div>
            <span className="text-sm text-slate-400">
              {latestPrice ? `Last updated: ${new Date(latestPrice.date).toLocaleString()}` : 'No data'}
            </span>
          </div>
          {dataLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
          ) : dataError ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
              <InformationCircleIcon className="w-12 h-12 mb-2 text-yellow-500" />
              <p className="text-yellow-400 font-medium">{dataError}</p>
              <p className="text-sm mt-2">Configure your API key in Settings to access this data</p>
            </div>
          ) : chartData.length > 0 ? (
            <LineChart
              data={chartData}
              title={`${commodities.find((c) => c.id === selectedCommodity)?.name} - ${timeRange}`}
              xAxisLabel="Date"
              yAxisLabel={`Price (${currentCurrency}/${commodities.find((c) => c.id === selectedCommodity)?.id === 'HenryHub' ? 'MMBtu' : 'bbl'})`}
              color={getChartColor()}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
              <CurrencyDollarIcon className="w-12 h-12 mb-2 opacity-50" />
              <p>No price data available for this time range</p>
              <button
                onClick={handleRefresh}
                className="mt-4 ep-btn-primary"
              >
                Try Refreshing
              </button>
            </div>
          )}
        </div>

        {/* Price statistics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="ep-card">
            <p className="text-sm text-slate-400">Period High</p>
            {dataLoading ? (
              <div className="mt-2 h-8 w-24 bg-slate-700 animate-pulse rounded" />
            ) : statistics.high !== null ? (
              <p className="mt-2 text-2xl font-bold text-green-500 font-mono">
                {formatPrice(convertPrice(statistics.high), currentCurrency)}
              </p>
            ) : (
              <p className="mt-2 text-lg text-slate-500">N/A</p>
            )}
          </div>
          <div className="ep-card">
            <p className="text-sm text-slate-400">Period Low</p>
            {dataLoading ? (
              <div className="mt-2 h-8 w-24 bg-slate-700 animate-pulse rounded" />
            ) : statistics.low !== null ? (
              <p className="mt-2 text-2xl font-bold text-red-500 font-mono">
                {formatPrice(convertPrice(statistics.low), currentCurrency)}
              </p>
            ) : (
              <p className="mt-2 text-lg text-slate-500">N/A</p>
            )}
          </div>
          <div className="ep-card">
            <p className="text-sm text-slate-400">Period Average</p>
            {dataLoading ? (
              <div className="mt-2 h-8 w-24 bg-slate-700 animate-pulse rounded" />
            ) : statistics.avg !== null ? (
              <p className="mt-2 text-2xl font-bold text-blue-500 font-mono">
                {formatPrice(convertPrice(statistics.avg), currentCurrency)}
              </p>
            ) : (
              <p className="mt-2 text-lg text-slate-500">N/A</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PricesPage;
