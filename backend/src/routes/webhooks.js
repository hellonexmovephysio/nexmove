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

    try {
      const sql = getDB();
      // Update booking based on the session ID
      await sql`
        UPDATE bookings 
        SET payment_status = 'paid', status = 'confirmed', amount_paid_pence = ${session.amount_total}
        WHERE stripe_session_id = ${session.id} AND payment_status != 'paid'
      `;
      console.log(`Payment successful for session ${session.id}. Booking confirmed.`);
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
