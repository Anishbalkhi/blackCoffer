require('dotenv').config();
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const Insight = require('./models/Insight');

const seed = async () => {
  await connectDB();

  const dataPath = path.join(__dirname, '..', 'jsondata.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`jsondata.json not found at: ${dataPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const records = JSON.parse(raw);

  console.log(`Loaded ${records.length} records from jsondata.json`);

  const normalized = records.map((r) => ({
    ...r,
    end_year: r.end_year === '' || r.end_year === undefined ? null : Number(r.end_year),
    start_year: r.start_year === '' || r.start_year === undefined ? null : Number(r.start_year),
    intensity: r.intensity === '' || r.intensity === undefined ? null : Number(r.intensity),
    likelihood: r.likelihood === '' || r.likelihood === undefined ? null : Number(r.likelihood),
    relevance: r.relevance === '' || r.relevance === undefined ? null : Number(r.relevance),
  }));

  await Insight.deleteMany({});
  console.log('Cleared existing collection');

  const inserted = await Insight.insertMany(normalized, { ordered: false });
  console.log(`Inserted ${inserted.length} records into MongoDB`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
