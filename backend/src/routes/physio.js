const express = require('express');
const crypto = require('crypto');
const { getDB } = require('../db/pool');
const { authMiddleware } = require('../middleware/auth');
const { cleanString } = require('../utils/helpers');
const { ensurePhysioPortalSchema } = require('../db/physioPortalSchema');
const {
  sendAdminPhysioApplicationNotification,
  sendPhysioApplicationStatusEmail,
} = require('../utils/email');

const router = express.Router();

const VALID_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected'];
const VALID_VERIFICATION_STATUSES = ['Not Requested', 'Required', 'Submitted', 'Verified', 'Issue'];
const VALID_DOC_STATUSES = ['Submitted', 'Verified', 'Issue'];

function documentKey() {
  const source = process.env.PHYSIO_DOCUMENT_KEY || process.env.JWT_SECRET;
  if (!source) throw new Error('Document encryption key is not configured');
  return crypto.createHash('sha256').update(String(source)).digest();
}

function decryptDocument(row) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', documentKey(), Buffer.from(row.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(row.auth_tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(row.encrypted_data, 'base64')), decipher.final()]);
}

function safeDownloadName(value) {
  return String(value || 'document').replace(/[\\/\0\r\n"]/g, '_').trim() || 'document';
}

// POST /api/physio — legacy application endpoint retained for backward compatibility.
router.post('/', async (req, res) => {
  try {
    await ensurePhysioPortalSchema();

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
        additional_info, consent_privacy, status, verification_status
      ) VALUES (
        ${application_ref}, ${cleanString(full_name, 255)}, ${email.trim()}, ${cleanString(phone, 50)},
        ${cleanString(city, 100)}, ${cleanString(preferred_contact || 'Email', 20)},
        ${cleanString(hcpc_number || '', 100)}, ${parseInt(years_experience, 10) || null},
        ${cleanString(specialisations || '', 2000)}, ${cleanString(qualifications || '', 2000)},
        ${cleanString(biography || '', 2000)}, ${cleanString(areas_covered, 2000)},
        ${cleanString(preferred_days || '', 255)}, ${cleanString(preferred_hours || '', 255)},
        ${home_visit_availability ? true : false}, ${cleanString(additional_info || '', 2000)},
        ${consent_privacy ? true : false}, 'Pending', 'Not Requested'
      )
    `;

    await sendAdminPhysioApplicationNotification({ full_name, email, phone, city, hcpc_number });

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully. We will be in touch soon.'
    });
  } catch (err) {
    console.error('Submit physio application error:', err);
    res.status(500).json({ success: false, message: 'We could not save your application right now. Please try again.' });
  }
});

// GET /api/physio/admin — list all applications
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const rows = await sql`
      SELECT a.id, a.application_ref, a.full_name, a.email, a.phone, a.city,
             a.status, a.verification_status, a.created_at,
             u.email_verified_at, u.practitioner_status
      FROM physio_applications a
      LEFT JOIN physio_users u ON u.id = a.physio_user_id
      ORDER BY a.created_at DESC
    `;
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/physio/admin/practitioners/active — for safe appointment assignment
router.get('/admin/practitioners/active', authMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const rows = await sql`
      SELECT u.id, u.full_name, u.email, p.hcpc_number, p.areas_covered, p.specialisations
      FROM physio_users u
      LEFT JOIN physio_profiles p ON p.physio_user_id = u.id
      WHERE u.account_status = 'Active'
        AND u.practitioner_status = 'Active'
      ORDER BY u.full_name
    `;
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get active practitioners error:', err);
    res.status(500).json({ success: false, message: 'Could not load active practitioners.' });
  }
});

// GET /api/physio/admin/:id — application, account and verification details
router.get('/admin/:id', authMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid ID.' });

    const rows = await sql`
      SELECT a.*,
             u.email_verified_at, u.practitioner_status, u.account_status,
             u.created_at AS account_created_at
      FROM physio_applications a
      LEFT JOIN physio_users u ON u.id = a.physio_user_id
      WHERE a.id = ${id}
      LIMIT 1
    `;
    if (!rows.length) return res.status(404).json({ success: false, message: 'Application not found.' });

    const docs = await sql`
      SELECT id, document_type, original_name, mime_type, file_size, status,
             reviewer_notes, created_at, updated_at
      FROM physio_verification_documents
      WHERE application_id = ${id}
      ORDER BY document_type, created_at DESC
    `;

    res.json({ success: true, data: rows[0], documents: docs });
  } catch (err) {
    console.error('Get application error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/physio/admin/:id — update application and verification status
router.put('/admin/:id', authMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    const status = req.body.status;
    const verificationStatus = req.body.verification_status || 'Not Requested';
    const internalNotes = cleanString(req.body.internal_notes || '', 5000);
    const verificationNotes = cleanString(req.body.verification_notes || '', 5000);

    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid ID.' });
    if (!VALID_STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Invalid application status.' });
    if (!VALID_VERIFICATION_STATUSES.includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status.' });
    }

    const rows = await sql`
      UPDATE physio_applications
      SET status = ${status},
          internal_notes = ${internalNotes},
          verification_status = ${verificationStatus},
          verification_notes = ${verificationNotes},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows.length) return res.status(404).json({ success: false, message: 'Application not found.' });

    const application = rows[0];
    if (application.physio_user_id) {
      let practitionerStatus = null;
      if (status === 'Rejected') practitionerStatus = 'Rejected';
      else if (verificationStatus === 'Required' || verificationStatus === 'Submitted' || verificationStatus === 'Issue') practitionerStatus = 'Verification';
      else if (status !== 'Approved') practitionerStatus = 'Applicant';

      if (practitionerStatus) {
        await sql`
          UPDATE physio_users
          SET practitioner_status = ${practitionerStatus}, updated_at = NOW()
          WHERE id = ${application.physio_user_id}
            AND practitioner_status <> 'Active'
        `;
      }
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    await sendPhysioApplicationStatusEmail({
      full_name: application.full_name,
      email: application.email,
      status: application.status,
      verification_status: application.verification_status,
      portal_url: `${baseUrl}/physio/`,
    });

    res.json({ success: true, message: 'Application updated successfully.', data: application });
  } catch (err) {
    console.error('Update application error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/physio/admin/:id/document/:docId — decrypt and download for admins only
router.get('/admin/:id/document/:docId', authMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const applicationId = parseInt(req.params.id, 10);
    const docId = parseInt(req.params.docId, 10);
    if (!Number.isInteger(applicationId) || !Number.isInteger(docId)) {
      return res.status(400).json({ success: false, message: 'Invalid document request.' });
    }

    const rows = await sql`
      SELECT *
      FROM physio_verification_documents
      WHERE id = ${docId} AND application_id = ${applicationId}
      LIMIT 1
    `;
    if (!rows.length) return res.status(404).json({ success: false, message: 'Document not found.' });

    const file = decryptDocument(rows[0]);
    res.setHeader('Content-Type', rows[0].mime_type);
    res.setHeader('Content-Length', file.length);
    res.setHeader('Content-Disposition', `attachment; filename="${safeDownloadName(rows[0].original_name)}"`);
    res.setHeader('Cache-Control', 'no-store');
    res.send(file);
  } catch (err) {
    console.error('Admin document download error:', err);
    res.status(500).json({ success: false, message: 'Could not open this verification document.' });
  }
});

// PUT /api/physio/admin/:id/document/:docId — review a verification document
router.put('/admin/:id/document/:docId', authMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const applicationId = parseInt(req.params.id, 10);
    const docId = parseInt(req.params.docId, 10);
    const status = req.body.status;
    const reviewerNotes = cleanString(req.body.reviewer_notes || '', 3000);

    if (!VALID_DOC_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid document status.' });
    }

    const rows = await sql`
      UPDATE physio_verification_documents
      SET status = ${status}, reviewer_notes = ${reviewerNotes}, updated_at = NOW()
      WHERE id = ${docId} AND application_id = ${applicationId}
      RETURNING id, document_type, original_name, status, reviewer_notes, updated_at
    `;
    if (!rows.length) return res.status(404).json({ success: false, message: 'Document not found.' });

    res.json({ success: true, message: 'Document review updated.', data: rows[0] });
  } catch (err) {
    console.error('Admin document review error:', err);
    res.status(500).json({ success: false, message: 'Could not update document review.' });
  }
});

// PUT /api/physio/admin/:id/activate — explicit final practitioner activation
router.put('/admin/:id/activate', authMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ success: false, message: 'Invalid ID.' });

    const rows = await sql`
      SELECT * FROM physio_applications WHERE id = ${id} LIMIT 1
    `;
    if (!rows.length) return res.status(404).json({ success: false, message: 'Application not found.' });
    const app = rows[0];

    if (!app.physio_user_id) {
      return res.status(409).json({ success: false, message: 'This legacy application is not linked to a practitioner portal account.' });
    }
    if (app.status !== 'Approved') {
      return res.status(409).json({ success: false, message: 'Approve the application before activating the practitioner.' });
    }
    if ((app.verification_status || 'Not Requested') !== 'Verified') {
      return res.status(409).json({ success: false, message: 'Mark verification as Verified before activation.' });
    }

    await sql`
      INSERT INTO physio_profiles (
        physio_user_id, display_name, hcpc_number, specialisations, biography,
        areas_covered, preferred_days, preferred_hours, active
      ) VALUES (
        ${app.physio_user_id}, ${app.full_name}, ${app.hcpc_number || ''},
        ${app.specialisations || ''}, ${app.biography || ''},
        ${app.areas_covered || ''}, ${app.preferred_days || ''},
        ${app.preferred_hours || ''}, TRUE
      )
      ON CONFLICT (physio_user_id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        hcpc_number = EXCLUDED.hcpc_number,
        specialisations = EXCLUDED.specialisations,
        biography = EXCLUDED.biography,
        areas_covered = EXCLUDED.areas_covered,
        preferred_days = EXCLUDED.preferred_days,
        preferred_hours = EXCLUDED.preferred_hours,
        active = TRUE,
        updated_at = NOW()
    `;

    await sql`
      UPDATE physio_users
      SET practitioner_status = 'Active', account_status = 'Active', updated_at = NOW()
      WHERE id = ${app.physio_user_id}
    `;

    res.json({ success: true, message: 'Practitioner activated successfully.' });
  } catch (err) {
    console.error('Practitioner activation error:', err);
    res.status(500).json({ success: false, message: 'Could not activate practitioner.' });
  }
});

// PUT /api/physio/admin/:id/suspend
router.put('/admin/:id/suspend', authMiddleware, async (req, res) => {
  try {
    await ensurePhysioPortalSchema();
    const sql = getDB();
    const id = parseInt(req.params.id, 10);
    const rows = await sql`SELECT physio_user_id FROM physio_applications WHERE id = ${id} LIMIT 1`;
    if (!rows.length || !rows[0].physio_user_id) {
      return res.status(404).json({ success: false, message: 'Linked practitioner account not found.' });
    }
    await sql`UPDATE physio_users SET practitioner_status = 'Suspended', updated_at = NOW() WHERE id = ${rows[0].physio_user_id}`;
    await sql`UPDATE physio_profiles SET active = FALSE, updated_at = NOW() WHERE physio_user_id = ${rows[0].physio_user_id}`;
    res.json({ success: true, message: 'Practitioner suspended.' });
  } catch (err) {
    console.error('Practitioner suspension error:', err);
    res.status(500).json({ success: false, message: 'Could not suspend practitioner.' });
  }
});

module.exports = router;
