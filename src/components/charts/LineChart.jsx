import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import { plotlyLayout } from '../../config/chart.config';

/**
 * Reusable Line Chart component using Plotly.js
 */
const LineChart = ({ data, title, xAxisLabel = 'Date', yAxisLabel = 'Value', color = '#3B82F6' }) => {
  const trace = {
    x: data.map(d => d.x),
    y: data.map(d => d.y),
    type: 'scatter',
    mode: 'lines',
    line: { color, width: 2 },
    hovertemplate: `<b>${yAxisLabel}</b>: %{y}<br><b>${xAxisLabel}</b>: %{x}<extra></extra>`,
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
      data={[trace]}
      layout={layout}
      config={config}
      className="w-full"
      style={{ height: '400px' }}
    />
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  color: PropTypes.string,
};

export default LineChart;
