const express = require('express');
const { getDB } = require('../db/pool');

const router = express.Router();

// POST /api/contact — replaces mail.php (stores in DB instead of sending email)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Valid email is required.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const sql = getDB();
    await sql`
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (${name.trim()}, ${email.trim()}, ${(phone || '').trim() || null}, ${(subject || '').trim() || null}, ${message.trim()})
    `;

    res.status(201).json({ success: true, message: 'Thank You! Your message has been sent.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ success: false, message: 'Oops! Something went wrong, we couldn\'t send your message.' });
  }
});

module.exports = router;
