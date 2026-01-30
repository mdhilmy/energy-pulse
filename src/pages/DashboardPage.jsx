import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { MultiLineChart } from '../components/charts';
import { commodityColors } from '../config/chart.config';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import { useCurrencyConverter } from '../hooks/useCurrencyConverter';

const DashboardPage = () => {
  const { settings } = useApp();
  const { convertPrice, currentCurrency } = useCurrencyConverter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const mockPrices = [
    { name: 'WTI Crude', price: 78.45, change: 2.3, positive: true },
    { name: 'Brent Crude', price: 82.67, change: 1.8, positive: true },
    { name: 'Henry Hub', price: 3.12, change: -0.5, positive: false },
    { name: 'OPEC Basket', price: 81.23, change: 1.2, positive: true },
  ];

  // Generate mock data for 7-day price trends
  const priceChartData = useMemo(() => {
    const days = 7;
    const prices = {
      'WTI Crude': { base: 78.45, color: commodityColors.WTI },
      'Brent Crude': { base: 82.67, color: commodityColors.Brent },
      'Henry Hub': { base: 3.12, color: commodityColors.HenryHub },
      'OPEC Basket': { base: 81.23, color: commodityColors.OPEC },
    };

    return Object.entries(prices).map(([name, config]) => ({
      name,
      color: config.color,
      data: Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        const variation = (Math.random() - 0.5) * (config.base * 0.03);
        const priceInUSD = config.base + variation;
        return {
          x: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          y: Number(convertPrice(priceInUSD).toFixed(2)),
        };
      }),
    }));
  }, [convertPrice]);

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

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockPrices.map((item) => (
            <div key={item.name} className="ep-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {item.name}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white font-mono">
                    {formatPrice(convertPrice(item.price), currentCurrency)}
                  </p>
                </div>
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
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={`text-sm font-medium ${
                    item.positive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {item.positive ? '+' : ''}
                  {item.change}%
                </span>
                <span className="ml-2 text-sm text-slate-500">vs yesterday</span>
              </div>
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
              <MultiLineChart
                series={priceChartData}
                title=""
                xAxisLabel="Date"
                yAxisLabel={`Price (${currentCurrency}/unit)`}
              />
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
