const express = require('express');
const router = express.Router();

// Mock leaderboard controller - will be implemented later
router.get('/global', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // TODO: Fetch real leaderboard data from database
    // Mock data for now
    const mockLeaderboard = Array.from({ length: parseInt(limit) }, (_, i) => ({
      rank: parseInt(offset) + i + 1,
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      totalXP: 50000 - (i * 1000),
      level: Math.floor((50000 - (i * 1000)) / 1000),
      badges: Math.floor(Math.random() * 20) + 5,
      weeklyChange: Math.floor(Math.random() * 200) - 100
    }));
    
    res.json({
      success: true,
      data: {
        leaderboard: mockLeaderboard,
        totalUsers: 125000,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global leaderboard',
      error: error.message
    });
  }
});

router.get('/app/:appId', async (req, res) => {
  try {
    const { appId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    // TODO: Fetch real app-specific leaderboard data
    const mockAppLeaderboard = Array.from({ length: parseInt(limit) }, (_, i) => ({
      rank: parseInt(offset) + i + 1,
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      appXP: 15000 - (i * 500),
      totalXP: 50000 - (i * 1000),
      level: Math.floor((15000 - (i * 500)) / 1000),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    res.json({
      success: true,
      data: {
        appId,
        leaderboard: mockAppLeaderboard,
        totalUsers: 25000,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch app leaderboard',
      error: error.message
    });
  }
});

router.get('/friends/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // TODO: Fetch real friends leaderboard data
    const mockFriendsLeaderboard = [
      { rank: 1, walletAddress: '0x123...', totalXP: 25000, level: 25, isOnline: true },
      { rank: 2, walletAddress: '0x456...', totalXP: 22000, level: 22, isOnline: false },
      { rank: 3, walletAddress: '0x789...', totalXP: 18000, level: 18, isOnline: true }
    ];
    
    res.json({
      success: true,
      data: {
        friends: mockFriendsLeaderboard,
        userRank: 2,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch friends leaderboard',
      error: error.message
    });
  }
});

module.exports = router;

