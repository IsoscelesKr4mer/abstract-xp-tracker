const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');

// Abstract Portal API configuration
const ABSTRACT_API_URL = 'https://api.abs.xyz';
const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;

// Global leaderboard using Abstract Portal XP system
router.get('/global', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    if (!ABSTRACT_API_KEY) {
      console.warn('ABSTRACT_API_KEY not configured, falling back to local data');
      return await getLocalLeaderboard(req, res);
    }

    // Fetch global XP data from Abstract Portal
    const globalLeaderboard = await fetchAbstractXPLeaderboard(limit, offset);
    
    res.json({
      success: true,
      data: {
        leaderboard: globalLeaderboard,
        totalUsers: globalLeaderboard.length,
        lastUpdated: new Date().toISOString(),
        source: 'Abstract Portal API'
      }
    });
  } catch (error) {
    console.error('Error fetching global leaderboard from Abstract Portal:', error);
    
    // Fallback to local data if Abstract API fails
    console.log('Falling back to local leaderboard data');
    return await getLocalLeaderboard(req, res);
  }
});

// Fetch global XP leaderboard from Abstract Portal API
async function fetchAbstractXPLeaderboard(limit, offset) {
  try {
    // Query Abstract Portal for global user XP data
    // Note: This endpoint may need to be updated based on actual Abstract API documentation
    const response = await axios.get(`${ABSTRACT_API_URL}/portal/users/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${ABSTRACT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        sortBy: 'xp',
        sortOrder: 'desc'
      }
    });

    if (response.data.success) {
      return response.data.data.map((user, index) => ({
        rank: parseInt(offset) + index + 1,
        walletAddress: user.walletAddress,
        totalXP: user.xp || 0,
        level: Math.floor((user.xp || 0) / 1000) + 1,
        badges: user.badges || 0,
        weeklyChange: user.weeklyChange || 0,
        apps: user.apps || [],
        lastActive: user.lastActive,
        profilePicture: user.profilePicture,
        username: user.username
      }));
    }
    
    throw new Error('Invalid response from Abstract Portal API');
  } catch (error) {
    console.error('Abstract Portal API error:', error.message);
    throw error;
  }
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

