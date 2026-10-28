const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Permit the official site, configured frontend origins, and the request's exact
// same origin (including Vercel preview URLs). Do not reflect arbitrary origins
// while allowing credentialed CORS requests.
const trustedOrigins = new Set([
  'https://www.nexmovephysio.co.uk',
  'https://nexmovephysio.co.uk',
]);
for (const value of (process.env.FRONTEND_URL || '').split(',')) {
  try {
    const url = new URL(value.trim());
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      trustedOrigins.add(url.origin);
    }
  } catch (_) {
    // Ignore missing/malformed optional frontend URLs.
  }
}
if (process.env.NODE_ENV !== 'production') {
  ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000']
    .forEach(origin => trustedOrigins.add(origin));
}

// Basic non-disruptive response hardening.
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use((req, res, next) => {
  const origin = req.get('Origin');
  let trusted = !origin; // Webhooks, mobile clients and server-to-server calls.
  if (origin) {
    try {
      const parsed = new URL(origin);
      const sameHost = parsed.host.toLowerCase() === (req.get('Host') || '').toLowerCase();
      const validProtocol = parsed.protocol === 'https:' ||
        (process.env.NODE_ENV !== 'production' && parsed.protocol === 'http:');
      trusted = origin === parsed.origin &&
        (trustedOrigins.has(origin) || (sameHost && validProtocol));
    } catch (_) {
      trusted = false;
    }
  }
  cors({ origin: trusted, credentials: true })(req, res, next);
});

// Webhook route needs raw body for Stripe signature verification
app.use('/api/webhooks', require('./routes/webhooks'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath, {
  extensions: ['html'],
  index: 'index.html',
  setHeaders: (res, filePath) => {
    // Public, immutable-in-content frontend images and fonts can be reused by
    // visitors. Keep HTML, API responses and all booking data uncached.
    if (/\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.removeHeader('Pragma');
      res.removeHeader('Expires');
      return;
    }
    if (process.env.NODE_ENV !== 'production') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
}));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/physio', require('./routes/physio'));
app.use('/api/physio-auth', require('./routes/physioAuth'));

// Daily failed-email recovery. Vercel adds Authorization: Bearer CRON_SECRET.
// This endpoint is never accessible without the configured production secret.
app.get('/api/jobs/paid-email-retry', async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.get('Authorization') !== 'Bearer ' + secret) {
    return res.status(401).json({ ok: false });
  }
  try {
    const sql = require('./db/pool').getDB();
    const { ensureOutboxSchema, processOutbox } = require('./utils/paymentOutbox');
    await ensureOutboxSchema(sql);
    const result = await processOutbox(sql, { limit: 6 });
    console.info('Daily paid booking email retry', result);
    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error('Daily paid booking email retry failed', {
      errorType: String(err && err.name || 'Error').replace(/[^A-Za-z0-9_]/g, '').slice(0, 40),
    });
    return res.status(500).json({ ok: false });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'NEXmove API is running.' });
});

// Unmatched public URLs must return a real 404, not a duplicate homepage
app.get('*', (req, res) => {
  // Only serve HTML for non-API requests
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

module.exports = app;
