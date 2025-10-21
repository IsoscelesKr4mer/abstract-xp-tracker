const express = require('express');
const router = express.Router();

// Mock user controller - will be implemented later
router.get('/profile/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // TODO: Fetch real user profile data
    const mockProfile = {
      walletAddress,
      username: `User${walletAddress.slice(-4)}`,
      joinDate: '2024-01-15',
      totalXP: 15420,
      level: 15,
      badges: 8,
      friends: 12,
      achievements: [
        { id: 1, name: 'Early Adopter', description: 'Joined in first month', earnedAt: '2024-01-15' },
        { id: 2, name: 'XP Hunter', description: 'Earned 10,000 XP', earnedAt: '2024-03-20' }
      ],
      preferences: {
        notifications: true,
        privacy: 'public',
        theme: 'dark'
      }
    };
    
    res.json({
      success: true,
      data: mockProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
});

router.put('/profile/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const updates = req.body;
    
    // TODO: Update user profile in database
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { walletAddress, ...updates }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

router.get('/friends/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // TODO: Fetch real friends list
    const mockFriends = [
      { walletAddress: '0x123...', username: 'CryptoTrader', totalXP: 25000, isOnline: true },
      { walletAddress: '0x456...', username: 'NFTCollector', totalXP: 22000, isOnline: false },
      { walletAddress: '0x789...', username: 'DeFiMaster', totalXP: 18000, isOnline: true }
    ];
    
    res.json({
      success: true,
      data: mockFriends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch friends list',
      error: error.message
    });
  }
});

module.exports = router;

