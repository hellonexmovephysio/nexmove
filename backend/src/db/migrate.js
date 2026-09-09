require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { getDB } = require('./pool');

async function migrate() {
  const sql = getDB();

  console.log('Running database migrations...');

  // admins table
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;

  // services table (from nexmove-booking-v4)
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      short_description TEXT,
      duration_minutes INT NOT NULL,
      appointment_type VARCHAR(100) NOT NULL,
      price_pence INT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INT NOT NULL DEFAULT 0
    )
  `;

  // conditions table
  await sql`
    CREATE TABLE IF NOT EXISTS conditions (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      label VARCHAR(255) NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INT NOT NULL DEFAULT 0
    )
  `;

  // therapists table
  await sql`
    CREATE TABLE IF NOT EXISTS therapists (
      id SERIAL PRIMARY KEY,
      display_name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      active BOOLEAN NOT NULL DEFAULT TRUE
    )
  `;

  // bookings table (unified booking table for simple and advanced forms)
  // Drop it first if it already exists, so we recreate it with nullable fields
  await sql`DROP TABLE IF EXISTS bookings CASCADE`;
  await sql`DROP TABLE IF EXISTS appointments CASCADE`;

  await sql`
    CREATE TABLE bookings (
      id SERIAL PRIMARY KEY,
      booking_ref VARCHAR(32) NOT NULL UNIQUE,
      service_id INT REFERENCES services(id) ON DELETE SET NULL,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      date_of_birth DATE,
      postcode VARCHAR(16),
      address_line1 VARCHAR(255),
      city VARCHAR(100),
      access_details VARCHAR(255),
      condition_id INT REFERENCES conditions(id) ON DELETE SET NULL,
      issue_duration VARCHAR(50),
      pain_level INT CHECK (pain_level IS NULL OR pain_level BETWEEN 0 AND 10),
      symptoms TEXT,
      mobility_aid BOOLEAN NOT NULL DEFAULT FALSE,
      fall_risk BOOLEAN NOT NULL DEFAULT FALSE,
      preferred_date DATE NOT NULL,
      preferred_time VARCHAR(50),
      therapist_id INT REFERENCES therapists(id) ON DELETE SET NULL,
      consent_privacy BOOLEAN NOT NULL DEFAULT FALSE,
      consent_updates BOOLEAN NOT NULL DEFAULT FALSE,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // contact_messages table (replaces mail.php)
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email)`;

  console.log('Migration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
