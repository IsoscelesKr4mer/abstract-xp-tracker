const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Global leaderboard - Abstract Portal XP integration
// Note: Abstract Portal XP data is not publicly accessible via API
// Abstract's API (https://docs.abs.xyz/api-reference/overview/abstract-json-rpc-api) 
// only provides blockchain JSON-RPC methods, not Portal XP data
router.get('/global', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Abstract Portal XP data is internal and not exposed via public API
    // The Abstract JSON-RPC API only provides blockchain operations, not Portal data
    // This implementation provides a realistic simulation based on Abstract ecosystem patterns
    const globalLeaderboard = await generateAbstractEcosystemLeaderboard(limit, offset);
    
    res.json({
      success: true,
      data: {
        leaderboard: globalLeaderboard,
        totalUsers: globalLeaderboard.length,
        lastUpdated: new Date().toISOString(),
        source: 'Abstract Ecosystem Simulation',
        note: 'Abstract Portal XP data is not publicly accessible. Abstract API only provides blockchain JSON-RPC methods.',
        apiReference: 'https://docs.abs.xyz/api-reference/overview/abstract-json-rpc-api'
      }
    });
  } catch (error) {
    console.error('Error generating Abstract ecosystem leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate leaderboard',
      error: error.message
    });
  }
});

// Generate realistic Abstract ecosystem leaderboard simulation
async function generateAbstractEcosystemLeaderboard(limit, offset) {
  // Abstract ecosystem patterns based on Portal documentation
  const abstractApps = [
    'Abstract DeFi Protocol',
    'Abstract NFT Marketplace', 
    'Abstract Gaming Hub',
    'Abstract Social Platform',
    'Abstract Trading Platform',
    'Abstract Creator Tools',
    'Abstract Analytics',
    'Abstract Bridge'
  ];

  const leaderboard = [];
  
  for (let i = 0; i < parseInt(limit); i++) {
    const rank = parseInt(offset) + i + 1;
    
    // Generate realistic XP distribution (top-heavy like real ecosystems)
    const baseXP = Math.max(1000, 50000 - (i * 800) + Math.random() * 2000);
    const totalXP = Math.floor(baseXP);
    
    // Generate realistic wallet address (Abstract format)
    const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    
    // Generate realistic app usage patterns
    const usedApps = abstractApps.slice(0, Math.floor(Math.random() * 6) + 2);
    
    leaderboard.push({
      rank,
      walletAddress,
      totalXP,
      level: Math.floor(totalXP / 1000) + 1,
      badges: Math.floor(Math.random() * 15) + 3,
      weeklyChange: Math.floor(Math.random() * 400) - 200,
      apps: usedApps,
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
      username: `AbstractUser${rank}`
    });
  }
  
  return leaderboard;
}

// Fallback to local database leaderboard
async function getLocalLeaderboard(req, res) {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Fetch local leaderboard data from database
    const users = await User.find({})
      .sort({ totalXP: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .select('walletAddress totalXP level badges')
      .lean();

    // Calculate ranks and format data
    const leaderboard = users.map((user, index) => ({
      rank: parseInt(offset) + index + 1,
      walletAddress: user.walletAddress,
      totalXP: user.totalXP || 0,
      level: user.level || 1,
      badges: user.badges ? user.badges.length : 0,
      weeklyChange: Math.floor(Math.random() * 200) - 100
    }));

    // Get total user count
    const totalUsers = await User.countDocuments({});
    
    res.json({
      success: true,
      data: {
        leaderboard,
        totalUsers,
        lastUpdated: new Date().toISOString(),
        source: 'Local Database (XP Protocol API not configured)'
      }
    });
  } catch (error) {
    console.error('Error fetching local leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
}

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

