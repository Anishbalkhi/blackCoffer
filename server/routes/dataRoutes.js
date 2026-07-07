const express = require('express');
const router = express.Router();
const {
  getInsightRecords,
  getFilterOptions,
  getAggregateMetrics,
} = require('../controllers/dataController');

router.get('/data', getInsightRecords);
router.get('/filters', getFilterOptions);
router.get('/stats', getAggregateMetrics);

module.exports = router;
