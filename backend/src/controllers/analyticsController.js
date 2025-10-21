const express = require('express');
const router = express.Router();

// Mock analytics controller - will be implemented later
router.get('/overview/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { period = '30d' } = req.query;
    
    // TODO: Fetch real analytics data
    const mockAnalytics = {
      walletAddress,
      period,
      totalXP: 15420,
      weeklyGrowth: 12.5,
      monthlyGrowth: 28.3,
      topApps: [
        { name: 'Abstract Swap', xp: 4500, percentage: 29.2 },
        { name: 'Abstract NFT', xp: 3200, percentage: 20.8 },
        { name: 'Abstract DeFi', xp: 2800, percentage: 18.2 },
        { name: 'Abstract Game', xp: 2100, percentage: 13.6 },
        { name: 'Others', xp: 2820, percentage: 18.2 }
      ],
      xpTrend: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        xp: Math.floor(Math.random() * 500) + 100
      })),
      badgesEarned: 8,
      levelProgress: 65,
      rankChange: -5,
      achievements: [
        { name: 'Daily Streak', value: 15, max: 30 },
        { name: 'Weekly Goal', value: 1200, max: 1500 },
        { name: 'Monthly Target', value: 4200, max: 5000 }
      ]
    };
    
    res.json({
      success: true,
      data: mockAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
});

router.get('/comparison/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { compareWith } = req.query;
    
    // TODO: Implement comparison analytics
    const mockComparison = {
      user: {
        walletAddress,
        totalXP: 15420,
        level: 15,
        rank: 42
      },
      comparison: {
        walletAddress: compareWith,
        totalXP: 18900,
        level: 18,
        rank: 28
      },
      difference: {
        xpDiff: 3480,
        levelDiff: 3,
        rankDiff: -14
      }
    };
    
    res.json({
      success: true,
      data: mockComparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comparison data',
      error: error.message
    });
  }
});

module.exports = router;

