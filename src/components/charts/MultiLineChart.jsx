import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import { plotlyLayout, commodityColors } from '../../config/chart.config';

/**
 * Multi-line chart for comparing multiple series
 */
const MultiLineChart = ({ series, title, xAxisLabel = 'Date', yAxisLabel = 'Value' }) => {
  const traces = series.map((s, index) => ({
    x: s.data.map(d => d.x),
    y: s.data.map(d => d.y),
    type: 'scatter',
    mode: 'lines',
    name: s.name,
    line: {
      color: s.color || Object.values(commodityColors)[index] || '#3B82F6',
      width: 2,
    },
    hovertemplate: `<b>${s.name}</b><br>%{y:.2f}<br>%{x}<extra></extra>`,
  }));

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
    showlegend: true,
    legend: {
      font: { color: '#94A3B8' },
      bgcolor: 'rgba(30, 41, 59, 0.8)',
      bordercolor: '#334155',
      borderwidth: 1,
    },
  };

  const config = {
    responsive: true,
    displayModeBar: false,
  };

  return (
    <Plot
      data={traces}
      layout={layout}
      config={config}
      className="w-full"
      style={{ height: '400px' }}
    />
  );
};

MultiLineChart.propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
          y: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
};

export default MultiLineChart;
