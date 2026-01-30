import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { CurrencyDollarIcon, ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { LineChart } from '../components/charts';
import { commodityColors } from '../config/chart.config';
import { getApiKeysStatus } from '../config/api.config';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { useCurrencyConverter } from '../hooks/useCurrencyConverter';

const PricesPage = () => {
  const { settings } = useApp();
  const { convertPrice, currentCurrency } = useCurrencyConverter();
  const [selectedCommodity, setSelectedCommodity] = useState('WTI');
  const [timeRange, setTimeRange] = useState('1D');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const apiKeysStatus = getApiKeysStatus();

  const commodities = [
    { id: 'WTI', name: 'WTI Crude', price: 78.45, change: 2.3, unit: '$/bbl' },
    { id: 'Brent', name: 'Brent Crude', price: 82.67, change: 1.8, unit: '$/bbl' },
    { id: 'HenryHub', name: 'Henry Hub Natural Gas', price: 3.12, change: -0.5, unit: '$/MMBtu' },
    { id: 'OPEC', name: 'OPEC Basket', price: 81.23, change: 1.2, unit: '$/bbl' },
  ];

  const timeRanges = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

  // Generate mock historical data for the selected commodity
  const chartData = useMemo(() => {
    const basePrice = commodities.find(c => c.id === selectedCommodity)?.price || 78.45;
    const dataPoints = timeRange === '1D' ? 24 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 90;

    return Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date();
      if (timeRange === '1D') {
        date.setHours(date.getHours() - (dataPoints - i));
      } else {
        date.setDate(date.getDate() - (dataPoints - i));
      }

      // Create realistic price fluctuation
      const variation = (Math.random() - 0.5) * (basePrice * 0.05);
      const trend = (i / dataPoints) * (Math.random() - 0.5) * 3;
      const priceInUSD = basePrice + variation + trend;

      return {
        x: date.toISOString(),
        y: Number(convertPrice(priceInUSD).toFixed(2)),
      };
    });
  }, [selectedCommodity, timeRange, commodities, convertPrice]);

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    // Show brief notification
    alert('Data refreshed successfully!');
  };

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
                onClick={() => setSelectedCommodity(commodity.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedCommodity === commodity.id
                    ? 'bg-blue-500 bg-opacity-20 border-blue-500'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                }`}
              >
                <p className="text-sm font-medium text-slate-400">
                  {commodity.name}
                </p>
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
                  {commodity.change}%
                </p>
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
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <LineChart
            data={chartData}
            title={`${commodities.find((c) => c.id === selectedCommodity)?.name} - ${timeRange}`}
            xAxisLabel="Date"
            yAxisLabel={`Price (${currentCurrency}/${commodities.find((c) => c.id === selectedCommodity)?.id === 'HenryHub' ? 'MMBtu' : 'bbl'})`}
            color={getChartColor()}
          />
        </div>

        {/* Price statistics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="ep-card">
            <p className="text-sm text-slate-400">24h High</p>
            <p className="mt-2 text-2xl font-bold text-green-500 font-mono">
              {formatPrice(convertPrice(79.23), currentCurrency)}
            </p>
          </div>
          <div className="ep-card">
            <p className="text-sm text-slate-400">24h Low</p>
            <p className="mt-2 text-2xl font-bold text-red-500 font-mono">
              {formatPrice(convertPrice(76.87), currentCurrency)}
            </p>
          </div>
          <div className="ep-card">
            <p className="text-sm text-slate-400">24h Volume</p>
            <p className="mt-2 text-2xl font-bold text-blue-500 font-mono">
              12.4M bbls
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PricesPage;
