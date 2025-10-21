const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
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
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['achievement', 'milestone', 'special', 'seasonal'],
    required: true
  },
  requirements: {
    xpRequired: Number,
    levelRequired: Number,
    appSpecific: String,
    customCriteria: mongoose.Schema.Types.Mixed
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: Date,
  totalEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);
