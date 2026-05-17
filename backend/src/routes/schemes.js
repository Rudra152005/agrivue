const express = require('express');
const {
  getSchemes,
  applyForScheme,
  getApplicationStatus
} = require('../controllers/schemes');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/', getSchemes);
router.post('/apply', protect, authorize('farmer'), applyForScheme);
router.get('/status', protect, authorize('farmer'), getApplicationStatus);

module.exports = router;
