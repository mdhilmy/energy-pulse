import { COMMODITY_COLORS, THEME_COLORS } from './constants';

// Plotly.js Layout Defaults
export const plotlyLayoutDefaults = {
  paper_bgcolor: THEME_COLORS.bgCard,
  plot_bgcolor: THEME_COLORS.bgCard,
  font: {
    color: THEME_COLORS.textSecondary,
    family: 'Inter, system-ui, sans-serif',
    size: 12,
  },
  xaxis: {
    gridcolor: THEME_COLORS.gridLines,
    linecolor: THEME_COLORS.borders,
    showgrid: true,
    zeroline: false,
  },
  yaxis: {
    gridcolor: THEME_COLORS.gridLines,
    linecolor: THEME_COLORS.borders,
    showgrid: true,
    zeroline: false,
  },
  margin: { l: 60, r: 20, t: 50, b: 50 },
  hovermode: 'x unified',
  hoverlabel: {
    bgcolor: THEME_COLORS.bgPrimary,
    bordercolor: THEME_COLORS.borders,
    font: { color: THEME_COLORS.textPrimary },
  },
  showlegend: true,
  legend: {
    x: 0,
    y: 1,
    bgcolor: 'rgba(30, 41, 59, 0.8)',
    bordercolor: THEME_COLORS.borders,
    borderwidth: 1,
  },
};

// Plotly.js Config Defaults
export const plotlyConfigDefaults = {
  responsive: true,
  displayModeBar: true,
  displaylogo: false,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  toImageButtonOptions: {
    format: 'png',
    filename: 'energypulse_chart',
    height: 800,
    width: 1200,
    scale: 2,
  },
};

// Correlation Heatmap Colors
export const correlationColorScale = [
  [0, THEME_COLORS.negative],     // -1 (red)
  [0.5, THEME_COLORS.textSecondary], // 0 (gray)
  [1, THEME_COLORS.positive],     // +1 (green)
];

// Commodity Color Mapping
export const commodityColors = COMMODITY_COLORS;

// Chart.js Defaults (for sparklines and simple charts)
export const chartJsDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: THEME_COLORS.bgPrimary,
      titleColor: THEME_COLORS.textPrimary,
      bodyColor: THEME_COLORS.textSecondary,
      borderColor: THEME_COLORS.borders,
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      tension: 0.4,
      borderWidth: 2,
    },
  },
};

// Sparkline specific config
export const sparklineConfig = {
  ...chartJsDefaults,
  interaction: {
    intersect: false,
    mode: 'index',
  },
};

// Price chart trace template
export const priceChartTrace = (commodity, data) => ({
  x: data.map(d => d.date),
  y: data.map(d => d.value),
  type: 'scatter',
  mode: 'lines',
  name: commodity,
  line: {
    color: commodityColors[commodity],
    width: 2,
  },
  hovertemplate: '%{y:.2f}<extra></extra>',
});

// Moving average trace template
export const movingAverageTrace = (period, data, color) => ({
  x: data.map(d => d.date),
  y: data.map(d => d.value),
  type: 'scatter',
  mode: 'lines',
  name: `MA ${period}`,
  line: {
    color: color,
    width: 1,
    dash: 'dash',
  },
  opacity: 0.6,
  hovertemplate: '%{y:.2f}<extra></extra>',
});

// Candlestick chart config
export const candlestickTrace = (data) => ({
  x: data.map(d => d.date),
  open: data.map(d => d.open),
  high: data.map(d => d.high),
  low: data.map(d => d.low),
  close: data.map(d => d.close),
  type: 'candlestick',
  increasing: { line: { color: THEME_COLORS.positive } },
  decreasing: { line: { color: THEME_COLORS.negative } },
});

// Bar chart config
export const barChartTrace = (data, name, color) => ({
  x: data.map(d => d.date),
  y: data.map(d => d.value),
  type: 'bar',
  name: name,
  marker: {
    color: color,
  },
  hovertemplate: '%{y:.2f}<extra></extra>',
});

// Scatter plot config
export const scatterPlotTrace = (xData, yData, name) => ({
  x: xData,
  y: yData,
  type: 'scatter',
  mode: 'markers',
  name: name,
  marker: {
    size: 6,
    color: THEME_COLORS.accent,
    opacity: 0.6,
  },
  hovertemplate: 'X: %{x:.2f}<br>Y: %{y:.2f}<extra></extra>',
});

// Heatmap config
export const heatmapTrace = (z, x, y) => ({
  z: z,
  x: x,
  y: y,
  type: 'heatmap',
  colorscale: correlationColorScale,
  zmin: -1,
  zmax: 1,
  hovertemplate: '%{x} vs %{y}<br>Correlation: %{z:.2f}<extra></extra>',
  colorbar: {
    title: 'Correlation',
    titleside: 'right',
    tickmode: 'linear',
    tick0: -1,
    dtick: 0.5,
  },
});

// Shorter aliases for convenience
export const plotlyLayout = plotlyLayoutDefaults;
export const plotlyConfig = plotlyConfigDefaults;

export default {
  plotlyLayoutDefaults,
  plotlyConfigDefaults,
  chartJsDefaults,
  sparklineConfig,
  commodityColors,
  correlationColorScale,
  plotlyLayout,
  plotlyConfig,
};
