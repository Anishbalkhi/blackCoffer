const Insight = require('../models/Insight');

const buildMatchStage = (queryParams) => {
  const stage = {};

  const multiValueFields = ['topic', 'sector', 'region', 'pestle', 'source', 'swot', 'country', 'city'];

  multiValueFields.forEach((field) => {
    if (!queryParams[field]) return;
    const selected = queryParams[field].split(',').map((v) => v.trim()).filter(Boolean);
    if (selected.length === 1) {
      stage[field] = selected[0];
    } else if (selected.length > 1) {
      stage[field] = { $in: selected };
    }
  });

  if (queryParams.endYear) {
    const yr = Number(queryParams.endYear);
    if (!isNaN(yr)) stage.end_year = yr;
  }

  return stage;
};

const getInsightRecords = async (req, res, next) => {
  try {
    const matchStage = buildMatchStage(req.query);

    const insightRecords = await Insight.aggregate([
      { $match: matchStage },
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    ]);

    res.json({ success: true, count: insightRecords.length, data: insightRecords });
  } catch (err) {
    next(err);
  }
};

const getFilterOptions = async (req, res, next) => {
  try {
    const [
      endYears,
      topics,
      sectors,
      regions,
      pestles,
      sources,
      swots,
      countries,
      cities,
    ] = await Promise.all([
      Insight.distinct('end_year'),
      Insight.distinct('topic'),
      Insight.distinct('sector'),
      Insight.distinct('region'),
      Insight.distinct('pestle'),
      Insight.distinct('source'),
      Insight.distinct('swot'),
      Insight.distinct('country'),
      Insight.distinct('city'),
    ]);

    const sanitize = (arr) =>
      arr
        .filter((v) => v !== null && v !== undefined && v !== '')
        .sort((a, b) =>
          typeof a === 'number' ? a - b : String(a).localeCompare(String(b))
        );

    res.json({
      success: true,
      filters: {
        end_years: sanitize(endYears),
        topics: sanitize(topics),
        sectors: sanitize(sectors),
        regions: sanitize(regions),
        pestles: sanitize(pestles),
        sources: sanitize(sources),
        swots: sanitize(swots),
        countries: sanitize(countries),
        cities: sanitize(cities),
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAggregateMetrics = async (req, res, next) => {
  try {
    const matchStage = buildMatchStage(req.query);

    const [aggregation, distinctCountries, distinctTopics] = await Promise.all([
      Insight.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgIntensity: { $avg: '$intensity' },
            avgLikelihood: { $avg: '$likelihood' },
            avgRelevance: { $avg: '$relevance' },
          },
        },
      ]),
      Insight.distinct('country', { ...matchStage, country: { $ne: '' } }),
      Insight.distinct('topic', { ...matchStage, topic: { $ne: '' } }),
    ]);

    const metrics = aggregation[0] ?? {
      total: 0,
      avgIntensity: 0,
      avgLikelihood: 0,
      avgRelevance: 0,
    };

    res.json({
      success: true,
      stats: {
        total: metrics.total,
        avgIntensity: parseFloat((metrics.avgIntensity ?? 0).toFixed(2)),
        avgLikelihood: parseFloat((metrics.avgLikelihood ?? 0).toFixed(2)),
        avgRelevance: parseFloat((metrics.avgRelevance ?? 0).toFixed(2)),
        distinctCountries: distinctCountries.length,
        distinctTopics: distinctTopics.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInsightRecords, getFilterOptions, getAggregateMetrics };
