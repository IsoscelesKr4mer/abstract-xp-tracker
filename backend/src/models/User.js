const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  totalXP: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    id: String,
    name: String,
    description: String,
    earnedAt: Date,
    icon: String
  }],
  friends: [{
    walletAddress: String,
    addedAt: Date
  }],
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: Date
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ walletAddress: 1 });
userSchema.index({ totalXP: -1 });
userSchema.index({ level: -1 });
userSchema.index({ lastActive: -1 });

module.exports = mongoose.model('User', userSchema);
