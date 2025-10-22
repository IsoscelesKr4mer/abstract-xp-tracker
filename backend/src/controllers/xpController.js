const express = require('express');
const router = express.Router();
const User = require('../models/User');
const XPRecord = require('../models/XPRecord');
const App = require('../models/App');

// Real XP controller with Abstract integration
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Fetch real user data from database
    let user = await User.findOne({ walletAddress }).populate('badges');
    
    if (!user) {
      // Create new user if they don't exist
      user = new User({
        walletAddress,
        username: `User_${walletAddress.slice(0, 6)}`,
        totalXP: 0,
        level: 1,
        badges: [],
        friends: [],
        preferences: {
          notifications: true,
          privacy: 'public',
          theme: 'dark'
        }
      });
      await user.save();
    }

    // Fetch recent XP records
    const recentRecords = await XPRecord.find({ walletAddress })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('appId');

    // Calculate weekly and monthly XP
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklyXP = await XPRecord.aggregate([
      { $match: { walletAddress, timestamp: { $gte: weekAgo } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyXP = await XPRecord.aggregate([
      { $match: { walletAddress, timestamp: { $gte: monthAgo } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get user rank
    const userRank = await User.countDocuments({ totalXP: { $gt: user.totalXP } }) + 1;

    const xpData = {
      walletAddress: user.walletAddress,
      totalXP: user.totalXP,
      level: user.level,
      rank: userRank,
      badges: user.badges,
      recentActivity: recentRecords.map(record => ({
        app: record.appId?.name || 'Unknown App',
        xp: record.amount,
        timestamp: record.timestamp,
        type: record.type
      })),
      weeklyXP: weeklyXP[0]?.total || 0,
      monthlyXP: monthlyXP[0]?.total || 0,
      allTimeXP: user.totalXP
    };
    
    res.json({
      success: true,
      data: xpData
    });
  } catch (error) {
    console.error('Error fetching XP data:', error);
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
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Fetch real XP history from database
    const history = await XPRecord.find({
      walletAddress,
      timestamp: { $gte: startDate }
    })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .populate('appId');

    // Group by date for daily aggregation
    const dailyData = {};
    history.forEach(record => {
      const date = record.timestamp.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          xp: 0,
          apps: new Set()
        };
      }
      dailyData[date].xp += record.amount;
      if (record.appId) {
        dailyData[date].apps.add(record.appId.name);
      }
    });

    const formattedHistory = Object.values(dailyData).map(day => ({
      date: day.date,
      xp: day.xp,
      apps: Array.from(day.apps)
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      success: true,
      data: formattedHistory
    });
  } catch (error) {
    console.error('Error fetching XP history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch XP history',
      error: error.message
    });
  }
});

router.get('/apps', async (req, res) => {
  try {
    // Fetch real app data from database
    const apps = await App.find({}).sort({ totalUsers: -1 });
    
    // If no apps exist, create some default Abstract apps
    if (apps.length === 0) {
      const defaultApps = [
        { 
          id: 'abstract-defi',
          name: 'Abstract DeFi', 
          description: 'Decentralized finance protocols', 
          category: 'defi',
          contractAddress: '0x0000000000000000000000000000000000000001',
          totalUsers: 0, 
          avgXPPerUser: 0 
        },
        { 
          id: 'abstract-nft',
          name: 'Abstract NFT Marketplace', 
          description: 'NFT trading platform', 
          category: 'nft',
          contractAddress: '0x0000000000000000000000000000000000000002',
          totalUsers: 0, 
          avgXPPerUser: 0 
        },
        { 
          id: 'abstract-gaming',
          name: 'Abstract Gaming Hub', 
          description: 'Play-to-earn gaming platform', 
          category: 'gaming',
          contractAddress: '0x0000000000000000000000000000000000000003',
          totalUsers: 0, 
          avgXPPerUser: 0 
        },
        { 
          id: 'abstract-social',
          name: 'Abstract Social', 
          description: 'Social networking on Abstract', 
          category: 'social',
          contractAddress: '0x0000000000000000000000000000000000000004',
          totalUsers: 0, 
          avgXPPerUser: 0 
        },
        { 
          id: 'abstract-trading',
          name: 'Abstract Trading', 
          description: 'Advanced trading platform', 
          category: 'utility',
          contractAddress: '0x0000000000000000000000000000000000000005',
          totalUsers: 0, 
          avgXPPerUser: 0 
        }
      ];
      
      await App.insertMany(defaultApps);
      const createdApps = await App.find({}).sort({ totalUsers: -1 });
      return res.json({
        success: true,
        data: createdApps
      });
    }
    
    res.json({
      success: true,
      data: apps
    });
  } catch (error) {
    console.error('Error fetching apps data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch apps data',
      error: error.message
    });
  }
});

// New endpoint to add XP for Abstract apps
router.post('/add-xp', async (req, res) => {
  try {
    const { walletAddress, appName, amount, type = 'interaction' } = req.body;
    
    if (!walletAddress || !appName || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: walletAddress, appName, amount'
      });
    }

    // Find or create the app
    let app = await App.findOne({ name: appName });
    if (!app) {
      app = new App({
        id: `app-${appName.toLowerCase().replace(/\s+/g, '-')}`,
        name: appName,
        description: `Abstract app: ${appName}`,
        category: 'other',
        contractAddress: '0x0000000000000000000000000000000000000000',
        totalUsers: 0,
        avgXPPerUser: 0
      });
      await app.save();
    }

    // Create XP record
    const xpRecord = new XPRecord({
      walletAddress,
      appId: app._id,
      amount: parseInt(amount),
      type,
      timestamp: new Date()
    });
    await xpRecord.save();

    // Update user's total XP
    const user = await User.findOne({ walletAddress });
    if (user) {
      user.totalXP += parseInt(amount);
      user.level = Math.floor(user.totalXP / 1000) + 1;
      await user.save();
    }

    // Update app statistics
    app.totalUsers = await XPRecord.distinct('walletAddress', { appId: app._id }).length;
    const avgXPResult = await XPRecord.aggregate([
      { $match: { appId: app._id } },
      { $group: { _id: null, avgXP: { $avg: '$amount' } } }
    ]);
    app.avgXPPerUser = avgXPResult[0]?.avgXP || 0;
    await app.save();
    
    res.json({
      success: true,
      message: 'XP added successfully',
      data: {
        walletAddress,
        appName,
        amount,
        newTotalXP: user?.totalXP || 0,
        newLevel: user?.level || 1
      }
    });
  } catch (error) {
    console.error('Error adding XP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add XP',
      error: error.message
    });
  }
});

module.exports = router;

