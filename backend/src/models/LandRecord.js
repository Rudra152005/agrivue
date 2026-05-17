const mongoose = require('mongoose');

const LandRecordSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farmer',
    required: true
  },
  surveyNumber: {
    type: String,
    required: true,
    unique: true
  },
  area: Number,
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  documents: [String], // URLs to Cloudinary
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  history: [{
    action: String,
    date: { type: Date, default: Date.now },
    performedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LandRecord', LandRecordSchema);
