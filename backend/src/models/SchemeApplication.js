const mongoose = require('mongoose');

const SchemeApplicationSchema = new mongoose.Schema({
  scheme: {
    type: mongoose.Schema.ObjectId,
    ref: 'Scheme',
    required: true
  },
  farmer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Farmer',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: String,
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
});

module.exports = mongoose.model('SchemeApplication', SchemeApplicationSchema);
