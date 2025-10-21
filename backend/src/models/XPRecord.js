const mongoose = require('mongoose');

const xpRecordSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  appId: {
    type: String,
    required: true
  },
  appName: {
    type: String,
    required: true
  },
  xpAmount: {
    type: Number,
    required: true,
    min: 0
  },
  transactionHash: {
    type: String,
    required: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  activityType: {
    type: String,
    enum: ['trade', 'mint', 'stake', 'play', 'social', 'other'],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
xpRecordSchema.index({ walletAddress: 1, timestamp: -1 });
xpRecordSchema.index({ appId: 1, timestamp: -1 });
xpRecordSchema.index({ transactionHash: 1 }, { unique: true });
xpRecordSchema.index({ timestamp: -1 });

module.exports = mongoose.model('XPRecord', xpRecordSchema);
