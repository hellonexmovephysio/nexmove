'use strict';

const crypto = require('crypto');
const VERSION = 'v1';
const LIFETIME_SECONDS = 90 * 24 * 60 * 60;

function signingKey() {
  const key = process.env.JWT_SECRET;
  if (!key || key.length < 16) throw new Error('Booking access signing key is not configured');
  return key;
}

// Private, tamper-evident access link; no new database column or patient login.
function createBookingAccess(reference, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (typeof reference !== 'string' || !reference || reference.length > 64) {
    throw new Error('Invalid booking reference');
  }
  const expires = nowSeconds + LIFETIME_SECONDS;
  const message = VERSION + '.' + expires + '.' + reference;
  const signature = crypto.createHmac('sha256', signingKey()).update(message).digest('hex');
  return VERSION + '.' + expires + '.' + signature;
}

function verifyBookingAccess(reference, token, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (typeof reference !== 'string' || !reference || reference.length > 64 ||
      typeof token !== 'string' || token.length > 150) return false;
  const match = /^v1\.([0-9]{10,11})\.([0-9a-f]{64})$/.exec(token);
  if (!match) return false;
  const expires = Number(match[1]);
  if (!Number.isSafeInteger(expires) || expires < nowSeconds ||
      expires > nowSeconds + LIFETIME_SECONDS) return false;
  const message = VERSION + '.' + expires + '.' + reference;
  const expected = crypto.createHmac('sha256', signingKey()).update(message).digest();
  const actual = Buffer.from(match[2], 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function confirmationLink(reference, token, origin, sessionIdPlaceholder = false) {
  const url = new URL('/booking/confirmation.html', origin);
  url.searchParams.set('ref', reference);
  if (sessionIdPlaceholder) url.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
  // Fragment tokens aren't sent in HTTP requests, referrers, or access logs.
  url.hash = 'access=' + encodeURIComponent(token);
  // Preserve Stripe's literal Checkout template braces in the success URL.
  return url.toString().replace('%7BCHECKOUT_SESSION_ID%7D', '{CHECKOUT_SESSION_ID}');
}

module.exports = { createBookingAccess, verifyBookingAccess, confirmationLink };
