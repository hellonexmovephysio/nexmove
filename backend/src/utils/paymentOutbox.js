'use strict';

// Durable, idempotent notification delivery for successfully paid bookings.
// The queue stores only a reference and delivery metadata, never patient details.
const { sendPaidBookingNotification } = require('./paymentNotifications');

const MAX_ATTEMPTS = 8;

async function ensureOutboxSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS booking_email_outbox (
      id BIGSERIAL PRIMARY KEY,
      booking_ref VARCHAR(64) NOT NULL,
      kind VARCHAR(12) NOT NULL CHECK (kind IN ('customer', 'admin')),
      status VARCHAR(12) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sending', 'sent', 'failed')),
      attempts INTEGER NOT NULL DEFAULT 0,
      next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      lease_until TIMESTAMPTZ,
      sent_at TIMESTAMPTZ,
      last_error_code VARCHAR(48),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (booking_ref, kind)
    )
  `;
}

async function enqueuePaidBooking(sql, reference) {
  if (!reference) throw new Error('Missing booking reference for email outbox');
  // A signed Stripe webhook may be delivered repeatedly: this insert is safe.
  return sql`
    INSERT INTO booking_email_outbox (booking_ref, kind)
    VALUES (${reference}, 'customer'), (${reference}, 'admin')
    ON CONFLICT (booking_ref, kind) DO NOTHING
    RETURNING id
  `;
}

function safeErrorCode(err) {
  return String(err && (err.code || err.name) || 'Error')
    .replace(/[^a-zA-Z0-9_]/g, '').slice(0, 48);
}

async function claimJobs(sql, { reference = null, limit = 2 } = {}) {
  const count = Math.max(1, Math.min(6, Number(limit) || 2));
  const ref = reference || null;
  // A single SQL statement atomically leases jobs. Retried webhooks, a cron
  // invocation and concurrent workers cannot claim the same row simultaneously.
  return sql`
    WITH picked AS (
      SELECT id
      FROM booking_email_outbox
      WHERE attempts < ${MAX_ATTEMPTS}
        AND (
          (status = 'pending' AND next_attempt_at <= NOW())
          OR (status = 'sending' AND lease_until < NOW())
        )
        AND (${ref}::text IS NULL OR booking_ref = ${ref})
      ORDER BY created_at ASC, id ASC
      LIMIT ${count}
      FOR UPDATE SKIP LOCKED
    )
    UPDATE booking_email_outbox AS job
    SET status = 'sending',
        attempts = job.attempts + 1,
        lease_until = NOW() + INTERVAL '2 minutes',
        updated_at = NOW()
    FROM picked
    WHERE job.id = picked.id
    RETURNING job.id, job.booking_ref, job.kind, job.attempts
  `;
}

async function sendOne(sql, job) {
  try {
    const rows = await sql`
      SELECT b.booking_ref, b.full_name, b.email, b.phone, b.preferred_date,
             b.preferred_time, b.amount_paid_pence, s.name AS service_name
      FROM bookings b
      LEFT JOIN services s ON s.id = b.service_id
      WHERE b.booking_ref = ${job.booking_ref} AND b.payment_status = 'paid'
      LIMIT 1
    `;
    if (rows.length !== 1) {
      const error = new Error('Paid booking is unavailable for email delivery');
      error.code = 'BOOKING_NOT_PAID';
      throw error;
    }

    await sendPaidBookingNotification(rows[0], job.kind);
    // Optimistic check stops an expired worker overwriting a newer attempt.
    await sql`
      UPDATE booking_email_outbox
      SET status = 'sent', sent_at = NOW(), lease_until = NULL,
          last_error_code = NULL, updated_at = NOW()
      WHERE id = ${job.id} AND status = 'sending' AND attempts = ${job.attempts}
    `;
    console.info('Paid booking notification delivered', { kind: job.kind, attempt: job.attempts });
    return { kind: job.kind, sent: true };
  } catch (error) {
    const errorCode = safeErrorCode(error);
    const exhausted = job.attempts >= MAX_ATTEMPTS;
    const delaySeconds = Math.min(86400, 60 * (5 ** Math.min(job.attempts - 1, 5)));
    try {
      await sql`
        UPDATE booking_email_outbox
        SET status = ${exhausted ? 'failed' : 'pending'},
            next_attempt_at = NOW() + (${delaySeconds} * INTERVAL '1 second'),
            lease_until = NULL,
            last_error_code = ${errorCode},
            updated_at = NOW()
        WHERE id = ${job.id} AND status = 'sending' AND attempts = ${job.attempts}
      `;
    } catch (storeError) {
      // A crashed worker can be recovered when its lease expires.
      console.error('Email retry state could not be stored', {
        kind: job.kind, errorType: safeErrorCode(storeError),
      });
    }
    console.error('Paid booking email attempt failed', {
      kind: job.kind, attempt: job.attempts, retryScheduled: !exhausted,
      errorType: errorCode,
    });
    return { kind: job.kind, sent: false, retryScheduled: !exhausted };
  }
}

async function processOutbox(sql, options = {}) {
  const jobs = await claimJobs(sql, options);
  const results = await Promise.all(jobs.map(job => sendOne(sql, job)));
  return {
    claimed: jobs.length,
    sent: results.filter(x => x.sent).length,
    failed: results.filter(x => !x.sent).length,
  };
}

module.exports = {
  ensureOutboxSchema,
  enqueuePaidBooking,
  claimJobs,
  processOutbox,
  MAX_ATTEMPTS,
};
