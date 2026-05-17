const express = require('express');
const {
  getSurveys,
  getTrajectory,
  createSurvey
} = require('../controllers/aerial');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin', 'officer'), getSurveys)
  .post(protect, authorize('officer', 'admin'), createSurvey);

router.get('/trajectory/:id', protect, getTrajectory);

module.exports = router;
