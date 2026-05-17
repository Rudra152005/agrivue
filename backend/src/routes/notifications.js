const express = require('express');
const {
  getNotifications,
  readNotification
} = require('../controllers/notifications');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, readNotification);

module.exports = router;
