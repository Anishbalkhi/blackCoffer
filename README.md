# Blackcoffer Analytics Dashboard

A full-stack **MERN** analytics dashboard that visualises **1,000+ business insight records** across topics, sectors, regions, and countries - with 7 interactive charts and a powerful filter system.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MongoDB Atlas + Mongoose |
| Backend | Node.js 18 + Express 4 |
| Frontend | React 19 + Vite 8 |
| Charts (standard) | Chart.js 4 + react-chartjs-2 |
| Chart (heatmap) | D3.js v7 |
| Multi-select filters | react-select 5 |
| HTTP client | Axios |
| Styling | Vanilla CSS (design-token-based) |
| Dev runner | concurrently |

---

## Project Structure

```
blackCoffer/
├── server/                         # Express API server
│   ├── config/
│   │   └── db.js                   # MongoDB connection helper
│   ├── controllers/
│   │   └── dataController.js       # getInsightRecords / getFilterOptions / getAggregateMetrics
│   ├── models/
│   │   └── Insight.js              # Mongoose schema + indexes
│   ├── routes/
│   │   └── dataRoutes.js           # /api/data  /api/filters  /api/stats
│   ├── seed.js                     # One-time data import script
│   ├── server.js                   # Express app entry point
│   ├── .env.example                # Template -- copy to .env and fill MONGO_URI
│   └── package.json
│
├── client/                         # Vite + React frontend
│   └── src/
│       ├── App.jsx                 # Root: filter state + parallel data fetching
│       ├── main.jsx                # React DOM entry point
│       ├── index.css               # Global design-system styles
│       ├── features/
│       │   ├── charts/
│       │   │   ├── TopicIntensityRanking.jsx   # Horiz bar  -- top 10 topics by avg intensity
│       │   │   ├── YearlyLikelihoodTrend.jsx   # Line+fill  -- avg likelihood by start year
│       │   │   ├── RegionRelevanceRadar.jsx    # Radar      -- avg relevance per region
│       │   │   ├── CountryFrequencyMap.jsx     # Horiz bar  -- top 15 countries by count
│       │   │   ├── SectorVolumeChart.jsx       # Polar area -- record count per sector
│       │   │   ├── MetricCorrelationBubble.jsx # Bubble     -- intensity x likelihood, size=relevance
│       │   │   └── InsightDensityHeatmap.jsx   # D3 heatmap -- intensity per topic x likelihood bucket
│       │   ├── filters/
│       │   │   └── FilterPanel.jsx             # Slide-in filter drawer (react-select)
│       │   └── overview/
│       │       └── MetricsSummary.jsx          # 6-KPI summary cards
│       ├── hooks/
│       │   └── useInsightFilters.js            # Filter state management hook
│       ├── layout/
│       │   └── AppShell.jsx                    # Top-nav + 3-column chart grid
│       └── services/
│           └── insightApi.js                   # Axios wrappers for all API calls
│
├── jsondata.json                   # Source dataset (1,000 records)
├── package.json                    # Root scripts: dev, seed, install:all, build
├── .gitignore
└── README.md
```

---

## Setup & Run

### Prerequisites

- **Node.js >= 18**
- **MongoDB Atlas** account (free tier works) -- or a local MongoDB instance

### 1. Clone & Install

```bash
git clone https://github.com/Anishbalkhi/blackCoffer.git
cd blackCoffer

# Install root + server + client dependencies in one step
npm run install:all
```

### 2. Configure Environment

**Server** -- copy the template and fill in your credentials:

```bash
# Linux / macOS
cp server/.env.example server/.env

# Windows (PowerShell)
Copy-Item server/.env.example server/.env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/blackcoffer?retryWrites=true&w=majority
PORT=5000
```

**Client** -- `client/.env` is pre-configured to point to `http://localhost:5000/api`. Only change this if your API runs on a different port.

### 3. Seed the Database

```bash
npm run seed
# Inserted 1000 records into MongoDB
```

> The seed script reads `jsondata.json`, normalises empty strings to `null` for numeric fields, clears existing records, and bulk-inserts all 1,000 entries.

### 4. Start Development Servers

```bash
# Both servers concurrently (recommended)
npm run dev

# -- or run separately --

# Terminal 1 -- API server  ->  http://localhost:5000
cd server && npm run dev

# Terminal 2 -- React app   ->  http://localhost:5173
cd client && npm run dev
```

### 5. Production Build

```bash
npm run build    # outputs to client/dist/
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### `GET /api/health`

Health check.

```json
{ "success": true, "message": "Blackcoffer API is running", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

### `GET /api/filters`

Returns distinct, sorted, non-empty values for every filter dropdown.

```json
{
  "success": true,
  "filters": {
    "end_years": [2017, 2018, 2019, 2020, 2021, 2025],
    "topics":    ["battery", "coal", "gas", "oil", "..."],
    "sectors":   ["Energy", "Environment", "Government", "..."],
    "regions":   ["Africa", "Central America", "Northern America", "..."],
    "pestles":   ["Economic", "Industries", "Political", "..."],
    "sources":   ["EIA", "Reuters", "..."],
    "swots":     ["Strengths", "Weaknesses", "..."],
    "countries": ["India", "United States of America", "..."],
    "cities":    ["..."]
  }
}
```

---

### `GET /api/data`

Returns filtered insight records.

**Query parameters** (all optional; multi-select values are comma-separated):

| Param | Example |
|-------|---------|
| `topic` | `topic=gas,oil` |
| `sector` | `sector=Energy` |
| `region` | `region=Northern America` |
| `pestle` | `pestle=Industries` |
| `source` | `source=EIA` |
| `country` | `country=United States of America` |
| `endYear` | `endYear=2020` |

```json
{ "success": true, "count": 87, "data": [ { "_id": "...", "topic": "gas", "intensity": 6, "..." } ] }
```

---

### `GET /api/stats`

Aggregate KPI metrics -- supports the same filter params as `/api/data`.

```json
{
  "success": true,
  "stats": {
    "total": 1000,
    "avgIntensity": 6.48,
    "avgLikelihood": 2.83,
    "avgRelevance": 1.96,
    "distinctCountries": 65,
    "distinctTopics": 87
  }
}
```

---

## Charts

| Chart | Type | Library | Description |
|-------|------|---------|-------------|
| **Topic Intensity Ranking** | Horizontal Bar | Chart.js | Top 10 topics ranked by average intensity score |
| **Likelihood Over Time** | Line + Area Fill | Chart.js | Average likelihood trend by start year |
| **Region Relevance** | Radar | Chart.js | Average relevance score for top 8 regions |
| **Country Frequency** | Horizontal Bar | Chart.js | Top 15 countries by number of insight records |
| **Sector Breakdown** | Polar Area | Chart.js | Record volume distribution across business sectors |
| **Metric Correlation** | Bubble | Chart.js | Intensity (X) x Likelihood (Y), bubble size = avg Relevance per sector |
| **Insight Density Heatmap** | Heatmap | **D3.js** | Average intensity per topic x likelihood bucket (1-5) |

---

## Design Highlights

- **Sticky top navigation** with live-indicator dot and dynamic record-count pill
- **Slide-in filter drawer** with backdrop -- 7 multi-select filter categories
- **6-column KPI summary bar** -- Total Records, Avg Intensity, Avg Likelihood, Avg Relevance, Countries, Topics
- **3-column responsive chart grid** -> 2 columns on tablets -> 1 column on mobile
- **Loading states** -- shimmer skeletons on KPI cards, spinner per chart
- **Error screen** with one-click retry if the API is unreachable

---

## Key Design Decisions

1. **Single fetch per filter change** -- all charts share one `/api/data` response so every chart stays consistent without extra network calls.

2. **Runtime filter options** -- `/api/filters` uses MongoDB `distinct()` live, so adding new data automatically populates dropdowns without any code change.

3. **No pagination on `/api/data`** -- 1,000 records fits in one JSON response. At scale, push aggregations into MongoDB's pipeline and add cursor-based pagination.

4. **`$in` for multi-select filters** -- comma-separated query strings (`topic=gas,oil`) are parsed server-side into `{ topic: { $in: ["gas","oil"] } }` MongoDB queries.

5. **Empty strings to null in seed** -- blank numeric fields (`intensity`, `likelihood`, `relevance`, etc.) are normalised to `null` so `$avg` aggregations are unaffected by spurious zero values.

6. **D3 tooltip hoisted before event handlers** -- the tooltip D3 selection is declared before the `.on('mouseover')` callback that references it, preventing a temporal dead-zone reference error.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit with conventional commits: `git commit -m "feat: add my feature"`
4. Push and open a Pull Request

---

## License

MIT (c) [Anish Balkhi](https://github.com/Anishbalkhi)
