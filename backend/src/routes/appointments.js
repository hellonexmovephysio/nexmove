const express = require('express');
const { getDB } = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const VALID_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

// GET /api/appointments — list all (with optional ?status= filter)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const { status } = req.query;

    let rows;
    if (status && VALID_STATUSES.includes(status)) {
      rows = await sql`
        SELECT b.id, b.full_name AS name, b.email, b.phone, 
               COALESCE(s.name, 'Unknown') AS service, 
               b.preferred_date AS appointment_date, 
               b.preferred_time AS appointment_time, 
               b.symptoms AS message,
               b.status, b.created_at
        FROM bookings b
        LEFT JOIN services s ON s.id = b.service_id
        WHERE b.status = ${status.toLowerCase()}
        ORDER BY b.preferred_date ASC, b.preferred_time ASC
      `;
    } else {
      rows = await sql`
        SELECT b.id, b.full_name AS name, b.email, b.phone, 
               COALESCE(s.name, 'Unknown') AS service, 
               b.preferred_date AS appointment_date, 
               b.preferred_time AS appointment_time, 
               b.symptoms AS message,
               b.status, b.created_at
        FROM bookings b
        LEFT JOIN services s ON s.id = b.service_id
        ORDER BY b.preferred_date ASC, b.preferred_time ASC
      `;
    }

    // capitalize status for frontend
    rows = rows.map(r => ({...r, status: r.status.charAt(0).toUpperCase() + r.status.slice(1)}));

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get appointments error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/appointments/stats — counts by status
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const rows = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed,
        COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
        COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled
      FROM bookings
    `;
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/appointments/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    }

    const rows = await sql`
      SELECT b.id, b.full_name AS name, b.email, b.phone, 
             COALESCE(s.name, 'Unknown') AS service, 
             b.preferred_date AS appointment_date, 
             b.preferred_time AS appointment_time, 
             b.symptoms AS message,
             b.status, b.created_at,
             b.approval_email_sent, b.approval_email_error
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.id = ${id} LIMIT 1
    `;
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const data = rows[0];
    data.status = data.status.charAt(0).toUpperCase() + data.status.slice(1);

    res.json({ success: true, data });
  } catch (err) {
    console.error('Get appointment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/appointments — create from book.php form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, appointment_date, appointment_time, message } = req.body;

    // Validation (same as book.php)
    const errors = [];
    if (!name || !name.trim()) errors.push('Please enter your full name.');
    if (!email || !email.trim()) errors.push('Please enter your email.');
    if (!phone || !phone.trim()) errors.push('Please enter your phone number.');
    if (!service || !service.trim()) errors.push('Please select a service.');
    if (!appointment_date) errors.push('Please select an appointment date.');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address.');
    }

    // Validate date not in past
    if (appointment_date) {
      const today = new Date().toISOString().split('T')[0];
      if (appointment_date < today) {
        errors.push('Appointment date cannot be in the past.');
      }
    }

    if (errors.length) {
      return res.status(422).json({ success: false, message: errors[0], errors });
    }

    const sql = getDB();

    // Map the string service back to service_id or default to 1
    // For nexmove-booking-v4 compatibility, the frontend should now send service_id,
    // but if it still sends the name (from old book.php), try to look it up.
    let service_id = null;
    const isNumber = !isNaN(parseInt(service, 10));
    
    if (isNumber) {
        service_id = parseInt(service, 10);
    } else {
        const serviceRows = await sql`SELECT id FROM services WHERE name ILIKE ${service} OR slug ILIKE ${service}`;
        if (serviceRows.length) {
            service_id = serviceRows[0].id;
        } else {
            // fallback to first service
            const fb = await sql`SELECT id FROM services LIMIT 1`;
            if (fb.length) service_id = fb[0].id;
        }
    }

    const { bookingReference } = require('../utils/helpers');
    const reference = bookingReference();

    const rows = await sql`
      INSERT INTO bookings (
        booking_ref, full_name, email, phone, service_id, 
        preferred_date, preferred_time, symptoms, status
      )
      VALUES (
        ${reference}, ${name.trim()}, ${email.trim()}, ${phone.trim()}, ${service_id}, 
        ${appointment_date}, ${appointment_time || ''}, ${message || null}, 'pending'
      )
      RETURNING id
    `;

    res.status(201).json({
      success: true,
      message: 'Your appointment request has been sent successfully. Our team will contact you shortly.',
      data: { id: rows[0].id },
    });
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ success: false, message: 'We could not save your appointment right now. Please try again.' });
  }
});

// PUT /api/appointments/:id — update status (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const rows = await sql`
      UPDATE bookings SET status = ${status.toLowerCase()} WHERE id = ${id} RETURNING *
    `;

    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    let emailMessage = '';
    const booking = rows[0];

    // If status changed to confirmed and email hasn't been successfully sent yet
    if (status.toLowerCase() === 'confirmed' && !booking.approval_email_sent) {
      const extraData = await sql`
          SELECT s.name AS service_name, t.display_name AS therapist_name
          FROM bookings b
          LEFT JOIN services s ON b.service_id = s.id
          LEFT JOIN therapists t ON b.therapist_id = t.id
          WHERE b.id = ${id}
      `;
      const fullBooking = { ...booking, ...extraData[0] };
      
      const { sendApprovalEmail } = require('../utils/email');
      const emailResult = await sendApprovalEmail(fullBooking);
      
      if (emailResult.success) {
          await sql`UPDATE bookings SET approval_email_sent = TRUE, approval_email_sent_at = NOW(), approval_email_error = NULL WHERE id = ${id}`;
          emailMessage = ' Confirmation email sent.';
      } else {
          await sql`UPDATE bookings SET approval_email_error = ${emailResult.error} WHERE id = ${id}`;
          emailMessage = ' Confirmation email failed to send.';
      }
    }

    res.json({ success: true, message: 'Status updated.' + emailMessage });
  } catch (err) {
    console.error('Update appointment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/appointments/:id (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    }

    await sql`DELETE FROM bookings WHERE id = ${id}`;
    res.json({ success: true, message: 'Appointment deleted.' });
  } catch (err) {
    console.error('Delete appointment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/appointments/:id/resend-email (admin)
router.post('/:id/resend-email', authMiddleware, async (req, res) => {
  try {
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid ID.' });

    const rows = await sql`
      SELECT b.*, s.name AS service_name, t.display_name AS therapist_name
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN therapists t ON b.therapist_id = t.id
      WHERE b.id = ${id} LIMIT 1
    `;
    
    if (!rows.length) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    
    const booking = rows[0];
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Can only send email for confirmed appointments.' });
    }

    const { sendApprovalEmail } = require('../utils/email');
    const emailResult = await sendApprovalEmail(booking);

    if (emailResult.success) {
      await sql`UPDATE bookings SET approval_email_sent = TRUE, approval_email_sent_at = NOW(), approval_email_error = NULL WHERE id = ${id}`;
      res.json({ success: true, message: 'Confirmation email resent successfully.' });
    } else {
      await sql`UPDATE bookings SET approval_email_error = ${emailResult.error} WHERE id = ${id}`;
      res.status(500).json({ success: false, message: 'Failed to resend email.', error: emailResult.error });
    }
  } catch (err) {
    console.error('Resend email error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
