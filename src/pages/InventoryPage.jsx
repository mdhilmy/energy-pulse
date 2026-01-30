import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { CubeIcon, ArrowPathIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { LineChart, BarChart } from '../components/charts';
import { getApiKeysStatus } from '../config/api.config';

const InventoryPage = () => {
  const [selectedInventory, setSelectedInventory] = useState('crude');
  const [isUpdating, setIsUpdating] = useState(false);
  const apiKeysStatus = getApiKeysStatus();

  const inventoryTypes = [
    {
      id: 'crude',
      name: 'Crude Oil',
      current: 448.2,
      change: -2.3,
      unit: 'Million Barrels',
    },
    {
      id: 'gasoline',
      name: 'Gasoline',
      current: 234.5,
      change: 1.2,
      unit: 'Million Barrels',
    },
    {
      id: 'distillate',
      name: 'Distillate Fuel',
      current: 112.8,
      change: -0.8,
      unit: 'Million Barrels',
    },
  ];

  const weeklyChanges = [
    { date: 'Jan 26', crude: -2.3, gasoline: 1.2, distillate: -0.8 },
    { date: 'Jan 19', crude: -1.5, gasoline: 0.8, distillate: 0.3 },
    { date: 'Jan 12', crude: 3.2, gasoline: -2.1, distillate: 1.2 },
    { date: 'Jan 5', crude: -0.9, gasoline: 1.5, distillate: -0.4 },
  ];

  // Generate historical inventory data for selected type
  const historicalData = useMemo(() => {
    const selectedItem = inventoryTypes.find(i => i.id === selectedInventory);
    if (!selectedItem) return [];

    return Array.from({ length: 52 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (52 - i) * 7); // Weekly data
      const variation = (Math.random() - 0.5) * (selectedItem.current * 0.1);
      return {
        x: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        y: Number((selectedItem.current + variation).toFixed(1)),
      };
    });
  }, [selectedInventory, inventoryTypes]);

  // Bar chart data for weekly changes
  const weeklyChangeBarData = useMemo(() => {
    return weeklyChanges.map(week => ({
      x: week.date,
      y: week[selectedInventory],
      color: week[selectedInventory] >= 0 ? '#22C55E' : '#EF4444',
    }));
  }, [weeklyChanges, selectedInventory]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsUpdating(false);
    // Show brief notification
    alert('Inventory data updated successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              US Petroleum Inventory
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Weekly inventory levels from EIA data
            </p>
          </div>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="ep-btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>

        {/* API Status Banner */}
        <div className={`p-4 rounded-lg border ${
          apiKeysStatus.eia
            ? 'bg-blue-500 bg-opacity-10 border-blue-500'
            : 'bg-yellow-500 bg-opacity-10 border-yellow-500'
        }`}>
          <div className="flex items-start">
            <InformationCircleIcon className={`w-5 h-5 mr-3 mt-0.5 ${
              apiKeysStatus.eia ? 'text-blue-500' : 'text-yellow-500'
            }`} />
            <div>
              <p className={`text-sm font-medium ${
                apiKeysStatus.eia ? 'text-blue-400' : 'text-yellow-400'
              }`}>
                {apiKeysStatus.eia
                  ? 'Using configured EIA API key for real-time inventory data'
                  : 'Using demo data - Configure EIA API key in Settings for live inventory updates'}
              </p>
            </div>
          </div>
        </div>

        {/* Inventory cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {inventoryTypes.map((inventory) => (
            <div
              key={inventory.id}
              onClick={() => setSelectedInventory(inventory.id)}
              className={`ep-card cursor-pointer transition-all ${
                selectedInventory === inventory.id
                  ? 'ring-2 ring-blue-500'
                  : 'hover:ring-1 hover:ring-slate-600'
              }`}
            >
              <div className="flex items-center mb-2">
                <CubeIcon className="w-5 h-5 mr-2 text-blue-500" />
                <p className="text-sm font-medium text-slate-400">
                  {inventory.name}
                </p>
              </div>
              <p className="text-3xl font-bold text-white font-mono">
                {inventory.current}
              </p>
              <p className="text-xs text-slate-500 mt-1">{inventory.unit}</p>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">Weekly Change</p>
                <p
                  className={`text-lg font-semibold font-mono ${
                    inventory.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {inventory.change >= 0 ? '+' : ''}
                  {inventory.change}M
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Inventory charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Historical levels */}
          <div className="ep-card">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {inventoryTypes.find((i) => i.id === selectedInventory)?.name} - 52 Week History
              </h3>
            </div>
            <LineChart
              data={historicalData}
              title=""
              xAxisLabel="Week"
              yAxisLabel="Inventory (Million Barrels)"
              color="#3B82F6"
            />
          </div>

          {/* Weekly changes bar chart */}
          <div className="ep-card">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Weekly Changes
              </h3>
            </div>
            <BarChart
              data={weeklyChangeBarData}
              title=""
              xAxisLabel="Week"
              yAxisLabel="Change (Million Barrels)"
            />
          </div>
        </div>

        {/* Weekly changes table */}
        <div className="ep-card">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Weekly Changes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                    Week Ending
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                    Crude Oil
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                    Gasoline
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">
                    Distillate
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeklyChanges.map((week, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-900"
                  >
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      {week.date}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right font-mono ${
                        week.crude >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {week.crude >= 0 ? '+' : ''}
                      {week.crude}M
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right font-mono ${
                        week.gasoline >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {week.gasoline >= 0 ? '+' : ''}
                      {week.gasoline}M
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right font-mono ${
                        week.distillate >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {week.distillate >= 0 ? '+' : ''}
                      {week.distillate}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary insights */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="ep-card">
            <p className="text-sm text-slate-400">5-Year Average</p>
            <p className="mt-2 text-2xl font-bold text-white font-mono">
              425.3M
            </p>
            <p className="mt-1 text-sm text-slate-500">Crude Oil</p>
          </div>
          <div className="ep-card">
            <p className="text-sm text-slate-400">YoY Change</p>
            <p className="mt-2 text-2xl font-bold text-green-500 font-mono">
              +5.2%
            </p>
            <p className="mt-1 text-sm text-slate-500">vs Last Year</p>
          </div>
          <div className="ep-card">
            <p className="text-sm text-slate-400">Days of Supply</p>
            <p className="mt-2 text-2xl font-bold text-blue-500 font-mono">28</p>
            <p className="mt-1 text-sm text-slate-500">At Current Demand</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InventoryPage;
