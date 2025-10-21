const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, verifyWalletSignature, authenticateToken } = require('../middleware/auth');

// Wallet-based login
router.post('/login', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and signature are required'
      });
    }

    // Verify wallet signature
    const isValidSignature = await verifyWalletSignature(walletAddress, signature, message);
    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // Check if user exists
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        username: `User${walletAddress.slice(-4)}`
      });
      await user.save();
      isNewUser = true;
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(walletAddress);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        totalXP: user.totalXP,
        level: user.level,
        isNewUser
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

router.post('/logout', async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // We could implement token blacklisting here if needed
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

router.get('/verify', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token is valid',
      user: {
        walletAddress: req.user.walletAddress,
        username: req.user.username,
        totalXP: req.user.totalXP,
        level: req.user.level,
        isAuthenticated: true
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
});

module.exports = router;

