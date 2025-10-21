const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT token
const generateToken = (walletAddress) => {
  return jwt.sign(
    { walletAddress },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Verify wallet signature (simplified for demo)
const verifyWalletSignature = async (walletAddress, signature, message) => {
  // In a real implementation, you would verify the signature against the message
  // For now, we'll just check if the signature exists
  return signature && signature.length > 0;
};

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ walletAddress: decoded.walletAddress });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = {
  generateToken,
  verifyWalletSignature,
  authenticateToken
};
