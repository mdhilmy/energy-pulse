import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import {
  Cog6ToothIcon,
  KeyIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  getApiKey,
  setApiKey,
  getApiKeysStatus,
  clearAllApiKeys,
} from '../config/api.config';
import { useApp } from '../context/AppContext';

const SettingsPage = () => {
  const { settings, updateSettings } = useApp();

  const [apiKeys, setApiKeys] = useState({
    eia: '',
    fred: '',
    oilprice: '',
  });

  const [apiKeysStatus, setApiKeysStatus] = useState({
    eia: false,
    fred: false,
    oilprice: false,
  });

  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    // Load existing API keys from localStorage
    setApiKeys({
      eia: getApiKey('eia') || '',
      fred: getApiKey('fred') || '',
      oilprice: getApiKey('oilprice') || '',
    });

    // Load status
    setApiKeysStatus(getApiKeysStatus());
  }, []);

  const handleInputChange = (service, value) => {
    setApiKeys((prev) => ({
      ...prev,
      [service]: value,
    }));
  };

  const handleSaveKey = (service) => {
    setApiKey(service, apiKeys[service]);
    setApiKeysStatus(getApiKeysStatus());
    setSaveStatus({ service, success: true });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleClearKey = (service) => {
    setApiKey(service, '');
    setApiKeys((prev) => ({
      ...prev,
      [service]: '',
    }));
    setApiKeysStatus(getApiKeysStatus());
    setSaveStatus({ service, success: false });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleClearAll = () => {
    if (
      confirm(
        'Are you sure you want to clear all API keys? This will disable full features.'
      )
    ) {
      clearAllApiKeys();
      setApiKeys({
        eia: '',
        fred: '',
        oilprice: '',
      });
      setApiKeysStatus(getApiKeysStatus());
      setSaveStatus({ service: 'all', success: false });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // Handle preference changes
  const handlePreferenceChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  const apiServices = [
    {
      id: 'eia',
      name: 'EIA (Energy Information Administration)',
      description: 'Required for US energy data, inventories, and production statistics',
      url: 'https://www.eia.gov/opendata/register.php',
      required: true,
    },
    {
      id: 'fred',
      name: 'FRED (Federal Reserve Economic Data)',
      description: 'Required for economic indicators and correlation analysis',
      url: 'https://fred.stlouisfed.org/docs/api/api_key.html',
      required: true,
    },
    {
      id: 'oilprice',
      name: 'OilPrice API',
      description: 'Optional - provides additional real-time price data',
      url: 'https://www.oilpriceapi.com/',
      required: false,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure API keys and application preferences
          </p>
        </div>

        {/* API Keys status banner */}
        <div
          className={`p-4 rounded-lg border ${
            apiKeysStatus.eia && apiKeysStatus.fred
              ? 'bg-green-500 bg-opacity-10 border-green-500'
              : 'bg-yellow-500 bg-opacity-10 border-yellow-500'
          }`}
        >
          <div className="flex items-start">
            {apiKeysStatus.eia && apiKeysStatus.fred ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircleIcon className="w-6 h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p
                className={`font-semibold ${
                  apiKeysStatus.eia && apiKeysStatus.fred
                    ? 'text-green-500'
                    : 'text-yellow-500'
                }`}
              >
                {apiKeysStatus.eia && apiKeysStatus.fred
                  ? 'Full Features Enabled'
                  : 'Limited Features Active'}
              </p>
              <p className="text-sm text-slate-300 mt-1">
                {apiKeysStatus.eia && apiKeysStatus.fred
                  ? 'All required API keys are configured. You have access to all features.'
                  : 'Some API keys are not configured. The app will use demo data for missing keys.'}
              </p>
              {/* Show specific API key status */}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-slate-400">
                  <span className={apiKeysStatus.eia ? 'text-green-400' : 'text-yellow-400'}>
                    • EIA API: {apiKeysStatus.eia ? 'Configured' : 'Not configured (Required)'}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  <span className={apiKeysStatus.fred ? 'text-green-400' : 'text-yellow-400'}>
                    • FRED API: {apiKeysStatus.fred ? 'Configured' : 'Not configured (Required)'}
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  <span className={apiKeysStatus.oilprice ? 'text-blue-400' : 'text-slate-500'}>
                    • OilPrice API: {apiKeysStatus.oilprice ? 'Configured' : 'Not configured (Optional)'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys configuration */}
        <div className="ep-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <KeyIcon className="w-5 h-5 mr-2 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">
                API Keys Configuration
              </h3>
            </div>
            {(apiKeysStatus.eia || apiKeysStatus.fred || apiKeysStatus.oilprice) && (
              <button
                onClick={handleClearAll}
                className="ep-btn-secondary flex items-center text-red-500 border-red-500 hover:bg-red-500 hover:bg-opacity-10"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Clear All Keys
              </button>
            )}
          </div>

          <div className="space-y-6">
            {apiServices.map((service) => (
              <div
                key={service.id}
                className="p-4 bg-slate-900 rounded-lg border border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-semibold text-white">
                        {service.name}
                      </h4>
                      {service.required && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded">
                          Required
                        </span>
                      )}
                      {apiKeysStatus[service.id] && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {service.description}
                    </p>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:text-blue-400 mt-2 inline-block"
                    >
                      Get API Key →
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeys[service.id]}
                    onChange={(e) =>
                      handleInputChange(service.id, e.target.value)
                    }
                    placeholder={`Enter ${service.name} API key`}
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSaveKey(service.id)}
                    disabled={!apiKeys[service.id]}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      apiKeys[service.id]
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Save
                  </button>
                  {apiKeysStatus[service.id] && (
                    <button
                      onClick={() => handleClearKey(service.id)}
                      className="px-4 py-2 bg-red-500 bg-opacity-10 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {saveStatus?.service === service.id && (
                  <p
                    className={`mt-2 text-sm ${
                      saveStatus.success ? 'text-green-500' : 'text-yellow-500'
                    }`}
                  >
                    {saveStatus.success
                      ? 'API key saved successfully!'
                      : 'API key cleared.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Application preferences */}
        <div className="ep-card">
          <div className="flex items-center mb-6">
            <Cog6ToothIcon className="w-5 h-5 mr-2 text-blue-500" />
            <h3 className="text-lg font-semibold text-white">
              Application Preferences
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium text-white">Default Currency</p>
                <p className="text-sm text-slate-400">
                  Currency for price display
                </p>
              </div>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => handlePreferenceChange('defaultCurrency', e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium text-white">Data Refresh Interval</p>
                <p className="text-sm text-slate-400">
                  How often to update prices
                </p>
              </div>
              <select
                value={settings.refreshInterval}
                onChange={(e) => handlePreferenceChange('refreshInterval', e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>Manual only</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div>
                <p className="font-medium text-white">Cache Data Locally</p>
                <p className="text-sm text-slate-400">
                  Reduce API calls by caching
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.cacheDataLocally}
                  onChange={(e) => handlePreferenceChange('cacheDataLocally', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* About section */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">About</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <span className="text-slate-400">Version:</span> 1.0.0
            </p>
            <p>
              <span className="text-slate-400">Build:</span> Production
            </p>
            <p>
              <span className="text-slate-400">Framework:</span> React 18 + Vite
              5
            </p>
            <p className="mt-4 text-slate-400">
              EnergyPulse provides professional energy market intelligence using
              free public APIs. All data is fetched client-side and cached
              locally.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
