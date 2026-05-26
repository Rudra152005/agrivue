const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Scheme = require('../models/Scheme');
const SchemeApplication = require('../models/SchemeApplication');
const Farmer = require('../models/Farmer');

// @desc    Get all schemes
// @route   GET /api/v1/schemes
// @access  Public
exports.getSchemes = asyncHandler(async (req, res, next) => {
  const schemes = await Scheme.find({ active: true });

  res.status(200).json({
    success: true,
    count: schemes.length,
    data: schemes
  });
});

// @desc    Apply for scheme
// @route   POST /api/v1/schemes/apply
// @access  Private/Farmer
exports.applyForScheme = asyncHandler(async (req, res, next) => {
  const farmer = await Farmer.findOne({ user: req.user.id });
  if (!farmer) return next(new ErrorResponse('Farmer profile not found', 404));

  req.body.farmer = farmer._id;

  // Check if already applied
  const existingApp = await SchemeApplication.findOne({
    scheme: req.body.scheme,
    farmer: farmer._id
  });

  if (existingApp) {
    return next(new ErrorResponse('You have already applied for this scheme', 400));
  }

  const application = await SchemeApplication.create(req.body);

  res.status(201).json({
    success: true,
    data: application
  });
});

// @desc    Get application status
// @route   GET /api/v1/schemes/status
// @access  Private/Farmer
exports.getApplicationStatus = asyncHandler(async (req, res, next) => {
  const farmer = await Farmer.findOne({ user: req.user.id });
  if (!farmer) return next(new ErrorResponse('Farmer profile not found', 404));

  const applications = await SchemeApplication.find({ farmer: farmer._id }).populate('scheme');

  res.status(200).json({
    success: true,
    data: applications
  });
});

// @desc    Create new scheme
// @route   POST /api/v1/schemes
// @access  Private/Admin
exports.createScheme = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const scheme = await Scheme.create(req.body);

  res.status(201).json({
    success: true,
    data: scheme
  });
});
