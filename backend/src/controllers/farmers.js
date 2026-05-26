const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Farmer = require('../models/Farmer');
const User = require('../models/User');

// @desc    Get all farmers
// @route   GET /api/v1/farmers
// @access  Private/Admin/Officer
exports.getFarmers = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Handle name search with regex
  if (reqQuery.name) {
    reqQuery.name = { $regex: reqQuery.name, $options: 'i' };
  } else if (req.query.name === '') {
    delete reqQuery.name;
  }

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Farmer.find(JSON.parse(queryStr)).populate('user');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Farmer.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const farmers = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: farmers.length,
    pagination,
    data: farmers
  });
});

// @desc    Get single farmer
// @route   GET /api/v1/farmers/:id
// @access  Private
exports.getFarmer = asyncHandler(async (req, res, next) => {
  const farmer = await Farmer.findById(req.params.id).populate('user');

  if (!farmer) {
    return next(
      new ErrorResponse(`Farmer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: farmer
  });
});

// @desc    Create farmer profile
// @route   POST /api/v1/farmers
// @access  Private
exports.createFarmer = asyncHandler(async (req, res, next) => {
  let userId = req.user.id;

  if (req.user.role === 'admin' || req.user.role === 'officer') {
    // Admin/Officer is creating a farmer. Create a User profile first.
    // Use contactNumber and timestamp as a pseudo-email to guarantee uniqueness
    const email = `${req.body.contactNumber || 'farmer'}_${Date.now()}@farmer.com`;
    const password = req.body.contactNumber || '123456'; // Default password
    
    const newUser = await User.create({
      name: req.body.name || 'Unknown Farmer',
      email,
      password,
      role: 'farmer'
    });
    userId = newUser._id;
  } else {
    // Check for existing farmer profile
    const existingFarmer = await Farmer.findOne({ user: req.user.id });
    if (existingFarmer) {
      return next(new ErrorResponse('User already has a farmer profile', 400));
    }
  }

  req.body.user = userId;
  const farmer = await Farmer.create(req.body);

  // Populate the user field before sending response so frontend sees the name
  await farmer.populate('user');

  res.status(201).json({
    success: true,
    data: farmer
  });
});

// @desc    Update farmer
// @route   PUT /api/v1/farmers/:id
// @access  Private
exports.updateFarmer = asyncHandler(async (req, res, next) => {
  let farmer = await Farmer.findById(req.params.id);

  if (!farmer) {
    return next(
      new ErrorResponse(`Farmer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is farmer owner or admin
  if (farmer.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to update this profile`, 401)
    );
  }

  farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: farmer
  });
});

// @desc    Delete farmer
// @route   DELETE /api/v1/farmers/:id
// @access  Private/Admin
exports.deleteFarmer = asyncHandler(async (req, res, next) => {
  const farmer = await Farmer.findById(req.params.id);

  if (!farmer) {
    return next(
      new ErrorResponse(`Farmer not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to delete this profile`, 401)
    );
  }

  await farmer.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
