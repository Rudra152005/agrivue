const mongoose = require('mongoose');

const DroneSurveySchema = new mongoose.Schema({
  landRecord: {
    type: mongoose.Schema.ObjectId,
    ref: 'LandRecord',
    required: true
  },
  surveyDate: {
    type: Date,
    default: Date.now
  },
  droneId: String,
  trajectory: [{
    lat: Number,
    lng: Number,
    alt: Number,
    timestamp: Date
  }],
  cropHealthScore: Number, // 0-100
  heatmapData: {
    type: Map,
    of: Number // lat_lng: value
  },
  images: [String],
  logs: [String],
  performedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('DroneSurvey', DroneSurveySchema);
