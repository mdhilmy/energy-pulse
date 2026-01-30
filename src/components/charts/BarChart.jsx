import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import { plotlyLayout } from '../../config/chart.config';

/**
 * Bar Chart component using Plotly.js
 */
const BarChart = ({ data, title, xAxisLabel = 'Category', yAxisLabel = 'Value', color = '#3B82F6' }) => {
  const trace = {
    x: data.map(d => d.x),
    y: data.map(d => d.y),
    type: 'bar',
    marker: {
      color: data.map(d => d.color || color),
    },
    hovertemplate: `<b>%{x}</b><br>${yAxisLabel}: %{y}<extra></extra>`,
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

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      y: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  color: PropTypes.string,
};

export default BarChart;
