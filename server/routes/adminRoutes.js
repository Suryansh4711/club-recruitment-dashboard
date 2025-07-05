// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

console.log('👨‍💼 Admin routes loaded');

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// POST /api/admin/login - Admin login
router.post('/login', async (req, res) => {
  console.log('🔐 POST /admin/login route hit', req.body);
  try {
    const { clubId, password } = req.body;

    // Production admin credentials from environment variables
    const validCredentials = [
      { 
        clubId: process.env.ADMIN_CLUB_ID || 'CODEBUSTERS2025', 
        password: process.env.ADMIN_PASSWORD || 'CodeBusters@2025', 
        role: 'super_admin', 
        name: 'CodeBusters Admin' 
      }
    ];

    const validCredential = validCredentials.find(
      cred => cred.clubId === clubId && cred.password === password
    );

    if (!validCredential) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        clubId: validCredential.clubId,
        role: validCredential.role,
        name: validCredential.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        clubId: validCredential.clubId,
        role: validCredential.role,
        name: validCredential.name
      }
    });

  } catch (err) {
    console.error('❌ Admin login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/profile - Get admin profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      admin: {
        clubId: req.admin.clubId,
        role: req.admin.role,
        name: req.admin.name
      }
    });
  } catch (err) {
    console.error('❌ Get admin profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/logout - Admin logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('❌ Admin logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.admin = admin;
    next();
  });
}

module.exports = router;
