const express = require('express');
const { getAnalytics } = require('../controllers/analytics');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'officer', 'farmer'), getAnalytics);

module.exports = router;
