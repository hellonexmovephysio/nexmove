const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getDB } = require('../db/pool');

const router = express.Router();

// Stripe needs the raw body to verify the signature
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Do not confirm a booking or send emails until Stripe reports the payment as paid.
    if (session.payment_status !== 'paid') {
      console.info('Stripe Checkout completed without settled payment; awaiting payment confirmation');
      return res.send();
    }

    try {
      const sql = getDB();
      // Keep the existing payment update independent from email delivery.
      const updated = await sql`
        UPDATE bookings
        SET payment_status = 'paid', status = 'confirmed', amount_paid_pence = ${session.amount_total}
        WHERE stripe_session_id = ${session.id} AND payment_status != 'paid'
        RETURNING booking_ref
      `;

      // A retry after an outbox/database error must still be able to enqueue.
      // The outbox's unique key prevents notifications from being enqueued twice.
      const matched = updated.length ? updated : await sql`
        SELECT booking_ref FROM bookings
        WHERE stripe_session_id = ${session.id} AND payment_status = 'paid'
        LIMIT 1
      `;

      if (matched.length) {
        const { ensureOutboxSchema, enqueuePaidBooking, processOutbox } =
          require('../utils/paymentOutbox');
        await ensureOutboxSchema(sql);
        await enqueuePaidBooking(sql, matched[0].booking_ref);
        try {
          const result = await processOutbox(sql, { reference: matched[0].booking_ref, limit: 2 });
          console.info('Paid booking email outbox processed', result);
        } catch (emailError) {
          // An already queued notification is retried by the daily worker;
          // a transient SMTP error must not reverse or duplicate a payment.
          console.error('Immediate email worker unavailable', {
            errorType: String(emailError && emailError.name || 'Error')
              .replace(/[^A-Za-z0-9_]/g, '').slice(0, 40),
          });
        }
      } else {
        console.info('Stripe payment webhook did not match a booking');
      }
    } catch (dbErr) {
      // Stripe retries a 500 webhook after a database/outbox write error.
      // Do not print SQL errors that could contain patient details.
      console.error('Booking payment or email outbox database operation failed', {
        errorType: String(dbErr && dbErr.name || 'Error')
          .replace(/[^A-Za-z0-9_]/g, '').slice(0, 40),
      });
      return res.status(500).end();
    }
  } else {
    // Optionally handle other event types
    console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

module.exports = router;
