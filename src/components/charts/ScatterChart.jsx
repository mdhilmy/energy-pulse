import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import { plotlyLayout } from '../../config/chart.config';

/**
 * Scatter Chart component for correlation analysis
 */
const ScatterChart = ({ data, title, xAxisLabel = 'X', yAxisLabel = 'Y', color = '#3B82F6' }) => {
  const trace = {
    x: data.map(d => d.x),
    y: data.map(d => d.y),
    type: 'scatter',
    mode: 'markers',
    marker: {
      color,
      size: 8,
      opacity: 0.7,
    },
    hovertemplate: `<b>${xAxisLabel}</b>: %{x}<br><b>${yAxisLabel}</b>: %{y}<extra></extra>`,
  };

  // Add trend line
  const xValues = data.map(d => d.x);
  const yValues = data.map(d => d.y);
  const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
  const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;

  const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (yValues[i] - yMean), 0);
  const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  const trendLine = {
    x: [Math.min(...xValues), Math.max(...xValues)],
    y: [slope * Math.min(...xValues) + intercept, slope * Math.max(...xValues) + intercept],
    type: 'scatter',
    mode: 'lines',
    line: { color: '#EF4444', width: 2, dash: 'dash' },
    name: 'Trend Line',
    hoverinfo: 'skip',
  };

  const layout = {
    ...plotlyLayout,
    title: {
      text: title,
      font: { color: '#F8FAFC', size: 16 },
    },
    xaxis: {
      ...plotlyLayout.xaxis,
      title: { text: xAxisLabel, font: { color: '#94A3B8' } },
    },
    yaxis: {
      ...plotlyLayout.yaxis,
      title: { text: yAxisLabel, font: { color: '#94A3B8' } },
    },
    showlegend: false,
  };

  const config = {
    responsive: true,
    displayModeBar: false,
  };

  return (
    <Plot
      data={[trace, trendLine]}
      layout={layout}
      config={config}
      className="w-full"
      style={{ height: '300px' }}
    />
  );
};

ScatterChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  color: PropTypes.string,
};

export default ScatterChart;
