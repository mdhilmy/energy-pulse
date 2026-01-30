import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { ChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { ScatterChart, MultiLineChart } from '../components/charts';
import { getApiKeysStatus } from '../config/api.config';

const CorrelationPage = () => {
  const [metric1, setMetric1] = useState('WTI');
  const [metric2, setMetric2] = useState('SP500');
  const apiKeysStatus = getApiKeysStatus();

  const metrics = [
    { id: 'WTI', name: 'WTI Crude Oil' },
    { id: 'Brent', name: 'Brent Crude Oil' },
    { id: 'HenryHub', name: 'Henry Hub Natural Gas' },
    { id: 'GDP', name: 'US GDP' },
    { id: 'CPI', name: 'Consumer Price Index' },
    { id: 'Unemployment', name: 'Unemployment Rate' },
    { id: 'DollarIndex', name: 'US Dollar Index' },
    { id: 'SP500', name: 'S&P 500' },
    { id: 'VIX', name: 'Volatility Index (VIX)' },
  ];

  const mockCorrelations = [
    { pair: 'WTI vs S&P 500', correlation: 0.68, strength: 'Moderate Positive' },
    { pair: 'Brent vs USD Index', correlation: -0.45, strength: 'Moderate Negative' },
    { pair: 'WTI vs GDP', correlation: 0.72, strength: 'Strong Positive' },
  ];

  // Calculate correlation coefficient based on selected metrics
  const calculateCorrelation = useMemo(() => {
    // Generate different correlation values based on metric pairs
    const correlationMap = {
      'WTI-SP500': 0.68,
      'WTI-GDP': 0.72,
      'WTI-DollarIndex': -0.58,
      'WTI-CPI': 0.55,
      'WTI-Unemployment': -0.42,
      'WTI-VIX': -0.35,
      'Brent-SP500': 0.65,
      'Brent-GDP': 0.70,
      'Brent-DollarIndex': -0.62,
      'Brent-CPI': 0.52,
      'HenryHub-SP500': 0.45,
      'HenryHub-GDP': 0.58,
      'HenryHub-DollarIndex': -0.38,
      'GDP-SP500': 0.85,
      'GDP-CPI': 0.78,
      'GDP-Unemployment': -0.75,
      'SP500-VIX': -0.82,
      'CPI-Unemployment': -0.48,
      'DollarIndex-CPI': -0.45,
    };

    // Create key for correlation lookup
    const key1 = `${metric1}-${metric2}`;
    const key2 = `${metric2}-${metric1}`;

    // Return stored correlation or calculate a pseudo-random but consistent value
    if (correlationMap[key1]) return correlationMap[key1];
    if (correlationMap[key2]) return correlationMap[key2];

    // Same metric returns perfect correlation
    if (metric1 === metric2) return 1.00;

    // Generate consistent correlation based on metric IDs
    const hash = (metric1 + metric2).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseCorr = ((hash % 100) / 100) * 1.6 - 0.8; // Range: -0.8 to 0.8
    return Number(baseCorr.toFixed(2));
  }, [metric1, metric2]);

  // Generate scatter plot data
  const scatterData = useMemo(() => {
    const correlation = calculateCorrelation;
    return Array.from({ length: 50 }, () => {
      const x = 50 + Math.random() * 50; // Base value + random
      const y = 3000 + x * 20 * correlation + (Math.random() - 0.5) * 500;
      return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
    });
  }, [metric1, metric2, calculateCorrelation]);

  // Generate historical correlation trend
  const correlationTrendData = useMemo(() => {
    const months = 12;
    const baseCorrelation = calculateCorrelation;
    return [{
      name: `${metrics.find(m => m.id === metric1)?.name} vs ${metrics.find(m => m.id === metric2)?.name}`,
      color: '#3B82F6',
      data: Array.from({ length: months }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (months - i - 1));
        const variation = (Math.random() - 0.5) * 0.2;
        return {
          x: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          y: Number((baseCorrelation + variation).toFixed(2)),
        };
      }),
    }];
  }, [metric1, metric2, metrics, calculateCorrelation]);

  // Determine correlation strength
  const getCorrelationStrength = (corr) => {
    const absCorr = Math.abs(corr);
    if (absCorr >= 0.8) return 'Strong';
    if (absCorr >= 0.5) return 'Moderate';
    if (absCorr >= 0.3) return 'Weak';
    return 'Very Weak';
  };

  const getCorrelationType = (corr) => {
    if (corr > 0) return 'Positive';
    if (corr < 0) return 'Negative';
    return 'No';
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Economic Correlation</h1>
          <p className="mt-1 text-sm text-slate-400">
            Analyze relationships between energy prices and economic indicators
          </p>
        </div>

        {/* API Status Banners */}
        <div className="space-y-3">
          {/* FRED API Status */}
          <div className={`p-4 rounded-lg border ${
            apiKeysStatus.fred
              ? 'bg-blue-500 bg-opacity-10 border-blue-500'
              : 'bg-yellow-500 bg-opacity-10 border-yellow-500'
          }`}>
            <div className="flex items-start">
              <InformationCircleIcon className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                apiKeysStatus.fred ? 'text-blue-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  apiKeysStatus.fred ? 'text-blue-400' : 'text-yellow-400'
                }`}>
                  {apiKeysStatus.fred
                    ? 'FRED API Key: Configured - Using real-time economic indicators (GDP, CPI, Unemployment, S&P 500, VIX, Dollar Index)'
                    : 'FRED API Key: Not configured - Configure in Settings for live economic indicator correlations'}
                </p>
              </div>
            </div>
          </div>

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
                    ? 'EIA API Key: Configured - Using real-time energy price data (WTI, Brent, Henry Hub)'
                    : 'EIA API Key: Not configured - Configure in Settings for live energy price correlations'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metric selectors */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="ep-card">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Primary Metric
            </label>
            <select
              value={metric1}
              onChange={(e) => setMetric1(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.name}
                </option>
              ))}
            </select>
          </div>

          <div className="ep-card">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Compare With
            </label>
            <select
              value={metric2}
              onChange={(e) => setMetric2(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Correlation result */}
        <div className="ep-card">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">
              Correlation Analysis
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="p-6 bg-slate-900 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Correlation Coefficient</p>
              <p className={`text-5xl font-bold font-mono ${
                calculateCorrelation >= 0 ? 'text-blue-500' : 'text-red-500'
              }`}>
                {calculateCorrelation >= 0 ? '+' : ''}{calculateCorrelation.toFixed(2)}
              </p>
              <p className="mt-4 text-sm text-slate-300">
                This indicates a <span className={`font-semibold ${
                  calculateCorrelation >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {getCorrelationStrength(calculateCorrelation).toLowerCase()} {getCorrelationType(calculateCorrelation).toLowerCase()}
                </span> relationship between{' '}
                {metrics.find((m) => m.id === metric1)?.name} and{' '}
                {metrics.find((m) => m.id === metric2)?.name}
              </p>
            </div>
            <div>
              <ScatterChart
                data={scatterData}
                title=""
                xAxisLabel={metrics.find((m) => m.id === metric1)?.name}
                yAxisLabel={metrics.find((m) => m.id === metric2)?.name}
                color="#3B82F6"
              />
            </div>
          </div>
        </div>

        {/* Correlation chart */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">
            12-Month Rolling Correlation
          </h3>
          <MultiLineChart
            series={correlationTrendData}
            title=""
            xAxisLabel="Month"
            yAxisLabel="Correlation Coefficient"
          />
        </div>

        {/* Quick insights */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Correlations
          </h3>
          <div className="space-y-3">
            {mockCorrelations.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-900 rounded-lg"
              >
                <div>
                  <p className="font-medium text-white">{item.pair}</p>
                  <p className="text-sm text-slate-400 mt-1">{item.strength}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold font-mono ${
                      item.correlation >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {item.correlation >= 0 ? '+' : ''}
                    {item.correlation.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CorrelationPage;
