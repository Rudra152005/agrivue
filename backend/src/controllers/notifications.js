const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Notification = require('../models/Notification');

// @desc    Get all notifications for user
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user.id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.readNotification = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  if (notification.recipient.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, {
    new: true
  });

  res.status(200).json({
    success: true,
    data: notification
  });
});
