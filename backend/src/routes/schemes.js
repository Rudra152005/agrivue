const express = require('express');
const {
  getSchemes,
  applyForScheme,
  getApplicationStatus,
  createScheme
} = require('../controllers/schemes');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getSchemes)
  .post(protect, authorize('admin'), createScheme);

router.post('/apply', protect, authorize('farmer'), applyForScheme);
router.get('/status', protect, authorize('farmer'), getApplicationStatus);

module.exports = router;
