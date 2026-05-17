const express = require('express');
const {
  getFarmers,
  getFarmer,
  createFarmer,
  updateFarmer,
  deleteFarmer
} = require('../controllers/farmers');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin', 'officer', 'farmer'), getFarmers)
  .post(protect, authorize('farmer', 'admin'), createFarmer);

router
  .route('/:id')
  .get(protect, getFarmer)
  .put(protect, authorize('farmer', 'admin'), updateFarmer)
  .delete(protect, authorize('admin'), deleteFarmer);

module.exports = router;
