# EnergyPulse

> **Professional Energy Market Intelligence Platform**
> Real-time oil & gas market data, economic correlation analysis, and comprehensive reporting for energy professionals.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Table of Contents

- [Application Overview](#application-overview)
- [Page Documentation](#page-documentation)
- [API Integration & Configuration](#api-integration--configuration)
- [Data Refresh Strategy](#data-refresh-strategy)
- [Data Caching System](#data-caching-system)
- [Glossary](#glossary)

---

## Application Overview

### What is EnergyPulse?

**EnergyPulse** is a comprehensive web-based market intelligence platform designed for petroleum economists, commodity traders, energy analysts, and E&P finance teams. The application provides Bloomberg/Platts-quality insights at zero cost by leveraging free public APIs to deliver real-time and historical data on energy commodities, economic indicators, and US petroleum inventories.

### Key Features

- **Real-Time Price Tracking**: Monitor WTI Crude, Brent Crude, Henry Hub Natural Gas, and OPEC Basket prices with automatic updates
- **Multi-Currency Support**: View prices in USD, EUR, GBP, JPY with real-time conversion
- **Economic Correlation Analysis**: Analyze relationships between energy prices and economic indicators (GDP, CPI, Unemployment, Dollar Index, S&P 500, VIX)
- **US Petroleum Inventory Tracking**: Weekly inventory data for Crude Oil, Gasoline, and Distillate Fuel Oil
- **Interactive Visualizations**: Professional charts built with Plotly.js for publication-quality output
- **Currency Converter**: Convert energy commodity prices between 20+ major currencies
- **Customizable Settings**: User-configurable preferences including default currency, refresh intervals, and local caching
- **Offline Capability**: Local data caching enables basic functionality without internet connection
- **Responsive Design**: Fully functional on desktop, tablet, and mobile devices

### Technology Stack

- **Frontend**: React 18.x with Vite 5.x build system
- **Routing**: React Router DOM 6.x with HashRouter for static hosting compatibility
- **Styling**: Tailwind CSS 3.x with custom dark theme
- **Charts**: Plotly.js (primary) and Chart.js 4.x (secondary)
- **State Management**: React Context API with useReducer pattern
- **Data Fetching**: Axios 1.x with intelligent caching layer
- **Date Handling**: date-fns 3.x
- **Icons**: Heroicons 2.x
- **Deployment**: GitHub Pages (static hosting)

### Target Users

1. **Petroleum Economists** - Track commodity price trends and correlations with macroeconomic indicators
2. **Commodity Traders** - Monitor real-time prices, historical trends, and market volatility
3. **Energy Analysts** - Generate comprehensive reports with exportable data and visualizations
4. **E&P Finance Teams** - Analyze inventory levels, supply-demand dynamics, and price forecasts
5. **Researchers & Students** - Access free, high-quality energy market data for academic purposes

---

## Page Documentation

### 1. Dashboard (`/#/`)

**Purpose**: Provides a high-level overview of current market conditions with real-time updates.

#### Features & Components

**Price Cards (4 Commodities)**
- Displays current prices for WTI Crude, Brent Crude, Henry Hub Natural Gas, and OPEC Basket
- Shows 24-hour price change as percentage and absolute value
- Color-coded indicators: Green for positive change, Red for negative change
- Up/Down arrow icons for quick visual reference
- Prices displayed in user's selected currency (configurable in Settings)
- Real-time updates based on refresh interval preference

**7-Day Price Trends Chart**
- Multi-line chart comparing all 4 commodities over the past week
- Interactive legend to show/hide specific commodities
- Hover tooltips showing exact price at each data point
- Color scheme:
  - WTI: Blue (#3B82F6)
  - Brent: Violet (#8B5CF6)
  - Henry Hub: Orange (#F97316)
  - OPEC: Teal (#14B8A6)
- Responsive scaling for different screen sizes

**Market Summary Panel**
- **Total Market Cap**: Estimated total market capitalization
- **Daily Volume**: Trading volume in millions of barrels
- **Market Sentiment**: Bullish/Bearish indicator based on overall price trends

**Recent Market Events**
- Timeline of key market-moving events
- Includes OPEC+ announcements, inventory reports, and price milestones
- Updates automatically based on latest data

**Real-Time Clock**
- Displays current market time with second-level precision
- Useful for tracking trading hours and data updates

---

### 2. Price Tracker (`/#/prices`)

**Purpose**: Detailed price analysis and historical data visualization for individual commodities.

#### Features & Components

**Commodity Selection Cards**
- 4 clickable cards for WTI, Brent, Henry Hub, OPEC Basket
- Each card shows:
  - Commodity name
  - Current price in selected currency
  - Unit of measurement ($/bbl for oil, $/MMBtu for gas)
  - 24-hour percentage change with color coding
- Selected commodity highlighted with blue border

**Time Range Selector**
- **1D**: 24 hourly data points for intraday analysis
- **1W**: 7 daily data points for weekly trends
- **1M**: 30 daily data points for monthly analysis
- **3M**: 90 data points for quarterly trends
- **6M**: 180 data points for semi-annual analysis
- **1Y**: 365 data points for annual trends
- **ALL**: Complete historical dataset

**Interactive Price Chart**
- Line chart showing price evolution over selected time range
- Features:
  - Smooth line rendering for professional appearance
  - Hover tooltips with date and exact price
  - Auto-scaling Y-axis for optimal visualization
  - Grid lines for easier reading
  - Responsive design adapts to screen size
- Chart title shows commodity name and time range
- X-axis label: Date (formatted as "MMM DD")
- Y-axis label: Price with unit ($/bbl or $/MMBtu)

**Price Statistics Cards**
- **24h High**: Highest price in last 24 hours (green text)
- **24h Low**: Lowest price in last 24 hours (red text)
- **24h Volume**: Trading volume in millions of barrels (blue text)

**Refresh Button**
- Manual refresh trigger with loading animation
- Bypasses cache to fetch latest data
- Shows "Refreshing..." state with spinning icon

**API Status Banners**
- **EIA API Status**: Shows if real-time energy price data is available
- **OilPrice API Status**: Indicates enhanced data source availability
- Color coding:
  - Blue: API key configured, using live data
  - Yellow: No API key, using fallback/demo data

---

### 3. Economic Correlation (`/#/correlation`)

**Purpose**: Analyze statistical relationships between energy commodity prices and macroeconomic indicators.

#### Features & Components

**Variable Selection**
- **Commodity Selector**: Choose from WTI, Brent, Henry Hub, OPEC Basket
- **Economic Indicator Selector**: Choose from:
  - GDP (Gross Domestic Product)
  - CPI (Consumer Price Index)
  - Unemployment Rate
  - Dollar Index
  - S&P 500
  - VIX (Volatility Index)

**Scatter Plot Chart**
- Shows relationship between selected commodity and economic indicator
- Each point represents a monthly data point
- Features:
  - Trend line (linear regression)
  - Correlation coefficient displayed on chart
  - Hover tooltips with exact values
  - Color-coded points based on trend strength

**Correlation Strength Indicator**
- Displays Pearson correlation coefficient (r)
- Range: -1.0 to +1.0
- Interpretation scale:
  - **+0.8 to +1.0**: Very Strong Positive Correlation
  - **+0.6 to +0.8**: Strong Positive Correlation
  - **+0.4 to +0.6**: Moderate Positive Correlation
  - **+0.2 to +0.4**: Weak Positive Correlation
  - **-0.2 to +0.2**: No Correlation
  - **-0.4 to -0.2**: Weak Negative Correlation
  - **-0.6 to -0.4**: Moderate Negative Correlation
  - **-0.8 to -0.6**: Strong Negative Correlation
  - **-1.0 to -0.8**: Very Strong Negative Correlation

**12-Month Rolling Correlation Chart**
- Line chart showing how correlation evolves over time
- Uses 12-month rolling window for smoothing
- Helps identify changing market dynamics
- Horizontal reference line at r=0

**Methodology Explanation**
- Uses Pearson correlation coefficient formula
- Monthly data resampling for consistency
- Minimum 12 data points required for analysis
- Missing values handled via linear interpolation

---

### 4. US Petroleum Inventory (`/#/inventory`)

**Purpose**: Track weekly US petroleum inventory levels and changes from EIA data.

#### Features & Components

**Inventory Type Cards (3 Types)**
- **Crude Oil**
  - Current level in millions of barrels
  - Weekly change (green for build, red for draw)
  - Unit: Million Barrels

- **Gasoline**
  - Finished motor gasoline inventories
  - Weekly change indicator
  - Unit: Million Barrels

- **Distillate Fuel Oil**
  - Includes heating oil and diesel
  - Weekly change tracking
  - Unit: Million Barrels

- Clicking a card selects that inventory type for detailed view
- Selected card highlighted with blue ring

**52-Week Historical Chart**
- Line chart showing inventory levels over past year
- Weekly data points
- Shows seasonal patterns and trends
- Hover tooltips with exact values and dates
- Y-axis: Inventory in Million Barrels
- X-axis: Week dates

**Weekly Changes Bar Chart**
- Bar chart showing last 4 weeks of inventory changes
- Green bars: Inventory builds (positive changes)
- Red bars: Inventory draws (negative changes)
- Y-axis: Change in Million Barrels
- Useful for identifying recent trends

**Recent Weekly Changes Table**
- Tabular view of last 4 weeks
- Columns:
  - Week Ending (date)
  - Crude Oil change
  - Gasoline change
  - Distillate change
- All changes color-coded (green/red)
- Values shown with +/- sign and "M" suffix for millions

**Summary Insights Cards**
- **5-Year Average**: Historical benchmark for current inventory type
- **YoY Change**: Year-over-year percentage change
- **Days of Supply**: Current inventory ÷ average daily consumption

**Update Button**
- Manual update trigger
- Shows loading state during data fetch
- Success notification on completion

**EIA API Status Banner**
- Shows if using real-time EIA data or demo data
- Links to Settings page for API key configuration

**Update Schedule**
- EIA releases data weekly on Wednesdays at 10:30 AM ET
- Cache duration: 24 hours

---

### 5. Currency Converter (`/#/currency`)

**Purpose**: Convert energy commodity prices between major world currencies.

#### Features & Components

**Price Converter Tool**
- **Input Section (From)**:
  - Amount input field (numeric)
  - Currency selector dropdown
  - Supported currencies: USD, EUR, GBP, JPY, CAD, AUD, CNY, INR

- **Output Section (To)**:
  - Converted amount display (auto-calculated)
  - Currency selector dropdown
  - Large, prominent green text for easy reading

- **Swap Button**:
  - Quickly reverse conversion direction
  - Icon: Bidirectional arrows
  - Swaps both currency selections

**Exchange Rate Display**
- Shows current rate between selected currencies
- Format: "1 USD = X.XXXX EUR"
- Updates in real-time when currencies change

**Current Exchange Rates Table**
- Grid of 8 major currencies vs USD
- Each card shows:
  - Currency symbol
  - Currency code (USD, EUR, etc.)
  - Currency name
  - Current exchange rate (4 decimal places)
- Hover effect for better UX

**WTI Crude Price in Different Currencies**
- Table showing current WTI price converted to all supported currencies
- Two columns:
  - Currency name and code
  - Converted price with currency symbol
- Useful for international traders and analysts

**Data Source**
- Free currency API (no authentication required)
- Updates: Hourly
- Fallback rates available if API unavailable

---

### 6. Settings (`/#/settings`)

**Purpose**: Configure API keys and application preferences for personalized experience.

#### Features & Components

**API Keys Status Banner**
- Overall status indicator at top of page
- **Green Banner**: "Full Features Enabled" - All required keys configured
- **Yellow Banner**: "Limited Features Active" - Some keys missing
- Shows individual status for each API:
  - EIA API: Required
  - FRED API: Required
  - OilPrice API: Optional

**API Keys Configuration Section**

Each API service has its own configuration card:

**1. EIA (Energy Information Administration)**
- Label: "Required"
- Description: "Required for US energy data, inventories, and production statistics"
- Registration link: Direct link to EIA API key registration
- Input field: Password-masked for security
- Save button: Activates when key is entered
- Clear button: Removes saved key
- Status indicator: Green checkmark when configured

**2. FRED (Federal Reserve Economic Data)**
- Label: "Required"
- Description: "Required for economic indicators and correlation analysis"
- Registration link: Direct link to FRED API key registration
- Same input/save/clear functionality as EIA

**3. OilPrice API**
- Label: "Optional"
- Description: "Optional - provides additional real-time price data"
- Registration link: OilPrice API website
- Same input/save/clear functionality as above

**Clear All Keys Button**
- Red-colored button at top-right of API section
- Confirmation dialog before clearing
- Removes all saved API keys at once

**Application Preferences Section**

All preferences auto-save when changed and apply immediately across all pages:

**1. Default Currency**
- Dropdown selector
- Options: USD, EUR, GBP, JPY
- Affects price display on Dashboard and Prices pages
- Updates are instant (no page reload required)

**2. Data Refresh Interval**
- Dropdown selector
- Options:
  - **15 minutes**: High-frequency updates for active trading
  - **30 minutes**: Balanced frequency
  - **1 hour**: Low-frequency for casual monitoring
  - **Manual only**: No automatic refresh, user controls updates
- Controls how often cached data expires and triggers API calls

**3. Cache Data Locally**
- Toggle switch (On/Off)
- **On**: Stores API responses in browser localStorage
  - Reduces API calls
  - Enables offline viewing of cached data
  - Improves page load speed
- **Off**: Always fetches fresh data from APIs
  - Ensures latest data
  - Higher API usage
  - Requires internet connection

**About Section**
- Application version number
- Build type (Production/Development)
- Framework information (React 18 + Vite 5)
- Brief description of EnergyPulse

**How Preferences Work**
- All preferences stored in React Context API
- Changes propagate instantly to all components
- Persisted to localStorage for session continuity
- No page refresh needed for changes to take effect

---

## API Integration & Configuration

### Overview

EnergyPulse integrates with multiple free public APIs to provide comprehensive energy market data. The application is designed to work in three modes:

1. **Full Mode**: All API keys configured, access to real-time data
2. **Partial Mode**: Some API keys configured, mix of real-time and fallback data
3. **Demo Mode**: No API keys, uses fallback APIs and mock data for demonstration

### Required APIs

#### 1. EIA (Energy Information Administration) ⭐ **REQUIRED**

**Purpose**: Primary source for US energy data

**What EnergyPulse Uses**:
- WTI Crude Oil spot prices
- Brent Crude Oil spot prices
- Henry Hub Natural Gas prices
- US Crude Oil inventories (weekly)
- US Gasoline inventories (weekly)
- US Distillate Fuel Oil inventories (weekly)

**How to Get API Key**:
1. Visit: [https://www.eia.gov/opendata/register.php](https://www.eia.gov/opendata/register.php)
2. Fill out registration form (free, instant approval)
3. Receive API key via email immediately
4. Enter key in EnergyPulse Settings page

**Rate Limits**:
- ~100 requests per minute
- No daily/monthly limits
- Free forever

**Demo Behavior Without Key**:
- Falls back to DataHub.io for historical WTI/Brent prices
- Uses mock data for inventories
- Banner notification on affected pages

#### 2. FRED (Federal Reserve Economic Data) ⭐ **REQUIRED**

**Purpose**: Economic indicators for correlation analysis

**What EnergyPulse Uses**:
- GDP (Gross Domestic Product) - Series: `GDP`
- CPI (Consumer Price Index) - Series: `CPIAUCSL`
- Unemployment Rate - Series: `UNRATE`
- Dollar Index - Series: `DTWEXBGS`
- S&P 500 - Series: `SP500`
- VIX Volatility Index - Series: `VIXCLS`

**How to Get API Key**:
1. Visit: [https://fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Sign up for free FRED account
3. Request API key (instant approval)
4. Copy key to EnergyPulse Settings

**Rate Limits**:
- 120 requests per minute
- No daily/monthly limits
- Free forever

**Demo Behavior Without Key**:
- Falls back to World Bank API for some economic data
- Uses mock data for unavailable indicators
- Correlation page shows limited functionality

#### 3. OilPrice API (Optional)

**Purpose**: Additional real-time oil price data source

**What EnergyPulse Uses**:
- Latest oil prices (supplements EIA data)
- Real-time price updates

**How to Get API Key**:
1. Visit: [https://www.oilpriceapi.com/](https://www.oilpriceapi.com/)
2. Sign up for free tier (20 requests/hour, no credit card required)
3. Or select paid tier for higher limits
4. Enter key in Settings (optional)

**Rate Limits**:
- **Free (No Key)**: 20 requests per hour
- **Free Tier**: 1,000 requests per month
- **Paid Tiers**: Higher limits available

**Demo Behavior Without Key**:
- Uses EIA data only (still functional)
- No impact on core features

### Fallback Data Sources (No API Key Required)

When API keys are not configured, EnergyPulse automatically uses these free alternatives:

**1. DataHub.io**
- Open data for historical WTI and Brent prices
- Updated: Daily
- No authentication required
- URL: `https://datahub.io/core/oil-prices`

**2. Currency API**
- Real-time currency exchange rates
- 20+ currencies supported
- Updated: Hourly
- No authentication required
- URL: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`

**3. World Bank API**
- Global economic indicators
- Quarterly/Annual data
- No authentication required
- URL: `https://api.worldbank.org/v2/`

**4. Mock Data**
- Realistic simulated data for demonstration
- Used when all APIs unavailable
- Clearly labeled in UI

### Setting Up API Keys

#### Option 1: Through Settings Page (Recommended for Production)

1. Navigate to `/#/settings` in the application
2. Scroll to "API Keys Configuration" section
3. For each service (EIA, FRED, OilPrice):
   - Click on the password input field
   - Paste your API key
   - Click "Save" button
   - Wait for green checkmark confirmation
4. Keys are stored securely in browser localStorage
5. Keys persist across sessions

**Security Notes**:
- Keys stored client-side only (never sent to any server except the API provider)
- Keys never included in source code
- Each user must enter their own keys
- Use "Clear" button to remove a key
- Use "Clear All Keys" to reset all at once

#### Option 2: Environment Variables (Development Only)

For local development, create `.env.local` file in project root:

```env
VITE_EIA_API_KEY=your_eia_key_here
VITE_FRED_API_KEY=your_fred_key_here
VITE_OILPRICE_API_KEY=your_oilprice_key_here
```

**Important**:
- Environment variables only work in development mode
- Production builds (GitHub Pages) ignore environment variables
- Users must enter keys via Settings page in production

---

## Data Refresh Strategy

### Overview

EnergyPulse implements an intelligent data refresh system that balances real-time accuracy with API rate limit conservation and optimal performance.

### User-Configurable Refresh Intervals

Users can select their preferred refresh interval in Settings page:

#### 1. **15 Minutes** (Default for Active Trading)
- Cache expires every 15 minutes
- Suitable for: Day traders, active market monitoring
- API calls: ~96 calls per day per commodity
- Behavior:
  - Data fetched fresh every 15 minutes
  - User sees "Last updated: X minutes ago"
  - Automatic background refresh
  - Page loads use cache if less than 15 min old

#### 2. **30 Minutes** (Balanced)
- Cache expires every 30 minutes
- Suitable for: Regular market monitoring
- API calls: ~48 calls per day per commodity
- Behavior:
  - Data fetched every 30 minutes
  - Less aggressive than 15-minute mode
  - Good balance of freshness and API conservation

#### 3. **1 Hour** (Conservative)
- Cache expires every 60 minutes
- Suitable for: Casual monitoring, research
- API calls: ~24 calls per day per commodity
- Behavior:
  - Data fetched hourly
  - Minimal API usage
  - Suitable when rate limits are a concern

#### 4. **Manual Only** (On-Demand)
- Cache never expires automatically
- Suitable for: Limited API quota, offline usage
- API calls: Only when user clicks "Refresh" button
- Behavior:
  - Data fetched only when explicitly requested
  - Shows cached data age
  - Useful for preserving API quota
  - Ideal for demo mode or testing

### How Refresh Works

#### Automatic Refresh Flow

```
1. User navigates to page (e.g., Prices page)
2. Component checks cache timestamp
3. If (current_time - cache_time) > refresh_interval:
   - Fetch fresh data from API
   - Update cache with new data and timestamp
   - Display new data to user
4. Else:
   - Display cached data
   - Show "Last updated: X minutes ago"
```

#### Manual Refresh Flow

Every data-displaying page has a "Refresh" button:

```
1. User clicks "Refresh" button
2. Button shows loading spinner
3. Cache is bypassed
4. Fresh data fetched from API
5. Cache updated with new data
6. UI re-renders with new data
7. Success notification shown
8. Button returns to normal state
```

### Refresh Behavior by Page

#### Dashboard Page
- Refreshes: All 4 commodity prices
- Frequency: User's selected interval
- Manual: "Refresh" button in header
- Cache key: `CACHE_PRICE_{COMMODITY}`

#### Prices Page
- Refreshes: Selected commodity's historical data
- Frequency: User's selected interval
- Manual: "Refresh" button in header
- Cache key: `CACHE_HISTORICAL_{COMMODITY}_{TIMERANGE}`

#### Correlation Page
- Refreshes: Both commodity and economic indicator data
- Frequency: User's selected interval (applies to both datasets)
- Manual: "Refresh" button triggers both datasets
- Cache keys:
  - `CACHE_PRICE_{COMMODITY}`
  - `CACHE_ECONOMIC_DATA_{INDICATOR}`

#### Inventory Page
- Refreshes: All 3 inventory types (Crude, Gasoline, Distillate)
- Frequency: 24 hours (overrides user preference for inventory data)
- Reason: EIA publishes weekly, no need for frequent updates
- Manual: "Update" button available
- Cache key: `CACHE_INVENTORY_DATA_{TYPE}`

#### Currency Page
- Refreshes: Exchange rates
- Frequency: 1 hour (fixed, overrides user preference)
- Reason: Currency rates don't change frequently enough to warrant more
- Manual: Recalculates on-the-fly, no cache involved for conversions
- Cache key: `CACHE_CURRENCY_RATES_{BASE_CURRENCY}`

### Cache Expiration Logic

The application uses the following cache durations (defined in `src/config/constants.js`):

```javascript
CACHE_DURATION = {
  PRICES: 15 * 60 * 1000,        // 15 minutes (affected by user preference)
  HISTORICAL: 24 * 60 * 60 * 1000, // 24 hours (historical data changes infrequently)
  CURRENCY: 60 * 60 * 1000,      // 1 hour (fixed)
  INVENTORY: 24 * 60 * 60 * 1000  // 24 hours (weekly EIA updates)
}
```

**How User Preference Affects Cache**:
- User's refresh interval setting modifies `CACHE_DURATION.PRICES`
- Historical, Currency, and Inventory durations remain fixed
- Setting stored in Context API and localStorage

### Background Refresh

Currently, EnergyPulse uses **lazy refresh** (refresh on page visit):
- Data refreshes when user navigates to a page
- No background polling when page is inactive
- Reduces unnecessary API calls
- Preserves battery on mobile devices

Future versions may include:
- Optional background refresh for active monitoring
- WebSocket connections for real-time updates
- Push notifications for price alerts

---

## Data Caching System

### Overview

EnergyPulse implements a sophisticated client-side caching system using browser localStorage to:
- Reduce API calls and conserve rate limits
- Improve page load performance
- Enable offline functionality
- Provide instant data display while fetching updates

### How Caching Works

#### Cache Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Request                       │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│          Check localStorage Cache                    │
│  Key: CACHE_PRICE_WTI                               │
│  Value: { data: {...}, timestamp: 1234567890 }      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
          ┌───────────────┐
          │ Cache Valid?  │
          │ (timestamp <  │
          │  duration)    │
          └───┬───────┬───┘
              │       │
         Yes  │       │  No
              │       │
              ▼       ▼
    ┌─────────────┐ ┌──────────────┐
    │ Return      │ │ Fetch from   │
    │ Cached Data │ │ API          │
    └─────────────┘ └──────┬───────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Update Cache     │
                  │ with new data    │
                  │ and timestamp    │
                  └──────────────────┘
```

#### Cache Implementation

**Location**: Browser localStorage
**Format**: JSON strings
**Scope**: Per-browser (not shared across devices)

**Cache Entry Structure**:
```javascript
{
  data: {
    // Actual API response data
    price: 78.45,
    change: 2.3,
    // ... more fields
  },
  timestamp: 1706567890000,  // Unix timestamp in milliseconds
  expires: 1706568790000     // timestamp + cache duration
}
```

### Cache Keys

Each type of data uses a unique cache key:

#### Price Data
- **WTI**: `CACHE_PRICE_WTI`
- **Brent**: `CACHE_PRICE_BRENT`
- **Henry Hub**: `CACHE_PRICE_HENRY_HUB`
- **OPEC**: `CACHE_PRICE_OPEC`

#### Historical Data
- **WTI**: `CACHE_HISTORICAL_WTI_{TIMERANGE}`
  - Example: `CACHE_HISTORICAL_WTI_1M`
- **Brent**: `CACHE_HISTORICAL_BRENT_{TIMERANGE}`
- **Natural Gas**: `CACHE_HISTORICAL_NG_{TIMERANGE}`

#### Economic Data
- `CACHE_ECONOMIC_DATA_{INDICATOR}`
  - Example: `CACHE_ECONOMIC_DATA_GDP`

#### Currency Rates
- `CACHE_CURRENCY_RATES_{BASE_CURRENCY}`
  - Example: `CACHE_CURRENCY_RATES_USD`

#### Inventory Data
- `CACHE_INVENTORY_DATA_{TYPE}`
  - Example: `CACHE_INVENTORY_DATA_CRUDE`

### Cache Durations

Different data types have different cache durations based on update frequency:

| Data Type | Duration | Reason |
|-----------|----------|--------|
| **Current Prices** | 15 min | User configurable, real-time trading data |
| **Historical Data** | 24 hours | Historical data doesn't change |
| **Currency Rates** | 1 hour | Rates change slowly throughout day |
| **Inventory Data** | 24 hours | EIA updates weekly (Wednesday) |
| **Economic Data** | 24 hours | FRED data updates monthly/quarterly |

### Cache Management Functions

#### getCachedData(cacheKey)
```javascript
/**
 * Retrieve cached data if still valid
 * @param {string} cacheKey - Unique identifier for cached data
 * @returns {Object|null} - Cached data or null if expired/missing
 */
export const getCachedData = (cacheKey) => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, timestamp, expires } = JSON.parse(cached);
    const now = Date.now();

    if (now > expires) {
      // Cache expired, remove it
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};
```

#### setCachedData(cacheKey, data, duration)
```javascript
/**
 * Store data in cache with expiration
 * @param {string} cacheKey - Unique identifier
 * @param {Object} data - Data to cache
 * @param {number} duration - Cache lifetime in milliseconds
 */
export const setCachedData = (cacheKey, data, duration) => {
  try {
    const now = Date.now();
    const cacheEntry = {
      data,
      timestamp: now,
      expires: now + duration
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};
```

#### clearCache()
```javascript
/**
 * Clear all EnergyPulse cache entries
 */
export const clearCache = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('CACHE_')) {
      localStorage.removeItem(key);
    }
  });
};
```

### User Control

Users can control caching behavior via Settings page:

#### "Cache Data Locally" Toggle

**When ON** (Default):
- All API responses cached according to durations above
- Faster page loads
- Reduced API calls
- Offline viewing of previously loaded data
- localStorage usage: ~1-5 MB depending on data

**When OFF**:
- No caching (except user preferences)
- Always fetches fresh data from APIs
- Higher API usage
- Requires constant internet connection
- Useful for debugging or ensuring absolute latest data

### Benefits of Caching

#### 1. **Performance**
- Instant page loads for cached data
- No waiting for API responses
- Smooth user experience

#### 2. **API Rate Limit Management**
- Drastically reduces API calls
- Example: With 15-min refresh, WTI price cached:
  - Without cache: 96 API calls per day
  - With cache: ~96 API calls per day BUT spread out evenly
  - Multiple page visits use same cached data

#### 3. **Offline Capability**
- Users can view previously loaded data without internet
- Charts, prices, and analysis remain accessible
- Only fresh data fetching requires connection

#### 4. **Cost Savings**
- For paid API tiers, reduces usage
- Free tiers have lower limits, caching helps stay within them

### Cache Invalidation

Cache is invalidated (cleared) when:
1. **Time expires**: Automatic based on cache duration
2. **User clicks Refresh**: Manual cache bypass
3. **User changes preference**: E.g., switching currency invalidates price cache
4. **API error**: Failed requests don't update cache, old data remains
5. **User clears browser data**: Manual localStorage clear

### localStorage Limits

**Browser Limits**:
- Most browsers: 5-10 MB per domain
- EnergyPulse typical usage: 1-3 MB
- Includes: Cached API responses + user preferences + API keys

**Handling Quota Exceeded**:
```javascript
try {
  localStorage.setItem(key, value);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // Clear old cache entries
    clearExpiredCache();
    // Retry
    localStorage.setItem(key, value);
  }
}
```

### Privacy & Security

**What's Stored**:
- API responses (public data)
- User preferences (currency, refresh interval)
- API keys (user-provided credentials)

**What's NOT Stored**:
- Personal information
- Browsing history
- Passwords (besides API keys)

**Security Measures**:
- API keys stored separately from cache
- Keys never logged to console (except in dev mode)
- Cache can be cleared from Settings page
- No transmission of keys to any server except API providers

---

## Glossary

### Commodities & Units

**WTI (West Texas Intermediate)**
- US crude oil benchmark
- Light, sweet crude oil
- Measured in $/barrel ($/bbl)
- Traded on NYMEX

**Brent Crude**
- International crude oil benchmark
- Extracted from North Sea
- Measured in $/barrel ($/bbl)
- Traded on ICE

**Henry Hub Natural Gas**
- US natural gas benchmark
- Delivery point: Louisiana
- Measured in $/Million British Thermal Units ($/MMBtu)
- Traded on NYMEX

**OPEC Basket**
- Weighted average of crude oils from OPEC member countries
- Measured in $/barrel ($/bbl)
- Reference price for OPEC production decisions

**Barrel (bbl)**
- Standard oil volume unit = 42 US gallons = 159 liters

**Million Barrels (M bbl or MMbbl)**
- 1 million barrels = 42 million gallons

**MMBtu (Million British Thermal Units)**
- Energy unit for natural gas
- 1 MMBtu ≈ 1,000 cubic feet of natural gas

### Inventory Terms

**Inventory Build**
- Increase in stored petroleum products
- Indicates supply > demand
- Typically bearish for prices
- Shown in green on charts

**Inventory Draw**
- Decrease in stored petroleum products
- Indicates demand > supply
- Typically bullish for prices
- Shown in red on charts

**Days of Supply**
- Current inventory ÷ average daily consumption
- Example: 448M barrels ÷ 16M barrels/day = 28 days
- Indicates how long current stocks would last

**Strategic Petroleum Reserve (SPR)**
- US emergency crude oil stockpile
- Not included in commercial inventory data
- Located in underground salt caverns

**Cushing, Oklahoma**
- Major US oil storage hub
- Delivery point for WTI futures
- Key inventory location

### Economic Indicators

**GDP (Gross Domestic Product)**
- Total value of goods and services produced
- Measured quarterly
- Higher GDP often correlates with higher energy demand

**CPI (Consumer Price Index)**
- Measures inflation in consumer goods
- Includes energy prices
- Monthly data from Bureau of Labor Statistics

**Unemployment Rate**
- Percentage of labor force without jobs
- Economic health indicator
- Affects consumer demand for energy

**Dollar Index (DXY)**
- Measures USD strength vs basket of currencies
- Inverse relationship with commodity prices
- Higher dollar = typically lower oil prices

**S&P 500**
- Stock market index of 500 large US companies
- Risk sentiment indicator
- Correlation with oil varies by market conditions

**VIX (Volatility Index)**
- Measures stock market volatility
- Known as "fear index"
- High VIX often correlates with oil price swings

### Statistical Terms

**Pearson Correlation Coefficient (r)**
- Measures linear relationship between two variables
- Range: -1.0 (perfect negative) to +1.0 (perfect positive)
- 0 indicates no linear relationship

**Linear Regression**
- Statistical method to model relationship between variables
- Produces trend line: y = mx + b
- Used in scatter plots

**Rolling Window**
- Moving subset of time series data
- Example: 12-month rolling correlation uses last 12 months
- Smooths out short-term fluctuations

**Time Series**
- Data points ordered by time
- Used for price charts and historical analysis
- Can show trends, seasonality, cycles

**YoY (Year-over-Year)**
- Comparison to same period last year
- Example: Jan 2026 inventory vs Jan 2025
- Removes seasonal effects

**Volatility**
- Measure of price variation over time
- High volatility = large price swings
- Important for risk assessment

### Pricing Terms

**Spot Price**
- Current market price for immediate delivery
- As opposed to futures price
- Used in EnergyPulse price displays

**Futures Contract**
- Agreement to buy/sell commodity at future date
- Traded on exchanges (NYMEX, ICE)
- Different from spot price

**Spread**
- Price difference between two related commodities
- Example: WTI-Brent spread
- Indicates market dynamics

**Bullish**
- Expectation of rising prices
- Positive market sentiment
- Opposite of bearish

**Bearish**
- Expectation of falling prices
- Negative market sentiment
- Opposite of bullish

**Backwardation**
- Futures price < spot price
- Indicates strong current demand
- Typical in tight supply conditions

**Contango**
- Futures price > spot price
- Indicates weak current demand
- Typical in oversupply conditions

---

### Environment Setup (Optional for Development)

Create `.env.local`:

```env
VITE_EIA_API_KEY=your_eia_key
VITE_FRED_API_KEY=your_fred_key
VITE_OILPRICE_API_KEY=your_oilprice_key
```

---

## Support & Contributing

**Issues**: [GitHub Issues](https://github.com/mdhilmy/energy-pulse/issues)

**License**: MIT

---

**Built for energy professionals worldwide**

© 2026 EnergyPulse
