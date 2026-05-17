const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const DroneSurvey = require('../models/DroneSurvey');

// @desc    Get all drone surveys
// @route   GET /api/v1/aerial
// @access  Private/Admin/Officer
exports.getSurveys = asyncHandler(async (req, res, next) => {
  const surveys = await DroneSurvey.find().populate('landRecord');

  res.status(200).json({
    success: true,
    count: surveys.length,
    data: surveys
  });
});

// @desc    Get survey trajectory
// @route   GET /api/v1/aerial/trajectory/:id
// @access  Private
exports.getTrajectory = asyncHandler(async (req, res, next) => {
  const survey = await DroneSurvey.findById(req.params.id).select('trajectory');

  if (!survey) {
    return next(new ErrorResponse(`Survey not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: survey.trajectory
  });
});

// @desc    Create survey report
// @route   POST /api/v1/aerial
// @access  Private/Officer/Admin
exports.createSurvey = asyncHandler(async (req, res, next) => {
  req.body.performedBy = req.user.id;

  const survey = await DroneSurvey.create(req.body);

  res.status(201).json({
    success: true,
    data: survey
  });
});
