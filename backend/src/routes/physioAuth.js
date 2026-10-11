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
const {
  sendPhysioPasswordResetEmail,
  sendPhysioVerificationEmail,
  sendAdminPhysioApplicationNotification,
} = require('../utils/email');

const router = express.Router();

const DOCUMENT_TYPES = ['cv', 'indemnity', 'qualification', 'dbs', 'right_to_work'];
const DOCUMENT_MIMES = ['application/pdf', 'image/jpeg', 'image/png'];
const DOCUMENT_MAX_BYTES = 5 * 1024 * 1024;

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
    practitioner_status: row.practitioner_status || 'Applicant',
    email_verified: Boolean(row.email_verified_at),
    email_verified_at: row.email_verified_at || null,
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

function createOneTimeToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

function documentKey() {
  const source = process.env.PHYSIO_DOCUMENT_KEY || process.env.JWT_SECRET;
  if (!source) throw new Error('Document encryption key is not configured');
  return crypto.createHash('sha256').update(String(source)).digest();
}

function encryptDocument(buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', documentKey(), iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { encrypted, iv, authTag: cipher.getAuthTag() };
}

function safeFileName(value) {
  const name = String(value || 'document').replace(/[\\/\0\r\n]/g, '_').trim();
  return cleanString(name || 'document', 255);
}

function detectMime(buffer, claimed) {
  if (!Buffer.isBuffer(buffer) || !buffer.length) return null;
  if (buffer.length >= 4 && buffer.subarray(0, 4).toString('hex') === '25504446') return 'application/pdf';
  if (buffer.length >= 3 && buffer.subarray(0, 3).toString('hex') === 'ffd8ff') return 'image/jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).toString('hex') === '89504e470d0a1a0a') return 'image/png';
  return DOCUMENT_MIMES.includes(claimed) ? claimed : null;
}

function applicationSummary(application) {
  if (!application) return null;
  return {
    id: application.id,
    application_ref: application.application_ref,
    status: application.status,
    verification_status: application.verification_status || 'Not Requested',
    verification_notes: application.verification_notes || '',
    created_at: application.created_at,
    updated_at: application.updated_at,
  };
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
    const existing = await sql`SELECT id FROM physio_users WHERE email = ${email} LIMIT 1`;
    if (existing.length) {
      return res.status(409).json({
        success: false,
        message: 'An account already exists for this email. Please sign in instead.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verification = createOneTimeToken();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const rows = await sql`
      INSERT INTO physio_users (
        full_name, email, phone, password_hash,
        email_verification_token_hash, email_verification_expires_at
      )
      VALUES (
        ${fullName}, ${email}, ${phone}, ${passwordHash},
        ${verification.hash}, ${verificationExpiry.toISOString()}
      )
      RETURNING id, full_name, email, phone, account_status, practitioner_status,
                email_verified_at, created_at
    `;

    const user = rows[0];
    setPhysioSessionCookie(res, user);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const mail = await sendPhysioVerificationEmail({
      full_name: user.full_name,
      email: user.email,
      verify_url: `${baseUrl}/physio/verify-email.html?token=${encodeURIComponent(verification.token)}&email=${encodeURIComponent(user.email)}`,
    });

    return res.status(201).json({
      success: true,
      message: mail.success
        ? 'Your account has been created. Check your email to verify your address.'
        : 'Your account has been created, but the verification email could not be sent. Use Resend verification email.',
      email_sent: Boolean(mail.success),
      user: publicUser(user),
      next: `/physio/verify-email.html?email=${encodeURIComponent(user.email)}`,
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
    const rows = await sql`SELECT * FROM physio_users WHERE email = ${email} LIMIT 1`;
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    }
    if (user.account_status !== 'Active') {
      return res.status(403).json({ success: false, message: 'This practitioner account is not active.' });
    }

    setPhysioSessionCookie(res, user);
    const application = await getApplicationByUser(sql, user.id);

    let next = '/physio/application.html';
    if (!user.email_verified_at) {
      next = `/physio/verify-email.html?email=${encodeURIComponent(user.email)}`;
    } else if (application) {
      next = '/physio/dashboard.html';
    }

    return res.json({
      success: true,
      user: publicUser(user),
      application: applicationSummary(application),
      next,
    });
  } catch (err) {
    console.error('Practitioner login error:', err);
    return res.status(500).json({ success: false, message: 'We could not sign you in right now.' });
  }
});

router.post('/logout', (req, res) => {
  clearPhysioSessionCookie(res);
  res.json({ success: true });
});

// POST /api/physio-auth/verify-email
router.post('/verify-email', async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const token = String(req.body.token || '');
    if (!token) return res.status(400).json({ success: false, message: 'Verification token is missing.' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const sql = getDB();
    const rows = await sql`
      SELECT *
      FROM physio_users
      WHERE email_verification_token_hash = ${tokenHash}
        AND email_verification_expires_at > NOW()
      LIMIT 1
    `;

    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'This verification link is invalid or has expired.' });
    }

    const updated = await sql`
      UPDATE physio_users
      SET email_verified_at = COALESCE(email_verified_at, NOW()),
          email_verification_token_hash = NULL,
          email_verification_expires_at = NULL,
          updated_at = NOW()
      WHERE id = ${rows[0].id}
      RETURNING *
    `;

    setPhysioSessionCookie(res, updated[0]);
    const application = await getApplicationByUser(sql, updated[0].id);

    res.json({
      success: true,
      message: 'Your email has been verified.',
      next: application ? '/physio/dashboard.html' : '/physio/application.html',
    });
  } catch (err) {
    console.error('Practitioner email verification error:', err);
    res.status(500).json({ success: false, message: 'We could not verify your email right now.' });
  }
});

// POST /api/physio-auth/resend-verification
router.post('/resend-verification', async (req, res) => {
  const generic = {
    success: true,
    message: 'If that account still needs verification, a new email has been sent.',
  };

  try {
    await ensurePhysioPortalSchema();
    const email = normaliseEmail(req.body.email);
    if (!validEmail(email)) return res.json(generic);

    const sql = getDB();
    const rows = await sql`
      SELECT id, full_name, email, email_verified_at
      FROM physio_users
      WHERE email = ${email}
      LIMIT 1
    `;
    if (!rows.length || rows[0].email_verified_at) return res.json(generic);

    const verification = createOneTimeToken();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await sql`
      UPDATE physio_users
      SET email_verification_token_hash = ${verification.hash},
          email_verification_expires_at = ${expiry.toISOString()},
          updated_at = NOW()
      WHERE id = ${rows[0].id}
    `;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    await sendPhysioVerificationEmail({
      full_name: rows[0].full_name,
      email: rows[0].email,
      verify_url: `${baseUrl}/physio/verify-email.html?token=${encodeURIComponent(verification.token)}&email=${encodeURIComponent(rows[0].email)}`,
    });

    res.json(generic);
  } catch (err) {
    console.error('Practitioner resend verification error:', err);
    res.status(500).json({ success: false, message: 'We could not resend the verification email right now.' });
  }
});

// GET /api/physio-auth/me
router.get('/me', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const rows = await sql`
      SELECT id, full_name, email, phone, account_status, practitioner_status,
             email_verified_at, created_at
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
      application: applicationSummary(application),
    });
  } catch (err) {
    console.error('Practitioner me error:', err);
    res.status(500).json({ success: false, message: 'Could not load your practitioner account.' });
  }
});

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

router.post('/application', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();

    const userRows = await sql`
      SELECT id, full_name, email, phone, email_verified_at
      FROM physio_users
      WHERE id = ${req.physio.id}
      LIMIT 1
    `;
    if (!userRows.length) return res.status(401).json({ success: false, message: 'Practitioner account not found.' });
    const user = userRows[0];

    if (!user.email_verified_at) {
      return res.status(403).json({ success: false, message: 'Verify your email before submitting your application.' });
    }

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
    if (errors.length) return res.status(422).json({ success: false, message: errors[0], errors });

    const applicationRef = 'NEX-PHY-' + crypto.randomBytes(5).toString('hex').toUpperCase();
    const rows = await sql`
      INSERT INTO physio_applications (
        application_ref, physio_user_id, full_name, email, phone, city, preferred_contact,
        hcpc_number, years_experience, specialisations, qualifications, biography,
        areas_covered, preferred_days, preferred_hours, home_visit_availability,
        right_to_work, eligibility_type, csp_member, uk_experience,
        additional_info, consent_privacy, agree_declaration, status, verification_status
      ) VALUES (
        ${applicationRef}, ${req.physio.id}, ${user.full_name}, ${user.email}, ${user.phone || ''},
        ${city}, ${preferredContact}, ${hcpcNumber},
        ${Number.isFinite(yearsExperience) ? yearsExperience : null},
        ${specialisations}, ${qualifications}, ${biography},
        ${areasCovered}, ${preferredDays}, ${preferredHours}, ${homeVisitAvailability},
        ${rightToWork}, ${eligibilityType}, ${cspMember}, ${ukExperience},
        ${additionalInfo}, ${consentPrivacy}, ${agreeDeclaration}, 'Pending', 'Not Requested'
      )
      RETURNING id, application_ref, status, verification_status, created_at
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

// GET /api/physio-auth/documents
router.get('/documents', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const rows = await sql`
      SELECT id, document_type, original_name, mime_type, file_size, status,
             reviewer_notes, created_at, updated_at
      FROM physio_verification_documents
      WHERE physio_user_id = ${req.physio.id}
      ORDER BY document_type, created_at DESC
    `;
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Practitioner documents list error:', err);
    res.status(500).json({ success: false, message: 'Could not load verification documents.' });
  }
});

// POST /api/physio-auth/documents/:type
router.post(
  '/documents/:type',
  physioAuthMiddleware,
  express.raw({ type: 'application/octet-stream', limit: DOCUMENT_MAX_BYTES }),
  async (req, res) => {
    try {
      await ensurePhysioPortalSchema();
      const type = cleanString(req.params.type || '', 40);
      if (!DOCUMENT_TYPES.includes(type)) {
        return res.status(400).json({ success: false, message: 'Unsupported document type.' });
      }

      const sql = getDB();
      const application = await getApplicationByUser(sql, req.physio.id);
      if (!application) return res.status(404).json({ success: false, message: 'Submit your application first.' });

      const verificationStatus = application.verification_status || 'Not Requested';
      if (!['Required', 'Submitted', 'Issue'].includes(verificationStatus)) {
        return res.status(403).json({
          success: false,
          message: 'Verification documents can be uploaded only after NEXmove requests them.',
        });
      }

      const buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || []);
      if (!buffer.length) return res.status(400).json({ success: false, message: 'Choose a document to upload.' });
      if (buffer.length > DOCUMENT_MAX_BYTES) return res.status(413).json({ success: false, message: 'Document must be 5 MB or smaller.' });

      const claimedMime = cleanString(req.headers['x-file-mime'] || '', 100);
      const mime = detectMime(buffer, claimedMime);
      if (!mime || !DOCUMENT_MIMES.includes(mime)) {
        return res.status(415).json({ success: false, message: 'Upload a PDF, JPG or PNG document.' });
      }

      const originalName = safeFileName(req.headers['x-file-name']);
      const encrypted = encryptDocument(buffer);

      await sql`
        DELETE FROM physio_verification_documents
        WHERE physio_user_id = ${req.physio.id}
          AND document_type = ${type}
          AND status <> 'Verified'
      `;

      const rows = await sql`
        INSERT INTO physio_verification_documents (
          physio_user_id, application_id, document_type, original_name, mime_type,
          file_size, encrypted_data, iv, auth_tag, status
        ) VALUES (
          ${req.physio.id}, ${application.id}, ${type}, ${originalName}, ${mime},
          ${buffer.length}, ${encrypted.encrypted}, ${encrypted.iv}, ${encrypted.authTag}, 'Submitted'
        )
        RETURNING id, document_type, original_name, mime_type, file_size, status, created_at
      `;

      await sql`
        UPDATE physio_applications
        SET verification_status = 'Submitted', updated_at = NOW()
        WHERE id = ${application.id}
          AND verification_status IN ('Required', 'Issue')
      `;

      res.status(201).json({ success: true, message: 'Document uploaded securely.', document: rows[0] });
    } catch (err) {
      if (err && err.type === 'entity.too.large') {
        return res.status(413).json({ success: false, message: 'Document must be 5 MB or smaller.' });
      }
      console.error('Practitioner document upload error:', err);
      res.status(500).json({ success: false, message: 'We could not upload that document right now.' });
    }
  }
);

// GET /api/physio-auth/profile
router.get('/profile', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const profileRows = await sql`
      SELECT * FROM physio_profiles WHERE physio_user_id = ${req.physio.id} LIMIT 1
    `;
    const application = await getApplicationByUser(sql, req.physio.id);
    res.json({ success: true, profile: profileRows[0] || null, application });
  } catch (err) {
    console.error('Practitioner profile get error:', err);
    res.status(500).json({ success: false, message: 'Could not load your profile.' });
  }
});

// PUT /api/physio-auth/profile
router.put('/profile', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const userRows = await sql`
      SELECT id, full_name, practitioner_status FROM physio_users WHERE id = ${req.physio.id} LIMIT 1
    `;
    if (!userRows.length) return res.status(404).json({ success: false, message: 'Practitioner account not found.' });
    if (userRows[0].practitioner_status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Your practitioner profile becomes editable after activation.' });
    }

    const displayName = cleanString(req.body.display_name || userRows[0].full_name, 255);
    const biography = cleanString(req.body.biography || '', 2000);
    const areasCovered = cleanString(req.body.areas_covered || '', 2000);
    const preferredDays = cleanString(req.body.preferred_days || '', 255);
    const preferredHours = cleanString(req.body.preferred_hours || '', 255);
    const specialisations = cleanString(req.body.specialisations || '', 2000);

    const rows = await sql`
      UPDATE physio_profiles
      SET display_name = ${displayName},
          biography = ${biography},
          areas_covered = ${areasCovered},
          preferred_days = ${preferredDays},
          preferred_hours = ${preferredHours},
          specialisations = ${specialisations},
          updated_at = NOW()
      WHERE physio_user_id = ${req.physio.id}
      RETURNING *
    `;
    if (!rows.length) return res.status(404).json({ success: false, message: 'Practitioner profile is not active yet.' });
    res.json({ success: true, message: 'Profile updated.', profile: rows[0] });
  } catch (err) {
    console.error('Practitioner profile update error:', err);
    res.status(500).json({ success: false, message: 'Could not update your profile.' });
  }
});

// GET /api/physio-auth/appointments
router.get('/appointments', physioAuthMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const users = await sql`
      SELECT practitioner_status FROM physio_users WHERE id = ${req.physio.id} LIMIT 1
    `;
    if (!users.length || users[0].practitioner_status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Assigned appointments are available after practitioner activation.' });
    }

    const rows = await sql`
      SELECT b.id, b.booking_ref, b.full_name, b.phone, b.postcode, b.address_line1, b.city,
             b.preferred_date, b.preferred_time, b.status, b.symptoms, b.access_details,
             s.name AS service_name
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.physio_user_id = ${req.physio.id}
      ORDER BY b.preferred_date DESC, b.preferred_time DESC
    `;
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Practitioner appointments get error:', err);
    res.status(500).json({ success: false, message: 'Could not load assigned appointments.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const email = normaliseEmail(req.body.email);
    const generic = { success: true, message: 'If an account exists for that email, a reset link has been sent.' };
    if (!validEmail(email)) return res.json(generic);

    const sql = getDB();
    const rows = await sql`SELECT id, full_name, email FROM physio_users WHERE email = ${email} LIMIT 1`;
    if (!rows.length) return res.json(generic);

    const reset = createOneTimeToken();
    const expiry = new Date(Date.now() + 60 * 60 * 1000);
    await sql`
      UPDATE physio_users
      SET password_reset_token_hash = ${reset.hash},
          password_reset_expires_at = ${expiry.toISOString()},
          updated_at = NOW()
      WHERE id = ${rows[0].id}
    `;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    await sendPhysioPasswordResetEmail({
      full_name: rows[0].full_name,
      email: rows[0].email,
      reset_url: `${baseUrl}/physio/reset-password.html?token=${encodeURIComponent(reset.token)}`,
    });
    return res.json(generic);
  } catch (err) {
    console.error('Practitioner forgot password error:', err);
    return res.status(500).json({ success: false, message: 'We could not start password recovery right now.' });
  }
});

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
    if (!rows.length) return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' });

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
