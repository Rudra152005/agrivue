const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const LandRecord = require('../models/LandRecord');
const Farmer = require('../models/Farmer');

// @desc    Get all land records
// @route   GET /api/v1/lands
// @access  Private
exports.getLands = asyncHandler(async (req, res, next) => {
  let query;

  if (req.user.role === 'farmer') {
    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) return next(new ErrorResponse('Farmer profile not found', 404));
    query = LandRecord.find({ farmer: farmer._id });
  } else {
    query = LandRecord.find().populate('farmer');
  }

  const lands = await query;

  res.status(200).json({
    success: true,
    count: lands.length,
    data: lands
  });
});

// @desc    Create land record
// @route   POST /api/v1/lands
// @access  Private/Farmer/Admin
exports.createLand = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'farmer') {
    const farmer = await Farmer.findOne({ user: req.user.id });
    if (!farmer) return next(new ErrorResponse('Farmer profile not found', 404));
    req.body.farmer = farmer._id;
  }

  const land = await LandRecord.create(req.body);

  res.status(201).json({
    success: true,
    data: land
  });
});

// @desc    Verify land record
// @route   PUT /api/v1/lands/:id/verify
// @access  Private/Officer/Admin
exports.verifyLand = asyncHandler(async (req, res, next) => {
  let land = await LandRecord.findById(req.params.id);

  if (!land) {
    return next(new ErrorResponse(`Land record not found with id of ${req.params.id}`, 404));
  }

  land = await LandRecord.findByIdAndUpdate(req.params.id, {
    verified: true,
    verifiedBy: req.user.id,
    $push: { history: { action: 'Verified', performedBy: req.user.id } }
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: land
  });
});
