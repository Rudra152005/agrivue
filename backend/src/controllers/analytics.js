const asyncHandler = require('../middleware/async');
const Farmer = require('../models/Farmer');
const LandRecord = require('../models/LandRecord');
const SchemeApplication = require('../models/SchemeApplication');
const DroneSurvey = require('../models/DroneSurvey');

// @desc    Get system analytics
// @route   GET /api/v1/analytics
// @access  Private/Admin/Officer
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  const totalFarmers = await Farmer.countDocuments();
  const totalLandArea = await LandRecord.aggregate([
    { $group: { _id: null, total: { $sum: '$area' } } }
  ]);
  const applicationsByStatus = await SchemeApplication.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const averageCropHealth = await DroneSurvey.aggregate([
    { $group: { _id: null, avg: { $avg: '$cropHealthScore' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalFarmers,
      totalLandArea: totalLandArea[0]?.total || 0,
      applicationsByStatus,
      averageCropHealth: averageCropHealth[0]?.avg || 0
    }
  });
});
