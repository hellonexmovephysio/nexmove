'use strict';

const nodemailer = require('nodemailer');

// HTML-escape every booking field because customers can enter arbitrary text.
const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const cleanText = value => String(value == null ? '' : value).replace(/[\r\n]+/g, ' ').trim();

function formatDate(date) {
  if (!date) return 'To be confirmed';
  const day = date instanceof Date ? date : new Date(String(date).slice(0, 10) + 'T12:00:00Z');
  if (Number.isNaN(day.getTime())) return cleanText(date);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(day);
}

function createPaymentEmails(booking) {
  const company = cleanText(process.env.EMAIL_FROM_NAME || 'NEXmove Physio');
  const name = cleanText(booking.full_name);
  const ref = cleanText(booking.booking_ref);
  const service = cleanText(booking.service_name || 'Physiotherapy');
  const date = formatDate(booking.preferred_date);
  const time = cleanText(booking.preferred_time || 'To be confirmed');
  const amount = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })
    .format(Number(booking.amount_paid_pence || 0) / 100);
  const { createBookingAccess, confirmationLink } = require('./bookingAccess');
  const confirmationUrl = confirmationLink(
    ref,
    createBookingAccess(ref),
    process.env.FRONTEND_URL || 'https://www.nexmovephysio.co.uk'
  );

  const cardStyle = 'background:#f7f4ed;border:1px solid #e7e1d5;border-radius:12px;padding:16px';
  const wrapperStart = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1b2a4a;line-height:1.6">'
    + '<p style="font-weight:bold;color:#58765b;font-size:18px">NEXmove Physio</p>';
  const wrapperEnd = '<p style="font-size:13px;color:#55616a">NEXmove Physio — Care that moves with you.</p></div>';

  const customerHtml = wrapperStart
    + '<h2 style="margin-bottom:8px">Payment received — booking details</h2>'
    + '<p>Hello ' + escapeHtml(name) + ',</p>'
    + '<p>Thank you. Your payment has been received and your physiotherapy booking has been recorded. '
    + 'Our team will contact you to confirm the appointment arrangements.</p>'
    + '<div style="' + cardStyle + '">'
    + '<p><strong>Booking reference:</strong> ' + escapeHtml(ref) + '</p>'
    + '<p><strong>Service:</strong> ' + escapeHtml(service) + '</p>'
    + '<p><strong>Preferred date:</strong> ' + escapeHtml(date) + '</p>'
    + '<p><strong>Preferred time:</strong> ' + escapeHtml(time) + '</p>'
    + '<p><strong>Payment received:</strong> ' + escapeHtml(amount) + '</p>'
    + '</div><p><a href="' + escapeHtml(confirmationUrl) + '">View your booking confirmation</a></p>'
    + '<p>Need help? Reply to this email or contact NEXmove Physio. '
    + 'Your card receipt may arrive separately from Stripe if receipts are enabled.</p>'
    + wrapperEnd;

  const customerText = [
    'Hello ' + name + ',',
    'Your NEXmove payment has been received and your booking has been recorded.',
    'Our team will contact you to confirm the appointment arrangements.',
    'Booking reference: ' + ref,
    'Service: ' + service,
    'Preferred date: ' + date,
    'Preferred time: ' + time,
    'Payment received: ' + amount,
    'View booking confirmation: ' + confirmationUrl,
    'Your card receipt may arrive separately from Stripe if enabled.',
    company,
  ].join('\n');

  // Limit the owner email to operational data; do not email clinical notes or symptoms.
  const customerEmail = cleanText(booking.email);
  const phone = cleanText(booking.phone);
  const adminHtml = wrapperStart
    + '<h2>New paid physiotherapy booking</h2>'
    + '<p>A Stripe payment has been confirmed for a new NEXmove booking.</p>'
    + '<div style="' + cardStyle + '">'
    + '<p><strong>Reference:</strong> ' + escapeHtml(ref) + '</p>'
    + '<p><strong>Patient:</strong> ' + escapeHtml(name) + '</p>'
    + '<p><strong>Email:</strong> ' + escapeHtml(customerEmail) + '</p>'
    + '<p><strong>Phone:</strong> ' + escapeHtml(phone) + '</p>'
    + '<p><strong>Service:</strong> ' + escapeHtml(service) + '</p>'
    + '<p><strong>Preferred date:</strong> ' + escapeHtml(date) + '</p>'
    + '<p><strong>Preferred time:</strong> ' + escapeHtml(time) + '</p>'
    + '<p><strong>Amount paid:</strong> ' + escapeHtml(amount) + '</p></div>'
    + '<p>Sign in to the NEXmove admin dashboard to review and arrange the visit.</p>'
    + wrapperEnd;

  const adminText = [
    'New paid NEXmove booking',
    'Reference: ' + ref,
    'Patient: ' + name,
    'Email: ' + customerEmail,
    'Phone: ' + phone,
    'Service: ' + service,
    'Preferred date: ' + date,
    'Preferred time: ' + time,
    'Amount paid: ' + amount,
    'Review in the NEXmove admin dashboard.',
  ].join('\n');

  return {
    customer: {
      to: customerEmail,
      subject: 'NEXmove — Payment received (' + ref + ')',
      html: customerHtml,
      text: customerText,
    },
    admin: {
      to: cleanText(process.env.ADMIN_EMAIL),
      subject: 'NEXmove — New paid booking (' + ref + ')',
      html: adminHtml,
      text: adminText,
    },
  };
}

async function sendPaidBookingNotifications(booking) {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM', 'ADMIN_EMAIL'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length || !booking.email) {
    console.error('Paid booking email configuration incomplete', {
      missingKeys: missing,
      missingCustomerEmail: !booking.email,
    });
    return { customer: false, admin: false };
  }

  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('Paid booking email invalid SMTP port');
    return { customer: false, admin: false };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  });
  const fromName = cleanText(process.env.EMAIL_FROM_NAME || 'NEXmove Physio').replace(/["\\]/g, '');
  const from = '"' + fromName + '" <' + cleanText(process.env.SMTP_FROM) + '>';
  const emails = createPaymentEmails(booking);

  const results = await Promise.allSettled([
    transporter.sendMail({ from, ...emails.customer }),
    transporter.sendMail({ from, ...emails.admin }),
  ]);
  const sent = {
    customer: results[0].status === 'fulfilled',
    admin: results[1].status === 'fulfilled',
  };
  // Never log email addresses, patient details, message IDs or full SMTP errors.
  console.info('Paid booking email delivery', sent);
  if (!sent.customer || !sent.admin) console.error('Paid booking email delivery incomplete', sent);
  if (typeof transporter.close === 'function') transporter.close();
  return sent;
}

// Send one recipient independently so one failed email can be retried without
// resending the other recipient's successful message.
async function sendPaidBookingNotification(booking, kind) {
  if (!['customer', 'admin'].includes(kind)) throw new Error('Invalid notification type');
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM'];
  if (kind === 'admin') required.push('ADMIN_EMAIL');
  if (required.some(key => !process.env[key]) || !booking.email) {
    const error = new Error('Email configuration incomplete');
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    const error = new Error('Invalid SMTP port');
    error.code = 'SMTP_PORT_INVALID';
    throw error;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 8000,
  });
  const fromName = cleanText(process.env.EMAIL_FROM_NAME || 'NEXmove Physio').replace(/["\\]/g, '');
  const from = '"' + fromName + '" <' + cleanText(process.env.SMTP_FROM) + '>';
  const message = createPaymentEmails(booking)[kind];
  try {
    const crypto = require('crypto');
    const digest = crypto.createHash('sha256')
      .update(kind + ':' + String(booking.booking_ref)).digest('hex').slice(0, 24);
    // Stable Message-ID assists provider/email threading but cannot guarantee
    // exactly-once SMTP delivery if a process crashes after the send.
    await transporter.sendMail({
      from, ...message, messageId: '<nexmove-' + kind + '-' + digest + '@nexmovephysio.co.uk>',
    });
  } finally {
    if (typeof transporter.close === 'function') transporter.close();
  }
}

module.exports = { createPaymentEmails, sendPaidBookingNotifications, sendPaidBookingNotification };
