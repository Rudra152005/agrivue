const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  aadhaarId: {
    type: String,
    required: [true, 'Please add an Aadhaar ID'],
    unique: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Please add a contact number']
  },
  village: String,
  district: String,
  state: String,
  crops: [String],
  landSize: Number, // in acres
  beneficiaryStatus: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Farmer', FarmerSchema);
