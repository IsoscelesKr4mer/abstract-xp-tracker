const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['defi', 'nft', 'gaming', 'social', 'utility', 'other'],
    required: true
  },
  contractAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  website: String,
  logo: String,
  isActive: {
    type: Boolean,
    default: true
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  totalXP: {
    type: Number,
    default: 0
  },
  avgXPPerUser: {
    type: Number,
    default: 0
  },
  xpMultiplier: {
    type: Number,
    default: 1.0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('App', appSchema);
