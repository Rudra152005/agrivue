const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { role, name, page = 1, limit = 10 } = req.query;
  
  let query = {};
  if (role) query.role = role;
  if (name) query.name = { $regex: name, $options: 'i' };

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  
  const users = await User.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(parseInt(limit, 10));

  const count = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count,
    pagination: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total: count
    },
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});
