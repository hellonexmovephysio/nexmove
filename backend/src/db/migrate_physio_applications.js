require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { getDB } = require('./pool');

async function migratePhysio() {
  const sql = getDB();

  console.log('Running physio applications table migration...');

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS physio_applications (
        id SERIAL PRIMARY KEY,
        application_ref VARCHAR(32) NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        city VARCHAR(100) NOT NULL,
        preferred_contact VARCHAR(20) NOT NULL,
        
        hcpc_number VARCHAR(100),
        years_experience INT,
        specialisations TEXT,
        qualifications TEXT,
        biography TEXT,
        
        areas_covered TEXT NOT NULL,
        preferred_days TEXT,
        preferred_hours TEXT,
        home_visit_availability BOOLEAN NOT NULL DEFAULT FALSE,
        
        additional_info TEXT,
        consent_privacy BOOLEAN NOT NULL DEFAULT FALSE,
        status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        internal_notes TEXT,
        
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    console.log('Migration successful: physio_applications table added.');
  } catch (err) {
    console.error('Migration error:', err);
  }

  process.exit(0);
}

migratePhysio().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
