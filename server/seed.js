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

  const cleanedRecords = records.map((record) => {
    return {
      ...record,
      end_year:   record.end_year   === '' || record.end_year   == null ? null : Number(record.end_year),
      start_year: record.start_year === '' || record.start_year == null ? null : Number(record.start_year),
      intensity:  record.intensity  === '' || record.intensity  == null ? null : Number(record.intensity),
      likelihood: record.likelihood === '' || record.likelihood == null ? null : Number(record.likelihood),
      relevance:  record.relevance  === '' || record.relevance  == null ? null : Number(record.relevance),
    };
  });

  await Insight.deleteMany({});
  console.log('Cleared existing collection');

  const inserted = await Insight.insertMany(cleanedRecords, { ordered: false });
  console.log(`Inserted ${inserted.length} records into MongoDB`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
