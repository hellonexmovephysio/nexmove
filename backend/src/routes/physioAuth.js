const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDB } = require('../db/pool');
const { cleanString } = require('../utils/helpers');
const { ensurePhysioPortalSchema } = require('../db/physioPortalSchema');
const {
  physioAuthMiddleware,
  setPhysioSessionCookie,
  clearPhysioSessionCookie,
} = require('../middleware/physioAuth');
const { sendPhysioPasswordResetEmail, sendAdminPhysioApplicationNotification } = require('../utils/email');

const router = express.Router();

function normaliseEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function publicUser(row) {
  return {
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone || '',
    account_status: row.account_status,
    created_at: row.created_at,
  };
}

async function getApplicationByUser(sql, userId) {
  const rows = await sql`
    SELECT *
    FROM physio_applications
    WHERE physio_user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  return rows[0] || null;
}

// POST /api/physio-auth/signup
router.post('/signup', async (req, res) => {
  try {
    await ensurePhysioPortalSchema();

    const fullName = cleanString(req.body.full_name || '', 255).trim();
    const email = normaliseEmail(req.body.email);
    const phone = cleanString(req.body.phone || '', 50).trim();
    const password = String(req.body.password || '');
    const confirmPassword = String(req.body.confirm_password || '');
    const consentPrivacy = Boolean(req.body.consent_privacy);

    const errors = [];
    if (!fullName) errors.push('Please enter your full name.');
    if (!validEmail(email)) errors.push('Please enter a valid email address.');
    if (!phone) errors.push('Please enter your mobile number.');
    if (password.length < 10) errors.push('Use at least 10 characters for your password.');
    if (password !== confirmPassword) errors.push('Passwords do not match.');
    if (!consentPrivacy) errors.push('Privacy consent is required.');

    if (errors.length) {
      return res.status(422).json({ success: false, message: errors[0], errors });
    }

    const sql = getDB();
    const existing = await sql`
      SELECT id FROM physio_users WHERE email = ${email} LIMIT 1
    `;
    if (existing.length) {
      return res.status(409).json({
        success: false,
        message: 'An account already exists for this email. Please sign in instead.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const rows = await sql`
      INSERT INTO physio_users (full_name, email, phone, password_hash)
      VALUES (${fullName}, ${email}, ${phone}, ${passwordHash})
      RETURNING id, full_name, email, phone, account_status, created_at
    `;

    const user = rows[0];
    setPhysioSessionCookie(res, user);

    return res.status(201).json({
      success: true,
      message: 'Your practitioner account has been created.',
      user: publicUser(user),
      next: '/join-as-physio/index.html',
    });
  } catch (err) {
    console.error('Practitioner signup error:', err);
    return res.status(500).json({ success: false, message: 'We could not create your account right now.' });
  }
});

// POST /api/physio-auth/login
router.post('/login', async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const email = normaliseEmail(req.body.email);
    const password = String(req.body.password || '');

    if (!validEmail(email) || !password) {
      return res.status(400).json({ success: false, message: 'Enter your email and password.' });
    }

    const sql = getDB();
    const rows = await sql`
      SELECT * FROM physio_users WHERE email = ${email} LIMIT 1
    `;
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    }

    if (user.account_status !== 'Active') {
      return res.status(403).json({ success: false, message: 'This practitioner account is not active.' });
    }

    setPhysioSessionCookie(res, user);
    const application = await getApplicationByUser(sql, user.id);

    return res.json({
      success: true,
      user: publicUser(user),
      application: application ? {
        id: application.id,
        application_ref: application.application_ref,
        status: application.status,
      } : null,
      next: application ? '/physio/dashboard.html' : '/join-as-physio/index.html',
    });
  } catch (err) {
    console.error('Practitioner login error:', err);
    return res.status(500).json({ success: false, message: 'We could not sign you in right now.' });
  }
});

// POST /api/physio-auth/logout
router.post('/logout', (req, res) => {
  clearPhysioSessionCookie(res);
  res.json({ success: true });
});

// GET /api/physio-auth/me
router.get('/me', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const rows = await sql`
      SELECT id, full_name, email, phone, account_status, created_at
      FROM physio_users
      WHERE id = ${req.physio.id}
      LIMIT 1
    `;
    if (!rows.length) {
      clearPhysioSessionCookie(res);
      return res.status(401).json({ success: false, message: 'Practitioner account not found.' });
    }

    const application = await getApplicationByUser(sql, req.physio.id);
    res.json({
      success: true,
      user: publicUser(rows[0]),
      application: application ? {
        id: application.id,
        application_ref: application.application_ref,
        status: application.status,
        created_at: application.created_at,
        updated_at: application.updated_at,
      } : null,
    });
  } catch (err) {
    console.error('Practitioner me error:', err);
    res.status(500).json({ success: false, message: 'Could not load your practitioner account.' });
  }
});

// GET /api/physio-auth/application
router.get('/application', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const application = await getApplicationByUser(sql, req.physio.id);
    res.json({ success: true, application });
  } catch (err) {
    console.error('Practitioner application get error:', err);
    res.status(500).json({ success: false, message: 'Could not load your application.' });
  }
});

// POST /api/physio-auth/application
router.post('/application', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();

    const userRows = await sql`
      SELECT id, full_name, email, phone
      FROM physio_users
      WHERE id = ${req.physio.id}
      LIMIT 1
    `;
    if (!userRows.length) {
      return res.status(401).json({ success: false, message: 'Practitioner account not found.' });
    }
    const user = userRows[0];

    const existing = await getApplicationByUser(sql, req.physio.id);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You have already submitted an application. You can track it from your practitioner dashboard.',
      });
    }

    const city = cleanString(req.body.city || '', 100).trim();
    const preferredContact = cleanString(req.body.preferred_contact || 'Email', 20);
    const hcpcNumber = cleanString(req.body.hcpc_number || '', 100).trim();
    const yearsExperience = Number.parseInt(req.body.years_experience, 10);
    const specialisations = cleanString(req.body.specialisations || '', 2000);
    const qualifications = cleanString(req.body.qualifications || '', 2000);
    const biography = cleanString(req.body.biography || '', 2000);
    const areasCovered = cleanString(req.body.areas_covered || '', 2000).trim();
    const preferredDays = cleanString(req.body.preferred_days || '', 255);
    const preferredHours = cleanString(req.body.preferred_hours || '', 255);
    const homeVisitAvailability = Boolean(req.body.home_visit_availability);
    const rightToWork = req.body.right_to_work === true || req.body.right_to_work === 'true' || req.body.right_to_work === 'yes';
    const eligibilityType = cleanString(req.body.eligibility_type || '', 120);
    const cspMember = req.body.csp_member === true || req.body.csp_member === 'true' || req.body.csp_member === 'yes';
    const ukExperience = req.body.uk_experience === true || req.body.uk_experience === 'true' || req.body.uk_experience === 'yes';
    const additionalInfo = cleanString(req.body.additional_info || '', 2000);
    const consentPrivacy = Boolean(req.body.consent_privacy);
    const agreeDeclaration = Boolean(req.body.agree_declaration);

    const errors = [];
    if (!city) errors.push('Please enter your city.');
    if (!areasCovered) errors.push('Please specify the areas you can cover.');
    if (!hcpcNumber) errors.push('Please enter your HCPC registration number.');
    if (!specialisations) errors.push('Please select or enter your clinical specialisations.');
    if (!qualifications) errors.push('Please enter your physiotherapy qualifications.');
    if (!consentPrivacy) errors.push('Privacy consent is required.');
    if (!agreeDeclaration) errors.push('Please confirm the applicant declaration.');

    if (errors.length) {
      return res.status(422).json({ success: false, message: errors[0], errors });
    }

    const applicationRef = 'NEX-PHY-' + crypto.randomBytes(5).toString('hex').toUpperCase();

    const rows = await sql`
      INSERT INTO physio_applications (
        application_ref, physio_user_id, full_name, email, phone, city, preferred_contact,
        hcpc_number, years_experience, specialisations, qualifications, biography,
        areas_covered, preferred_days, preferred_hours, home_visit_availability,
        right_to_work, eligibility_type, csp_member, uk_experience,
        additional_info, consent_privacy, agree_declaration, status
      ) VALUES (
        ${applicationRef}, ${req.physio.id}, ${user.full_name}, ${user.email}, ${user.phone || ''},
        ${city}, ${preferredContact}, ${hcpcNumber},
        ${Number.isFinite(yearsExperience) ? yearsExperience : null},
        ${specialisations}, ${qualifications}, ${biography},
        ${areasCovered}, ${preferredDays}, ${preferredHours}, ${homeVisitAvailability},
        ${rightToWork}, ${eligibilityType}, ${cspMember}, ${ukExperience},
        ${additionalInfo}, ${consentPrivacy}, ${agreeDeclaration}, 'Pending'
      )
      RETURNING id, application_ref, status, created_at
    `;

    await sendAdminPhysioApplicationNotification({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone || '',
      city,
      hcpc_number: hcpcNumber,
    });

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully.',
      application: rows[0],
      next: '/physio/dashboard.html',
    });
  } catch (err) {
    console.error('Practitioner application submit error:', err);
    res.status(500).json({ success: false, message: 'We could not submit your application right now.' });
  }
});

// POST /api/physio-auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const email = normaliseEmail(req.body.email);

    const generic = {
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    };

    if (!validEmail(email)) return res.json(generic);

    const sql = getDB();
    const rows = await sql`
      SELECT id, full_name, email FROM physio_users WHERE email = ${email} LIMIT 1
    `;
    if (!rows.length) return res.json(generic);

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await sql`
      UPDATE physio_users
      SET password_reset_token_hash = ${tokenHash},
          password_reset_expires_at = ${expiry.toISOString()},
          updated_at = NOW()
      WHERE id = ${rows[0].id}
    `;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    await sendPhysioPasswordResetEmail({
      full_name: rows[0].full_name,
      email: rows[0].email,
      reset_url: `${baseUrl}/physio/reset-password.html?token=${encodeURIComponent(token)}`,
    });

    return res.json(generic);
  } catch (err) {
    console.error('Practitioner forgot password error:', err);
    return res.status(500).json({ success: false, message: 'We could not start password recovery right now.' });
  }
});

// POST /api/physio-auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const token = String(req.body.token || '');
    const password = String(req.body.password || '');
    const confirmPassword = String(req.body.confirm_password || '');

    if (!token) return res.status(400).json({ success: false, message: 'Reset token is missing.' });
    if (password.length < 10) return res.status(422).json({ success: false, message: 'Use at least 10 characters for your password.' });
    if (password !== confirmPassword) return res.status(422).json({ success: false, message: 'Passwords do not match.' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const sql = getDB();
    const rows = await sql`
      SELECT id
      FROM physio_users
      WHERE password_reset_token_hash = ${tokenHash}
        AND password_reset_expires_at > NOW()
      LIMIT 1
    `;

    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await sql`
      UPDATE physio_users
      SET password_hash = ${passwordHash},
          password_reset_token_hash = NULL,
          password_reset_expires_at = NULL,
          updated_at = NOW()
      WHERE id = ${rows[0].id}
    `;

    return res.json({ success: true, message: 'Your password has been reset. You can now sign in.' });
  } catch (err) {
    console.error('Practitioner reset password error:', err);
    return res.status(500).json({ success: false, message: 'We could not reset your password right now.' });
  }
});

module.exports = router;
