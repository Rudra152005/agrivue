const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  eligibilityCriteria: [String],
  benefits: String,
  deadline: Date,
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scheme', SchemeSchema);
