const express = require('express');
const {
  getLands,
  createLand,
  verifyLand
} = require('../controllers/lands');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getLands)
  .post(protect, authorize('farmer', 'admin'), createLand);

router
  .route('/:id/verify')
  .put(protect, authorize('officer', 'admin'), verifyLand);

module.exports = router;
