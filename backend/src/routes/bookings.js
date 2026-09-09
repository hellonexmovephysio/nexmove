const express = require('express');
const { getDB } = require('../db/pool');
const { bookingReference, cleanString } = require('../utils/helpers');

const router = express.Router();

// GET /api/bookings/form-data — services, conditions, therapists for form
router.get('/form-data', async (req, res) => {
  try {
    const sql = getDB();
    const [services, conditions, therapists] = await Promise.all([
      sql`SELECT * FROM services WHERE active = TRUE ORDER BY sort_order, id`,
      sql`SELECT * FROM conditions WHERE active = TRUE ORDER BY sort_order, id`,
      sql`SELECT * FROM therapists WHERE active = TRUE ORDER BY display_name`,
    ]);

    res.json({ success: true, data: { services, conditions, therapists } });
  } catch (err) {
    console.error('Get form data error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/bookings — create booking (mirrors create_booking.php exactly)
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    const serviceId = parseInt(body.service_id, 10) || 0;
    const conditionId = body.condition_id ? parseInt(body.condition_id, 10) || null : null;
    const therapistId = body.therapist_id ? parseInt(body.therapist_id, 10) || null : null;

    const fullName = cleanString(body.full_name, 120);
    const email = (body.email || '').trim();
    const phone = cleanString(body.phone, 40);
    const dob = cleanString(body.date_of_birth, 10);
    const postcode = cleanString(body.postcode, 16).toUpperCase();
    const address = cleanString(body.address_line1, 190);
    const city = cleanString(body.city, 100);
    const accessDetails = cleanString(body.access_details, 255);
    const issueDuration = cleanString(body.issue_duration, 50);
    const painLevel = body.pain_level !== undefined && body.pain_level !== '' ? parseInt(body.pain_level, 10) : null;
    const symptoms = (body.symptoms || '').trim().substring(0, 2000);
    const mobilityAid = body.mobility_aid ? true : false;
    const fallRisk = body.fall_risk ? true : false;
    const preferredDate = cleanString(body.preferred_date, 10);
    const preferredTime = cleanString(body.preferred_time, 40);
    const consentPrivacy = body.consent_privacy ? true : false;
    const consentUpdates = body.consent_updates ? true : false;

    // Validation (same as create_booking.php)
    const errors = [];
    if (!serviceId) errors.push('Choose a service.');
    if (!fullName) errors.push('Enter your full name.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) errors.push('Enter a valid email address.');
    if (!phone) errors.push('Enter your phone number.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) errors.push('Enter a valid date of birth.');
    if (!postcode || !address || !city) errors.push('Complete your visit address.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) errors.push('Choose a preferred appointment date.');
    if (!preferredTime) errors.push('Choose a preferred time.');
    if (!consentPrivacy) errors.push('Privacy consent is required.');

    // Date not in past
    if (preferredDate) {
      const today = new Date().toISOString().split('T')[0];
      if (preferredDate < today) errors.push('Preferred date cannot be in the past.');
    }

    // Pain level range
    if (painLevel !== null && (painLevel < 0 || painLevel > 10)) {
      errors.push('Pain level must be between 0 and 10.');
    }

    if (errors.length) {
      return res.status(422).json({ ok: false, message: 'Please correct the form.', errors });
    }

    const sql = getDB();

    // Verify service exists and is active
    const serviceRows = await sql`SELECT id FROM services WHERE id = ${serviceId} AND active = TRUE`;
    if (!serviceRows.length) {
      return res.status(422).json({ ok: false, message: 'The selected service is not available.' });
    }

    const reference = bookingReference();

    await sql`
      INSERT INTO bookings (
        booking_ref, service_id, full_name, email, phone, date_of_birth,
        postcode, address_line1, city, access_details, condition_id,
        issue_duration, pain_level, symptoms, mobility_aid, fall_risk,
        preferred_date, preferred_time, therapist_id, consent_privacy, consent_updates
      ) VALUES (
        ${reference}, ${serviceId}, ${fullName}, ${email}, ${phone}, ${dob},
        ${postcode}, ${address}, ${city}, ${accessDetails || null}, ${conditionId},
        ${issueDuration || null}, ${painLevel}, ${symptoms || null}, ${mobilityAid}, ${fallRisk},
        ${preferredDate}, ${preferredTime}, ${therapistId}, ${consentPrivacy}, ${consentUpdates}
      )
    `;

    res.status(201).json({
      ok: true,
      reference,
      redirect: `confirmation.html?ref=${encodeURIComponent(reference)}`,
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ ok: false, message: 'We could not save your booking. Please try again.' });
  }
});

// GET /api/bookings/:ref — get booking by reference (for confirmation page)
router.get('/:ref', async (req, res) => {
  try {
    const sql = getDB();
    const ref = cleanString(req.params.ref, 32);

    if (!ref) {
      return res.status(400).json({ ok: false, message: 'Reference is required.' });
    }

    const rows = await sql`
      SELECT b.*, s.name AS service_name, s.duration_minutes, s.appointment_type, s.price_pence
      FROM bookings b
      JOIN services s ON s.id = b.service_id
      WHERE b.booking_ref = ${ref}
      LIMIT 1
    `;

    if (!rows.length) {
      return res.status(404).json({ ok: false, message: 'Booking not found.' });
    }

    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ ok: false, message: 'Server error.' });
  }
});

module.exports = router;
