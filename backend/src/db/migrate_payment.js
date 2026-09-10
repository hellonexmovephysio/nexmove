require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { getDB } = require('./pool');

async function migratePayment() {
  const sql = getDB();

  console.log('Running payment database migration...');

  try {
    await sql`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255) UNIQUE,
      ADD COLUMN IF NOT EXISTS amount_paid_pence INT;
    `;
    console.log('Successfully added payment columns to bookings table.');
  } catch (error) {
    console.error('Error altering bookings table:', error);
    throw error;
  }

  console.log('Payment migration complete.');
  process.exit(0);
}

migratePayment().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
