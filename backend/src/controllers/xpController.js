const express = require('express');
const router = express.Router();

// Mock XP controller - will be implemented later
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // TODO: Fetch real XP data from Abstract blockchain
    // Mock data for now
    const mockXPData = {
      walletAddress,
      totalXP: 15420,
      level: 15,
      rank: 42,
      badges: [
        { id: 1, name: 'First Steps', description: 'Earned your first XP', earnedAt: '2024-01-15' },
        { id: 2, name: 'Trader', description: 'Completed 10 trades', earnedAt: '2024-01-20' },
        { id: 3, name: 'Collector', description: 'Minted 5 NFTs', earnedAt: '2024-02-01' }
      ],
      recentActivity: [
        { app: 'Abstract Swap', xp: 150, timestamp: '2024-10-21T10:30:00Z' },
        { app: 'Abstract NFT', xp: 200, timestamp: '2024-10-21T09:15:00Z' },
        { app: 'Abstract DeFi', xp: 100, timestamp: '2024-10-20T16:45:00Z' }
      ],
      weeklyXP: 1250,
      monthlyXP: 4200,
      allTimeXP: 15420
    };
    
    res.json({
      success: true,
      data: mockXPData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch XP data',
      error: error.message
    });
  }
});

router.get('/history/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { period = '30d', limit = 100 } = req.query;
    
    // TODO: Fetch real XP history from database
    // Mock data for now
    const mockHistory = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      xp: Math.floor(Math.random() * 500) + 50,
      apps: ['Abstract Swap', 'Abstract NFT', 'Abstract DeFi', 'Abstract Game'][Math.floor(Math.random() * 4)]
    }));
    
    res.json({
      success: true,
      data: mockHistory.reverse()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch XP history',
      error: error.message
    });
  }
});

router.get('/apps', async (req, res) => {
  try {
    // TODO: Fetch real app data from Abstract
    const mockApps = [
      { id: 1, name: 'Abstract Swap', description: 'Decentralized exchange', totalUsers: 12500, avgXP: 850 },
      { id: 2, name: 'Abstract NFT', description: 'NFT marketplace', totalUsers: 8900, avgXP: 1200 },
      { id: 3, name: 'Abstract DeFi', description: 'DeFi protocols', totalUsers: 15600, avgXP: 2100 },
      { id: 4, name: 'Abstract Game', description: 'Play-to-earn game', totalUsers: 22000, avgXP: 1800 }
    ];
    
    res.json({
      success: true,
      data: mockApps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch apps data',
      error: error.message
    });
  }
});

module.exports = router;

