import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { BanknotesIcon, ArrowsRightLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { fetchExchangeRates, convertCurrency } from '../services/api/currency.service';
import { useMultiplePrices } from '../hooks/usePriceData';
import { CURRENCIES } from '../config/constants';

const CurrencyPage = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { prices } = useMultiplePrices();

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const rates = await fetchExchangeRates('USD');
        setExchangeRates(rates);
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
        setError('Failed to fetch exchange rates. Using cached data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Build currencies list with real rates
  const currencies = CURRENCIES.filter(curr =>
    ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'INR'].includes(curr.code)
  ).map(curr => ({
    ...curr,
    rate: exchangeRates[curr.code.toLowerCase()] || 1.0,
  }));

  const calculateConversion = () => {
    const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;
    const result = (parseFloat(amount) / fromRate) * toRate;
    return isNaN(result) ? 0 : result;
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const rates = await fetchExchangeRates('USD');
      setExchangeRates(rates);
    } catch (err) {
      console.error('Error refreshing exchange rates:', err);
      setError('Failed to refresh exchange rates');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Currency Converter</h1>
            <p className="mt-1 text-sm text-slate-400">
              Convert energy prices between different currencies (real-time rates from free API)
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="ep-btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Rates'}
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-4 rounded-lg border bg-yellow-500 bg-opacity-10 border-yellow-500">
            <p className="text-sm text-yellow-400">{error}</p>
          </div>
        )}

        {/* Currency converter */}
        <div className="ep-card">
          <div className="flex items-center mb-6">
            <BanknotesIcon className="w-5 h-5 mr-2 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">
              Price Converter
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* From currency */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                From
              </label>
              <div className="space-y-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* To currency */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                To
              </label>
              <div className="space-y-3">
                <div className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg">
                  <p className="text-2xl font-bold text-green-500 font-mono">
                    {calculateConversion().toFixed(2)}
                  </p>
                </div>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSwapCurrencies}
              className="ep-btn-secondary flex items-center"
            >
              <ArrowsRightLeftIcon className="w-4 h-4 mr-2" />
              Swap Currencies
            </button>
          </div>

          {/* Exchange rate */}
          <div className="mt-6 p-4 bg-slate-900 rounded-lg">
            <p className="text-sm text-slate-400">Exchange Rate</p>
            <p className="mt-1 text-lg font-semibold text-white">
              1 {fromCurrency} = {(
                currencies.find((c) => c.code === toCurrency)?.rate /
                currencies.find((c) => c.code === fromCurrency)?.rate
              ).toFixed(4)}{' '}
              {toCurrency}
            </p>
          </div>
        </div>

        {/* Currency rates table */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Exchange Rates (vs USD)
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {currencies.map((currency) => (
              <div
                key={currency.code}
                className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{currency.symbol}</span>
                  <span className="text-sm font-semibold text-blue-500">
                    {currency.code}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-1">{currency.name}</p>
                <p className="text-xl font-bold text-white font-mono">
                  {currency.rate.toFixed(4)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Oil price in different currencies */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">
            WTI Crude Price in Different Currencies
          </h3>
          {prices.WTI?.price ? (
            <div className="space-y-3">
              {currencies.map((currency) => {
                const wtiUSD = prices.WTI.price;
                const convertedPrice = wtiUSD * currency.rate;
                return (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between p-4 bg-slate-900 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{currency.name}</p>
                      <p className="text-sm text-slate-400">{currency.code} per barrel</p>
                    </div>
                    {loading ? (
                      <div className="h-8 w-32 bg-slate-700 animate-pulse rounded" />
                    ) : (
                      <p className="text-2xl font-bold text-blue-500 font-mono">
                        {currency.symbol}
                        {convertedPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <p>Loading WTI price data...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CurrencyPage;
