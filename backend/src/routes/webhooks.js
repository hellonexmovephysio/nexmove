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
      // Mark a paid booking exactly once, using Stripe's verified session ID.
      // RETURNING also ensures Stripe webhook retries do not send duplicate emails.
      const updated = await sql`
        UPDATE bookings
        SET payment_status = 'paid', status = 'confirmed', amount_paid_pence = ${session.amount_total}
        WHERE stripe_session_id = ${session.id} AND payment_status != 'paid'
        RETURNING booking_ref, full_name, email, phone, preferred_date,
                  preferred_time, amount_paid_pence, service_id
      `;

      if (updated.length) {
        console.info('Stripe payment matched a booking and was confirmed');
        // Only notify after Stripe reports that the payment was actually paid.
        if (session.payment_status === 'paid') {
          try {
            const booking = updated[0];
            const services = await sql`
              SELECT name FROM services WHERE id = ${booking.service_id} LIMIT 1
            `;
            const { sendPaidBookingNotifications } = require('../utils/paymentNotifications');
            await sendPaidBookingNotifications({
              ...booking,
              service_name: services[0] ? services[0].name : 'Physiotherapy',
            });
          } catch (notificationErr) {
            // Payment/database confirmation must not be rolled back or repeatedly
            // processed because a separate email provider is unavailable.
            console.error('Paid booking email notification step failed', {
              errorType: String(notificationErr && notificationErr.name || 'Error')
                .replace(/[^A-Za-z0-9_]/g, '').slice(0, 40),
            });
          }
        } else {
          console.info('Stripe session completed; no paid notification because payment is not settled');
        }
      } else {
        console.info('Stripe webhook duplicate or unmatched booking; no emails sent');
      }
    } catch (dbErr) {
      console.error('Database error updating booking status:', dbErr);
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
