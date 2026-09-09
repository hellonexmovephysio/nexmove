const crypto = require('crypto');

function bookingReference() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `NEX-${yy}${mm}${dd}-${hex}`;
}

function cleanString(value, max = 255) {
  if (!value) return '';
  let s = String(value).trim().replace(/\s+/g, ' ');
  return s.substring(0, max);
}

function jsonResponse(res, payload, status = 200) {
  return res.status(status).json(payload);
}

module.exports = { bookingReference, cleanString, jsonResponse };
