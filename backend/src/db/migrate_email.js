require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { getDB } = require('./pool');

async function migrateEmail() {
  const sql = getDB();

  console.log('Running email column migration...');

  try {
    await sql`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS approval_email_sent BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS approval_email_sent_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS approval_email_error TEXT
    `;
    console.log('Migration successful: Email columns added to bookings table.');
  } catch (err) {
    console.error('Migration error:', err);
  }

  process.exit(0);
}

migrateEmail().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
