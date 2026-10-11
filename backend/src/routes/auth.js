const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Temporary owner-account initializer. Removed immediately after one production use.
router.get('/initialize-owner-account-7f3c9a', async (req, res) => {
  try {
    const setupPassword = process.env.ADMIN_SETUP_PASSWORD;
    if (!setupPassword) {
      return res.status(404).json({ success: false });
    }

    const sql = getDB();
    const passwordHash = await bcrypt.hash(setupPassword, 12);

    await sql`
      INSERT INTO admins (username, password)
      VALUES ('nexmoveowner', ${passwordHash})
      ON CONFLICT (username)
      DO UPDATE SET password = EXCLUDED.password
    `;

    return res.json({ success: true, username: 'nexmoveowner' });
  } catch (err) {
    console.error('Owner account setup error:', err);
    return res.status(500).json({ success: false, message: 'Owner account setup failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const sql = getDB();
    const rows = await sql`SELECT * FROM admins WHERE username = ${username} LIMIT 1`;
    const admin = rows[0];

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = router;
