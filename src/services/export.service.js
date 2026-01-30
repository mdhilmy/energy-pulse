import { formatDate } from '../utils/dateUtils';
import { formatPrice } from '../utils/formatters';

/**
 * Export data to CSV format
 * @param {Array} data - Data array
 * @param {string} filename - Filename without extension
 * @param {Array} columns - Column definitions
 * @returns {void} Downloads CSV file
 */
export const exportToCSV = (data, filename = 'export', columns = null) => {
  if (!data || data.length === 0) {
    console.warn('[Export] No data to export');
    return;
  }

  try {
    // Determine columns
    const cols = columns || Object.keys(data[0]);

    // Create CSV header
    const header = cols.join(',');

    // Create CSV rows
    const rows = data.map(row => {
      return cols.map(col => {
        const value = row[col];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',');
    });

    // Combine header and rows
    const csvContent = [header, ...rows].join('\n');

    // Create and download file
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  } catch (error) {
    console.error('[Export] Error exporting to CSV:', error);
  }
};

/**
 * Export chart data to CSV
 * @param {Array} data - Chart data array [{date, value}]
 * @param {string} commodity - Commodity name
 * @returns {void} Downloads CSV file
 */
export const exportChartToCSV = (data, commodity = 'price') => {
  const formattedData = data.map(item => ({
    Date: item.date,
    Value: item.value,
  }));

  const filename = `${commodity}_${formatDate(new Date(), 'yyyy-MM-dd')}`;
  exportToCSV(formattedData, filename);
};

/**
 * Export correlation matrix to CSV
 * @param {Object} matrix - Correlation matrix {labels, values}
 * @param {string} filename - Filename
 * @returns {void} Downloads CSV file
 */
export const exportCorrelationMatrixToCSV = (matrix, filename = 'correlation_matrix') => {
  if (!matrix || !matrix.labels || !matrix.values) {
    console.warn('[Export] Invalid correlation matrix');
    return;
  }

  try {
    const { labels, values } = matrix;

    // Create header row with labels
    const header = ['', ...labels].join(',');

    // Create data rows
    const rows = values.map((row, i) => {
      return [labels[i], ...row.map(v => v.toFixed(2))].join(',');
    });

    const csvContent = [header, ...rows].join('\n');
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  } catch (error) {
    console.error('[Export] Error exporting correlation matrix:', error);
  }
};

/**
 * Export price summary report
 * @param {Object} summary - Price summary data
 * @param {string} commodity - Commodity name
 * @returns {void} Downloads CSV file
 */
export const exportPriceSummary = (summary, commodity = 'Energy') => {
  const data = [
    { Metric: 'Current Price', Value: formatPrice(summary.current) },
    { Metric: 'Previous Close', Value: formatPrice(summary.previousClose) },
    { Metric: 'Change', Value: summary.change },
    { Metric: 'Change %', Value: `${summary.changePercent}%` },
    { Metric: '52-Week High', Value: formatPrice(summary.high52Week) },
    { Metric: '52-Week Low', Value: formatPrice(summary.low52Week) },
    { Metric: 'Average', Value: formatPrice(summary.average) },
    { Metric: 'Volatility', Value: `${summary.volatility}%` },
  ];

  const filename = `${commodity}_summary_${formatDate(new Date(), 'yyyy-MM-dd')}`;
  exportToCSV(data, filename);
};

/**
 * Export chart as image (PNG)
 * Note: This requires plotly.js toImage function
 * @param {Object} plotlyChart - Plotly chart element
 * @param {string} filename - Filename
 * @returns {Promise<void>} Downloads PNG file
 */
export const exportChartToPNG = async (plotlyChart, filename = 'chart') => {
  try {
    // This function assumes plotly.js is being used
    // Plotly provides toImage function to export charts
    console.log('[Export] Chart PNG export requested');

    // Implementation would use Plotly.toImage or Plotly.downloadImage
    // For now, we'll log a message
    console.warn('[Export] PNG export requires plotly.js toImage function');

    // Example implementation if plotly is available:
    // const Plotly = await import('plotly.js');
    // await Plotly.downloadImage(plotlyChart, {
    //   format: 'png',
    //   filename: filename,
    //   height: 800,
    //   width: 1200,
    // });
  } catch (error) {
    console.error('[Export] Error exporting chart to PNG:', error);
  }
};

/**
 * Download file helper
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 * @returns {void} Triggers download
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Generate report from multiple data sources
 * @param {Object} reportData - Report data object
 * @param {string} reportType - Report type (daily, weekly, custom)
 * @returns {void} Downloads report CSV
 */
export const generateReport = (reportData, reportType = 'custom') => {
  try {
    const sections = [];

    // Add header
    sections.push(['EnergyPulse Market Report']);
    sections.push([`Generated: ${formatDate(new Date(), 'MMM d, yyyy h:mm a')}`]);
    sections.push([`Report Type: ${reportType.toUpperCase()}`]);
    sections.push(['']);

    // Add each data section
    if (reportData.prices) {
      sections.push(['=== CURRENT PRICES ===']);
      reportData.prices.forEach(item => {
        sections.push([item.commodity, formatPrice(item.price), item.change]);
      });
      sections.push(['']);
    }

    if (reportData.summary) {
      sections.push(['=== MARKET SUMMARY ===']);
      Object.keys(reportData.summary).forEach(key => {
        sections.push([key, reportData.summary[key]]);
      });
      sections.push(['']);
    }

    if (reportData.historical) {
      sections.push(['=== HISTORICAL DATA ===']);
      sections.push(['Date', 'WTI', 'Brent', 'Henry Hub']);
      reportData.historical.forEach(row => {
        sections.push([row.date, row.wti, row.brent, row.henryHub]);
      });
    }

    // Convert to CSV
    const csvContent = sections.map(row => row.join(',')).join('\n');

    const filename = `energypulse_report_${reportType}_${formatDate(new Date(), 'yyyy-MM-dd')}`;
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  } catch (error) {
    console.error('[Export] Error generating report:', error);
  }
};

export default {
  exportToCSV,
  exportChartToCSV,
  exportCorrelationMatrixToCSV,
  exportPriceSummary,
  exportChartToPNG,
  generateReport,
};
