const express = require('express');
const { getDB } = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');
const { cleanString } = require('../utils/helpers');
const { sendAdminPhysioApplicationNotification } = require('../utils/email');
const crypto = require('crypto');

const router = express.Router();

const VALID_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected'];

// POST /api/physio — Submit application
router.post('/', async (req, res) => {
  try {
    const {
      full_name, email, phone, city, preferred_contact,
      hcpc_number, years_experience, specialisations, qualifications, biography,
      areas_covered, preferred_days, preferred_hours, home_visit_availability,
      additional_info, consent_privacy
    } = req.body;

    const errors = [];
    if (!full_name || !full_name.trim()) errors.push('Please enter your full name.');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) errors.push('Please enter a valid email address.');
    
    if (!phone || !phone.trim()) errors.push('Please enter your phone number.');
    if (!city || !city.trim()) errors.push('Please enter your city.');
    if (!areas_covered || !areas_covered.trim()) errors.push('Please specify the areas you cover.');
    if (!consent_privacy) errors.push('Privacy consent is required.');

    if (errors.length) {
      return res.status(422).json({ success: false, message: errors[0], errors });
    }

    const application_ref = crypto.randomBytes(16).toString('hex').substring(0, 32);

    const sql = getDB();

    await sql`
      INSERT INTO physio_applications (
        application_ref, full_name, email, phone, city, preferred_contact,
        hcpc_number, years_experience, specialisations, qualifications, biography,
        areas_covered, preferred_days, preferred_hours, home_visit_availability,
        additional_info, consent_privacy, status
      ) VALUES (
        ${application_ref}, ${cleanString(full_name, 255)}, ${email.trim()}, ${cleanString(phone, 50)},
        ${cleanString(city, 100)}, ${cleanString(preferred_contact || 'Email', 20)},
        ${cleanString(hcpc_number || '', 100)}, ${parseInt(years_experience, 10) || null},
        ${cleanString(specialisations || '', 2000)}, ${cleanString(qualifications || '', 2000)},
        ${cleanString(biography || '', 2000)}, ${cleanString(areas_covered, 2000)},
        ${cleanString(preferred_days || '', 255)}, ${cleanString(preferred_hours || '', 255)},
        ${home_visit_availability ? true : false}, ${cleanString(additional_info || '', 2000)},
        ${consent_privacy ? true : false}, 'Pending'
      )
    `;

    // Note: Email could be sent here to admin and applicant if required using email.js
    // For now we assume they just want it saved correctly

    // Send notification to admin
    await sendAdminPhysioApplicationNotification({
      full_name, email, phone, city, hcpc_number
    });

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully. We will be in touch soon.'
    });
  } catch (err) {
    console.error('Submit physio application error:', err);
    res.status(500).json({ success: false, message: 'We could not save your application right now. Please try again.' });
  }
});

// GET /api/physio/admin — list all applications (admin)
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const rows = await sql`
      SELECT id, application_ref, full_name, email, phone, city, status, created_at
      FROM physio_applications
      ORDER BY created_at DESC
    `;
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/physio/admin/:id — Get single application details
router.get('/admin/:id', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid ID.' });

    const rows = await sql`SELECT * FROM physio_applications WHERE id = ${id} LIMIT 1`;
    if (!rows.length) return res.status(404).json({ success: false, message: 'Application not found.' });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get application error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/physio/admin/:id — update status (admin)
router.put('/admin/:id', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    const { status, internal_notes } = req.body;

    if (isNaN(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid ID.' });

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const updateFields = [];
    if (internal_notes !== undefined) {
      const rows = await sql`UPDATE physio_applications SET status = ${status}, internal_notes = ${internal_notes} WHERE id = ${id} RETURNING *`;
      if (!rows.length) return res.status(404).json({ success: false, message: 'Application not found.' });
    } else {
      const rows = await sql`UPDATE physio_applications SET status = ${status} WHERE id = ${id} RETURNING *`;
      if (!rows.length) return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.json({ success: true, message: 'Application updated successfully.' });
  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
