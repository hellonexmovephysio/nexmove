const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'nexmove_physio_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function parseCookies(header = '') {
  return header.split(';').reduce((acc, pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return acc;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (key) acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function getPhysioToken(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  if (cookies[COOKIE_NAME]) return cookies[COOKIE_NAME];

  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

function verifyPhysioToken(token) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || decoded.role !== 'physio') throw new Error('Invalid practitioner session');
  return decoded;
}

function physioAuthMiddleware(req, res, next) {
  const token = getPhysioToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Practitioner sign-in required.' });
  }

  try {
    const decoded = verifyPhysioToken(token);
    req.physio = {
      id: Number(decoded.sub || decoded.id),
      email: decoded.email,
      role: decoded.role,
    };
    if (!req.physio.id) throw new Error('Invalid practitioner account');
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Your practitioner session is invalid or has expired.' });
  }
}

function setPhysioSessionCookie(res, user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: 'physio' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function clearPhysioSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const parts = [
    `${COOKIE_NAME}=`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0',
  ];
  if (secure) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

module.exports = {
  COOKIE_NAME,
  physioAuthMiddleware,
  setPhysioSessionCookie,
  clearPhysioSessionCookie,
};
