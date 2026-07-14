const Insight = require('../models/Insight');

const getInsightRecords = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);
    const records = await Insight.find(filter, { __v: 0, createdAt: 0, updatedAt: 0 });
    res.json({ success: true, count: records.length, data: records });
  } catch (err) {
    next(err);
  }
};

const getFilterOptions = async (req, res, next) => {
  try {
    const endYears  = await Insight.distinct('end_year');
    const topics    = await Insight.distinct('topic');
    const sectors   = await Insight.distinct('sector');
    const regions   = await Insight.distinct('region');
    const pestles   = await Insight.distinct('pestle');
    const sources   = await Insight.distinct('source');
    const swots     = await Insight.distinct('swot');
    const countries = await Insight.distinct('country');
    const cities    = await Insight.distinct('city');

    const clean = (arr) =>
      arr.filter((v) => v !== null && v !== undefined && v !== '')
        .sort((a, b) => (typeof a === 'number' ? a - b : String(a).localeCompare(String(b))));

    res.json({
      success: true,
      filters: {
        end_years: clean(endYears),
        topics:    clean(topics),
        sectors:   clean(sectors),
        regions:   clean(regions),
        pestles:   clean(pestles),
        sources:   clean(sources),
        swots:     clean(swots),
        countries: clean(countries),
        cities:    clean(cities),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAggregateMetrics = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);

    const total = await Insight.countDocuments(filter);
    const records = await Insight.find(filter, { intensity: 1, likelihood: 1, relevance: 1 });

    let intensitySum = 0, intensityCount = 0;
    let likelihoodSum = 0, likelihoodCount = 0;
    let relevanceSum = 0, relevanceCount = 0;

    records.forEach((r) => {
      if (r.intensity  != null) { intensitySum  += r.intensity;  intensityCount++;  }
      if (r.likelihood != null) { likelihoodSum += r.likelihood; likelihoodCount++; }
      if (r.relevance  != null) { relevanceSum  += r.relevance;  relevanceCount++;  }
    });

    const avgIntensity  = intensityCount  > 0 ? intensitySum  / intensityCount  : 0;
    const avgLikelihood = likelihoodCount > 0 ? likelihoodSum / likelihoodCount : 0;
    const avgRelevance  = relevanceCount  > 0 ? relevanceSum  / relevanceCount  : 0;

    const distinctCountries = await Insight.distinct('country', { ...filter, country: { $ne: '' } });
    const distinctTopics    = await Insight.distinct('topic',   { ...filter, topic:   { $ne: '' } });

    res.json({
      success: true,
      stats: {
        total,
        avgIntensity:      parseFloat(avgIntensity.toFixed(2)),
        avgLikelihood:     parseFloat(avgLikelihood.toFixed(2)),
        avgRelevance:      parseFloat(avgRelevance.toFixed(2)),
        distinctCountries: distinctCountries.length,
        distinctTopics:    distinctTopics.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

function buildFilter(query) {
  const filter = {};

  if (query.topic)   filter.topic   = query.topic;
  if (query.sector)  filter.sector  = query.sector;
  if (query.region)  filter.region  = query.region;
  if (query.pestle)  filter.pestle  = query.pestle;
  if (query.source)  filter.source  = query.source;
  if (query.swot)    filter.swot    = query.swot;
  if (query.country) filter.country = query.country;
  if (query.city)    filter.city    = query.city;

  if (query.endYear) {
    const year = Number(query.endYear);
    if (!isNaN(year)) filter.end_year = year;
  }

  return filter;
}

module.exports = { getInsightRecords, getFilterOptions, getAggregateMetrics };
