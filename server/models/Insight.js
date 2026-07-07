const mongoose = require('mongoose');

const InsightSchema = new mongoose.Schema(
  {
    end_year: { type: Number, default: null },
    start_year: { type: Number, default: null },
    intensity: { type: Number, default: null },
    likelihood: { type: Number, default: null },
    relevance: { type: Number, default: null },
    sector: { type: String, default: '' },
    topic: { type: String, default: '' },
    insight: { type: String, default: '' },
    url: { type: String, default: '' },
    region: { type: String, default: '' },
    impact: { type: String, default: '' },
    added: { type: String, default: '' },
    published: { type: String, default: '' },
    country: { type: String, default: '' },
    pestle: { type: String, default: '' },
    source: { type: String, default: '' },
    title: { type: String, default: '' },
    swot: { type: String, default: '' },
    city: { type: String, default: '' },
  },
  { timestamps: true }
);

InsightSchema.index({ topic: 1 });
InsightSchema.index({ sector: 1 });
InsightSchema.index({ region: 1 });
InsightSchema.index({ country: 1 });
InsightSchema.index({ pestle: 1 });
InsightSchema.index({ end_year: 1 });
InsightSchema.index({ start_year: 1 });

module.exports = mongoose.model('Insight', InsightSchema);
